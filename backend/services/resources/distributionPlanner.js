const RoutePlanner = require('../routing/routePlanner');
const EtaCalculator = require('../routing/etaCalculator');
const logger = require('../../utils/logger');

class DistributionPlanner {
  /**
   * Calculates delivery route and ETA
   */
  static async planDelivery(warehouseLat, warehouseLon, incidentLat, incidentLon) {
    try {
      const route = await RoutePlanner.getRoute(warehouseLat, warehouseLon, incidentLat, incidentLon);
      
      if (!route) {
        return { estimatedDelivery: 'Unknown', routeGeometry: null, distance: 'Unknown' };
      }

      return {
        estimatedDelivery: EtaCalculator.getHumanReadableETA(route.durationSeconds),
        routeGeometry: route.geometry,
        distance: `${(route.distanceMeters / 1000).toFixed(2)} km`
      };
    } catch (error) {
      logger.error('DistributionPlanner Error:', error);
      return { estimatedDelivery: 'Unknown', routeGeometry: null, distance: 'Unknown' };
    }
  }
}

module.exports = DistributionPlanner;
