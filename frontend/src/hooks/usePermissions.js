import { useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';

// Client-side mirror of the backend permission matrix
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
      'Everything'
    ],
    cannot: []
  }
};

export const usePermissions = () => {
  const { user } = useContext(AuthContext);
  
  const hasPermission = useMemo(() => {
    return (action) => {
      if (!user || !user.role) return false;
      const rolePerms = permissions[user.role];
      if (!rolePerms) return false;
      
      if (rolePerms.can.includes('Everything')) return true;
      if (rolePerms.cannot.includes(action)) return false;
      
      return rolePerms.can.includes(action);
    };
  }, [user]);

  return { hasPermission, role: user?.role };
};
