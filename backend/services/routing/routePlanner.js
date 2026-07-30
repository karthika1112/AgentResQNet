const routingClient = require('../apis/routingClient');
const logger = require('../../utils/logger');

class RoutePlanner {
  /**
   * Fetches driving route from origin to destination using OSRM via routingClient
   * @param {number} startLat 
   * @param {number} startLon 
   * @param {number} endLat 
   * @param {number} endLon 
   */
  static async getRoute(startLat, startLon, endLat, endLon) {
    try {
      const data = await routingClient.getRoute(startLat, startLon, endLat, endLon);
      
      if (data.error) {
        throw new Error(data.error);
      }

      return {
        distanceMeters: data.distanceMeters,
        durationSeconds: data.durationSeconds,
        geometry: data.geometry // GeoJSON for Leaflet
      };
    } catch (error) {
      logger.error('RoutePlanner Error:', error.message);
      return null;
    }
  }
}

module.exports = RoutePlanner;
