const { getIO } = require('../../config/socket');
const RescueMission = require('../../models/RescueMission');
const Responder = require('../../models/Responder');
const EtaEngine = require('./etaEngine');
const logger = require('../../utils/logger');

class GpsTracker {
  /**
   * Updates the GPS location of a responder and recalculates ETA for their active mission
   */
  static async updateLocation(missionId, lat, lon) {
    try {
      const mission = await RescueMission.findById(missionId).populate('assignedResponder');
      if (!mission) return { success: false, message: 'Mission not found' };

      // Update Responder Location
      if (mission.assignedResponder) {
        await Responder.findByIdAndUpdate(mission.assignedResponder._id, {
          'currentLocation.latitude': lat,
          'currentLocation.longitude': lon
        });
      }

      // Recalculate ETA
      const etaData = await EtaEngine.calculateETA(lat, lon, mission.targetLocation.lat, mission.targetLocation.lng);
      mission.estimatedArrival = new Date(Date.now() + etaData.seconds * 1000);
      await mission.save();

      // Emit Live Update via Socket.IO
      const io = getIO();
      io.emit('mission:update', {
        missionId: mission._id,
        currentLocation: { lat, lon },
        estimatedArrival: mission.estimatedArrival,
        etaText: etaData.text,
        status: mission.status
      });

      return { success: true, eta: etaData.text };
    } catch (error) {
      logger.error('GpsTracker Error:', error);
      return { success: false, message: 'Internal tracking error' };
    }
  }
}

module.exports = GpsTracker;
