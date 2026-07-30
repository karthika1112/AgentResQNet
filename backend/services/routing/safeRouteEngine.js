const RoutePlanner = require('./routePlanner');
const EtaCalculator = require('./etaCalculator');
const logger = require('../../utils/logger');

class SafeRouteEngine {
  /**
   * Generates a safe route payload based on origin and destination
   */
  static async generatePlan(startLat, startLon, shelter) {
    try {
      const routeData = await RoutePlanner.getRoute(startLat, startLon, shelter.latitude, shelter.longitude);
      
      if (!routeData) {
        return {
          routeFound: false,
          message: 'Unable to calculate route via OSRM.'
        };
      }

      return {
        routeFound: true,
        distance: `${(routeData.distanceMeters / 1000).toFixed(2)} km`,
        estimatedTime: EtaCalculator.getHumanReadableETA(routeData.durationSeconds),
        safeRoute: routeData.geometry, // GeoJSON for Leaflet
        alternativeRoute: null // In MVP, just returning primary
      };
    } catch (error) {
      logger.error('SafeRouteEngine Error:', error);
      return { routeFound: false, message: 'Routing engine failure' };
    }
  }
}

module.exports = SafeRouteEngine;
