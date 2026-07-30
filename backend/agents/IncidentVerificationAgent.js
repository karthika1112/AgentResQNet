const BaseAgent = require('./BaseAgent');
const GpsVerification = require('../services/verification/gpsVerification');
const DuplicateDetector = require('../services/verification/duplicateDetector');
const ImageValidator = require('../services/verification/imageValidator');
const SourceVerification = require('../services/verification/sourceVerification');
const ConfidenceEngine = require('../services/verification/confidenceEngine');
const logger = require('../utils/logger');

class IncidentVerificationAgent extends BaseAgent {
  constructor() {
    super('Incident Verification Agent', 'Validate and verify incident reports using official data and crowd consensus.');
  }

  /**
   * Expects context to contain: { lat, lon, category, images }
   */
  async execute(context) {
    const startTime = Date.now();
    logger.info(`[IncidentVerificationAgent] Executing... Context: ${JSON.stringify(context)}`);

    try {
      const { lat = 37.77, lon = -122.41, category = 'Earthquake', images = [] } = typeof context === 'string' ? JSON.parse(context) : context;

      // Run all checks concurrently
      const [gpsData, duplicateData, sourceData, imageData] = await Promise.all([
        GpsVerification.validateCoordinates(lat, lon),
        DuplicateDetector.findDuplicates(lat, lon, category),
        SourceVerification.verifyAgainstSources(category, lat, lon),
        ImageValidator.validateImages(images)
      ]);

      // Calculate mathematically driven confidence
      const confidenceResult = ConfidenceEngine.calculateScore(gpsData, duplicateData, sourceData, imageData);

      const executionTime = Date.now() - startTime;

      return {
        incidentId: `INC-${Date.now()}`,
        verificationStatus: confidenceResult.status,
        confidence: confidenceResult.score,
        priority: confidenceResult.score >= 80 ? 'High' : 'Normal',
        matchedSources: sourceData.sourcesMatched,
        duplicateDetected: duplicateData.hasDuplicates,
        recommendation: confidenceResult.recommendation,
        executionTime: `${executionTime}ms`,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error(`[IncidentVerificationAgent] Error: ${error.message}`);
      return {
        verificationStatus: 'Pending',
        confidence: 0,
        recommendation: 'Verification failed due to internal error.',
        error: error.message
      };
    }
  }
}

module.exports = IncidentVerificationAgent;
