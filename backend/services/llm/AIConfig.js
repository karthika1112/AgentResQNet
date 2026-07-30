const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const AIConfig = {
  activeProvider: process.env.ACTIVE_AI_PROVIDER || 'Gemini',
  keys: {
    Gemini: process.env.GEMINI_API_KEY,
    OpenAI: process.env.OPENAI_API_KEY,
    Claude: process.env.CLAUDE_API_KEY,
  }
};

module.exports = AIConfig;
