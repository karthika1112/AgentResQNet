const WeatherService = require('../weather/weatherService');
const EarthquakeService = require('../earthquake/earthquakeService');

class SourceVerification {
  /**
   * Cross-checks the incident claims with official public data
   */
  static async verifyAgainstSources(category, lat, lon) {
    let matchedSources = [];
    let isSupported = false;

    if (category.toLowerCase().includes('earthquake')) {
      isSupported = true;
      const eqData = await EarthquakeService.getRecentEarthquakes();
      if (eqData.events && eqData.events.length > 0) {
        matchedSources.push('USGS Earthquake Catalog');
      }
    } 
    else if (category.toLowerCase().includes('flood') || category.toLowerCase().includes('storm')) {
      isSupported = true;
      const weatherData = await WeatherService.getWeather(lat, lon);
      if (weatherData.current && weatherData.current.precipitation > 0) {
        matchedSources.push('Open-Meteo Weather Data');
      }
    }

    return {
      supportedCategory: isSupported,
      sourcesMatched: matchedSources,
      verifiedBySource: matchedSources.length > 0
    };
  }
}

module.exports = SourceVerification;
