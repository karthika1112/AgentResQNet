import React from 'react';
import { Home, MapPin, Users, Navigation } from 'lucide-react';

export const NearbyShelters = () => {
  const shelters = [
    { name: 'SF Moscone Center', distance: '2.4 km', capacity: 1500, available: 450, status: 'Open', color: 'green' },
    { name: 'Downtown High School', distance: '3.1 km', capacity: 800, available: 0, status: 'Full', color: 'red' },
    { name: 'City Sports Arena', distance: '5.6 km', capacity: 3000, available: 2100, status: 'Open', color: 'green' }
  ];

  return (
    <div className="bg-[#0B0F19] rounded-2xl border border-[rgba(255,255,255,0.05)] p-5 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center">
          <Home size={16} className="text-blue-500 mr-2" /> Nearby Shelters
        </h3>
      </div>
      
      <div className="space-y-3">
        {shelters.map((shelter, idx) => (
          <div key={idx} className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-3 flex justify-between items-center group hover:border-blue-500/30 transition-colors">
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide flex items-center">
                {shelter.name}
                {shelter.status === 'Full' && <span className="ml-2 text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-black uppercase tracking-widest">Full</span>}
              </h4>
              <p className="text-xs text-gray-400 flex items-center mt-1 font-mono">
                <MapPin size={10} className="mr-1" /> {shelter.distance} away
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`px-2 py-1 bg-${shelter.color}-500/20 text-${shelter.color}-400 border border-${shelter.color}-500/30 text-[9px] font-black tracking-widest uppercase rounded mb-2 flex items-center`}>
                <Users size={10} className="mr-1" /> {shelter.available} Beds
              </span>
              <button disabled={shelter.status === 'Full'} className="disabled:opacity-50 text-[10px] bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded transition-colors uppercase font-bold tracking-widest flex items-center">
                <Navigation size={10} className="mr-1" /> Navigate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
