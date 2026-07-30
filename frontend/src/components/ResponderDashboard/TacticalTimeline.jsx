import React from 'react';
import { ShieldAlert, Zap, Radio, MapPin } from 'lucide-react';

export const TacticalTimeline = () => {
  const events = [
    { id: 1, time: '14:02:11', label: 'SOS Received', source: 'Victim App', icon: ShieldAlert, color: 'text-red-400' },
    { id: 2, time: '14:02:15', label: 'AI Triaged (Critical)', source: 'Commander Agent', icon: Zap, color: 'text-yellow-400' },
    { id: 3, time: '14:02:20', label: 'Unit Dispatched', source: 'Rescue Agent', icon: Radio, color: 'text-blue-400' },
    { id: 4, time: '14:08:00', label: 'Arrival Expected', source: 'System', icon: MapPin, color: 'text-gray-500' }
  ];

  return (
    <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 shadow-lg h-full">
      <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wide text-xs">Mission Timeline</h3>
      
      <div className="relative pl-6 border-l border-gray-800 space-y-6">
        {events.map((event) => {
          const Icon = event.icon;
          return (
            <div key={event.id} className="relative">
              <div className="absolute -left-[31px] bg-[#141C2D] p-1">
                <Icon size={16} className={event.color} />
              </div>
              <div>
                <div className="flex justify-between items-baseline">
                  <h4 className="text-sm font-semibold text-white">{event.label}</h4>
                  <span className="text-[10px] text-gray-500 font-mono">{event.time}</span>
                </div>
                <p className="text-[10px] text-gray-400 uppercase mt-0.5 opacity-70">SRC: {event.source}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
