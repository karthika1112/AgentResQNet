import React from 'react';
import { ResponderStatus } from '../../components/ResponderDashboard/ResponderStatus';
import { AIAgentMatrix } from '../../components/AdminDashboard/AIAgentMatrix';
import { TacticalMap } from '../../components/ResponderDashboard/TacticalMap';
import { RescueMissionPanel } from '../../components/ResponderDashboard/RescueMissionPanel';
import { TacticalTimeline } from '../../components/ResponderDashboard/TacticalTimeline';
import { IncidentFeed } from '../../components/ResponderDashboard/IncidentFeed';
import { CommanderChat } from '../../components/AIChat/CommanderChat';
import { Activity } from 'lucide-react';

export const ResponderDashboard = () => {
  return (
    <div className="flex flex-col space-y-6 h-full pb-6">
      {/* Top Navigation / Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide uppercase">Tactical Command Center</h1>
          <p className="text-gray-400">Emergency Rescue & Evacuation Coordination</p>
        </div>
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg font-bold text-sm flex items-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <Activity size={16} className="mr-2 animate-pulse" />
          ENCRYPTED COMMS ACTIVE
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[850px]">
        
        {/* Left Column: Status, Map & Chat */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <ResponderStatus />
          <TacticalMap />
          <div className="flex-1 min-h-[400px]">
            <CommanderChat />
          </div>
        </div>

        {/* Right Column: Mission Panel, Timeline, Intel & Agents */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <div className="flex-1 max-h-[400px]">
             <RescueMissionPanel />
          </div>
          <div className="flex-1">
             <TacticalTimeline />
          </div>
          <div className="flex-1">
             <IncidentFeed />
          </div>
          <div className="flex-1">
             <AIAgentMatrix />
          </div>
        </div>
      </div>
    </div>
  );
};
