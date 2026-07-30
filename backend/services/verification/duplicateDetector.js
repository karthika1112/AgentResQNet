const Incident = require('../../models/Incident');
const logger = require('../../utils/logger');

class DuplicateDetector {
  /**
   * Checks if an incident of the same category was reported nearby in the last 6 hours
   * @param {number} lat 
   * @param {number} lon 
   * @param {string} category 
   */
  static async findDuplicates(lat, lon, category) {
    try {
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
      
      // Simple bounding box for roughly ~5km radius
      const latRange = 0.045; 
      const lonRange = 0.045;

      const duplicates = await Incident.find({
        category: category,
        createdAt: { $gte: sixHoursAgo },
        latitude: { $gte: lat - latRange, $lte: lat + latRange },
        longitude: { $gte: lon - lonRange, $lte: lon + lonRange }
      }).select('incidentId status createdAt latitude longitude');

      return {
        hasDuplicates: duplicates.length > 0,
        count: duplicates.length,
        similarIncidents: duplicates.map(d => d.incidentId)
      };
    } catch (error) {
      logger.error('DuplicateDetector Error:', error);
      return { hasDuplicates: false, count: 0, similarIncidents: [] };
    }
  }
}

module.exports = DuplicateDetector;
