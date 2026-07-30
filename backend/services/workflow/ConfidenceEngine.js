class ConfidenceEngine {
  /**
   * Calculates overall workflow confidence based on agent results
   */
  static calculate(agentResults) {
    let totalConfidence = 0;
    let validAgents = 0;

    for (const res of agentResults) {
      if (res.status === 'Success' && res.result && res.result.confidence !== undefined) {
        totalConfidence += res.result.confidence;
        validAgents++;
      }
    }

    if (validAgents === 0) return 0;
    return Math.round(totalConfidence / validAgents);
  }
}

module.exports = ConfidenceEngine;
