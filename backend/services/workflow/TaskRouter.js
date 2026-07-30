class TaskRouter {
  /**
   * Maps an intent to a list of required specialist agents
   * @param {string} intent 
   * @returns {string[]} Array of Agent Names
   */
  static routeIntent(intent) {
    switch (intent) {
      case 'EVACUATION':
        return ['DisasterIntelligenceAgent', 'EvacuationAgent'];
      case 'RESCUE':
        return ['DisasterIntelligenceAgent', 'VerificationAgent', 'RescueAgent'];
      case 'RESOURCE':
        return ['ResourceAgent', 'VolunteerAgent'];
      case 'INCIDENT_REPORT':
      case 'VERIFY_INCIDENT':
        return ['VerificationAgent', 'DisasterIntelligenceAgent'];
      case 'DISASTER_INFORMATION':
      case 'GENERAL_QUERY':
      default:
        return ['DisasterIntelligenceAgent'];
    }
  }
}

module.exports = TaskRouter;
