import React, { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle, Truck, Package } from 'lucide-react';
import api from '../../api/axios';

export const VictimRequestTracker = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/victim/help-request');
        setRequests(res.data.data.slice(0, 3)); // Only show latest 3 for compact view
      } catch (err) {
        console.error("Failed to fetch requests");
      }
    };
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30';
      case 'Assigned': return 'text-blue-500 bg-blue-500/20 border-blue-500/30';
      case 'Dispatched': return 'text-orange-500 bg-orange-500/20 border-orange-500/30';
      case 'Completed': return 'text-green-500 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-500 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock size={12} className="mr-1" />;
      case 'Assigned': return <Activity size={12} className="mr-1" />;
      case 'Dispatched': return <Truck size={12} className="mr-1" />;
      case 'Completed': return <CheckCircle size={12} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="bg-[#0B0F19] rounded-2xl border border-[rgba(255,255,255,0.05)] p-5 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center">
          <Activity size={16} className="text-blue-500 mr-2" /> Request Tracker
        </h3>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-xs font-mono">No active help requests.</div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req._id} className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{req.requestId}</p>
                  <h4 className="text-sm font-bold text-white tracking-wide">{req.helpType.join(', ')}</h4>
                </div>
                <span className={`px-2 py-1 border text-[9px] font-black tracking-widest uppercase rounded flex items-center ${getStatusColor(req.status)}`}>
                  {getStatusIcon(req.status)} {req.status}
                </span>
              </div>
              
              {/* Progress Bar UI */}
              <div className="relative pt-4">
                <div className="overflow-hidden h-1 mb-4 text-xs flex rounded bg-gray-800">
                  <div style={{ width: req.status === 'Pending' ? '25%' : req.status === 'Assigned' ? '50%' : req.status === 'Dispatched' ? '75%' : '100%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-1000"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
