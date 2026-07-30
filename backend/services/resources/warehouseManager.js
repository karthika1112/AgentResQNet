const Shelter = require('../../models/Shelter');
const logger = require('../../utils/logger');

class WarehouseManager {
  /**
   * Finds the nearest shelter (warehouse) to a given incident location
   */
  static async findNearestWarehouse(lat, lon) {
    try {
      const warehouses = await Shelter.find({ status: 'Open' });
      
      if (!warehouses || warehouses.length === 0) {
        return null;
      }

      // Simple Haversine distance estimation
      const sorted = warehouses.map(w => {
        const dist = Math.sqrt(Math.pow(w.latitude - lat, 2) + Math.pow(w.longitude - lon, 2));
        return { warehouse: w, distance: dist };
      }).sort((a, b) => a.distance - b.distance);

      return sorted[0].warehouse;
    } catch (error) {
      logger.error('WarehouseManager Error:', error);
      return null;
    }
  }
}

module.exports = WarehouseManager;
