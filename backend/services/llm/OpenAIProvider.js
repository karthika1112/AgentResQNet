const BaseProvider = require('./BaseProvider');
const axios = require('axios');
const AIConfig = require('./AIConfig');

class OpenAIProvider extends BaseProvider {
  constructor() {
    super('OpenAI');
    this.apiKey = AIConfig.keys.OpenAI;
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async generate(prompt) {
    if (!this.apiKey) {
      // Mock response
      return {
        text: `[Mock OpenAI] This is a simulated response to: "${prompt.substring(0, 50)}..."`,
        tokens: prompt.length / 4 + 20
      };
    }

    try {
      const response = await axios.post(this.baseUrl, {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }]
      }, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      const text = response.data.choices[0].message.content;
      return {
        text,
        tokens: response.data.usage.total_tokens
      };
    } catch (error) {
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
  }

  async health() {
    return this.apiKey ? 'Healthy' : 'Missing API Key';
  }
}

module.exports = OpenAIProvider;
