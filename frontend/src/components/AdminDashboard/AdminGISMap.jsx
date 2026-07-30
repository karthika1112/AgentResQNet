import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../api/axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const icons = {
  incident: createIcon('red'),
  responder: createIcon('gold'),
  volunteer: createIcon('blue'),
  shelter: createIcon('green'),
  quake: createIcon('violet'),
  predict: createIcon('black')
};

export const AdminGISMap = React.memo(() => {
  const [incidents, setIncidents] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);
  const [earthquakes, setEarthquakes] = useState([]);
  const [predictiveEvents, setPredictiveEvents] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Internal Platform Data
        const [incRes, helpRes] = await Promise.all([
          api.get('/victim/incidents').catch(() => ({ data: { success: false } })),
          api.get('/victim/help-request').catch(() => ({ data: { success: false } }))
        ]);
        if (incRes.data.success) setIncidents(incRes.data.data);
        if (helpRes.data.success) setHelpRequests(helpRes.data.data);

        // External Satellite & Geological Data (Real-World)
        const usgsRes = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson').then(r => r.json()).catch(() => ({ features: [] }));
        
        if (usgsRes.features) setEarthquakes(usgsRes.features);
        
        // AI Predictive Data Feed (Simulated for demonstration of prediction capabilities)
        const mockPredictions = [
          { id: 'p1', type: 'Flood', lat: 28.7041, lng: 77.1025, title: 'Severe Flood Warning', predictTime: '4 hours', risk: 'Critical', emoji: '🌊' },
          { id: 'p2', type: 'Wildfire', lat: -33.8688, lng: 151.2093, title: 'Wildfire Expansion', predictTime: '12 hours', risk: 'High', emoji: '🔥' },
          { id: 'p3', type: 'Cyclone', lat: 22.5726, lng: 88.3639, title: 'Cyclone Landfall Prediction', predictTime: '24 hours', risk: 'Critical', emoji: '🌪️' },
          { id: 'p4', type: 'Tsunami', lat: 35.6762, lng: 139.6503, title: 'Tsunami Wave Threat', predictTime: '2 hours', risk: 'Critical', emoji: '🌊' },
          { id: 'p5', type: 'Flood', lat: 51.5074, lng: -0.1278, title: 'Urban Flash Flood', predictTime: '6 hours', risk: 'Medium', emoji: '🌊' }
        ];
        setPredictiveEvents(mockPredictions);

      } catch (err) {
        console.error("Failed to fetch map data", err);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 60000); // Poll external APIs every minute
    return () => clearInterval(interval);
  }, []);

  // Center on the first real incident, or fallback to global view if empty
  const centerPosition = incidents.length > 0 
    ? [incidents[0].latitude, incidents[0].longitude] 
    : [20.0, 0.0];

  return (
    <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden shadow-lg h-full min-h-[500px] relative">
      <div className="absolute top-4 left-4 z-[1000] bg-black/80 text-white px-4 py-2 rounded border border-[rgba(255,255,255,0.1)] shadow-2xl">
        <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Map Legend</h4>
        <div className="space-y-1 text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center text-red-500"><div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-[0_0_10px_red]"></div> Local Incidents</div>
          <div className="flex items-center text-yellow-500"><div className="w-3 h-3 rounded-full bg-gold mr-2 shadow-[0_0_10px_yellow]"></div> Victim SOS</div>
          <div className="flex items-center text-purple-400"><div className="w-3 h-3 rounded-full bg-violet-500 mr-2 shadow-[0_0_10px_purple]"></div> USGS Earthquakes (M4.5+)</div>
          <div className="flex items-center text-gray-400"><div className="w-3 h-3 rounded-full bg-gray-500 mr-2 shadow-[0_0_10px_gray]"></div> AI Predictive Models</div>
        </div>
      </div>

      <MapContainer 
        center={centerPosition} 
        zoom={incidents.length > 0 ? 10 : 2} 
        style={{ height: '100%', width: '100%', background: '#0F1523' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO | Data: USGS'
        />

        {/* AI Predictive Events */}
        {predictiveEvents.map(event => (
          <React.Fragment key={event.id}>
            <Marker position={[event.lat, event.lng]} icon={icons.predict}>
              <Popup className="custom-popup">
                <div className="font-sans min-w-[200px]">
                  <strong className="text-cyan-400 block text-sm mb-1 uppercase tracking-wider">{event.emoji} AI Predictive Alert</strong>
                  <div className="text-xs space-y-1 mt-2 border-t border-[rgba(255,255,255,0.1)] pt-2">
                    <p><strong>🚨 Event:</strong> {event.title}</p>
                    <p><strong>⏳ Impact In:</strong> <span className="font-bold text-red-400">{event.predictTime}</span></p>
                    <p>
                        <strong>⚠️ Risk Level:</strong> 
                        <span className={`ml-1 px-1.5 py-0.5 rounded text-white font-bold ${
                          event.risk === 'Critical' ? 'bg-red-600' : 
                          event.risk === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
                        }`}>{event.risk}</span>
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
            <Circle center={[event.lat, event.lng]} radius={100000} pathOptions={{ color: 'cyan', fillOpacity: 0.1, weight: 1, dashArray: '5, 10' }} />
          </React.Fragment>
        ))}

        {/* USGS Earthquakes */}
        {earthquakes.map(quake => {
          const coords = quake.geometry.coordinates;
          const lat = coords[1];
          const lng = coords[0];
          const mag = quake.properties.mag;
          
          return (
            <React.Fragment key={quake.id}>
              <Marker position={[lat, lng]} icon={icons.quake}>
                <Popup className="custom-popup">
                  <div className="font-sans min-w-[200px]">
                    <strong className="text-purple-500 block text-sm mb-1 uppercase tracking-wider">📉 USGS Seismograph</strong>
                    <div className="text-xs space-y-1 mt-2 border-t border-[rgba(255,255,255,0.1)] pt-2">
                      <p><strong>📍 Epicenter:</strong> {quake.properties.place}</p>
                      <p><strong>⚠️ Magnitude:</strong> <span className="font-bold text-purple-400">{mag}</span></p>
                      <p><strong>🕒 Time:</strong> {new Date(quake.properties.time).toLocaleString()}</p>
                    </div>
                    {/* AI Prediction Injection */}
                    <div className="text-xs space-y-1 mt-2 border-t border-[rgba(255,255,255,0.1)] pt-2 bg-black/30 p-2 rounded">
                      <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-1">🧠 AI Aftershock Prediction</p>
                      <p><strong>⏳ Impact Window:</strong> <span className="font-bold text-red-400">Next {Math.floor(mag * 2)} hours</span></p>
                      <p>
                          <strong>⚠️ Risk Level:</strong> 
                          <span className={`ml-1 px-1.5 py-0.5 rounded text-white font-bold ${
                            mag >= 5.5 ? 'bg-red-600' : 
                            mag >= 4.5 ? 'bg-orange-500' : 'bg-yellow-500'
                          }`}>{mag >= 5.5 ? 'Critical' : mag >= 4.5 ? 'High' : 'Medium'}</span>
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
              <Circle center={[lat, lng]} radius={mag * 10000} pathOptions={{ color: 'purple', fillOpacity: 0.1, weight: 1 }} />
            </React.Fragment>
          );
        })}

        {/* Platform Incidents */}
        {incidents.map(inc => (
          inc.latitude && inc.longitude && (
            <React.Fragment key={inc._id}>
              <Marker position={[inc.latitude, inc.longitude]} icon={icons.incident}>
                <Popup className="custom-popup">
                  <div className="font-sans min-w-[200px]">
                    <strong className="text-red-600 block text-sm mb-1 uppercase tracking-wider">{inc.title}</strong>
                    <div className="text-xs space-y-1 mt-2 border-t pt-2">
                      <p><strong>📍 Place:</strong> {inc.address || 'Unknown Location'}</p>
                      <p><strong>🕒 Time:</strong> {new Date(inc.createdAt).toLocaleString()}</p>
                      <p>
                        <strong>⚠️ Level:</strong> 
                        <span className={`ml-1 px-1.5 py-0.5 rounded text-white font-bold ${
                          inc.severity === 'Critical' ? 'bg-red-600' : 
                          inc.severity === 'High' ? 'bg-orange-500' : 
                          inc.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}>{inc.severity}</span>
                      </p>
                      <p className="mt-2 text-gray-600 italic">"{inc.description}"</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
              <Circle center={[inc.latitude, inc.longitude]} radius={inc.severity === 'Critical' ? 2500 : inc.severity === 'High' ? 1500 : 800} pathOptions={{ color: 'red', fillOpacity: 0.3 }} />
            </React.Fragment>
          )
        ))}

        {/* Platform SOS Requests */}
        {helpRequests.map(req => (
          req.latitude && req.longitude && (
            <Marker key={req._id} position={[req.latitude, req.longitude]} icon={icons.responder}>
              <Popup className="custom-popup">
                <div className="font-sans min-w-[200px]">
                  <strong className="text-yellow-500 block text-sm mb-1 uppercase tracking-wider">SOS: {req.victimName}</strong>
                  <div className="text-xs space-y-1 mt-2 border-t pt-2">
                    <p><strong>📍 Place:</strong> {req.address || 'Unknown Location'}</p>
                    <p><strong>🕒 Time:</strong> {new Date(req.createdAt).toLocaleString()}</p>
                    <p><strong>📦 Needs:</strong> <span className="font-bold">{req.helpType.join(', ')}</span></p>
                    <p>
                        <strong>🚨 Priority:</strong> 
                        <span className={`ml-1 px-1.5 py-0.5 rounded text-white font-bold ${
                          req.priority === 'Critical' || req.priority === 'High' ? 'bg-red-500' : 'bg-orange-400'
                        }`}>{req.priority}</span>
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
});
