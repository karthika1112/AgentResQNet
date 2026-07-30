import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { io } from 'socket.io-client';

export const RescueTracker = () => {
  const [status, setStatus] = useState('pending'); // pending, dispatched, arrived
  const [eta, setEta] = useState(null);
  
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    
    // Listen for rescue updates
    socket.on('rescue_updated', (data) => {
      // In a real app, verify this is for the current user's request
      setStatus(data.status.toLowerCase());
      if (data.eta) setEta(data.eta);
    });

    return () => socket.disconnect();
  }, []);

  const steps = [
    { id: 'pending', label: 'Request Received', icon: AlertCircle },
    { id: 'dispatched', label: 'Responder Dispatched', icon: Truck },
    { id: 'arrived', label: 'Team Arrived', icon: CheckCircle2 }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(s => s.id === status) >= 0 ? steps.findIndex(s => s.id === status) : 0;
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Live Rescue Tracker</h3>
        {eta && (
          <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold flex items-center">
            <Clock size={12} className="mr-1" />
            ETA: {eta}
          </div>
        )}
      </div>

      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute top-5 left-6 w-[calc(100%-3rem)] h-1 bg-gray-800 -z-10 rounded-full" />
        <div 
          className="absolute top-5 left-6 h-1 bg-blue-500 -z-10 rounded-full transition-all duration-1000"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        <div className="flex justify-between relative z-10">
          {steps.map((step, idx) => {
            const isActive = idx <= currentIndex;
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div 
                  initial={false}
                  animate={{ 
                    scale: isActive ? 1 : 0.9,
                    backgroundColor: isActive ? '#3B82F6' : '#1F2937',
                    borderColor: isActive ? '#60A5FA' : '#374151'
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-gray-500'} />
                </motion.div>
                <span className={`mt-2 text-xs font-medium text-center max-w-[80px] ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
