import React from 'react';
import { useDemo } from '../../contexts/DemoContext';
import { Play, Square } from 'lucide-react';

export const DemoModeToggle = () => {
  const { isDemoMode, toggleDemoMode } = useDemo();

  return (
    <div className="fixed bottom-6 left-6 z-[9999]">
      <button
        onClick={toggleDemoMode}
        className={`flex items-center px-4 py-3 rounded-full font-bold shadow-2xl transition-all duration-300 ${
          isDemoMode 
            ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30 animate-pulse' 
            : 'bg-[#141C2D] text-gray-400 border border-[rgba(255,255,255,0.1)] hover:text-white'
        }`}
      >
        {isDemoMode ? (
          <>
            <Square size={18} className="mr-2 fill-current" />
            END DEMO
          </>
        ) : (
          <>
            <Play size={18} className="mr-2 fill-current text-blue-500" />
            PRESENTATION MODE
          </>
        )}
      </button>
    </div>
  );
};
