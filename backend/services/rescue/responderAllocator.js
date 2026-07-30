const Responder = require('../../models/Responder');
const logger = require('../../utils/logger');

class ResponderAllocator {
  /**
   * Finds the nearest available responder
   */
  static async allocateNearest(lat, lon) {
    try {
      const availableResponders = await Responder.find({ status: 'Available' }).populate('user');
      
      if (!availableResponders || availableResponders.length === 0) {
        return null;
      }

      // Simple straight-line distance sorting
      const sorted = availableResponders.map(r => {
        const dist = Math.sqrt(Math.pow((r.currentLocation?.latitude || 0) - lat, 2) + Math.pow((r.currentLocation?.longitude || 0) - lon, 2));
        return { responder: r, distance: dist };
      }).sort((a, b) => a.distance - b.distance);

      const bestResponder = sorted[0].responder;
      
      // Mark them as busy
      bestResponder.status = 'Busy';
      await bestResponder.save();

      return bestResponder;
    } catch (error) {
      logger.error('ResponderAllocator Error:', error);
      return null;
    }
  }
}

module.exports = ResponderAllocator;
