const BaseApiClient = require('./BaseApiClient');
const logger = require('../../utils/logger');

class AlertClient extends BaseApiClient {
  constructor() {
    // 5 minutes cacheTTL
    super('AlertClient', { cacheTTL: 300, retries: 2, timeout: 5000 });
  }

  async getActiveAlerts(stateCode = 'CA') {
    try {
      // US National Weather Service API
      const url = `https://api.weather.gov/alerts/active?area=${stateCode}`;
      
      // NWS requires a User-Agent
      const data = await this.fetch(url, {
        headers: {
          'User-Agent': '(resqnet.com, contact@resqnet.com)',
          'Accept': 'application/geo+json'
        }
      });
      
      return {
        source: 'NOAA NWS',
        count: data.features ? data.features.length : 0,
        alerts: data.features ? data.features.map(f => ({
          event: f.properties.event,
          severity: f.properties.severity,
          headline: f.properties.headline,
          instruction: f.properties.instruction,
          effective: f.properties.effective
        })) : []
      };
    } catch (error) {
      logger.error('AlertClient Error:', error.message);
      return { error: 'No verified official data available.', source: 'NOAA NWS' };
    }
  }
}

module.exports = new AlertClient();
