const BaseAgent = require('./BaseAgent');
const AIService = require('../services/AIService');
const WorkflowEngine = require('../services/workflow/WorkflowEngine');
const logger = require('../utils/logger');

class CommanderAgent extends BaseAgent {
  constructor() {
    super('Commander Agent', 'Master Orchestrator for ResQNet AI');
  }

  async processRequest(userMessage, sessionHistory) {
    const startTime = Date.now();
    logger.info(`Commander processing request: "${userMessage}"`);

    // 1. Intent Extraction
    const intentData = await this.extractIntent(userMessage);
    
    // 2. Pass to Enterprise Workflow Engine
    const workflowResult = await WorkflowEngine.run(intentData.intent, userMessage);
    
    // 3. Synthesize Final Response using the LLM (bypassed if mock)
    const finalResponse = await this.synthesizeResponse(userMessage, workflowResult, intentData);

    const executionTime = Date.now() - startTime;

    return {
      requestId: workflowResult.requestId || `req_${Date.now()}`,
      workflowId: workflowResult.workflowId,
      intent: intentData.intent,
      selectedAgents: workflowResult.selectedAgents,
      workflowNodes: workflowResult.workflowNodes,
      overallConfidence: workflowResult.overallConfidence,
      executionTime: `${executionTime}ms`,
      response: finalResponse,
      finalRecommendation: workflowResult.finalRecommendation,
      officialSources: workflowResult.officialSources,
      timestamp: new Date().toISOString()
    };
  }

  async extractIntent(message) {
    // In a real implementation, this prompt would force a strict JSON response.
    // For this step, we use the LLM to get a structured response, or mock it if using the mock provider.
    const prompt = `Analyze this user request: "${message}". Classify the intent into ONE of these categories: DISASTER_INFORMATION, INCIDENT_REPORT, VERIFY_INCIDENT, EVACUATION, RESCUE, RESOURCE, GENERAL_QUERY. Respond ONLY with a JSON object like {"intent": "RESCUE", "confidence": 0.95}.`;
    
    const result = await AIService.processPrompt(prompt);
    
    try {
      // Very basic extraction of JSON from response (in case LLM wraps in markdown)
      let rawText = result.response.replace(/```json/g, '').replace(/```/g, '').trim();
      
      // If mock, it might not be JSON, so we handle it gracefully
      if (rawText.startsWith('[Mock')) {
        return this.mockIntentDetection(message);
      }

      const parsed = JSON.parse(rawText);
      return {
        intent: parsed.intent || 'GENERAL_QUERY',
        confidence: parsed.confidence || 0.8
      };
    } catch (error) {
      logger.warn('Failed to parse intent JSON, falling back to heuristic mock:', result.response);
      return this.mockIntentDetection(message);
    }
  }

  mockIntentDetection(message) {
    const msg = message.toLowerCase();
    if (msg.includes('evacuate') || msg.includes('route')) return { intent: 'EVACUATION', confidence: 0.9 };
    if (msg.includes('rescue') || msg.includes('help me')) return { intent: 'RESCUE', confidence: 0.95 };
    if (msg.includes('resource') || msg.includes('food') || msg.includes('water')) return { intent: 'RESOURCE', confidence: 0.85 };
    if (msg.includes('report') || msg.includes('happened')) return { intent: 'INCIDENT_REPORT', confidence: 0.9 };
    return { intent: 'GENERAL_QUERY', confidence: 0.7 };
  }

  async synthesizeResponse(userMessage, workflowResult, intentData) {
    if (workflowResult.status === 'Failed') {
      return `I encountered an error coordinating the response: ${workflowResult.error}`;
    }

    const aggregatedData = workflowResult.agentResults ? workflowResult.agentResults.map(r => `Agent ${r.agent} (${r.status}): ${JSON.stringify(r.result)}`).join(' | ') : '';
    
    const prompt = `You are the Commander AI for ResQNet. The user asked: "${userMessage}". The specialist agents provided this data: [${aggregatedData}]. Synthesize a concise, helpful response for the user based ONLY on the agent data.`;
    
    const result = await AIService.processPrompt(prompt);
    
    if (result.response.startsWith('[Mock')) {
      return `Based on your request, I coordinated with my specialist agents. Summary of findings: ${aggregatedData}`;
    }
    
    return result.response;
  }
}

module.exports = new CommanderAgent();
