const BaseApiClient = require('./BaseApiClient');
const logger = require('../../utils/logger');

class EarthquakeClient extends BaseApiClient {
  constructor() {
    // 5 minutes cacheTTL = 300000ms
    super('EarthquakeClient', { cacheTTL: 300, retries: 2, timeout: 5000 });
  }

  async getRecentEarthquakes() {
    try {
      // Fetch all earthquakes M4.5+ in the past 24 hours
      const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson`;
      const data = await this.fetch(url);
      
      return {
        source: 'USGS',
        count: data.metadata.count,
        events: data.features.map(f => ({
          magnitude: f.properties.mag,
          place: f.properties.place,
          time: new Date(f.properties.time).toISOString(),
          tsunamiWarning: f.properties.tsunami === 1
        }))
      };
    } catch (error) {
      logger.error('EarthquakeClient Error:', error.message);
      return { error: 'No verified official data available.', source: 'USGS' };
    }
  }
}

module.exports = new EarthquakeClient();
