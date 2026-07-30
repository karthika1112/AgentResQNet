import React from 'react';
import { AlertTriangle, Info, RadioReceiver } from 'lucide-react';

export const IncidentFeed = () => {
  const intel = [
    { id: 1, type: 'critical', msg: 'Bridge collapse reported on Route 4. Reroute advised.', time: '2m ago' },
    { id: 2, type: 'warning', msg: 'Heavy rain expected to cause flash flooding in Sector 7.', time: '15m ago' },
    { id: 3, type: 'info', msg: 'Supply convoy en route to Central MedEvac.', time: '1h ago' }
  ];

  return (
    <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 shadow-lg h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wide text-xs flex items-center">
        <RadioReceiver size={14} className="mr-2 text-blue-400" />
        Tactical Intel Feed
      </h3>
      
      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {intel.map((item) => (
          <div key={item.id} className="bg-[#0B0F19] p-3 rounded border-l-2 border-l-[rgba(255,255,255,0.1)] hover:bg-gray-800/50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                {item.type === 'critical' && <AlertTriangle size={14} className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />}
                {item.type === 'warning' && <AlertTriangle size={14} className="text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />}
                {item.type === 'info' && <Info size={14} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />}
                
                <p className="text-xs text-gray-300 leading-relaxed">{item.msg}</p>
              </div>
            </div>
            <div className="text-[9px] text-gray-500 text-right mt-2 font-mono uppercase">{item.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
