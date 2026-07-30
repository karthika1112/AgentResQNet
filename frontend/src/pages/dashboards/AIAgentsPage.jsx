import React from 'react';
import { CommanderChat } from '../../components/AIChat/CommanderChat';
import { Map, Bot, Activity } from 'lucide-react';

export const AIAgentsPage = () => {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Bot className="mr-3 text-blue-400" />
            AI Agents Orchestration
          </h1>
          <p className="text-gray-400 mt-1">Live Multi-Agent Workflow Monitoring & Interaction</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
        {/* Left Side: Chat Interface */}
        <div className="lg:col-span-2 h-full">
          <CommanderChat />
        </div>

        {/* Right Side: Quick Stats & Future Map Integration */}
        <div className="h-full flex flex-col space-y-6">
          <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="mr-2 text-blue-400" size={20} />
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-2">
                <span className="text-gray-400">Commander Node</span>
                <span className="text-green-400 text-sm font-medium flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-2">
                <span className="text-gray-400">Specialist Agents</span>
                <span className="text-green-400 text-sm font-medium">5/5 Active</span>
              </div>
              <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-2">
                <span className="text-gray-400">MongoDB Connection</span>
                <span className="text-green-400 text-sm font-medium">Verified</span>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 shadow-lg flex flex-col items-center justify-center text-center">
            <Map className="text-gray-600 mb-3" size={48} />
            <h3 className="text-lg font-semibold text-gray-300">Live Map Feed</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-[200px]">
              Geospatial data will automatically render here during an active workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
