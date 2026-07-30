const RoutePlanner = require('../routing/routePlanner');
const EtaCalculator = require('../routing/etaCalculator');

class EtaEngine {
  /**
   * Calculates ETA from responder to incident
   */
  static async calculateETA(respLat, respLon, incLat, incLon) {
    const route = await RoutePlanner.getRoute(respLat, respLon, incLat, incLon);
    if (!route) {
      return { seconds: 0, text: 'Unknown', routeGeometry: null };
    }

    const text = EtaCalculator.getHumanReadableETA(route.durationSeconds);
    return {
      seconds: route.durationSeconds,
      text: text,
      routeGeometry: route.geometry
    };
  }
}

module.exports = EtaEngine;
