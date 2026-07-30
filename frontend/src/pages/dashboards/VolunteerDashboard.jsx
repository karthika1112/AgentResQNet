import React from 'react';
import { VolunteerOverview } from '../../components/VolunteerDashboard/VolunteerOverview';
import { AIAgentMatrix } from '../../components/AdminDashboard/AIAgentMatrix';
import { VolunteerMap } from '../../components/VolunteerDashboard/VolunteerMap';
import { MissionPanel } from '../../components/VolunteerDashboard/MissionPanel';
import { MissionTimeline } from '../../components/VolunteerDashboard/MissionTimeline';
import { CommanderChat } from '../../components/AIChat/CommanderChat';
import { Radio } from 'lucide-react';

export const VolunteerDashboard = () => {
  return (
    <div className="flex flex-col space-y-6 h-full pb-6">
      {/* Top Navigation / Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Volunteer Operations Hub</h1>
          <p className="text-gray-400">Resource Delivery & Support Coordination</p>
        </div>
        <div className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-lg font-medium text-sm flex items-center">
          <Radio size={16} className="mr-2 animate-pulse" />
          Connected to Commander
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[800px]">
        
        {/* Left Column: Overview, Map & Chat */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <VolunteerOverview />
          <VolunteerMap />
          <div className="flex-1 min-h-[400px]">
            <CommanderChat />
          </div>
        </div>

        {/* Right Column: Mission Panel, Timeline & Agents */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <div className="flex-1 max-h-[400px]">
             <MissionPanel />
          </div>
          <div className="flex-1">
             <MissionTimeline />
          </div>
          <div className="flex-1">
             <AIAgentMatrix />
          </div>
        </div>
      </div>
    </div>
  );
};
