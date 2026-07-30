const BaseAgent = require('./BaseAgent');
const ShelterFinder = require('../services/routing/shelterFinder');
const CapacityManager = require('../services/routing/capacityManager');
const SafeRouteEngine = require('../services/routing/safeRouteEngine');
const logger = require('../utils/logger');

class EvacuationShelterAgent extends BaseAgent {
  constructor() {
    super('Evacuation & Shelter Agent', 'Provides safest evacuation routes and verifies nearby shelters.');
  }

  async execute(context) {
    const startTime = Date.now();
    logger.info(`[EvacuationShelterAgent] Executing...`);

    try {
      const { lat = 37.77, lon = -122.41 } = typeof context === 'string' ? {} : context;

      // 1. Find Shelters
      const nearbyShelters = await ShelterFinder.findNearestShelters(lat, lon);
      
      if (nearbyShelters.length === 0) {
        return {
          nearestShelter: null,
          message: 'No verified shelter available nearby.',
          confidence: 0,
          timestamp: new Date().toISOString()
        };
      }

      // 2. Check Capacity (Find first available)
      let selectedShelter = null;
      for (const shelter of nearbyShelters) {
        if (CapacityManager.isAvailable(shelter)) {
          selectedShelter = shelter;
          break;
        }
      }

      if (!selectedShelter) {
        return {
          nearestShelter: null,
          message: 'Nearby shelters found, but all are at maximum capacity.',
          confidence: 0,
          timestamp: new Date().toISOString()
        };
      }

      // 3. Generate Route
      const routePlan = await SafeRouteEngine.generatePlan(lat, lon, selectedShelter);

      const executionTime = Date.now() - startTime;

      return {
        nearestShelter: {
          name: selectedShelter.name,
          address: selectedShelter.address,
          coordinates: [selectedShelter.latitude, selectedShelter.longitude],
          foodAvailable: selectedShelter.foodAvailable,
          medicalAvailable: selectedShelter.medicalAvailable
        },
        distance: routePlan.distance || 'Unknown',
        estimatedTime: routePlan.estimatedTime || 'Unknown',
        safeRoute: routePlan.safeRoute,
        alternativeRoute: routePlan.alternativeRoute,
        shelterCapacity: `${selectedShelter.occupied}/${selectedShelter.capacity}`,
        emergencyContacts: selectedShelter.contactNumber ? [selectedShelter.contactNumber] : ['911'],
        confidence: routePlan.routeFound ? 95 : 50,
        executionTime: `${executionTime}ms`,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error(`[EvacuationShelterAgent] Error: ${error.message}`);
      return {
        nearestShelter: null,
        message: 'Internal error processing evacuation request.',
        error: error.message
      };
    }
  }
}

module.exports = EvacuationShelterAgent;
