const BaseApiClient = require('./BaseApiClient');
const logger = require('../../utils/logger');

class WeatherClient extends BaseApiClient {
  constructor() {
    // 10 minutes cacheTTL = 600000ms
    super('WeatherClient', { cacheTTL: 600, retries: 2, timeout: 5000 });
  }

  async getWeather(lat = 37.77, lon = -122.41) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
      const data = await this.fetch(url);
      
      return {
        source: 'Open-Meteo',
        current: data.current_weather,
        forecast: data.daily
      };
    } catch (error) {
      logger.error('WeatherClient Error:', error.message);
      return { error: 'No verified official data available.', source: 'Open-Meteo' };
    }
  }
}

module.exports = new WeatherClient();
