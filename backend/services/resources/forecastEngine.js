class ForecastEngine {
  /**
   * Basic heuristic forecast for future demand based on current incident
   */
  static predictDemand(incidentSeverity, victimCount, currentRequired) {
    const forecast = {};
    const multiplier = incidentSeverity === 'Critical' ? 1.5 : (incidentSeverity === 'High' ? 1.2 : 1.0);
    
    // E.g., if they asked for food now, they will likely need more tomorrow
    for (const [item, amount] of Object.entries(currentRequired)) {
      forecast[item] = Math.ceil(amount * multiplier);
    }
    
    return forecast;
  }
}

module.exports = ForecastEngine;
