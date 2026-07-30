const RescueMission = require('../../models/RescueMission');

class MissionPlanner {
  /**
   * Generates a mission priority based on incident data
   */
  static calculatePriority(incidentSeverity, victimCount) {
    if (incidentSeverity === 'Critical' || victimCount > 10) return 'Critical';
    if (incidentSeverity === 'High' || victimCount > 5) return 'High';
    if (incidentSeverity === 'Medium' || victimCount > 0) return 'Medium';
    return 'Low';
  }

  static async createMission(missionData) {
    const mission = new RescueMission({
      ...missionData,
      timeline: [{ event: 'Mission Created', timestamp: new Date() }]
    });
    await mission.save();
    return mission;
  }
}

module.exports = MissionPlanner;
