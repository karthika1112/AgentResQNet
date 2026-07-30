const BaseAgent = require('./BaseAgent');
const weatherClient = require('../services/apis/weatherClient');
const earthquakeClient = require('../services/apis/earthquakeClient');
const wildfireClient = require('../services/apis/wildfireClient');
const alertClient = require('../services/apis/alertClient');
const AIService = require('../services/AIService');
const logger = require('../utils/logger');

class DisasterIntelligenceAgent extends BaseAgent {
  constructor() {
    super('Disaster Intelligence Agent', 'Monitor, analyze, and predict disasters using verified real-world data.');
  }

  async execute(context) {
    const startTime = Date.now();
    logger.info(`[DisasterIntelligenceAgent] Executing... Context: ${context}`);

    try {
      // 1. Fetch real-world data in parallel
      const [weatherData, earthquakeData, wildfireData, alertData] = await Promise.all([
        weatherClient.getWeather(37.77, -122.41), // Defaulting to SF for demo if coords not in context
        earthquakeClient.getRecentEarthquakes(),
        wildfireClient.getActiveWildfires(),
        alertClient.getActiveAlerts('CA') // Defaulting to CA for demo
      ]);

      // 2. Synthesize using LLM
      const prompt = `You are a Disaster Intelligence Agent. Analyze the following verified data: 
        Weather: ${JSON.stringify(weatherData)} 
        Earthquakes: ${JSON.stringify(earthquakeData)}
        Wildfires: ${JSON.stringify(wildfireData)}
        Alerts: ${JSON.stringify(alertData)}
        
        User query context: "${context}".
        Respond with a highly structured summary including disasterType, riskLevel (Low/Medium/High/Critical), location, forecast, officialSources, recommendation. Do NOT use fake data. If data indicates no immediate threat, state that clearly. Return ONLY valid JSON.`;
      
      const aiResponse = await AIService.processPrompt(prompt);
      
      let parsedData;
      try {
        let rawJson = aiResponse.response.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(rawJson);
      } catch (e) {
        parsedData = {
          disasterType: 'Analysis Failed',
          riskLevel: 'Unknown',
          location: 'Global',
          forecast: 'Unable to parse LLM response',
          officialSources: ['Open-Meteo', 'USGS', 'NASA', 'NOAA'],
          confidence: 0,
          recommendation: aiResponse.response
        };
      }

      const executionTime = Date.now() - startTime;
      
      return {
        ...parsedData,
        executionTime: `${executionTime}ms`,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      logger.error(`[DisasterIntelligenceAgent] Error: ${error.message}`);
      return {
        disasterType: 'Unknown',
        riskLevel: 'Unknown',
        officialSources: [],
        confidence: 0,
        recommendation: 'No verified official data available.',
        error: error.message
      };
    }
  }
}

module.exports = DisasterIntelligenceAgent;
