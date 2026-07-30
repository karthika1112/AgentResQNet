class VehicleAllocator {
  /**
   * Simple logic to assign an appropriate vehicle type based on the incident
   */
  static assignVehicle(incidentCategory, severity) {
    incidentCategory = (incidentCategory || '').toLowerCase();
    
    if (incidentCategory.includes('fire')) return { type: 'Firetruck', id: `FT-${Math.floor(Math.random()*1000)}` };
    if (incidentCategory.includes('medical') || severity === 'Critical') return { type: 'Ambulance', id: `AMB-${Math.floor(Math.random()*1000)}` };
    if (incidentCategory.includes('flood')) return { type: 'Rescue Boat', id: `RB-${Math.floor(Math.random()*1000)}` };
    
    return { type: 'Standard Rescue SUV', id: `SUV-${Math.floor(Math.random()*1000)}` };
  }
}

module.exports = VehicleAllocator;
