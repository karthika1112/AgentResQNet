import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import { AdminGISMap } from '../../components/AdminDashboard/AdminGISMap';
import { AIAgentMatrix } from '../../components/AdminDashboard/AIAgentMatrix';
import { SystemHealthPanel } from '../../components/AdminDashboard/SystemHealthPanel';
import { TerminalConsole } from '../../components/AdminDashboard/TerminalConsole';
import { WorkflowAnimation } from '../../components/Presentation/WorkflowAnimation';
import { DataTableModule } from '../../components/AdminDashboard/modules/DataTableModule';
import { AgentChatModule } from '../../components/AdminDashboard/modules/AgentChatModule';
import { SOSRequestsModule } from '../../components/AdminDashboard/modules/SOSRequestsModule';
import { VolunteerOffersModule } from '../../components/AdminDashboard/modules/VolunteerOffersModule';
import { UsersModule } from '../../components/AdminDashboard/modules/UsersModule';
import { 
  mockIncidents, mockAlerts, mockShelters, mockRescues, mockResources, mockUsers 
} from '../../components/AdminDashboard/modules/mockAdminData';
import { 
  incidentColumns, alertColumns, shelterColumns, rescueColumns, resourceColumns, userColumns 
} from '../../components/AdminDashboard/modules/TableConfigs.jsx';
import { 
  Globe, ShieldAlert, Activity, Users, Truck, Database, Settings, BarChart2, Crosshair, 
  Brain, Navigation, ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const [stats, setStats] = useState({
    totalUsers: 142,
    activeIncidents: 3,
    activeResponders: 28,
    activeShelters: 5
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats/admin');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      }
    };
    fetchStats();
  }, []);

  // Renders the main dashboard layout
  const renderOverview = () => (
    <div className="flex flex-col space-y-6">
      {/* Top Row: Animated Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {[
          { label: 'Total Incidents', value: stats.activeIncidents + 12, icon: ShieldAlert, color: 'red' },
          { label: 'Critical', value: stats.activeIncidents, icon: Activity, color: 'red' },
          { label: 'Victims', value: 89, icon: Users, color: 'orange' },
          { label: 'Volunteers', value: stats.totalUsers - 50, icon: Users, color: 'green' },
          { label: 'Rescue Teams', value: stats.activeResponders, icon: Crosshair, color: 'blue' },
          { label: 'Resources', value: '1.2k', icon: Truck, color: 'purple' },
          { label: 'AI Agents', value: 6, icon: Database, color: 'indigo' },
          { label: 'Health', value: '100%', icon: Activity, color: 'green' }
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-[#0B0F19] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 shadow-lg relative overflow-hidden group hover:border-${metric.color}-500/50 transition-colors`}
            >
              <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity text-${metric.color}-500`}>
                <Icon size={80} />
              </div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">{metric.label}</span>
                <Icon size={14} className={`text-${metric.color}-400`} />
              </div>
              <div className="text-2xl font-black text-white">{metric.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Second Row: Map & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 xl:col-span-9 h-[500px]">
          <AdminGISMap />
        </div>
        <div className="lg:col-span-4 xl:col-span-3 bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl flex flex-col overflow-hidden shadow-lg">
          <div className="p-4 border-b border-[rgba(255,255,255,0.05)] bg-[#0B0F19]">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center">
              <Activity size={14} className="mr-2 text-red-500 animate-pulse" />
              Live Emergency Feed
            </h3>
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border-l-2 border-red-500 pl-3">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-red-400 font-bold uppercase tracking-wider">Priority 1</span>
                  <span className="text-gray-500 font-mono">1m ago</span>
                </div>
                <p className="text-xs text-gray-300 mb-1">Building collapse reported in Downtown sector.</p>
                <div className="text-[10px] text-blue-400 font-mono bg-blue-500/10 inline-block px-2 py-0.5 rounded">
                  Agent Handling: Rescue
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row: AI Matrix & Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 h-[400px]">
          <AIAgentMatrix />
        </div>
        <div className="lg:col-span-7 h-[400px] flex items-center justify-center bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl shadow-lg p-6">
          <WorkflowAnimation />
        </div>
      </div>

      {/* Bottom Row: Logs & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-[350px]">
          <TerminalConsole />
        </div>
        <div className="lg:col-span-4 h-[350px]">
          <SystemHealthPanel />
        </div>
      </div>
    </div>
  );

  // Reusable Empty State Widget
  const renderEmptyState = (title, icon, message) => {
    const Icon = icon;
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-12 text-center h-[70vh]">
        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
          <Icon size={40} className="text-blue-500 opacity-80" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-4">{title}</h2>
        <p className="text-gray-400 max-w-lg mb-8">{message}</p>
        <div className="animate-pulse flex items-center text-blue-400 text-sm font-bold uppercase tracking-widest">
          <Activity size={16} className="mr-2" />
          Awaiting System Telemetry...
        </div>
      </div>
    );
  };

  // Tab Router
  const renderContent = () => {
    switch (currentTab) {
      case 'overview':
      case 'command':
        return renderOverview();
      case 'map':
        return (
          <div className="h-[85vh]">
            <AdminGISMap />
          </div>
        );
      
      // Data Tables
      case 'incidents':
        return <DataTableModule title="Incident Management" description="Global Disaster & Emergency Reporting System" icon={ShieldAlert} columns={incidentColumns} data={mockIncidents} />;
      case 'alerts':
        return <DataTableModule title="Emergency Alerts" description="Public Broadcasting & Warning System" icon={Activity} columns={alertColumns} data={mockAlerts} />;
      case 'sos-requests':
        return <SOSRequestsModule />;
      case 'shelters':
        return <DataTableModule title="Evacuation Centers" description="Live Shelter Occupancy & Logistics" icon={Globe} columns={shelterColumns} data={mockShelters} />;
      case 'rescues':
        return <DataTableModule title="Rescue Operations" description="Active Mission Telemetry & Tracking" icon={Crosshair} columns={rescueColumns} data={mockRescues} />;
      case 'resources':
        return <DataTableModule title="Resource Logistics" inventory description="Global Supply Chain & Inventory" icon={Truck} columns={resourceColumns} data={mockResources} />;
      case 'volunteers':
        return <UsersModule roleFilter="Volunteer" />;
      case 'victims':
        return <UsersModule roleFilter="Victim" />;
      case 'users':
        return <UsersModule roleFilter="All" />;
      case 'volunteer-offers':
        return <VolunteerOffersModule />;
      
      // AI Agent Modules
      case 'agents':
      case 'agent-commander':
        return <AgentChatModule agentName="Commander Agent" subtitle="Multi-Agent Orchestration Engine" icon={Brain} endpoint="/commander/chat" welcomeMessage="Hello Admin. I am the Commander Agent. I am currently orchestrating all active sub-agents. How can I assist you with the global strategy?" />;
      case 'agent-intelligence':
        return <AgentChatModule agentName="Disaster Intelligence Agent" subtitle="Global Weather & Geological Scraper" icon={Database} endpoint="/ai/chat" welcomeMessage="Intelligence Agent online. I am actively scraping USGS and Open-Meteo for seismic and weather anomalies. What data do you need?" />;
      case 'agent-verification':
        return <AgentChatModule agentName="Incident Verification Agent" subtitle="Fraud Detection & AI Validation" icon={ShieldCheck} endpoint="/ai/chat" welcomeMessage="Verification Agent standing by. Currently scanning all incoming reports for duplicates and AI-generated misinformation." />;
      case 'agent-evacuation':
        return <AgentChatModule agentName="Evacuation Agent" subtitle="Shelter & Routing Optimization" icon={Navigation} endpoint="/ai/chat" welcomeMessage="Evacuation routing systems nominal. Calculating shortest paths via OSRM to nearest safe zones." />;
      case 'agent-rescue':
        return <AgentChatModule agentName="Rescue Agent" subtitle="Tactical Unit Deployment" icon={Crosshair} endpoint="/ai/chat" welcomeMessage="Rescue Coordinator active. Managing active Responder units and tracking mission ETAs." />;
      case 'agent-resources':
        return <AgentChatModule agentName="Resource Agent" subtitle="Supply Chain & Inventory Predictor" icon={Truck} endpoint="/ai/chat" welcomeMessage="Resource Agent online. Monitoring supply levels across all active warehouses. No critical shortages detected at this time." />;
      
      // Other tools
      case 'workflow':
        return (
          <div className="h-[85vh] flex items-center justify-center">
            <WorkflowAnimation />
          </div>
        );
      case 'logs':
        return (
          <div className="h-[85vh]">
            <TerminalConsole />
          </div>
        );
      case 'health':
        return (
          <div className="h-[85vh] max-w-4xl mx-auto">
            <SystemHealthPanel />
          </div>
        );
      case 'analytics':
        return renderEmptyState('Operational Analytics', BarChart2, 'Aggregating cross-platform operational metrics. Historical charts and response latency metrics are currently being compiled by the data warehouse layer.');
      case 'settings':
        return renderEmptyState('System Settings', Settings, 'Core platform configuration is locked to enterprise environment variables (Vercel/Render). Modifying AI Agent temperatures requires CLI access.');
      default:
        return renderEmptyState(currentTab.toUpperCase(), Globe, `Live telemetry module for ${currentTab} is standing by. Operations are currently being managed autonomously.`);
    }
  };

  return (
    <div className="flex flex-col h-full pb-6 relative z-10">
      
      {/* Decorative Command Center Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        {/* Radar Sweep Effect (CSS Animation) */}
        <div className="absolute w-[800px] h-[800px] rounded-full border border-blue-500/10 opacity-20 animate-[spin_10s_linear_infinite]"
             style={{ background: 'conic-gradient(from 0deg, transparent 70%, rgba(59,130,246,0.1) 100%)' }}>
        </div>
        <div className="absolute w-[600px] h-[600px] rounded-full border border-blue-500/10 opacity-20"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full border border-blue-500/20 opacity-30"></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] mix-blend-screen"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Dynamic Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-white tracking-widest uppercase flex items-center drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <Globe className="mr-3 text-blue-500" size={28} />
              {currentTab === 'overview' ? 'Emergency Operations Center' : currentTab.replace('-', ' ')}
            </h1>
            <p className="text-gray-400 mt-1 uppercase text-xs tracking-wider">
              {currentTab === 'overview' ? 'Global AI Orchestration & Monitoring Console' : `Dedicated monitoring panel for ${currentTab}`}
            </p>
          </div>
          <div className="bg-purple-500/20 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-lg font-bold text-sm tracking-widest uppercase shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            God Mode Active
          </div>
        </div>

        {/* Main Render Area */}
        {renderContent()}
      </div>
    </div>
  );
};
