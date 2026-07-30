import React, { useState, useEffect } from 'react';
import { Crosshair, AlertOctagon, Camera, CheckCircle } from 'lucide-react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

export const RescueMissionPanel = () => {
  const [mission, setMission] = useState(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    
    // Listen for new assignments
    socket.on('mission_assigned', (data) => {
      // Assuming this is a rescue mission
      if(data.type === 'Rescue') {
        setMission({
          id: data.missionId || `RES-${Date.now().toString().slice(-4)}`,
          victimId: 'VIC-8932',
          condition: 'Critical Injury - Trapped',
          priority: 'CRITICAL',
          eta: '8 mins',
          status: 'Pending Dispatch'
        });
        toast.error('CRITICAL RESCUE MISSION ASSIGNED!', { duration: 5000 });
      }
    });

    // Mock initial state for visualization
    setMission({
      id: `RES-${Date.now().toString().slice(-4)}`,
      victimId: 'VIC-8932',
      condition: 'Severe Flooding - Roof Evac',
      priority: 'CRITICAL',
      eta: '8 mins',
      status: 'Pending Dispatch'
    });

    return () => socket.disconnect();
  }, []);

  const handleAction = (newStatus) => {
    setMission({ ...mission, status: newStatus });
    if(newStatus === 'Completed') {
      toast.success('Mission Accomplished. Standing by for next task.');
      setTimeout(() => setMission(null), 3000);
    } else {
      toast.success(`Status updated to: ${newStatus}`);
    }
  };

  const uploadEvidence = () => {
    toast('Camera interface opened for evidence upload.', { icon: '📸' });
  };

  if (!mission) {
    return (
      <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 shadow-lg h-full flex flex-col items-center justify-center text-center">
        <Crosshair size={48} className="text-gray-600 mb-4" />
        <h3 className="text-lg font-bold text-gray-300">No Active Rescues</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-[200px]">
          All clear. Monitoring dispatch frequencies.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#141C2D] border border-red-500/50 rounded-xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.15)] h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-600 animate-pulse"></div>
      
      <div className="flex justify-between items-start mb-4 ml-2">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Rescue: {mission.id}</h3>
          <span className="text-red-400 text-sm font-bold uppercase tracking-wider">{mission.condition}</span>
        </div>
        <div className="bg-red-600 text-white px-3 py-1 rounded text-xs font-black flex items-center shadow-lg animate-pulse">
          <AlertOctagon size={14} className="mr-1" />
          {mission.priority}
        </div>
      </div>

      <div className="space-y-3 mb-6 flex-1 ml-2">
        <div className="bg-[#0B0F19] rounded-lg p-3 border border-red-500/20 flex justify-between items-center">
          <span className="text-gray-500 text-xs uppercase">Victim ID</span>
          <span className="text-white font-mono">{mission.victimId}</span>
        </div>
        <div className="bg-[#0B0F19] rounded-lg p-3 border border-red-500/20 flex justify-between items-center">
          <span className="text-gray-500 text-xs uppercase">Current Status</span>
          <span className="text-yellow-400 font-bold">{mission.status}</span>
        </div>
        <div className="bg-[#0B0F19] rounded-lg p-3 border border-red-500/20 flex justify-between items-center">
          <span className="text-gray-500 text-xs uppercase">Calculated ETA</span>
          <span className="text-white font-bold">{mission.eta}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto ml-2">
        {mission.status === 'Pending Dispatch' && (
          <button 
            onClick={() => handleAction('En Route')}
            className="col-span-2 bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-bold uppercase tracking-wide transition-colors"
          >
            Acknowledge & Start
          </button>
        )}
        
        {mission.status === 'En Route' && (
          <>
            <button 
              onClick={() => handleAction('On Scene')}
              className="col-span-2 bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-lg font-bold uppercase tracking-wide transition-colors"
            >
              Report: On Scene
            </button>
          </>
        )}

        {mission.status === 'On Scene' && (
          <>
            <button 
              onClick={uploadEvidence}
              className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold uppercase tracking-wide transition-colors flex items-center justify-center"
            >
              <Camera size={16} className="mr-2" /> Evidence
            </button>
            <button 
              onClick={() => handleAction('Completed')}
              className="bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold uppercase tracking-wide transition-colors flex items-center justify-center"
            >
              <CheckCircle size={16} className="mr-2" /> Complete
            </button>
          </>
        )}
      </div>
    </div>
  );
};
