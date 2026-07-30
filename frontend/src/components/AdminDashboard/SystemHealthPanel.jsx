import React, { useState, useEffect } from 'react';
import { Server, Database, Cloud, Cpu, MemoryStick } from 'lucide-react';
import api from '../../api/axios';
import { useDemo } from '../../contexts/DemoContext';

export const SystemHealthPanel = React.memo(() => {
  const [healthData, setHealthData] = useState(null);
  const { isDemoMode } = useDemo();

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await api.get('/health');
        if (res.data.success) {
          setHealthData(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch health data', error);
      }
    };
    
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (name) => {
    if (name.includes('Mongo')) return Database;
    if (name.includes('Socket')) return Server;
    if (name.includes('Gemini')) return Cpu;
    return Cloud;
  };

  if (!healthData) return <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 shadow-lg h-full flex items-center justify-center text-gray-500">Loading Telemetry...</div>;

  return (
    <div className={`bg-[#141C2D] border rounded-xl p-6 h-full flex flex-col transition-all duration-500 ${isDemoMode ? 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)] scale-[1.02]' : 'border-[rgba(255,255,255,0.05)] shadow-lg'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white uppercase tracking-wide text-xs">Infrastructure Health</h3>
        <div className="text-[10px] text-gray-500 font-mono flex items-center">
          <MemoryStick size={12} className="mr-1" />
          MEM: {healthData.metrics.memoryUsedMB}MB / CPU: {healthData.metrics.cpuLoad}
        </div>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {healthData.systems.map((sys, idx) => {
          const Icon = getIcon(sys.name);
          const isDegraded = sys.status !== 'Operational';
          
          return (
            <div key={idx} className="flex items-center justify-between p-3 bg-[#0B0F19] rounded-lg border border-[rgba(255,255,255,0.05)]">
              <div className="flex items-center">
                <Icon size={16} className={`mr-3 ${isDegraded ? 'text-yellow-500' : 'text-gray-400'}`} />
                <div>
                  <h4 className="text-sm font-semibold text-gray-200">{sys.name}</h4>
                  <p className={`text-[10px] uppercase font-bold ${isDegraded ? 'text-yellow-500' : 'text-green-500'}`}>
                    {sys.status}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 font-mono">{sys.ping}</p>
                <p className="text-[10px] text-gray-500">Up: {sys.uptime}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
