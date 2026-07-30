const axios = require('axios');
const CacheManager = require('../../utils/cacheManager');
const logger = require('../../utils/logger');

class WeatherService {
  /**
   * Fetches weather and forecast for given lat/lon using Open-Meteo
   */
  static async getWeather(lat = 37.77, lon = -122.41) {
    const cacheKey = `weather_${lat}_${lon}`;
    const cachedData = CacheManager.get(cacheKey);
    if (cachedData) return cachedData;

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
      const response = await axios.get(url);
      
      const data = {
        source: 'Open-Meteo',
        current: response.data.current_weather,
        forecast: response.data.daily
      };
      
      CacheManager.set(cacheKey, data);
      return data;
    } catch (error) {
      logger.error('WeatherService Error:', error.message);
      return { error: 'No verified disaster data available.', source: 'Open-Meteo' };
    }
  }
}

module.exports = WeatherService;
