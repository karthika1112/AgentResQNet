class VehicleAllocator {
  /**
   * Assigns a vehicle based on the volume of allocated resources
   */
  static assignVehicle(allocatedResources) {
    let totalVolume = 0;
    
    // Naive volume estimation
    if (allocatedResources.food) totalVolume += allocatedResources.food * 2;
    if (allocatedResources.water) totalVolume += allocatedResources.water * 3;
    if (allocatedResources.blankets) totalVolume += allocatedResources.blankets * 5;
    if (allocatedResources.medicine) totalVolume += allocatedResources.medicine * 1;

    if (totalVolume > 500) {
      return { type: 'Heavy Transport Truck', id: `HT-${Math.floor(Math.random()*1000)}` };
    } else if (totalVolume > 100) {
      return { type: 'Supply Van', id: `SV-${Math.floor(Math.random()*1000)}` };
    } else {
      return { type: 'Light SUV', id: `SUV-${Math.floor(Math.random()*1000)}` };
    }
  }
}

module.exports = VehicleAllocator;
