import React from 'react';
import { AlertTriangle, MapPin, Users, Navigation } from 'lucide-react';

export const NearbyDangerPanel = () => {
  const dangers = [
    { type: 'Flood', distance: '2.1 km', risk: 'HIGH RISK', affected: 540, rescued: 390, status: 'Rising Water', color: 'red' },
    { type: 'Building Collapse', distance: '3.4 km', risk: 'MEDIUM', affected: 45, rescued: 12, status: 'Road Blocked', color: 'orange' }
  ];

  return (
    <div className="bg-[#0B0F19] rounded-2xl border border-[rgba(255,255,255,0.05)] p-5 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center">
          <AlertTriangle size={16} className="text-red-500 mr-2" /> Nearby Dangers
        </h3>
      </div>
      
      <div className="space-y-3">
        {dangers.map((danger, idx) => (
          <div key={idx} className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-3 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-1 h-full bg-${danger.color}-500 group-hover:w-2 transition-all`}></div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">{danger.type}</h4>
                <p className="text-xs text-gray-400 flex items-center mt-1">
                  <MapPin size={10} className="mr-1" /> {danger.distance} away
                </p>
              </div>
              <span className={`px-2 py-1 bg-${danger.color}-500/20 text-${danger.color}-500 text-[10px] font-black tracking-widest uppercase rounded`}>
                {danger.risk}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
              <div>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Affected / Rescued</p>
                <p className="text-xs text-white font-mono mt-0.5">{danger.affected} / <span className="text-green-400">{danger.rescued}</span></p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Status</p>
                <p className="text-xs text-white font-mono mt-0.5">{danger.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
