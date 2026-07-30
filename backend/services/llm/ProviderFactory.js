const AIConfig = require('./AIConfig');
const GeminiProvider = require('./GeminiProvider');
const OpenAIProvider = require('./OpenAIProvider');
const ClaudeProvider = require('./ClaudeProvider');
const logger = require('../../utils/logger');

class ProviderFactory {
  static getProvider(providerName = AIConfig.activeProvider) {
    switch (providerName.toLowerCase()) {
      case 'gemini':
        return new GeminiProvider();
      case 'openai':
        return new OpenAIProvider();
      case 'claude':
        return new ClaudeProvider();
      default:
        logger.warn(`Provider ${providerName} not recognized. Falling back to Gemini.`);
        return new GeminiProvider();
    }
  }

  static getAvailableProviders() {
    return ['Gemini', 'OpenAI', 'Claude'];
  }
}

module.exports = ProviderFactory;
