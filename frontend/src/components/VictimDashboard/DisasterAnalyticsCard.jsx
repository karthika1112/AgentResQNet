import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Users, MapPin, Database } from 'lucide-react';
import api from '../../api/axios';

export const DisasterAnalyticsCard = () => {
  const [stats, setStats] = useState({
    activeIncidents: 0,
    peopleAffected: 0,
    peopleRescued: 0,
    missingPeople: 0,
    criticalZones: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/victim/live-stats');
        setStats(res.data.data);
      } catch (err) {
        console.error("Failed to fetch live stats");
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0B0F19] rounded-2xl border border-[rgba(255,255,255,0.05)] p-5 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] -z-10 group-hover:bg-blue-500/10 transition-colors"></div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center">
          <Activity size={16} className="text-blue-500 mr-2" /> Live Analytics
        </h3>
        <div className="flex items-center space-x-1 text-[10px] text-green-400 font-mono">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          <span>SYNCING</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-3">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 flex items-center"><ShieldAlert size={10} className="mr-1 text-red-500"/> Critical Zones</p>
          <p className="text-xl font-black text-white">{stats.criticalZones}</p>
        </div>
        <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-3">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 flex items-center"><MapPin size={10} className="mr-1 text-orange-500"/> Active Incidents</p>
          <p className="text-xl font-black text-white">{stats.activeIncidents}</p>
        </div>
        <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-3">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 flex items-center"><Users size={10} className="mr-1 text-purple-500"/> Affected</p>
          <p className="text-xl font-black text-white">{stats.peopleAffected.toLocaleString()}</p>
        </div>
        <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-3">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 flex items-center"><Database size={10} className="mr-1 text-green-500"/> Rescued</p>
          <p className="text-xl font-black text-white">{stats.peopleRescued.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
