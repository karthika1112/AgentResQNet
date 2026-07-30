const ProviderFactory = require('./llm/ProviderFactory');
const logger = require('../utils/logger');

class AIService {
  /**
   * Process a prompt through the active LLM Provider
   * @param {string} prompt 
   * @returns {object} Standardized response format
   */
  static async processPrompt(prompt) {
    const startTime = Date.now();
    let provider = null;
    
    try {
      provider = ProviderFactory.getProvider();
      logger.info(`Routing request to AI Provider: ${provider.name}`);

      const result = await provider.generate(prompt);
      
      const latency = Date.now() - startTime;
      
      logger.info(`AI Response received from ${provider.name}. Latency: ${latency}ms, Tokens: ${result.tokens}`);

      return {
        success: true,
        provider: provider.name,
        response: result.text,
        confidence: 0.95, // Placeholder for future confidence scoring
        latency: `${latency}ms`,
        tokens: result.tokens,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`AI Service Error (${provider ? provider.name : 'Unknown'}):`, error);
      
      return {
        success: false,
        provider: provider ? provider.name : 'Unknown',
        response: 'AI processing failed. Please try again later.',
        confidence: 0,
        latency: `${Date.now() - startTime}ms`,
        tokens: 0,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  static async getHealth() {
    const provider = ProviderFactory.getProvider();
    const status = await provider.health();
    return {
      activeProvider: provider.name,
      status: status,
      availableProviders: ProviderFactory.getAvailableProviders()
    };
  }
}

module.exports = AIService;
