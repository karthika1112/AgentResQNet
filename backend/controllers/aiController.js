const AIService = require('../services/AIService');

exports.checkHealth = async (req, res, next) => {
  try {
    const health = await AIService.getHealth();
    res.status(200).json({
      success: true,
      data: health
    });
  } catch (error) {
    next(error);
  }
};

exports.testPrompt = async (req, res, next) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const response = await AIService.processPrompt(message);
    
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(500).json(response);
    }
  } catch (error) {
    next(error);
  }
};
