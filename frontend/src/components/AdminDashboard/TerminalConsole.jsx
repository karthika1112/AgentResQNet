import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

export const TerminalConsole = () => {
  const [logs, setLogs] = useState([
    '[SYSTEM] Terminal Initialized.',
    '[SYSTEM] Connecting to Commander Socket namespace...',
    '[SUCCESS] Connected to orchestration engine.'
  ]);
  const containerRef = useRef(null);

  useEffect(() => {
    // Simulate incoming background logs
    const mockLogs = [
      '[ROUTER] Incoming request: POST /api/commander/chat',
      '[AGENT:Commander] Analyzing intent...',
      '[AGENT:Commander] Intent classified as "Rescue"',
      '[WORKFLOW] Triggering RescueAgent...',
      '[AGENT:Rescue] Calculating optimal route using OSRM.',
      '[AGENT:Rescue] Assigned Unit Alpha-1 to VIC-8932.',
      '[SOCKET] Emitting mission_assigned to Responder room.',
      '[DB] Updated Incident #492 status to Dispatched.'
    ];

    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < mockLogs.length) {
        setLogs(prev => [...prev, mockLogs[currentIndex]]);
        currentIndex++;
      } else {
        currentIndex = 0; // loop for visualization
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (log) => {
    if (!log) return 'text-gray-400';
    if (log.includes('[ERROR]')) return 'text-red-500';
    if (log.includes('[WARNING]')) return 'text-yellow-500';
    if (log.includes('[SUCCESS]')) return 'text-green-400';
    if (log.includes('[AGENT:')) return 'text-blue-400';
    return 'text-gray-400';
  };

  return (
    <div className="bg-[#0B0F19] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden shadow-xl h-full flex flex-col font-mono relative z-10">
      <div className="bg-[#141C2D] px-4 py-3 flex items-center border-b border-[rgba(255,255,255,0.05)] shadow-md">
        <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center mr-3 border border-gray-700">
          <Terminal size={14} className="text-gray-400" />
        </div>
        <span className="text-xs text-gray-300 font-bold uppercase tracking-widest">Live Execution Terminal</span>
      </div>
      
      <div ref={containerRef} className="p-5 flex-1 overflow-y-auto custom-scrollbar text-xs leading-relaxed space-y-2">
        {logs.map((log, idx) => (
          <div key={idx} className={`${getLogColor(log)} break-all flex group`}>
            <span className="text-gray-600 mr-3 select-none group-hover:text-gray-500 transition-colors">
              {new Date().toISOString().split('T')[1].slice(0,8)}
            </span>
            <span className="flex-1 opacity-90 group-hover:opacity-100 transition-opacity">
              {log}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
