const DisasterIntelligenceAgent = require('../../agents/DisasterIntelligenceAgent');
const IncidentVerificationAgent = require('../../agents/IncidentVerificationAgent');
const EvacuationShelterAgent = require('../../agents/EvacuationShelterAgent');
const RescueCoordinationAgent = require('../../agents/RescueCoordinationAgent');
const ResourceCommandAgent = require('../../agents/ResourceCommandAgent');

class AgentRegistry {
  /**
   * Returns a new instance of the requested agent
   */
  static getAgent(agentName) {
    switch (agentName) {
      case 'DisasterIntelligenceAgent':
        return new DisasterIntelligenceAgent();
      case 'VerificationAgent':
        return new IncidentVerificationAgent();
      case 'EvacuationAgent':
        return new EvacuationShelterAgent();
      case 'RescueAgent':
        return new RescueCoordinationAgent();
      case 'ResourceAgent':
        return new ResourceCommandAgent();
      default:
        throw new Error(`Agent ${agentName} not found in registry.`);
    }
  }
}

module.exports = AgentRegistry;
