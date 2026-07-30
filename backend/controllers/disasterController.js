const DisasterIntelligenceAgent = require('../agents/DisasterIntelligenceAgent');
const WeatherService = require('../services/weather/weatherService');

exports.getStatus = async (req, res, next) => {
  try {
    const dia = new DisasterIntelligenceAgent();
    // Providing a generic context for overall status
    const result = await dia.execute('What is the current global disaster status?');
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getForecast = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const weather = await WeatherService.getWeather(lat || 37.77, lon || -122.41);
    
    res.status(200).json({
      success: true,
      data: weather
    });
  } catch (error) {
    next(error);
  }
};

exports.analyseLocation = async (req, res, next) => {
  try {
    const { location } = req.body;
    if (!location) {
      return res.status(400).json({ success: false, message: 'Location is required' });
    }

    const dia = new DisasterIntelligenceAgent();
    const result = await dia.execute(`Analyze disaster risks for location: ${location}`);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
