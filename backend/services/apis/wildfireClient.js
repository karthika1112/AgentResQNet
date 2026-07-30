const BaseApiClient = require('./BaseApiClient');
const logger = require('../../utils/logger');

class WildfireClient extends BaseApiClient {
  constructor() {
    // 5 minutes cacheTTL = 300
    super('WildfireClient', { cacheTTL: 300, retries: 2, timeout: 5000 });
  }

  async getActiveWildfires() {
    try {
      // NASA EONET (Earth Observatory Natural Event Tracker) for Wildfires
      const url = `https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires&limit=20&status=open`;
      const data = await this.fetch(url);
      
      return {
        source: 'NASA EONET',
        count: data.events ? data.events.length : 0,
        events: data.events ? data.events.map(e => ({
          id: e.id,
          title: e.title,
          coordinates: e.geometry && e.geometry.length > 0 ? e.geometry[0].coordinates : null,
          date: e.geometry && e.geometry.length > 0 ? e.geometry[0].date : null
        })) : []
      };
    } catch (error) {
      logger.error('WildfireClient Error:', error.message);
      return { error: 'No verified official data available.', source: 'NASA EONET' };
    }
  }
}

module.exports = new WildfireClient();
