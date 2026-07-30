import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Database, Cpu, Globe, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export const PremiumLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING BOOT SEQUENCE...');

  useEffect(() => {
    const sequence = [
      { p: 15, text: 'SCANNING REGIONAL RADAR...' },
      { p: 30, text: 'CONNECTING MONGODB CLUSTER...' },
      { p: 45, text: 'INITIALIZING MULTI-AGENT SYSTEM...' },
      { p: 60, text: 'ESTABLISHING SOCKET.IO TELEMETRY...' },
      { p: 75, text: 'CHECKING USGS & WEATHER APIS...' },
      { p: 90, text: 'LOADING GIS TACTICAL MAPS...' },
      { p: 100, text: 'SYSTEM READY.' }
    ];

    let currentStep = 0;
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        
        const newP = p + 2;
        if (sequence[currentStep] && newP >= sequence[currentStep].p) {
          setStatusText(sequence[currentStep].text);
          currentStep++;
        }
        return newP;
      });
    }, 50);
    
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030712] overflow-hidden"
      >
        {/* Radar Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -mt-[400px] -ml-[400px] border border-blue-500/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -mt-[300px] -ml-[300px] border border-blue-500/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -mt-[200px] -ml-[200px] border border-blue-500/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-full h-[1px] bg-blue-500/20"></div>
          <div className="absolute left-1/2 top-0 w-[1px] h-full bg-blue-500/20"></div>
          <div className="radar-sweep"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="mb-8 relative"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-[50px] rounded-full scale-150"></div>
            <Shield className="w-24 h-24 text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
          </motion.div>

          <h1 className="text-3xl font-black text-white tracking-[0.2em] mb-2 uppercase font-['Space_Grotesk'] drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            ResQNet AI
          </h1>
          <p className="text-blue-400 font-mono text-xs tracking-widest mb-12">
            EMERGENCY OPERATIONS CENTER
          </p>

          <div className="w-80 space-y-4">
            <div className="flex justify-between text-xs font-mono text-gray-400">
              <span>{statusText}</span>
              <span className="text-blue-400">{progress}%</span>
            </div>
            
            <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.05 }}
              />
            </div>

            <div className="grid grid-cols-4 gap-2 mt-6">
              {[
                { icon: Database, p: 30 },
                { icon: Cpu, p: 45 },
                { icon: Globe, p: 90 },
                { icon: CheckCircle, p: 100 }
              ].map((item, i) => {
                const Icon = item.icon;
                const isActive = progress >= item.p;
                return (
                  <div key={i} className={`flex justify-center p-2 rounded border transition-colors duration-500 ${isActive ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-gray-900 border-gray-800 text-gray-700'}`}>
                    <Icon size={16} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
