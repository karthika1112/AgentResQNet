import React from 'react';

export const incidentColumns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Type', accessor: 'type' },
  { header: 'Location', accessor: 'location' },
  { header: 'Severity', render: (row) => (
    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
      row.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
      row.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
    }`}>{row.severity}</span>
  )},
  { header: 'Verification', render: (row) => (
    <div className="flex items-center">
      <div className="w-16 h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full mr-2 overflow-hidden">
        <div className="h-full bg-blue-500" style={{ width: `${row.verification}%` }}></div>
      </div>
      <span className="text-xs font-mono">{row.verification}%</span>
    </div>
  )},
  { header: 'Agent Handling', accessor: 'agent' },
  { header: 'Time', accessor: 'reportedAt' }
];

export const alertColumns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Priority', render: (row) => (
    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
      row.priority.includes('Critical') ? 'bg-red-500/20 text-red-400' :
      row.priority.includes('High') ? 'bg-orange-500/20 text-orange-400' :
      'bg-yellow-500/20 text-yellow-400'
    }`}>{row.priority}</span>
  )},
  { header: 'Message', accessor: 'message' },
  { header: 'Recipients', accessor: 'recipients' },
  { header: 'Time', accessor: 'time' },
  { header: 'Status', render: (row) => (
    <span className={row.status === 'Delivered' ? 'text-green-400' : 'text-yellow-400'}>{row.status}</span>
  )}
];

export const shelterColumns = [
  { header: 'Shelter Name', accessor: 'name' },
  { header: 'Capacity', render: (row) => (
    <span className="font-mono">{row.occupied} / {row.capacity}</span>
  )},
  { header: 'Distance', accessor: 'distance' },
  { header: 'Manager', accessor: 'manager' },
  { header: 'Supplies', accessor: 'supplies' },
  { header: 'Status', render: (row) => (
    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
      row.status === 'Open' ? 'bg-green-500/20 text-green-400' :
      row.status === 'At Capacity' ? 'bg-red-500/20 text-red-400' :
      'bg-gray-500/20 text-gray-400'
    }`}>{row.status}</span>
  )}
];

export const rescueColumns = [
  { header: 'Mission', accessor: 'mission' },
  { header: 'Team', accessor: 'team' },
  { header: 'Vehicle', accessor: 'vehicle' },
  { header: 'Location', accessor: 'location' },
  { header: 'ETA', accessor: 'eta' },
  { header: 'Victims Rescued', accessor: 'rescued' },
  { header: 'Status', render: (row) => (
    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30`}>
      {row.status}
    </span>
  )}
];

export const resourceColumns = [
  { header: 'Resource Item', accessor: 'item' },
  { header: 'Stock Level', render: (row) => (
    <span className="font-mono">{row.stock} {row.unit}</span>
  )},
  { header: 'Location', accessor: 'location' },
  { header: 'Status', render: (row) => (
    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
      row.status === 'Adequate' ? 'bg-green-500/20 text-green-400' :
      row.status === 'Low' ? 'bg-orange-500/20 text-orange-400' :
      'bg-red-500/20 text-red-400 animate-pulse'
    }`}>{row.status}</span>
  )}
];

export const userColumns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Role', accessor: 'role' },
  { header: 'Location', accessor: 'location' },
  { header: 'Skills/Details', accessor: 'skills' },
  { header: 'Status', render: (row) => (
    <span className={`flex items-center text-xs font-bold uppercase ${row.status === 'Active' ? 'text-green-400' : 'text-gray-400'}`}>
      <span className={`w-2 h-2 rounded-full mr-2 ${row.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
      {row.status}
    </span>
  )}
];
