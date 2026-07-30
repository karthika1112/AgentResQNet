import React from 'react';
import { useDemo } from '../../contexts/DemoContext';
import { Brain, Database, ShieldAlert, Navigation, Package, Activity, MapPin } from 'lucide-react';

const steps = [
  { id: 0, title: 'Incident Reported', icon: ShieldAlert, desc: 'User submits SOS with location.', api: 'Geocoding API' },
  { id: 1, title: 'Commander Agent', icon: Brain, desc: 'Analyzes intent and orchestrates workflow.', api: 'Gemini 1.5 Flash' },
  { id: 2, title: 'Disaster Intelligence', icon: Database, desc: 'Correlates SOS with live external APIs.', api: 'USGS / Open-Meteo' },
  { id: 3, title: 'Verification', icon: Activity, desc: 'Flags fake reports, confirms emergency.', api: 'Image Analysis API' },
  { id: 4, title: 'Evacuation', icon: MapPin, desc: 'Identifies nearest safe zones & routes.', api: 'OSRM Routing' },
  { id: 5, title: 'Rescue Orchestration', icon: Navigation, desc: 'Dispatches nearest available Responders.', api: 'Socket.IO Live Match' },
  { id: 6, title: 'Resource Logistics', icon: Package, desc: 'Alerts volunteers for supply drops.', api: 'Inventory DB' },
  { id: 7, title: 'Action Executed', icon: Brain, desc: 'All agents synchronize. Response deployed.', api: 'Full Matrix' },
];

export const PresentationPanel = () => {
  const { isDemoMode, currentWorkflowStep } = useDemo();

  if (!isDemoMode) return null;

  const current = steps.find(s => s.id === currentWorkflowStep) || steps[0];
  const Icon = current.icon;

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-[#0B0F19]/95 backdrop-blur-xl border border-blue-500/30 rounded-xl p-5 shadow-[0_0_40px_rgba(59,130,246,0.15)] z-[9998] transition-all duration-500 transform translate-y-0 opacity-100">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[rgba(255,255,255,0.1)]">
        <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping mr-2"></span>
          Live Demo Execution
        </h3>
        <span className="text-[10px] text-gray-500 font-mono">STEP 0{current.id + 1}</span>
      </div>

      <div className="flex items-start mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mr-4 flex-shrink-0 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Icon size={20} className="text-blue-400" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">{current.title}</h4>
          <p className="text-xs text-gray-400 leading-relaxed mt-1">{current.desc}</p>
        </div>
      </div>

      <div className="bg-[#141C2D] rounded p-3 mb-3 border border-[rgba(255,255,255,0.05)]">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">API Provider:</span>
          <span className="text-green-400 font-mono">{current.api}</span>
        </div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Confidence:</span>
          <span className="text-blue-400 font-mono">98.{Math.floor(Math.random() * 99)}%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Exec Time:</span>
          <span className="text-yellow-400 font-mono">{Math.floor(Math.random() * 300) + 120}ms</span>
        </div>
      </div>
      
      <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
        <div 
          className="bg-blue-500 h-full transition-all duration-500 ease-out" 
          style={{ width: `${((currentWorkflowStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};
