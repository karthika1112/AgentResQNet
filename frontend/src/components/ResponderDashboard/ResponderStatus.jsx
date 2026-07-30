import React, { useState } from 'react';
import { Shield, Fuel, Navigation, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export const ResponderStatus = () => {
  const [isReady, setIsReady] = useState(true);

  const toggleReady = () => {
    setIsReady(!isReady);
    toast.success(`Unit Status: ${!isReady ? 'READY FOR DISPATCH' : 'OUT OF SERVICE'}`);
  };

  return (
    <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 shadow-lg h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Shield className="text-blue-400 mr-2" size={20} />
            Unit Alpha-1
          </h3>
          
          <button 
            onClick={toggleReady}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-colors border ${
              isReady 
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30' 
                : 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
            }`}
          >
            {isReady ? 'Ready for Dispatch' : 'Out of Service'}
          </button>
        </div>
        
        <p className="text-sm text-gray-400 mb-6">
          Heavy Rescue Vehicle. Equipped for water evacuation and medical transport.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0B0F19] rounded-lg p-3 border border-[rgba(255,255,255,0.05)] flex flex-col items-center">
          <Fuel className="text-green-400 mb-1" size={18} />
          <span className="text-sm font-bold text-white">85%</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Fuel Level</span>
        </div>
        <div className="bg-[#0B0F19] rounded-lg p-3 border border-[rgba(255,255,255,0.05)] flex flex-col items-center">
          <Activity className="text-blue-400 mb-1" size={18} />
          <span className="text-sm font-bold text-white">Online</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Telemetry</span>
        </div>
        <div className="bg-[#0B0F19] rounded-lg p-3 border border-[rgba(255,255,255,0.05)] flex flex-col items-center">
          <Navigation className="text-yellow-400 mb-1" size={18} />
          <span className="text-sm font-bold text-white">Active</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">GPS Sync</span>
        </div>
      </div>
    </div>
  );
};
