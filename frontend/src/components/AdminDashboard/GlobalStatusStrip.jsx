import React from 'react';
import { ShieldAlert, Users, Radio, Map } from 'lucide-react';

export const GlobalStatusStrip = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-[#141C2D] border border-red-500/30 p-4 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Active Incidents</h3>
          <p className="text-3xl font-light text-white">{stats.activeIncidents}</p>
        </div>
        <div className="bg-red-500/20 p-3 rounded-lg">
          <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
        </div>
      </div>
      
      <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] p-4 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Users</h3>
          <p className="text-3xl font-light text-white">{stats.totalUsers}</p>
        </div>
        <div className="bg-blue-500/20 p-3 rounded-lg">
          <Users className="w-6 h-6 text-blue-400" />
        </div>
      </div>
      
      <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] p-4 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Responders Online</h3>
          <p className="text-3xl font-light text-white">{stats.activeResponders}</p>
        </div>
        <div className="bg-yellow-500/20 p-3 rounded-lg">
          <Radio className="w-6 h-6 text-yellow-400" />
        </div>
      </div>
      
      <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] p-4 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Shelters Active</h3>
          <p className="text-3xl font-light text-white">{stats.activeShelters}</p>
        </div>
        <div className="bg-green-500/20 p-3 rounded-lg">
          <Map className="w-6 h-6 text-green-400" />
        </div>
      </div>
    </div>
  );
};
