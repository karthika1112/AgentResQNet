import React, { useState } from 'react';
import { UserCheck, UserX, Award, Package, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export const VolunteerOverview = () => {
  const [isAvailable, setIsAvailable] = useState(true);

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    if (!isAvailable) {
      toast.success('You are now marked as AVAILABLE for missions.');
    } else {
      toast.success('You are now marked as OFFLINE.');
    }
    // In a real app, this would hit a PUT /api/volunteers/status endpoint
  };

  return (
    <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 shadow-lg h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Volunteer Profile</h3>
          
          <button 
            onClick={toggleAvailability}
            className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              isAvailable 
                ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30' 
                : 'bg-gray-700/50 text-gray-400 border-gray-600 hover:bg-gray-700'
            }`}
          >
            {isAvailable ? (
              <><UserCheck size={16} className="mr-2" /> Active (On Duty)</>
            ) : (
              <><UserX size={16} className="mr-2" /> Offline</>
            )}
          </button>
        </div>
        
        <p className="text-sm text-gray-400 mb-6">
          Keep your status active to receive automated resource delivery and support tasks from the Commander Agent.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0B0F19] rounded-lg p-4 border border-[rgba(255,255,255,0.05)] flex flex-col items-center justify-center text-center">
          <Package className="text-blue-400 mb-2" size={24} />
          <span className="text-2xl font-bold text-white">12</span>
          <span className="text-xs text-gray-500 mt-1">Deliveries</span>
        </div>
        <div className="bg-[#0B0F19] rounded-lg p-4 border border-[rgba(255,255,255,0.05)] flex flex-col items-center justify-center text-center">
          <Clock className="text-yellow-400 mb-2" size={24} />
          <span className="text-2xl font-bold text-white">48h</span>
          <span className="text-xs text-gray-500 mt-1">Hours Logged</span>
        </div>
        <div className="bg-[#0B0F19] rounded-lg p-4 border border-[rgba(255,255,255,0.05)] flex flex-col items-center justify-center text-center">
          <Award className="text-purple-400 mb-2" size={24} />
          <span className="text-2xl font-bold text-white">Gold</span>
          <span className="text-xs text-gray-500 mt-1">Rating</span>
        </div>
      </div>
    </div>
  );
};
