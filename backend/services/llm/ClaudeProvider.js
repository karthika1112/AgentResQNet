const BaseProvider = require('./BaseProvider');
const axios = require('axios');
const AIConfig = require('./AIConfig');

class ClaudeProvider extends BaseProvider {
  constructor() {
    super('Claude');
    this.apiKey = AIConfig.keys.Claude;
    this.baseUrl = 'https://api.anthropic.com/v1/messages';
  }

  async generate(prompt) {
    if (!this.apiKey) {
      // Mock response
      return {
        text: `[Mock Claude] This is a simulated response to: "${prompt.substring(0, 50)}..."`,
        tokens: prompt.length / 4 + 20
      };
    }

    try {
      const response = await axios.post(this.baseUrl, {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      }, {
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        }
      });

      const text = response.data.content[0].text;
      return {
        text,
        tokens: response.data.usage.output_tokens
      };
    } catch (error) {
      throw new Error(`Claude API Error: ${error.message}`);
    }
  }

  async health() {
    return this.apiKey ? 'Healthy' : 'Missing API Key';
  }
}

module.exports = ClaudeProvider;
