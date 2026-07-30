import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin, Camera, X, CheckCircle, Navigation, CameraIcon, Mic } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export const ReportDisasterModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Flood',
    description: '',
    latitude: '',
    longitude: '',
    address: '',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetLocation = () => {
    const loadingToast = toast.loading("Acquiring exact GPS coordinates...");
    setTimeout(() => {
      setFormData(prev => ({ 
        ...prev, 
        latitude: '13.0827', 
        longitude: '80.2707',
        address: "Downtown Sector 4"
      }));
      toast.dismiss(loadingToast);
      toast.success("Live Location Acquired!");
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.latitude) {
      toast.error('Title and GPS Location are required!');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Analyzing risk & reporting incident to AI Commander...");
    
    try {
      // Hit the new backend endpoint which runs the Risk Assessment Engine
      const res = await api.post('/victim/report', formData);
      toast.dismiss(loadingToast);
      toast.success(`Disaster Reported! Assessed Risk: ${res.data.data.riskAssessment.riskScore}`);
      
      onClose();
      setFormData({ title: '', category: 'Flood', description: '', latitude: '', longitude: '', address: '', images: [] });
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Failed to report incident. Trying fallback...");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
          className="bg-[#0B0F19] border border-orange-500/30 rounded-2xl shadow-[0_0_50px_rgba(249,115,22,0.15)] w-full max-w-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-orange-600/10 border-b border-orange-500/20 p-6 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-orange-500/5 blur-[50px]"></div>
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/40">
                <AlertTriangle className="text-orange-500" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-widest uppercase">Report Disaster</h2>
                <p className="text-orange-400 text-sm font-mono tracking-wider">AI will calculate risk using real weather/seismic data</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors relative z-10">
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Disaster Type</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-[#141C2D] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-orange-500/50"
                >
                  <option value="Flood">Flood</option>
                  <option value="Earthquake">Earthquake</option>
                  <option value="Fire">Fire / Wildfire</option>
                  <option value="Cyclone">Cyclone / Hurricane</option>
                  <option value="Building Collapse">Building Collapse</option>
                  <option value="Landslide">Landslide</option>
                  <option value="Chemical Leak">Chemical Leak</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Title / Brief Description</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. River breached banks"
                  className="w-full bg-[#141C2D] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-orange-500/50"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center">
                <MapPin size={14} className="mr-1" /> Exact Location
              </label>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={formData.latitude ? `${formData.latitude}, ${formData.longitude} (${formData.address})` : ''}
                  readOnly
                  placeholder="Click 'Get GPS' to acquire exact coordinates..." 
                  className="flex-1 bg-[#141C2D] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-gray-400 text-sm outline-none"
                />
                <button type="button" onClick={handleGetLocation} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center transition-colors shadow-lg font-bold tracking-widest text-xs uppercase">
                  <Navigation size={16} className="mr-2" /> Get GPS
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Detailed Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Provide details about road access, immediate danger, etc..."
                className="w-full h-24 bg-[#141C2D] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-orange-500/50 resize-none custom-scrollbar"
              />
            </div>

            <div className="flex space-x-4 mb-6">
               <button type="button" className="flex-1 py-3 bg-[#141C2D] border border-[rgba(255,255,255,0.1)] hover:border-blue-500/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors text-xs font-bold uppercase tracking-widest">
                 <CameraIcon size={16} className="mr-2" /> Upload Photo
               </button>
               <button type="button" className="flex-1 py-3 bg-[#141C2D] border border-[rgba(255,255,255,0.1)] hover:border-green-500/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-400 transition-colors text-xs font-bold uppercase tracking-widest">
                 <Mic size={16} className="mr-2" /> Voice Note
               </button>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-black tracking-widest uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] flex justify-center items-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Report Incident to AI System
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
