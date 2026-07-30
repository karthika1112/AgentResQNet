const TaskRouter = require('./TaskRouter');
const ExecutionEngine = require('./ExecutionEngine');
const logger = require('../../utils/logger');

class WorkflowManager {
  static async executeWorkflow(intent, context) {
    logger.info(`WorkflowManager initiated for intent: ${intent}`);
    const logs = [];
    
    logs.push('Extracting intent...');
    
    // 1. Route to agents
    const requiredAgents = TaskRouter.routeIntent(intent);
    logs.push(`Task Router selected agents: ${requiredAgents.join(', ')}`);
    
    // 2. Execute parallel
    logs.push('Executing agents in parallel...');
    const results = await ExecutionEngine.executeParallel(requiredAgents, context);
    
    logs.push('Aggregating results...');

    return {
      executedAgents: requiredAgents,
      results: results,
      logs: logs
    };
  }
}

module.exports = WorkflowManager;
