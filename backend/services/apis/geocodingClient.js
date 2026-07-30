const BaseApiClient = require('./BaseApiClient');
const logger = require('../../utils/logger');

class GeocodingClient extends BaseApiClient {
  constructor() {
    // 60 minutes cacheTTL for geocoding
    super('GeocodingClient', { cacheTTL: 3600, retries: 2, timeout: 5000 });
  }

  async geocode(address) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
      const data = await this.fetch(url, {
        headers: {
          'User-Agent': 'ResQNet-AI/1.0 (contact@resqnet.com)'
        }
      });
      
      if (data && data.length > 0) {
        return {
          source: 'Nominatim/OSM',
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          displayName: data[0].display_name
        };
      }
      return { error: 'Address not found.', source: 'Nominatim/OSM' };
    } catch (error) {
      logger.error('GeocodingClient Error:', error.message);
      return { error: 'No verified official data available.', source: 'Nominatim/OSM' };
    }
  }

  async reverseGeocode(lat, lon) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
      const data = await this.fetch(url, {
        headers: {
          'User-Agent': 'ResQNet-AI/1.0 (contact@resqnet.com)'
        }
      });
      
      if (data && data.display_name) {
        return {
          source: 'Nominatim/OSM',
          address: data.display_name,
          details: data.address
        };
      }
      return { error: 'Coordinates not found.', source: 'Nominatim/OSM' };
    } catch (error) {
      logger.error('GeocodingClient Error:', error.message);
      return { error: 'No verified official data available.', source: 'Nominatim/OSM' };
    }
  }
}

module.exports = new GeocodingClient();
