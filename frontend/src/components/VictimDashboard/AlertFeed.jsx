import React, { useState, useEffect } from 'react';
import { AlertCircle, Info, CloudLightning } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import api from '../../api/axios';

export const AlertFeed = () => {
  const [alerts, setAlerts] = useState([
    { id: '1', type: 'warning', message: 'Severe weather alert issued for your region.', timestamp: new Date() }
  ]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get('/disaster/active');
        if (res.data.success && res.data.data.length > 0) {
          const fetchedAlerts = res.data.data.map(d => ({
            id: d._id,
            type: d.severity === 'Critical' ? 'danger' : 'warning',
            message: `${d.type} detected: ${d.description}`,
            timestamp: new Date(d.reportedAt)
          }));
          setAlerts(prev => [...fetchedAlerts, ...prev].slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch alerts", error);
      }
    };
    
    fetchAlerts();

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.on('incident_verified', (data) => {
      const newAlert = {
        id: Date.now().toString(),
        type: data.incident.severity === 'Critical' ? 'danger' : 'warning',
        message: `New verified incident: ${data.incident.type} near your location.`,
        timestamp: new Date()
      };
      setAlerts(prev => [newAlert, ...prev].slice(0, 5));
    });

    return () => socket.disconnect();
  }, []);

  const getAlertStyle = (type) => {
    switch (type) {
      case 'danger': return 'bg-red-500/10 border-red-500/30 text-red-200';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200';
      default: return 'bg-blue-500/10 border-blue-500/30 text-blue-200';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'danger': return <AlertCircle size={16} className="text-red-400 mt-0.5 mr-2 flex-shrink-0" />;
      case 'warning': return <CloudLightning size={16} className="text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />;
      default: return <Info size={16} className="text-blue-400 mt-0.5 mr-2 flex-shrink-0" />;
    }
  };

  return (
    <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 shadow-lg h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">Live Alert Feed</h3>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
        <AnimatePresence>
          {alerts.length === 0 ? (
            <div className="text-gray-500 text-sm italic text-center mt-4">No active alerts in your area.</div>
          ) : (
            alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg border flex items-start text-sm ${getAlertStyle(alert.type)}`}
              >
                {getAlertIcon(alert.type)}
                <div>
                  <p>{alert.message}</p>
                  <span className="text-[10px] opacity-60 mt-1 block">
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
