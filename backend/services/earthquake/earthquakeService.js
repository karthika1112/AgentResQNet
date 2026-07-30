const axios = require('axios');
const CacheManager = require('../../utils/cacheManager');
const logger = require('../../utils/logger');

class EarthquakeService {
  /**
   * Fetches recent earthquakes using USGS API
   */
  static async getRecentEarthquakes() {
    const cacheKey = `earthquake_recent`;
    const cachedData = CacheManager.get(cacheKey);
    if (cachedData) return cachedData;

    try {
      // Fetch all earthquakes M4.5+ in the past 24 hours
      const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson`;
      const response = await axios.get(url);
      
      const data = {
        source: 'USGS',
        count: response.data.metadata.count,
        events: response.data.features.map(f => ({
          magnitude: f.properties.mag,
          place: f.properties.place,
          time: new Date(f.properties.time).toISOString(),
          tsunamiWarning: f.properties.tsunami === 1
        }))
      };
      
      CacheManager.set(cacheKey, data);
      return data;
    } catch (error) {
      logger.error('EarthquakeService Error:', error.message);
      return { error: 'No verified disaster data available.', source: 'USGS' };
    }
  }
}

module.exports = EarthquakeService;
