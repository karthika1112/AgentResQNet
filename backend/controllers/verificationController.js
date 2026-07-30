const IncidentVerificationAgent = require('../agents/IncidentVerificationAgent');

exports.verifyIncident = async (req, res, next) => {
  try {
    const { lat, lon, category, images } = req.body;
    
    if (!lat || !lon || !category) {
      return res.status(400).json({ success: false, message: 'lat, lon, and category are required' });
    }

    const iva = new IncidentVerificationAgent();
    const result = await iva.execute({ lat, lon, category, images });
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getVerificationStatus = async (req, res, next) => {
  try {
    // In a full implementation, this would fetch from a database.
    // For now, we mock the retrieval.
    res.status(200).json({
      success: true,
      data: {
        incidentId: req.params.id,
        verificationStatus: 'Pending',
        message: 'This endpoint currently returns a mock status. Database integration required.'
      }
    });
  } catch (error) {
    next(error);
  }
};
