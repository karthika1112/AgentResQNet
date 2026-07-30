const Shelter = require('../../models/Shelter');
const logger = require('../../utils/logger');

class ShelterFinder {
  /**
   * Finds the nearest open shelters to the given coordinates
   * @param {number} lat 
   * @param {number} lon 
   * @returns {Promise<Object[]>}
   */
  static async findNearestShelters(lat, lon) {
    try {
      // Using basic coordinate bounding for MVP instead of complex GeoJSON aggregation
      const range = 0.5; // ~50km radius roughly
      const shelters = await Shelter.find({
        status: 'Open',
        latitude: { $gte: lat - range, $lte: lat + range },
        longitude: { $gte: lon - range, $lte: lon + range }
      });

      // Calculate approximate straight-line distance to sort them
      const sortedShelters = shelters.map(shelter => {
        const dist = Math.sqrt(Math.pow(shelter.latitude - lat, 2) + Math.pow(shelter.longitude - lon, 2));
        return { shelter, distance: dist };
      }).sort((a, b) => a.distance - b.distance);

      return sortedShelters.map(s => s.shelter);
    } catch (error) {
      logger.error('ShelterFinder Error:', error);
      return [];
    }
  }
}

module.exports = ShelterFinder;
