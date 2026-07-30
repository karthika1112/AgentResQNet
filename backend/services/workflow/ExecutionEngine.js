const logger = require('../../utils/logger');
const DisasterIntelligenceAgent = require('../../agents/DisasterIntelligenceAgent');
const IncidentVerificationAgent = require('../../agents/IncidentVerificationAgent');
const EvacuationShelterAgent = require('../../agents/EvacuationShelterAgent');
const RescueCoordinationAgent = require('../../agents/RescueCoordinationAgent');
const ResourceCommandAgent = require('../../agents/ResourceCommandAgent');

class ExecutionEngine {
  /**
   * Executes a list of agents in parallel.
   * @param {string[]} agents Array of agent names
   * @param {string} context Original user message
   * @returns {Promise<Object[]>} Array of execution results
   */
  static async executeParallel(agents, context) {
    logger.info(`Execution Engine starting parallel execution for: ${agents.join(', ')}`);
    
    const executionPromises = agents.map(agentName => {
      if (agentName === 'DisasterIntelligenceAgent') {
        const dia = new DisasterIntelligenceAgent();
        return dia.execute(context).then(res => ({
          agent: agentName,
          result: JSON.stringify(res)
        }));
      }
      
      if (agentName === 'VerificationAgent') {
        const iva = new IncidentVerificationAgent();
        let parsedContext = { lat: 37.77, lon: -122.41, category: 'Earthquake' };
        if (typeof context === 'object') parsedContext = context;
        return iva.execute(parsedContext).then(res => ({
          agent: agentName,
          result: JSON.stringify(res)
        }));
      }

      if (agentName === 'EvacuationAgent') {
        const esa = new EvacuationShelterAgent();
        let parsedContext = { lat: 37.77, lon: -122.41 };
        if (typeof context === 'object') parsedContext = context;
        return esa.execute(parsedContext).then(res => ({
          agent: agentName,
          result: JSON.stringify(res)
        }));
      }
      
      if (agentName === 'RescueAgent') {
        const rca = new RescueCoordinationAgent();
        let parsedContext = { lat: 37.77, lon: -122.41, category: 'General Emergency', severity: 'High' };
        if (typeof context === 'object') parsedContext = context;
        return rca.execute(parsedContext).then(res => ({
          agent: agentName,
          result: JSON.stringify(res)
        }));
      }

      if (agentName === 'ResourceAgent') {
        const rcoa = new ResourceCommandAgent();
        let parsedContext = { lat: 37.77, lon: -122.41, requiredResources: { food: 50, water: 50 } };
        if (typeof context === 'object') parsedContext = context;
        return rcoa.execute(parsedContext).then(res => ({
          agent: agentName,
          result: JSON.stringify(res)
        }));
      }

      return this.mockExecuteAgent(agentName, context);
    });

    const results = await Promise.all(executionPromises);
    
    logger.info('Parallel execution completed.');
    return results;
  }

  static async mockExecuteAgent(agentName, context) {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let mockResult = '';
    if (agentName === 'VolunteerAgent') mockResult = 'Notified 3 nearby volunteers.';
    else mockResult = 'Task completed successfully.';

    return {
      agent: agentName,
      result: `[Mock ${agentName}] ${mockResult}`
    };
  }
}

module.exports = ExecutionEngine;
