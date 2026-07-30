const EvacuationShelterAgent = require('../agents/EvacuationShelterAgent');
const ShelterFinder = require('../services/routing/shelterFinder');

exports.getShelters = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ success: false, message: 'lat and lon are required' });
    }

    const shelters = await ShelterFinder.findNearestShelters(parseFloat(lat), parseFloat(lon));
    
    res.status(200).json({
      success: true,
      data: shelters
    });
  } catch (error) {
    next(error);
  }
};

exports.getNearestShelter = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ success: false, message: 'lat and lon are required' });
    }

    const esa = new EvacuationShelterAgent();
    // execute will find the nearest available shelter and calculate the route
    const result = await esa.execute({ lat: parseFloat(lat), lon: parseFloat(lon) });
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.calculateRoute = async (req, res, next) => {
  try {
    // This is essentially triggering the agent for a specific location
    const { lat, lon } = req.body;
    if (!lat || !lon) {
      return res.status(400).json({ success: false, message: 'lat and lon are required in body' });
    }

    const esa = new EvacuationShelterAgent();
    const result = await esa.execute({ lat: parseFloat(lat), lon: parseFloat(lon) });
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
