import React from 'react';
import { Brain, Database, ShieldCheck, Navigation, Truck, Crosshair, Activity } from 'lucide-react';
import { useDemo } from '../../contexts/DemoContext';

export const AIAgentMatrix = React.memo(() => {
  const { isDemoMode } = useDemo();
  const agents = [
    { name: 'Commander Agent', icon: Brain, status: 'Online', task: 'Orchestrating Workflow #492', latency: '120ms', conf: 98 },
    { name: 'Intelligence Agent', icon: Database, status: 'Online', task: 'Scraping USGS APIs', latency: '450ms', conf: 92 },
    { name: 'Verification Agent', icon: ShieldCheck, status: 'Online', task: 'Analyzing image hash', latency: '800ms', conf: 85 },
    { name: 'Evacuation Agent', icon: Navigation, status: 'Idle', task: 'Standing by', latency: '---', conf: 100 },
    { name: 'Rescue Agent', icon: Crosshair, status: 'Online', task: 'Routing Unit Alpha-1', latency: '210ms', conf: 95 },
    { name: 'Resource Agent', icon: Truck, status: 'Online', task: 'Optimizing Inventory', latency: '330ms', conf: 90 },
  ];

  return (
    <div className={`bg-[#141C2D] border rounded-xl p-6 h-full transition-all duration-500 ${isDemoMode ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-[1.02]' : 'border-[rgba(255,255,255,0.05)] shadow-lg'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white uppercase tracking-wide text-xs">AI Agent Matrix</h3>
        <div className="flex items-center text-green-400 text-xs">
          <Activity size={14} className="mr-1 animate-pulse" />
          All Systems Nominal
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent, idx) => {
          const Icon = agent.icon;
          const isIdle = agent.status === 'Idle';
          
          return (
            <div key={idx} className="bg-[#0B0F19] p-4 rounded-lg border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)] transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${isIdle ? 'bg-gray-800 text-gray-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{agent.name}</h4>
                    <span className={`text-[10px] uppercase font-bold ${isIdle ? 'text-gray-500' : 'text-green-400'}`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Task</span>
                  <span className="text-gray-300 truncate max-w-[120px]" title={agent.task}>{agent.task}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Latency</span>
                  <span className="text-gray-300 font-mono">{agent.latency}</span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-500">Confidence</span>
                  <div className="flex items-center">
                    <div className="w-16 h-1.5 bg-gray-800 rounded-full mr-2 overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${agent.conf}%` }}></div>
                    </div>
                    <span className="text-gray-300 font-mono">{agent.conf}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
