const AgentScheduler = require('./AgentScheduler');
const ParallelExecutor = require('./ParallelExecutor');
const ResponseMerger = require('./ResponseMerger');
const { getIO } = require('../../config/socket');
const logger = require('../../utils/logger');

class ExecutionManager {
  /**
   * Orchestrates the full lifecycle of a multi-agent workflow
   */
  static async runWorkflow(intent, context) {
    const workflowId = `WF-${Date.now()}`;
    const startTime = Date.now();
    const io = getIO();

    logger.info(`[ExecutionManager] Starting workflow ${workflowId} for intent ${intent}`);
    io.emit('workflow_started', { workflowId, intent, timestamp: new Date() });

    try {
      // 1. Determine which agents to run
      const selectedAgents = AgentScheduler.getRequiredAgents(intent);
      
      // 2. Execute them in parallel
      const agentResults = await ParallelExecutor.execute(workflowId, selectedAgents, context);

      // 3. Merge results and calculate confidence
      const executionTime = Date.now() - startTime;
      const finalResponse = ResponseMerger.merge(workflowId, agentResults, executionTime);

      io.emit('workflow_completed', { 
        workflowId, 
        overallConfidence: finalResponse.overallConfidence, 
        executionTime: finalResponse.executionTime,
        timestamp: new Date()
      });

      return finalResponse;

    } catch (error) {
      logger.error(`[ExecutionManager] Workflow ${workflowId} failed: ${error.message}`);
      io.emit('workflow_failed', { workflowId, error: error.message, timestamp: new Date() });
      
      return {
        workflowId,
        status: 'Failed',
        error: error.message,
        executionTime: `${Date.now() - startTime}ms`
      };
    }
  }
}

module.exports = ExecutionManager;
