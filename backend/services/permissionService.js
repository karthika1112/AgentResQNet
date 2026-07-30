/**
 * Centralized Permission Matrix
 * Defines exactly what each role can and cannot do based on Step 6 Requirements.
 */

const permissions = {
  Victim: {
    can: [
      'Register',
      'Login',
      'Report Incident',
      'Request Rescue',
      'View Alerts',
      'View Shelters',
      'Track Rescue',
      'Chat with AI',
      'View Profile'
    ],
    cannot: [
      'Manage Users',
      'Manage Resources',
      'Assign Missions',
      'Manage AI'
    ]
  },
  Volunteer: {
    can: [
      'Accept Missions',
      'Deliver Resources',
      'Update Mission Status',
      'Navigation',
      'Chat',
      'View Profile'
    ],
    cannot: [
      'Delete Incidents',
      'Manage Users',
      'Configure System'
    ]
  },
  Responder: {
    can: [
      'View Assigned Missions',
      'Update Rescue Status',
      'Track GPS',
      'View Incident Details',
      'Mission Timeline',
      'Emergency Communication'
    ],
    cannot: [
      'Manage Users',
      'Delete Resources',
      'Modify System'
    ]
  },
  Admin: {
    can: [
      'Everything',
      'Manage Users',
      'Manage Responders',
      'Manage Volunteers',
      'Manage Resources',
      'Manage Shelters',
      'Manage AI',
      'View Logs',
      'System Configuration',
      'Analytics'
    ],
    cannot: []
  }
};

const hasPermission = (role, action) => {
  if (!permissions[role]) return false;
  if (permissions[role].can.includes('Everything')) return true;
  
  if (permissions[role].cannot.includes(action)) return false;
  return permissions[role].can.includes(action);
};

module.exports = {
  permissions,
  hasPermission
};
