const RescueMission = require('../../models/RescueMission');
const { getIO } = require('../../config/socket');
const logger = require('../../utils/logger');

class MissionTimeline {
  /**
   * Appends an event to the mission timeline and broadcasts
   */
  static async addEvent(missionId, eventDescription, newStatus = null) {
    try {
      const updateData = {
        $push: { timeline: { event: eventDescription, timestamp: new Date() } }
      };

      if (newStatus) {
        updateData.status = newStatus;
      }

      const mission = await RescueMission.findByIdAndUpdate(missionId, updateData, { new: true });
      
      const io = getIO();
      io.emit('mission:timeline_update', {
        missionId: mission._id,
        event: eventDescription,
        status: mission.status,
        timestamp: new Date()
      });

      return mission;
    } catch (error) {
      logger.error('MissionTimeline Error:', error);
      return null;
    }
  }
}

module.exports = MissionTimeline;
