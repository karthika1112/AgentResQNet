import React, { useState, useEffect } from 'react';
import { HeartPulse } from 'lucide-react';
import api from '../../../api/axios';
import { DataTableModule } from './DataTableModule';

export const SOSRequestsModule = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchRequests = async () => {
      try {
         const res = await api.get('/victim/help-request');
         if (res.data.success) {
           setData(res.data.data);
         }
      } catch (e) {
         console.error("Failed to fetch SOS requests", e);
      }
    };
    
    fetchRequests();
    const interval = setInterval(fetchRequests, 3000); // Poll every 3 seconds for live updates
    return () => clearInterval(interval);
  }, []);

  const columns = [
    { header: 'Request ID', render: (row) => <span className="font-mono text-gray-400">{row.requestId}</span> },
    { header: 'Victim / Phone', render: (row) => (
      <div>
        <p className="text-white font-bold">{row.victimName}</p>
        <p className="text-xs text-gray-500">{row.phoneNumber || 'N/A'}</p>
      </div>
    )},
    { header: 'Needs', render: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.helpType.map(need => (
          <span key={need} className="px-2 py-0.5 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded text-[10px] text-gray-300 font-bold uppercase tracking-wider">
            {need}
          </span>
        ))}
      </div>
    )},
    { header: 'Priority', render: (row) => {
      const isCritical = row.priority === 'High' || row.priority === 'Critical';
      return (
        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${isCritical ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
          {row.priority}
        </span>
      );
    }},
    { header: 'Status', render: (row) => {
      let colors = 'bg-gray-500/20 text-gray-400';
      if (row.status === 'Pending') colors = 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30';
      if (row.status === 'Assigned') colors = 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      if (row.status === 'Dispatched') colors = 'bg-orange-500/20 text-orange-500 border border-orange-500/30';
      if (row.status === 'Completed') colors = 'bg-green-500/20 text-green-500 border border-green-500/30';
      return <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${colors}`}>{row.status}</span>;
    }},
    { header: 'Location / Details', render: (row) => (
      <div className="max-w-xs truncate">
        <p className="text-xs text-blue-400 truncate">{row.address}</p>
        <p className="text-[10px] text-gray-500 truncate mt-0.5">{row.description}</p>
      </div>
    )},
  ];

  return <DataTableModule title="Active SOS Requests" description="Live Victim Emergency Broadcasts from the Victim Portal" icon={HeartPulse} columns={columns} data={data} />;
};
