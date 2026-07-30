import React, { useState } from 'react';
import { VictimAICompanion } from '../../components/VictimDashboard/VictimAICompanion';
import { EmergencyStatusCard } from '../../components/VictimDashboard/EmergencyStatusCard';
import { SOSReportModal } from '../../components/VictimDashboard/SOSReportModal';
import { ReportDisasterModal } from '../../components/VictimDashboard/ReportDisasterModal';
import { VictimMap } from '../../components/VictimDashboard/VictimMap';
import { AlertFeed } from '../../components/VictimDashboard/AlertFeed';
import { DisasterAnalyticsCard } from '../../components/VictimDashboard/DisasterAnalyticsCard';
import { NearbyDangerPanel } from '../../components/VictimDashboard/NearbyDangerPanel';
import { NearbyResources } from '../../components/VictimDashboard/NearbyResources';
import { NearbyShelters } from '../../components/VictimDashboard/NearbyShelters';
import { VictimRequestTracker } from '../../components/VictimDashboard/VictimRequestTracker';
import { Activity, Radio, AlertTriangle } from 'lucide-react';

export const VictimDashboard = () => {
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <div className="flex flex-col space-y-4 h-full pb-6">
      {/* Top Navigation / Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Emergency Assistance Portal</h1>
          <p className="text-gray-400">Live AI Orchestration and Rescue Tracking</p>
        </div>
        <div className="flex space-x-4">
          <button onClick={() => setIsReportOpen(true)} className="bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white transition-colors px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            <AlertTriangle size={16} className="mr-2" /> Report Disaster
          </button>
          <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            <Activity size={16} className="mr-2 animate-pulse" />
            Network: Stable
          </div>
        </div>
      </div>

      {/* Main Grid Layout - The Emergency Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[85vh]">
        
        {/* LEFT COLUMN: Map & Analytics (Section 4, 10, 5) */}
        <div className="lg:col-span-3 flex flex-col space-y-4 overflow-y-auto custom-scrollbar pr-2 pb-20">
          <DisasterAnalyticsCard />
          
          <div className="h-[250px] rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.05)] shadow-xl relative group shrink-0">
             <div className="absolute top-4 left-4 z-10 bg-[#141C2D]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.1)] flex items-center">
               <Radio size={14} className="text-blue-500 mr-2 animate-pulse" />
               <span className="text-[10px] font-black text-white tracking-widest uppercase">Live Tracking Map</span>
             </div>
             <VictimMap />
          </div>

          <NearbyDangerPanel />
        </div>

        {/* CENTER COLUMN: AI Companion (Section 1) */}
        <div className="lg:col-span-6 flex flex-col h-full pb-4">
          <VictimAICompanion />
        </div>

        {/* RIGHT COLUMN: Emergency Status & Resources (Section 2, 6, 7, 8, 9) */}
        <div className="lg:col-span-3 flex flex-col space-y-4 overflow-y-auto custom-scrollbar pl-2 pb-20">
          <EmergencyStatusCard onOpenSOS={() => setIsSOSOpen(true)} />
          <VictimRequestTracker />
          <NearbyResources />
          <NearbyShelters />
          <div className="flex-1 min-h-[300px]">
            <AlertFeed />
          </div>
        </div>
      </div>
      
      <SOSReportModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />
      <ReportDisasterModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </div>
  );
};
