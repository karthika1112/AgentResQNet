class EtaCalculator {
  /**
   * Converts raw seconds into human readable ETA string
   * @param {number} seconds 
   */
  static getHumanReadableETA(seconds) {
    if (!seconds && seconds !== 0) return 'Unknown ETA';
    
    // Add 20% to the time to account for disaster conditions
    const adjustedSeconds = seconds * 1.2;
    
    const minutes = Math.floor(adjustedSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours} hour(s) and ${remainingMinutes} minute(s)`;
    }
    return `${minutes} minute(s)`;
  }
}

module.exports = EtaCalculator;
