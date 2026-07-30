// Realistic fallback data for EOC modules to demonstrate functionality during hackathon

export const mockIncidents = [
  { id: 'INC-2026-901', type: 'Earthquake', severity: 'Critical', location: 'San Francisco, CA', status: 'Active', verification: 98, reportedAt: '10 mins ago', agent: 'Rescue Agent' },
  { id: 'INC-2026-902', type: 'Wildfire', severity: 'High', location: 'Napa Valley, CA', status: 'Active', verification: 92, reportedAt: '45 mins ago', agent: 'Evacuation Agent' },
  { id: 'INC-2026-903', type: 'Flood', severity: 'Medium', location: 'Sacramento, CA', status: 'Monitoring', verification: 85, reportedAt: '2 hours ago', agent: 'Disaster Intelligence' },
  { id: 'INC-2026-904', type: 'Structural Collapse', severity: 'Critical', location: 'Downtown SF', status: 'Active', verification: 100, reportedAt: '12 mins ago', agent: 'Rescue Agent' },
  { id: 'INC-2026-905', type: 'Power Outage', severity: 'Low', location: 'Oakland, CA', status: 'Resolved', verification: 99, reportedAt: '5 hours ago', agent: 'Resource Agent' },
];

export const mockAlerts = [
  { id: 'ALT-101', priority: 'P1 - Critical', message: 'M7.2 Earthquake detected. Evacuate coastal zones.', recipients: 'All Users (SF Bay Area)', status: 'Delivered', time: '10:45 AM UTC' },
  { id: 'ALT-102', priority: 'P2 - High', message: 'Wildfire spreading. Highway 101 North closed.', recipients: 'Responders Only', status: 'Delivered', time: '09:20 AM UTC' },
  { id: 'ALT-103', priority: 'P3 - Medium', message: 'Tsunami Warning downgraded to Watch.', recipients: 'All Users', status: 'Pending', time: '11:00 AM UTC' },
];

export const mockShelters = [
  { name: 'SF Moscone Center', capacity: 5000, occupied: 3450, distance: '2.4 km', manager: 'Sarah Connor', status: 'Open', supplies: 'Adequate' },
  { name: 'Oakland Coliseum', capacity: 15000, occupied: 2100, distance: '14.2 km', manager: 'John Smith', status: 'Open', supplies: 'Abundant' },
  { name: 'Berkeley High School', capacity: 800, occupied: 795, distance: '18.5 km', manager: 'Maria Garcia', status: 'At Capacity', supplies: 'Low' },
  { name: 'San Mateo Expo', capacity: 2000, occupied: 0, distance: '22.1 km', manager: 'Unassigned', status: 'Standby', supplies: 'Pending' },
];

export const mockRescues = [
  { mission: 'Op-Alpha', team: 'SF-FIRE-01', vehicle: 'Helicopter H-1', location: 'Golden Gate Bridge', eta: '5 mins', status: 'In Transit', rescued: 0 },
  { mission: 'Op-Beta', team: 'USCG-04', vehicle: 'Rescue Boat R-4', location: 'Embarcadero', eta: 'Arrived', status: 'Active Rescue', rescued: 12 },
  { mission: 'Op-Gamma', team: 'FEMA-GROUND-2', vehicle: 'Heavy Transport', location: 'Napa Valley', eta: '35 mins', status: 'Routing', rescued: 0 },
];

export const mockResources = [
  { item: 'MRE Rations', stock: 12500, unit: 'boxes', location: 'Warehouse Alpha', status: 'Adequate' },
  { item: 'Bottled Water', stock: 45000, unit: 'liters', location: 'Warehouse Alpha', status: 'Adequate' },
  { item: 'Medical Trauma Kits', stock: 120, unit: 'kits', location: 'Mobile Unit 7', status: 'Critical Low' },
  { item: 'Generators (10kW)', stock: 45, unit: 'units', location: 'Warehouse Beta', status: 'Adequate' },
  { item: 'Blankets', stock: 500, unit: 'packs', location: 'Shelter 1', status: 'Low' },
];

export const mockUsers = [
  { name: 'Alex Mercer', role: 'Responder', status: 'Active', location: 'Sector 4', skills: 'Paramedic, Search & Rescue' },
  { name: 'Dana Scully', role: 'Volunteer', status: 'Active', location: 'Sector 2', skills: 'First Aid, Logistics' },
  { name: 'Fox Mulder', role: 'Admin', status: 'Active', location: 'EOC Command', skills: 'System Admin' },
  { name: 'Ellen Ripley', role: 'Volunteer', status: 'Offline', location: 'Sector 7', skills: 'Heavy Machinery' },
];
