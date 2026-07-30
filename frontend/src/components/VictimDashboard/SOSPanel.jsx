import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const SOSPanel = () => {
  const [isPressing, setIsPressing] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  const handleSOS = async () => {
    try {
      setIsPressing(true);
      
      // Get location first
      let locationStr = 'Unknown Location';
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          locationStr = `${position.coords.latitude}, ${position.coords.longitude}`;
        } catch (e) {
          console.warn('Geolocation failed or denied.');
        }
      }

      // Send to Commander Agent
      await api.post('/commander/chat', { 
        message: `EMERGENCY SOS TRIGGERED. Location: ${locationStr}. Immediate rescue required.` 
      });

      setSosActive(true);
      toast.success('SOS Signal Broadcasted Successfully!', { duration: 5000 });
      
    } catch (error) {
      console.error('SOS Failed', error);
      toast.error('Failed to send SOS signal. Check connection.');
    } finally {
      setIsPressing(false);
    }
  };

  return (
    <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 shadow-lg flex flex-col items-center justify-center text-center">
      <h2 className="text-xl font-bold text-white mb-2">Emergency SOS</h2>
      <p className="text-sm text-gray-400 mb-6">Press only in life-threatening situations.</p>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSOS}
        disabled={isPressing || sosActive}
        className={`relative w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.4)] ${
          sosActive 
            ? 'bg-gray-700 cursor-not-allowed' 
            : 'bg-red-600 hover:bg-red-500 cursor-pointer'
        } transition-colors border-4 border-red-900/50`}
      >
        {sosActive && (
          <motion.div 
            className="absolute inset-0 rounded-full border-4 border-red-500 opacity-50"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
        
        <div className="flex flex-col items-center">
          <AlertTriangle size={32} className={sosActive ? 'text-gray-400' : 'text-white'} />
          <span className={`mt-2 font-black text-xl tracking-wider ${sosActive ? 'text-gray-400' : 'text-white'}`}>
            {sosActive ? 'SENT' : 'SOS'}
          </span>
        </div>
      </motion.button>
      
      {sosActive && (
        <div className="mt-6 text-sm text-red-400 font-medium flex items-center bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
          <MapPin size={16} className="mr-2" />
          Distress Signal Active
        </div>
      )}
    </div>
  );
};
