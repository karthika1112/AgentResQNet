import React from 'react';
import { ShieldCheck, Crosshair, AlertTriangle, MapPin, HeartPulse, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmergencyStatusCard = ({ onOpenSOS }) => {
  return (
    <div className="bg-[#0B0F19] rounded-2xl border border-[rgba(255,255,255,0.05)] shadow-2xl overflow-hidden relative group">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-600/10 rounded-full blur-[80px] -z-10 group-hover:bg-red-500/20 transition-colors duration-700"></div>

      {/* Header */}
      <div className="bg-red-600/10 border-b border-red-500/20 p-4 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/40 relative">
            <AlertTriangle className="text-red-500" size={20} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
          </div>
          <div>
            <h2 className="text-white font-black tracking-widest uppercase">Emergency Status</h2>
            <p className="text-xs text-red-400 font-mono tracking-wider">Priority: CRITICAL</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center">
          <ShieldCheck size={12} className="mr-1" /> Verified
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-6 grid grid-cols-2 gap-4">
        
        {/* Rescue Status */}
        <div className="col-span-2 bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Assigned Rescue</p>
            <h3 className="text-white font-black text-lg tracking-wider">SF-FIRE-01</h3>
            <p className="text-xs text-blue-400 font-mono flex items-center mt-1">
              <Crosshair size={12} className="mr-1" /> Vehicle: Helicopter H-1
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">ETA</p>
            <h3 className="text-3xl font-black text-white text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              5<span className="text-sm text-gray-400 ml-1">mins</span>
            </h3>
          </div>
        </div>

        {/* Location & Shelter */}
        <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 relative overflow-hidden group/card">
          <div className="absolute right-0 bottom-0 opacity-5 group-hover/card:opacity-10 transition-opacity">
            <MapPin size={80} />
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Current Location</p>
          <p className="text-sm font-semibold text-white mb-2">Sector 4, Downtown</p>
          
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 mt-4">Nearest Safe Zone</p>
          <p className="text-sm font-semibold text-green-400 truncate">SF Moscone Center (2.4km)</p>
        </div>

        {/* Health & Resources */}
        <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group/card2">
          <div className="absolute right-0 bottom-0 opacity-5 group-hover/card2:opacity-10 transition-opacity">
            <HeartPulse size={80} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Medical Status</p>
            <p className="text-sm font-semibold text-orange-400">Injury Reported</p>
          </div>
          
          <div>
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 mt-4">Resources Requested</p>
             <div className="flex space-x-2 mt-1">
               <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] flex items-center font-bold uppercase tracking-wider">
                 <Truck size={10} className="mr-1" /> Water
               </span>
               <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[10px] flex items-center font-bold uppercase tracking-wider">
                 <HeartPulse size={10} className="mr-1" /> Meds
               </span>
             </div>
          </div>
        </div>
      </div>
      
      {/* Footer Action */}
      <div className="px-6 pb-6 pt-2">
        <button 
          onClick={onOpenSOS}
          className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black tracking-widest uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] flex justify-center items-center"
        >
           Update SOS Broadcast
        </button>
      </div>

    </div>
  );
};
