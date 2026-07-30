import { motion } from 'framer-motion';
import { ShieldAlert, Activity, ShieldCheck, Database, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center p-6 z-10 relative overflow-hidden bg-[#030712]">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#030712] to-[#030712] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative mb-12 group">
          <div className="absolute inset-0 bg-blue-500/30 blur-[60px] rounded-full scale-[2] group-hover:scale-[3] transition-transform duration-700"></div>
          <ShieldAlert className="w-32 h-32 text-blue-500 relative z-10 drop-shadow-[0_0_25px_rgba(59,130,246,0.8)]" />
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase font-['Space_Grotesk'] leading-tight">
          Global Disaster <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 animate-pulse">
            Orchestration
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 font-mono max-w-3xl mb-12 uppercase tracking-widest leading-relaxed">
          Autonomous Multi-Agent AI Platform coordinating citizens, volunteers, and tactical responders in real-time.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link to="/register">
            <button className="relative overflow-hidden group bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest uppercase py-4 px-10 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.8)] border border-blue-400/50 hover:-translate-y-1">
              <span className="relative z-10">Initialize System</span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            </button>
          </Link>
          
          <Link to="/login">
            <button className="bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-gray-300 hover:text-white border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)] font-bold tracking-widest uppercase py-4 px-10 rounded-full transition-all duration-300 hover:-translate-y-1">
              Secure Login
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Floating UI Elements */}
      <motion.div 
        animate={{ y: [0, -10, 0] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-10 md:left-32 bg-[#0B0F19]/80 backdrop-blur-xl border border-[rgba(255,255,255,0.1)] p-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] hidden lg:flex items-center"
      >
        <Activity className="text-green-500 mr-3 animate-pulse" />
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Telemetry</div>
          <div className="text-sm text-white font-mono">142 Active Nodes</div>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 15, 0] }} 
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-10 md:right-32 bg-[#0B0F19]/80 backdrop-blur-xl border border-[rgba(255,255,255,0.1)] p-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] hidden lg:flex items-center"
      >
        <ShieldCheck className="text-blue-500 mr-3" />
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Commander AI</div>
          <div className="text-sm text-white font-mono">Status: Nominal</div>
        </div>
      </motion.div>
    </div>
  );
};
