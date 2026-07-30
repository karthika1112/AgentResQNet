const NodeCache = require('node-cache');
// Cache with standard TTL of 10 minutes (600 seconds)
const apiCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

class CacheManager {
  static get(key) {
    return apiCache.get(key);
  }

  static set(key, value, ttl = 600) {
    return apiCache.set(key, value, ttl);
  }
}

module.exports = CacheManager;
