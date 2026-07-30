const axios = require('axios');
const CacheManager = require('../../utils/cacheManager');
const logger = require('../../utils/logger');

class BaseApiClient {
  constructor(name, config = {}) {
    this.name = name;
    this.timeout = config.timeout || 10000;
    this.retries = config.retries || 2;
    this.cacheTTL = config.cacheTTL || 300; // default 5 mins
    
    // Circuit Breaker State
    this.failureThreshold = config.failureThreshold || 3;
    this.cooldownPeriod = config.cooldownPeriod || 30000; // 30 seconds
    this.failures = 0;
    this.lastFailureTime = null;
    this.circuitOpen = false;
  }

  isCircuitOpen() {
    if (this.circuitOpen) {
      const now = Date.now();
      if (now - this.lastFailureTime > this.cooldownPeriod) {
        // Half-open: let one request through to test
        logger.info(`[${this.name}] Circuit half-open. Testing connection...`);
        this.circuitOpen = false;
        return false;
      }
      return true;
    }
    return false;
  }

  recordFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.failureThreshold) {
      this.circuitOpen = true;
      logger.warn(`[${this.name}] Circuit Breaker OPENED after ${this.failures} failures.`);
    }
  }

  recordSuccess() {
    if (this.failures > 0) {
      logger.info(`[${this.name}] Circuit Breaker RESET.`);
    }
    this.failures = 0;
    this.circuitOpen = false;
  }

  async fetch(url, options = {}, disableCache = false) {
    const startTime = Date.now();
    const cacheKey = `api_${this.name}_${url}`;
    
    // Check Cache
    if (!disableCache) {
      const cached = CacheManager.get(cacheKey);
      if (cached) {
        logger.info(`[${this.name}] Cache HIT. Latency: 0ms`);
        return cached;
      }
    }

    // Check Circuit Breaker
    if (this.isCircuitOpen()) {
      logger.warn(`[${this.name}] Request blocked. Circuit is OPEN.`);
      throw new Error(`[${this.name}] Service unavailable (Circuit Open)`);
    }

    let attempt = 0;
    while (attempt <= this.retries) {
      try {
        const response = await axios({
          url,
          timeout: this.timeout,
          ...options
        });
        
        const latency = Date.now() - startTime;
        logger.info(`[${this.name}] Request SUCCESS. Latency: ${latency}ms`);
        this.recordSuccess();

        if (!disableCache) {
          CacheManager.set(cacheKey, response.data, this.cacheTTL);
        }
        
        return response.data;
      } catch (error) {
        attempt++;
        const latency = Date.now() - startTime;
        logger.error(`[${this.name}] Attempt ${attempt} FAILED. Latency: ${latency}ms. Error: ${error.message}`);
        
        if (attempt > this.retries) {
          this.recordFailure();
          throw new Error(`[${this.name}] Max retries exceeded: ${error.message}`);
        }
        
        // Exponential backoff
        await new Promise(res => setTimeout(res, Math.pow(2, attempt) * 500));
      }
    }
  }
}

module.exports = BaseApiClient;
