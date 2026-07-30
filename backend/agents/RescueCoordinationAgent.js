const BaseAgent = require('./BaseAgent');
const MissionPlanner = require('../services/rescue/missionPlanner');
const ResponderAllocator = require('../services/rescue/responderAllocator');
const VehicleAllocator = require('../services/rescue/vehicleAllocator');
const EtaEngine = require('../services/rescue/etaEngine');
const logger = require('../utils/logger');

class RescueCoordinationAgent extends BaseAgent {
  constructor() {
    super('Rescue Coordination Agent', 'Coordinates real rescue missions by assigning verified responders and vehicles.');
  }

  async execute(context) {
    const startTime = Date.now();
    logger.info(`[RescueCoordinationAgent] Executing... Context: ${JSON.stringify(context)}`);

    try {
      const { 
        lat = 37.77, 
        lon = -122.41, 
        incidentSeverity = 'High', 
        victimCount = 2,
        category = 'Medical Emergency',
        incidentId = null
      } = typeof context === 'string' ? {} : context;

      // 1. Assign Responder
      const responder = await ResponderAllocator.allocateNearest(lat, lon);
      if (!responder) {
        return {
          missionId: null,
          message: 'No rescue team is currently available.',
          confidence: 100,
          timestamp: new Date().toISOString()
        };
      }

      // 2. Assign Vehicle
      const vehicle = VehicleAllocator.assignVehicle(category, incidentSeverity);

      // 3. Calculate Initial ETA
      const etaData = await EtaEngine.calculateETA(
        responder.currentLocation?.latitude || lat, 
        responder.currentLocation?.longitude || lon, 
        lat, 
        lon
      );

      // 4. Create Mission Plan
      const priority = MissionPlanner.calculatePriority(incidentSeverity, victimCount);
      
      const missionData = {
        title: `Rescue Operation - ${category}`,
        incident: incidentId, // Optional reference
        assignedResponder: responder._id,
        vehicleAssigned: vehicle.type,
        targetLocation: { lat, lng: lon },
        status: 'Dispatched',
        priority: priority,
        estimatedArrival: new Date(Date.now() + (etaData.seconds || 600) * 1000)
      };

      const mission = await MissionPlanner.createMission(missionData);

      const executionTime = Date.now() - startTime;

      return {
        missionId: mission._id,
        assignedResponder: {
          name: responder.user ? responder.user.name : 'Unknown Responder',
          phone: responder.user ? responder.user.phone : 'N/A',
          role: responder.department
        },
        assignedVolunteers: [], // Expanding this later if needed
        assignedVehicle: vehicle,
        currentLocation: responder.currentLocation,
        estimatedArrival: etaData.text,
        missionStatus: mission.status,
        priority: mission.priority,
        confidence: 98,
        executionTime: `${executionTime}ms`,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error(`[RescueCoordinationAgent] Error: ${error.message}`);
      return {
        message: 'Internal error while coordinating rescue.',
        error: error.message
      };
    }
  }
}

module.exports = RescueCoordinationAgent;
