const RescueCoordinationAgent = require('../agents/RescueCoordinationAgent');
const RescueMission = require('../models/RescueMission');
const GpsTracker = require('../services/rescue/gpsTracker');
const MissionTimeline = require('../services/rescue/missionTimeline');

exports.createRescueMission = async (req, res, next) => {
  try {
    const { lat, lon, category, severity, victimCount } = req.body;
    
    if (!lat || !lon) {
      return res.status(400).json({ success: false, message: 'lat and lon are required' });
    }

    const rca = new RescueCoordinationAgent();
    const result = await rca.execute({ 
      lat: parseFloat(lat), 
      lon: parseFloat(lon),
      category,
      incidentSeverity: severity,
      victimCount
    });
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getMissionStatus = async (req, res, next) => {
  try {
    const { missionId } = req.params;
    const mission = await RescueMission.findById(missionId).populate('assignedResponder');
    
    if (!mission) {
      return res.status(404).json({ success: false, message: 'Mission not found' });
    }

    res.status(200).json({
      success: true,
      data: mission
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMissionGPS = async (req, res, next) => {
  try {
    const { missionId, lat, lon, statusUpdate } = req.body;
    
    if (!missionId || !lat || !lon) {
      return res.status(400).json({ success: false, message: 'missionId, lat, and lon are required' });
    }

    // Update GPS and broadcast via Socket.IO
    const trackerResult = await GpsTracker.updateLocation(missionId, parseFloat(lat), parseFloat(lon));
    
    // Optionally update timeline if status changed (e.g. 'Arrived')
    if (statusUpdate) {
      await MissionTimeline.addEvent(missionId, `Status updated to ${statusUpdate}`, statusUpdate);
    }

    res.status(200).json({
      success: true,
      message: 'Mission GPS updated via Socket.IO',
      data: trackerResult
    });
  } catch (error) {
    next(error);
  }
};
