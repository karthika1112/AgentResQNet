const BaseApiClient = require('./BaseApiClient');
const logger = require('../../utils/logger');

class RoutingClient extends BaseApiClient {
  constructor() {
    // 5 minutes cacheTTL for routing
    super('RoutingClient', { cacheTTL: 300, retries: 2, timeout: 5000 });
  }

  /**
   * Calculate route from origin to destination using OSRM
   * @param {number} startLat 
   * @param {number} startLon 
   * @param {number} endLat 
   * @param {number} endLon 
   */
  async getRoute(startLat, startLon, endLat, endLon) {
    try {
      // OSRM coordinates are in longitude,latitude format
      const url = `http://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`;
      const data = await this.fetch(url, {
        headers: { 'User-Agent': 'ResQNet-AI/1.0' }
      });
      
      if (data && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          source: 'OSRM',
          distanceMeters: route.distance,
          distanceKm: (route.distance / 1000).toFixed(2),
          durationSeconds: route.duration,
          durationMinutes: Math.ceil(route.duration / 60),
          geometry: route.geometry
        };
      }
      return { error: 'No route found.', source: 'OSRM' };
    } catch (error) {
      logger.error('RoutingClient Error:', error.message);
      return { error: 'No verified official data available.', source: 'OSRM' };
    }
  }
}

module.exports = new RoutingClient();
