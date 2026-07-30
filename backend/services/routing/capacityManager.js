class CapacityManager {
  /**
   * Determines if a shelter has enough capacity for an evacuee
   * @param {Object} shelter The shelter document
   * @returns {boolean} True if available
   */
  static isAvailable(shelter) {
    if (!shelter) return false;
    
    // In our model we have capacity and occupied or availableBeds
    const available = shelter.availableBeds > 0 || (shelter.capacity - shelter.occupied) > 0;
    return available;
  }
}

module.exports = CapacityManager;
