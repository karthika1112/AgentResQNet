class ConflictResolver {
  /**
   * Basic logic to normalize conflicting data from multiple agents
   */
  static resolve(agentResults) {
    let finalSeverity = 'Unknown';
    let isSafe = false;

    for (const res of agentResults) {
      if (res.status === 'Success' && res.result) {
        // If intelligence says high risk, but evacuation says safe route found
        if (res.agent === 'DisasterIntelligenceAgent') {
          finalSeverity = res.result.riskLevel || 'Unknown';
        }
        if (res.agent === 'EvacuationAgent') {
          isSafe = res.result.status === 'Safe Route Found';
        }
      }
    }

    return {
      resolvedSeverity: finalSeverity,
      evacuationDeemedSafe: isSafe
    };
  }
}

module.exports = ConflictResolver;
