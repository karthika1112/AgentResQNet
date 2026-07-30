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
  nasa: createIcon('orange'),
  quake: createIcon('violet')
};

export const AdminGISMap = React.memo(() => {
  const [incidents, setIncidents] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);
  const [nasaEvents, setNasaEvents] = useState([]);
  const [earthquakes, setEarthquakes] = useState([]);
  
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
        const [nasaRes, usgsRes] = await Promise.all([
          fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=200').then(r => r.json()).catch(() => ({ events: [] })),
          fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson').then(r => r.json()).catch(() => ({ features: [] }))
        ]);
        
        if (nasaRes.events) setNasaEvents(nasaRes.events);
        if (usgsRes.features) setEarthquakes(usgsRes.features);
        
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
          <div className="flex items-center text-orange-500"><div className="w-3 h-3 rounded-full bg-orange-500 mr-2 shadow-[0_0_10px_orange]"></div> NASA Satellite Events</div>
          <div className="flex items-center text-purple-400"><div className="w-3 h-3 rounded-full bg-violet-500 mr-2 shadow-[0_0_10px_purple]"></div> USGS Earthquakes (M4.5+)</div>
        </div>
      </div>

      <MapContainer 
        center={centerPosition} 
        zoom={incidents.length > 0 ? 10 : 2} 
        style={{ height: '100%', width: '100%', background: '#0F1523' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO | Data: NASA EONET, USGS'
        />

        {/* NASA EONET Events (Wildfires, Storms, Volcanoes, Floods) */}
        {nasaEvents.map(event => {
          if (!event.geometry || event.geometry.length === 0) return null;
          const coords = event.geometry[0].coordinates;
          const lat = coords[1];
          const lng = coords[0];
          
          const categoryName = event.categories.map(c => c.title).join(', ');
          let categoryEmoji = '🛰️';
          if (categoryName.toLowerCase().includes('fire')) categoryEmoji = '🔥';
          else if (categoryName.toLowerCase().includes('flood')) categoryEmoji = '🌊';
          else if (categoryName.toLowerCase().includes('storm')) categoryEmoji = '🌪️';
          else if (categoryName.toLowerCase().includes('volcano')) categoryEmoji = '🌋';
          else if (categoryName.toLowerCase().includes('ice')) categoryEmoji = '🧊';
          
          return (
            <React.Fragment key={event.id}>
              <Marker position={[lat, lng]} icon={icons.nasa}>
                <Popup className="custom-popup">
                  <div className="font-sans min-w-[200px]">
                    <strong className="text-orange-500 block text-sm mb-1 uppercase tracking-wider">{categoryEmoji} NASA Satellite Data</strong>
                    <div className="text-xs space-y-1 mt-2 border-t pt-2">
                      <p><strong>🚨 Event:</strong> {event.title}</p>
                      <p><strong>🏷️ Category:</strong> {categoryName}</p>
                      <p><strong>🕒 Time:</strong> {new Date(event.geometry[0].date).toLocaleString()}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

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
                    <strong className="text-purple-500 block text-sm mb-1 uppercase tracking-wider">USGS Seismograph</strong>
                    <div className="text-xs space-y-1 mt-2 border-t pt-2">
                      <p><strong>📍 Place:</strong> {quake.properties.place}</p>
                      <p><strong>⚠️ Magnitude:</strong> <span className="font-bold text-red-500">{mag}</span></p>
                      <p><strong>🕒 Time:</strong> {new Date(quake.properties.time).toLocaleString()}</p>
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
