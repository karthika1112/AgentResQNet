const BaseAgent = require('./BaseAgent');
const WarehouseManager = require('../services/resources/warehouseManager');
const InventoryManager = require('../services/resources/inventoryManager');
const VehicleAllocator = require('../services/resources/vehicleAllocator');
const VolunteerAllocator = require('../services/resources/volunteerAllocator');
const DistributionPlanner = require('../services/resources/distributionPlanner');
const ForecastEngine = require('../services/resources/forecastEngine');
const logger = require('../utils/logger');

class ResourceCommandAgent extends BaseAgent {
  constructor() {
    super('Resource Command Agent', 'Manages disaster relief resources, optimising allocation and delivery logistics.');
  }

  async execute(context) {
    const startTime = Date.now();
    logger.info(`[ResourceCommandAgent] Executing...`);

    try {
      const { 
        lat = 37.77, 
        lon = -122.41, 
        requiredResources = { food: 50, water: 50 }, 
        incidentSeverity = 'High',
        victimCount = 20
      } = typeof context === 'string' ? {} : context;

      // 1. Find Nearest Warehouse
      const warehouse = await WarehouseManager.findNearestWarehouse(lat, lon);
      if (!warehouse) {
        return {
          status: 'Failed',
          message: 'No warehouse or shelter available in the region.',
          confidence: 0
        };
      }

      // 2. Allocate Inventory
      const allocationResult = await InventoryManager.allocateResources(warehouse._id, requiredResources);
      
      if (Object.keys(allocationResult.allocated).length === 0) {
        return {
          status: 'Failed',
          message: 'Nearest warehouse has insufficient inventory for all requested items.',
          confidence: 0
        };
      }

      // 3. Allocate Vehicle
      const vehicle = VehicleAllocator.assignVehicle(allocationResult.allocated);

      // 4. Allocate Volunteers (Assign 2 volunteers for delivery)
      const volunteers = await VolunteerAllocator.allocateVolunteers(warehouse.latitude, warehouse.longitude, 2);

      // 5. Plan Distribution (ETA)
      const deliveryPlan = await DistributionPlanner.planDelivery(warehouse.latitude, warehouse.longitude, lat, lon);

      // 6. Forecast future demand
      const forecastedDemand = ForecastEngine.predictDemand(incidentSeverity, victimCount, requiredResources);

      const executionTime = Date.now() - startTime;

      let finalStatus = allocationResult.success ? 'Dispatched' : 'Partially Dispatched (Shortages Detected)';

      return {
        resourceRequestId: `REQ-${Date.now()}`,
        requiredResources,
        allocatedResources: allocationResult.allocated,
        shortages: allocationResult.shortages,
        warehouse: {
          name: warehouse.name,
          address: warehouse.address,
          coordinates: [warehouse.latitude, warehouse.longitude]
        },
        assignedVehicle: vehicle,
        assignedVolunteers: volunteers.map(v => ({ name: v.user?.name || 'Volunteer', phone: v.user?.phone || 'N/A' })),
        estimatedDelivery: deliveryPlan.estimatedDelivery,
        forecastedDemand: forecastedDemand,
        status: finalStatus,
        confidence: allocationResult.success ? 98 : 60,
        executionTime: `${executionTime}ms`,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error(`[ResourceCommandAgent] Error: ${error.message}`);
      return {
        status: 'Error',
        message: 'Internal error while managing resources.',
        error: error.message
      };
    }
  }
}

module.exports = ResourceCommandAgent;
