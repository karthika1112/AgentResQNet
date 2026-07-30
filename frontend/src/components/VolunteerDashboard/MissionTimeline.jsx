import React from 'react';
import { CheckCircle2, Clock, Truck, MapPin } from 'lucide-react';

export const MissionTimeline = () => {
  const steps = [
    { id: 1, title: 'Mission Assigned', time: '10:42 AM', status: 'completed', icon: CheckCircle2 },
    { id: 2, title: 'Pickup Resources', subtitle: 'Central Shelter', time: '10:55 AM', status: 'completed', icon: Truck },
    { id: 3, title: 'En Route to Drop Zone', subtitle: 'ETA: 5 mins', status: 'current', icon: MapPin },
    { id: 4, title: 'Delivery Confirmed', status: 'pending', icon: Clock }
  ];

  return (
    <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 shadow-lg h-full">
      <h3 className="text-lg font-semibold text-white mb-6">Mission Timeline</h3>
      
      <div className="relative pl-6 border-l-2 border-gray-800 space-y-8">
        {steps.map((step) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative">
              <div 
                className={`absolute -left-[35px] w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#141C2D] ${
                  isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-700'
                }`}
              >
                <Icon size={14} className="text-white" />
              </div>
              
              <div>
                <h4 className={`text-sm font-semibold ${isCompleted || isCurrent ? 'text-white' : 'text-gray-500'}`}>
                  {step.title}
                </h4>
                {step.subtitle && (
                  <p className="text-xs text-gray-400 mt-1">{step.subtitle}</p>
                )}
                {step.time && (
                  <span className="text-[10px] text-gray-500 absolute top-0 right-0">{step.time}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
