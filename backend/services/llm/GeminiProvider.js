const BaseProvider = require('./BaseProvider');
const axios = require('axios');
const AIConfig = require('./AIConfig');

class GeminiProvider extends BaseProvider {
  constructor() {
    super('Gemini');
    this.apiKey = AIConfig.keys.Gemini;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  }

  async generate(prompt) {
    if (!this.apiKey) {
      // Mock response for testing if no key is provided
      return {
        text: `[Mock Gemini] This is a simulated response to: "${prompt.substring(0, 50)}..."`,
        tokens: prompt.length / 4 + 20
      };
    }

    try {
      const response = await axios.post(`${this.baseUrl}?key=${this.apiKey}`, {
        contents: [{ parts: [{ text: prompt }] }]
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const text = response.data.candidates[0].content.parts[0].text;
      return {
        text,
        tokens: text.length / 4 // rough estimate
      };
    } catch (error) {
      throw new Error(`Gemini API Error: ${error.message}`);
    }
  }

  async health() {
    return this.apiKey ? 'Healthy' : 'Missing API Key';
  }
}

module.exports = GeminiProvider;
