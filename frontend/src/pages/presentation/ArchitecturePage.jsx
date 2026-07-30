import React from 'react';
import { Database, Server, Cpu, Cloud, Smartphone, Users } from 'lucide-react';
import { WorkflowAnimation } from '../../components/Presentation/WorkflowAnimation';

export const ArchitecturePage = () => {
  return (
    <div className="min-h-screen bg-[#030712] p-8 pb-32">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 mb-4">
            SYSTEM ARCHITECTURE
          </h1>
          <p className="text-gray-400 text-lg">ResQNet AI Enterprise Multi-Agent Platform</p>
        </header>

        {/* Dynamic Workflow */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Cpu className="mr-3 text-blue-500" /> Pipeline Orchestration
          </h2>
          <WorkflowAnimation />
        </section>

        {/* Tech Stack Grid */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Server className="mr-3 text-indigo-500" /> Technology Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Frontend */}
            <div className="bg-[#141C2D] p-6 rounded-xl border border-[rgba(255,255,255,0.05)] shadow-lg hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="text-blue-500" size={24} />
              </div>
              <h3 className="text-white font-bold mb-2">Frontend</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>React 18 + Vite</li>
                <li>TailwindCSS</li>
                <li>Leaflet GIS Mapping</li>
                <li>Role-Based Routing</li>
                <li>Vercel Edge Network</li>
              </ul>
            </div>

            {/* Backend */}
            <div className="bg-[#141C2D] p-6 rounded-xl border border-[rgba(255,255,255,0.05)] shadow-lg hover:border-green-500/30 transition-colors">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <Server className="text-green-500" size={24} />
              </div>
              <h3 className="text-white font-bold mb-2">Backend Services</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>Node.js + Express</li>
                <li>Socket.IO (WebSockets)</li>
                <li>JWT Authentication</li>
                <li>NoSQL Sanitization</li>
                <li>Render Deployment</li>
              </ul>
            </div>

            {/* AI Layer */}
            <div className="bg-[#141C2D] p-6 rounded-xl border border-[rgba(255,255,255,0.05)] shadow-lg hover:border-purple-500/30 transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Cpu className="text-purple-500" size={24} />
              </div>
              <h3 className="text-white font-bold mb-2">Multi-Agent AI</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>Google Gemini 1.5 Flash</li>
                <li>Google Vertex AI APIs</li>
                <li>6 Specialized Autonomous Agents</li>
                <li>Live Context Injection</li>
              </ul>
            </div>

            {/* Data Layer */}
            <div className="bg-[#141C2D] p-6 rounded-xl border border-[rgba(255,255,255,0.05)] shadow-lg hover:border-yellow-500/30 transition-colors">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4">
                <Database className="text-yellow-500" size={24} />
              </div>
              <h3 className="text-white font-bold mb-2">Data & External APIs</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>MongoDB Atlas (Cloud DB)</li>
                <li>USGS Earthquake Live Data</li>
                <li>Open-Meteo Weather API</li>
                <li>OSRM OpenRouting</li>
              </ul>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};
