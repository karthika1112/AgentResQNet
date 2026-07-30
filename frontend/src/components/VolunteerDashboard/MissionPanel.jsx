import React, { useState, useEffect } from 'react';
import { PackageOpen, AlertTriangle, Check, X } from 'lucide-react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

export const MissionPanel = () => {
  const [mission, setMission] = useState(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    
    // Listen for new assignments
    socket.on('mission_assigned', (data) => {
      setMission({
        id: data.missionId || `MSN-${Date.now().toString().slice(-4)}`,
        type: data.type || 'Resource Delivery',
        priority: data.priority || 'High',
        eta: data.eta || '15 mins',
        resources: data.resources || { blankets: 50, water: 100 },
        status: 'Pending Acceptance'
      });
      toast('New Mission Assigned!', { icon: '🚨' });
    });

    return () => socket.disconnect();
  }, []);

  const acceptMission = () => {
    setMission({ ...mission, status: 'In Progress' });
    toast.success('Mission Accepted. Proceed to pickup location.');
  };

  const rejectMission = () => {
    setMission(null);
    toast('Mission Rejected. Returning to queue.');
  };

  const completeMission = () => {
    setMission(null);
    toast.success('Mission Completed! Great job.', { icon: '🎉' });
  };

  if (!mission) {
    return (
      <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 shadow-lg h-full flex flex-col items-center justify-center text-center">
        <PackageOpen size={48} className="text-gray-600 mb-4" />
        <h3 className="text-lg font-bold text-gray-300">No Active Missions</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-[200px]">
          Stay online. The Commander Agent will assign you tasks based on nearby incidents.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#141C2D] border border-blue-500/30 rounded-xl p-6 shadow-[0_0_20px_rgba(59,130,246,0.1)] h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Active Mission: {mission.id}</h3>
          <span className="text-blue-400 text-sm font-medium">{mission.type}</span>
        </div>
        <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded text-xs font-bold flex items-center border border-red-500/30">
          <AlertTriangle size={12} className="mr-1" />
          {mission.priority} Priority
        </div>
      </div>

      <div className="space-y-4 mb-6 flex-1">
        <div className="bg-[#0B0F19] rounded-lg p-3 border border-[rgba(255,255,255,0.05)]">
          <span className="text-gray-500 text-xs block mb-1">Status</span>
          <span className="text-white font-medium">{mission.status}</span>
        </div>
        
        <div className="bg-[#0B0F19] rounded-lg p-3 border border-[rgba(255,255,255,0.05)]">
          <span className="text-gray-500 text-xs block mb-1">Required Payload</span>
          <ul className="text-white text-sm list-disc list-inside">
            {Object.entries(mission.resources).map(([key, val]) => (
              <li key={key} className="capitalize">{val}x {key}</li>
            ))}
          </ul>
        </div>
      </div>

      {mission.status === 'Pending Acceptance' ? (
        <div className="flex space-x-3 mt-auto">
          <button 
            onClick={acceptMission}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
          >
            <Check size={18} className="mr-2" /> Accept
          </button>
          <button 
            onClick={rejectMission}
            className="flex-1 bg-transparent border border-red-500/50 hover:bg-red-500/10 text-red-400 py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
          >
            <X size={18} className="mr-2" /> Reject
          </button>
        </div>
      ) : (
        <button 
          onClick={completeMission}
          className="w-full mt-auto bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-medium flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]"
        >
          <Check size={18} className="mr-2" /> Mark as Delivered
        </button>
      )}
    </div>
  );
};
