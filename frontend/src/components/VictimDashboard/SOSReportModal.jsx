import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin, Users, HeartPulse, ShieldAlert, X, CheckCircle, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

export const SOSReportModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    needs: [],
    location: '',
    riskLevel: 'high',
    peopleAffected: 1,
    details: ''
  });

  const toggleNeed = (need) => {
    setFormData(prev => ({
      ...prev,
      needs: prev.needs.includes(need) 
        ? prev.needs.filter(n => n !== need)
        : [...prev.needs, need]
    }));
  };

  const handleGetLocation = () => {
    const loadingToast = toast.loading("Acquiring GPS coordinates...");
    setTimeout(() => {
      setFormData(prev => ({ ...prev, location: "13.0827° N, 80.2707° E (Sector 4)" }));
      toast.dismiss(loadingToast);
      toast.success("Live Location Acquired!");
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Transmitting SOS to Commander Agent...");
    
    // Simulate backend transmission
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success("SOS Broadcast Successful! Rescue teams notified.");
      onClose();
      setStep(1);
      setFormData({ needs: [], location: '', riskLevel: 'high', peopleAffected: 1, details: '' });
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-[#0B0F19] border border-red-500/30 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.15)] w-full max-w-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-red-600/10 border-b border-red-500/20 p-6 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[50px] rounded-full"></div>
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/40">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-widest uppercase">Emergency SOS</h2>
                <p className="text-red-400 text-sm font-mono tracking-wider">Direct connection to AI Orchestrator</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors relative z-10">
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            
            {/* Needs Selection */}
            <div className="mb-6">
              <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">I Need Immediate Help With:</label>
              <div className="flex flex-wrap gap-3">
                {['Food', 'Water', 'Medical / First Aid', 'Clothes / Dress', 'Shelter', 'Rescue'].map(need => (
                  <button
                    key={need}
                    onClick={() => toggleNeed(need)}
                    className={`px-4 py-2 rounded-lg border text-sm font-bold tracking-wide transition-all ${
                      formData.needs.includes(need)
                        ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                        : 'bg-[#141C2D] border-[rgba(255,255,255,0.1)] text-gray-400 hover:border-red-500/50 hover:text-white'
                    }`}
                  >
                    {need}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Location */}
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center">
                  <MapPin size={14} className="mr-1" /> Incident Location
                </label>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Enter Attack Place or Address..." 
                    className="flex-1 bg-[#141C2D] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-red-500/50"
                  />
                  <button onClick={handleGetLocation} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center transition-colors shadow-lg shadow-blue-500/20" title="Get Live GPS">
                    <Navigation size={16} />
                  </button>
                </div>
              </div>

              {/* People Affected */}
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center">
                  <Users size={14} className="mr-1" /> People Affected
                </label>
                <input 
                  type="number" 
                  min="1"
                  value={formData.peopleAffected}
                  onChange={(e) => setFormData({...formData, peopleAffected: parseInt(e.target.value)})}
                  className="w-full bg-[#141C2D] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-red-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Risk Level */}
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center">
                  <ShieldAlert size={14} className="mr-1" /> Risk Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Low', 'Mid', 'High'].map(level => (
                    <button
                      key={level}
                      onClick={() => setFormData({...formData, riskLevel: level.toLowerCase()})}
                      className={`py-2 rounded-lg border text-xs font-bold uppercase tracking-widest transition-all ${
                        formData.riskLevel === level.toLowerCase()
                          ? level === 'High' ? 'bg-red-600 border-red-500 text-white' : level === 'Mid' ? 'bg-orange-500 border-orange-400 text-white' : 'bg-yellow-500 border-yellow-400 text-white'
                          : 'bg-[#141C2D] border-[rgba(255,255,255,0.1)] text-gray-500 hover:border-gray-400'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra Details */}
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center">
                  <HeartPulse size={14} className="mr-1" /> Condition / Details
                </label>
                <input 
                  type="text" 
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                  placeholder="e.g. Broken leg, building collapsed..." 
                  className="w-full bg-[#141C2D] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-red-500/50"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleSubmit}
              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black tracking-widest uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] flex justify-center items-center text-lg mt-4 group"
            >
              <AlertTriangle className="mr-2 group-hover:scale-110 transition-transform" />
              Broadcast SOS to AI Agents
            </button>
            <p className="text-center text-[10px] text-gray-500 mt-4 uppercase tracking-widest font-bold">
              Providing false emergency information is a crime. Use only in real emergencies.
            </p>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
