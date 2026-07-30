const Volunteer = require('../../models/Volunteer');
const logger = require('../../utils/logger');

class VolunteerAllocator {
  /**
   * Finds available volunteers to assist with distribution
   * @param {number} lat 
   * @param {number} lon 
   * @param {number} requiredCount 
   */
  static async allocateVolunteers(lat, lon, requiredCount = 2) {
    try {
      const availableVolunteers = await Volunteer.find({ availability: true }).populate('user');
      
      if (!availableVolunteers || availableVolunteers.length === 0) {
        return [];
      }

      // Sort by proximity
      const sorted = availableVolunteers.map(v => {
        const dist = Math.sqrt(Math.pow((v.currentLocation?.latitude || 0) - lat, 2) + Math.pow((v.currentLocation?.longitude || 0) - lon, 2));
        return { volunteer: v, distance: dist };
      }).sort((a, b) => a.distance - b.distance);

      // Select top N volunteers
      const selected = sorted.slice(0, requiredCount).map(s => s.volunteer);
      
      // Mark them as unavailable
      for (const v of selected) {
        v.availability = false;
        await v.save();
      }

      return selected;
    } catch (error) {
      logger.error('VolunteerAllocator Error:', error);
      return [];
    }
  }
}

module.exports = VolunteerAllocator;
