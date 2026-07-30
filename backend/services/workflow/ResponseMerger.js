const ConflictResolver = require('./ConflictResolver');
const ConfidenceEngine = require('./ConfidenceEngine');

class ResponseMerger {
  /**
   * Merges all agent results into the final unified response format
   */
  static merge(workflowId, agentResults, executionTime) {
    const overallConfidence = ConfidenceEngine.calculate(agentResults);
    const resolvedData = ConflictResolver.resolve(agentResults);

    // Extract visualization data (Workflow Nodes)
    const workflowNodes = agentResults.map(res => ({
      agent: res.agent,
      status: res.status,
      latency: res.latency
    }));

    // Generate unified recommendation string
    let finalRecommendation = "Workflow completed. Summary:\n";
    agentResults.forEach(res => {
      if (res.status === 'Success') {
         finalRecommendation += `- ${res.agent} completed successfully.\n`;
      } else {
         finalRecommendation += `- ${res.agent} failed: ${res.error}\n`;
      }
    });

    return {
      requestId: `REQ-${Date.now()}`,
      workflowId: workflowId,
      selectedAgents: workflowNodes.map(n => n.agent),
      workflowNodes: workflowNodes,
      agentResults: agentResults,
      overallConfidence: overallConfidence,
      resolvedData: resolvedData,
      finalRecommendation: finalRecommendation,
      officialSources: ["USGS", "Open-Meteo", "OSRM", "MongoDB Verified Data"], // Dynamic in real app
      executionTime: `${executionTime}ms`,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = ResponseMerger;
