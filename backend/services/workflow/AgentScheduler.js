class AgentScheduler {
  /**
   * Maps an intent to a sequence/list of required agents
   */
  static getRequiredAgents(intent) {
    intent = (intent || '').toUpperCase();

    if (intent === 'FLOOD') {
      return [
        'DisasterIntelligenceAgent',
        'VerificationAgent',
        'EvacuationAgent',
        'ResourceAgent',
        'RescueAgent'
      ];
    }
    
    if (intent === 'EARTHQUAKE') {
      return [
        'DisasterIntelligenceAgent',
        'VerificationAgent',
        'RescueAgent',
        'EvacuationAgent',
        'ResourceAgent'
      ];
    }
    
    if (intent === 'RESCUE') {
      return ['DisasterIntelligenceAgent', 'VerificationAgent', 'RescueAgent'];
    }

    if (intent === 'RESOURCE') {
      return ['DisasterIntelligenceAgent', 'VerificationAgent', 'ResourceAgent'];
    }

    // Default basic workflow
    return ['DisasterIntelligenceAgent', 'VerificationAgent'];
  }
}

module.exports = AgentScheduler;
