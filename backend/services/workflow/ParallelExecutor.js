const AgentRegistry = require('./AgentRegistry');
const { getIO } = require('../../config/socket');
const logger = require('../../utils/logger');

class ParallelExecutor {
  /**
   * Executes a list of agents in parallel with retry logic and Socket.IO events
   */
  static async execute(workflowId, agents, context) {
    const io = getIO();
    
    const executionPromises = agents.map(async (agentName) => {
      let attempts = 0;
      const maxAttempts = 2;
      let lastError = null;

      while (attempts < maxAttempts) {
        attempts++;
        const startTime = Date.now();
        
        io.emit('agent_started', { workflowId, agentName, timestamp: new Date() });
        logger.info(`[Workflow ${workflowId}] Starting ${agentName} (Attempt ${attempts})`);

        try {
          const agentInstance = AgentRegistry.getAgent(agentName);
          const result = await agentInstance.execute(context);
          
          const latency = Date.now() - startTime;
          io.emit('agent_completed', { 
            workflowId, 
            agentName, 
            status: 'Success', 
            latency: `${latency}ms`,
            timestamp: new Date() 
          });

          return {
            agent: agentName,
            status: 'Success',
            latency: `${latency}ms`,
            result: result
          };
        } catch (error) {
          lastError = error;
          logger.warn(`[Workflow ${workflowId}] ${agentName} failed on attempt ${attempts}: ${error.message}`);
          
          if (attempts >= maxAttempts) {
            const latency = Date.now() - startTime;
            io.emit('agent_failed', { 
              workflowId, 
              agentName, 
              status: 'Failed', 
              error: error.message,
              latency: `${latency}ms`,
              timestamp: new Date() 
            });

            return {
              agent: agentName,
              status: 'Failed',
              latency: `${latency}ms`,
              error: error.message
            };
          }
          // Brief backoff before retry
          await new Promise(res => setTimeout(res, 500));
        }
      }
    });

    return await Promise.all(executionPromises);
  }
}

module.exports = ParallelExecutor;
