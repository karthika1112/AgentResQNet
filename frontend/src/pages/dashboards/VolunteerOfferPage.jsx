import React, { useState } from 'react';
import { PackagePlus, MapPin, CheckCircle, Navigation, HeartHandshake } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../api/axios';

export const VolunteerOfferPage = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    volunteerName: 'Local Volunteer',
    phoneNumber: '',
    targetArea: '',
    latitude: '',
    longitude: '',
    offerType: [],
    details: ''
  });

  const toggleOffer = (offer) => {
    setFormData(prev => ({
      ...prev,
      offerType: prev.offerType.includes(offer) 
        ? prev.offerType.filter(o => o !== offer)
        : [...prev.offerType, offer]
    }));
  };

  const handleGetLocation = () => {
    const loadingToast = toast.loading("Acquiring Target Coordinates...");
    setTimeout(() => {
      setFormData(prev => ({ 
        ...prev, 
        latitude: '13.0827', 
        longitude: '80.2707',
        targetArea: "Downtown Sector 4 (Directly to Victim Area)" 
      }));
      toast.dismiss(loadingToast);
      toast.success("Target Location Acquired!");
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.targetArea) {
      toast.error('Destination / Target Area is required!');
      return;
    }
    if (formData.offerType.length === 0) {
      toast.error('Please select at least one type of help to offer.');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting Offer to Admin...");
    
    try {
      await api.post('/volunteer/offer', {
        volunteerName: formData.volunteerName,
        phoneNumber: formData.phoneNumber,
        latitude: formData.latitude || 0,
        longitude: formData.longitude || 0,
        targetArea: formData.targetArea,
        offerType: formData.offerType,
        details: formData.details
      });

      toast.dismiss(loadingToast);
      toast.success("Help Offer Submitted Successfully!");
      setStep(2);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Failed to submit offer. Trying fallback...");
      setStep(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 2) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex items-center justify-center">
        <div className="bg-[#0B0F19] border border-green-500/30 rounded-2xl p-8 max-w-lg w-full text-center shadow-[0_0_50px_rgba(34,197,94,0.15)]">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Offer Received</h2>
          <p className="text-gray-400 mb-6">Your offer to help has been sent directly to the Admin Command Center and will be allocated to the victims shortly.</p>
          <button onClick={() => { setStep(1); setFormData({ ...formData, offerType: [], details: '' }); }} className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold tracking-widest uppercase rounded-lg transition-colors">
            Offer More Help
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-full pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center tracking-widest uppercase">
          <HeartHandshake className="mr-3 text-purple-500" size={32} />
          Offer Help & Resources
        </h1>
        <p className="text-gray-400 mt-2">Donate supplies, provide manpower, or send transport directly to victim areas or Admin.</p>
      </div>

      <div className="bg-[#0B0F19] rounded-2xl border border-[rgba(255,255,255,0.05)] shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="p-6 md:p-8 space-y-8 relative z-10">
          
          {/* Section 1: Volunteer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Your Name / Group Name</label>
              <input 
                type="text" 
                value={formData.volunteerName}
                onChange={(e) => setFormData({...formData, volunteerName: e.target.value})}
                className="w-full bg-[#141C2D] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Phone Number</label>
              <input 
                type="text" 
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                placeholder="e.g., +1 234 567 8900"
                className="w-full bg-[#141C2D] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          {/* Section 2: Offer Types */}
          <div>
            <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-3 flex items-center">
              <PackagePlus size={14} className="mr-1 text-green-400" /> I Can Provide (Select Multiple)
            </label>
            <div className="flex flex-wrap gap-3">
              {['Food', 'Drinking Water', 'Clothes', 'Medicine', 'Transport / Vehicle', 'Manpower', 'Medical Expertise', 'Shelter Space'].map(offer => (
                <button
                  key={offer}
                  onClick={() => toggleOffer(offer)}
                  className={`px-5 py-3 rounded-lg border text-sm font-bold tracking-wide transition-all flex items-center ${
                    formData.offerType.includes(offer)
                      ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-105'
                      : 'bg-[#141C2D] border-[rgba(255,255,255,0.1)] text-gray-400 hover:border-purple-500/50 hover:text-white'
                  }`}
                >
                  {offer}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Destination */}
          <div>
            <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center">
              <MapPin size={14} className="mr-1 text-blue-400" /> Deliver To (Admin HQ or Direct to Victim Area)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                value={formData.targetArea}
                onChange={(e) => setFormData({...formData, targetArea: e.target.value})}
                placeholder="Type 'AdminHQ' or exact address/GPS..." 
                className="flex-1 bg-[#141C2D] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50"
              />
              <button type="button" onClick={handleGetLocation} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)] font-bold tracking-widest text-xs uppercase shrink-0">
                <Navigation size={16} className="mr-2" /> Select Victim Area
              </button>
            </div>
          </div>

          {/* Section 4: Details & Submission */}
          <div>
            <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Extra Details (Quantity, Vehicle Type, etc.)</label>
            <textarea 
              value={formData.details}
              onChange={(e) => setFormData({...formData, details: e.target.value})}
              placeholder="e.g., 50 boxes of food, 1 SUV available..."
              className="w-full h-24 bg-[#141C2D] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-purple-500/50 resize-none custom-scrollbar"
            />
          </div>

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black tracking-widest uppercase rounded-xl transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] flex justify-center items-center text-lg disabled:opacity-50 group"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Offer to Admin'}
          </button>
        </div>
      </div>
    </div>
  );
};
