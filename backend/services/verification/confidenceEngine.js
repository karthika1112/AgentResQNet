class ConfidenceEngine {
  /**
   * Calculates a final confidence score (0-100) based on all validation metrics
   */
  static calculateScore(gpsData, duplicateData, sourceData, imageData) {
    let score = 50; // Base score for any user-submitted report
    let recommendation = 'Verification Pending';
    let status = 'Pending';

    // 1. GPS Impact (+20 for valid physical location)
    if (gpsData.valid) score += 20;
    else score -= 30;

    // 2. Duplicate Impact (+15 if multiple people report the same thing, crowd consensus)
    if (duplicateData.hasDuplicates && duplicateData.count > 1) {
      score += 15;
    }

    // 3. Official Source Match (+30 for direct correlation with government data)
    if (sourceData.supportedCategory) {
      if (sourceData.verifiedBySource) {
        score += 30;
      } else {
        // Expected an official source to see it, but none did
        score -= 20;
      }
    }

    // 4. Evidence Impact (+10 for images)
    if (imageData.hasEvidence) score += 10;

    // Cap at 100 or 0
    score = Math.min(100, Math.max(0, score));

    // Determine final status
    if (score >= 80) {
      status = 'Verified';
      recommendation = 'Incident mathematically verified by crowd consensus or official data.';
    } else if (score < 40) {
      status = 'Rejected';
      recommendation = 'Incident flagged as likely false or unverifiable.';
    }

    return {
      score,
      status,
      recommendation
    };
  }
}

module.exports = ConfidenceEngine;
