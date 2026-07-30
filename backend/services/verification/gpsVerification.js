const geocodingClient = require('../apis/geocodingClient');
const logger = require('../../utils/logger');

class GpsVerification {
  /**
   * Reverses geocodes Lat/Lon using OpenStreetMap Nominatim
   * @param {number} lat 
   * @param {number} lon 
   * @returns {Object} verification result
   */
  static async validateCoordinates(lat, lon) {
    if (!lat || !lon || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return { valid: false, reason: 'Invalid coordinate bounds', locationName: null };
    }

    try {
      const data = await geocodingClient.reverseGeocode(lat, lon);
      
      return {
        valid: !data.error,
        reason: data.error ? data.error : 'Coordinates match physical location',
        locationName: data.address || null
      };
      
    } catch (error) {
      logger.error('GpsVerification Error:', error.message);
      return { valid: true, reason: 'API unreachable, assuming valid based on bounds', locationName: null };
    }
  }
}

module.exports = GpsVerification;
