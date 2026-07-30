import React from 'react';
import { Package, MapPin, Navigation, Clock } from 'lucide-react';

export const NearbyResources = () => {
  const resources = [
    { type: 'Food Camp', name: 'Red Cross Relief A', distance: '1.2 km', available: 'High', color: 'green' },
    { type: 'Medical Camp', name: 'City Hospital Annex', distance: '2.5 km', available: 'Medium', color: 'orange' },
    { type: 'Water Distribution', name: 'Sector 4 Hub', distance: '0.8 km', available: 'Low', color: 'red' }
  ];

  return (
    <div className="bg-[#0B0F19] rounded-2xl border border-[rgba(255,255,255,0.05)] p-5 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center">
          <Package size={16} className="text-blue-500 mr-2" /> Nearby Resources
        </h3>
      </div>
      
      <div className="space-y-3">
        {resources.map((res, idx) => (
          <div key={idx} className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-3 flex justify-between items-center group hover:border-blue-500/30 transition-colors">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{res.type}</p>
              <h4 className="text-sm font-bold text-white tracking-wide">{res.name}</h4>
              <p className="text-xs text-gray-400 flex items-center mt-1 font-mono">
                <MapPin size={10} className="mr-1" /> {res.distance} away
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`px-2 py-1 bg-${res.color}-500/20 text-${res.color}-400 border border-${res.color}-500/30 text-[9px] font-black tracking-widest uppercase rounded mb-2`}>
                Stock: {res.available}
              </span>
              <button className="text-[10px] bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded transition-colors uppercase font-bold tracking-widest flex items-center">
                <Navigation size={10} className="mr-1" /> Route
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
