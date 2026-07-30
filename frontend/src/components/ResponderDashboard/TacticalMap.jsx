import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const responderIcon = createCustomIcon('gold');
const victimIcon = createCustomIcon('red');
const shelterIcon = createCustomIcon('green');

export const TacticalMap = () => {
  const [position, setPosition] = useState([37.7749, -122.4194]); 
  
  const victimLocation = [37.7550, -122.4250];
  const medEvacShelter = [37.7800, -122.4100];
  
  const routeToVictim = [position, victimLocation];
  const routeToShelter = [victimLocation, medEvacShelter];

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        () => console.warn('Geolocation denied, using default.')
      );
    }
  }, []);

  return (
    <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden shadow-lg h-full min-h-[350px] relative">
      <div className="absolute top-4 right-4 z-[1000] bg-black/80 text-white px-3 py-1.5 rounded text-xs font-mono border border-[rgba(255,255,255,0.1)]">
        LIVE GIS FEED
      </div>
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%', background: '#0F1523' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />

        <Marker position={position} icon={responderIcon}>
          <Popup><strong>Unit Alpha-1 (You)</strong></Popup>
        </Marker>

        <Marker position={victimLocation} icon={victimIcon}>
          <Popup><strong>SOS Target: Critical Injury</strong></Popup>
        </Marker>

        <Marker position={medEvacShelter} icon={shelterIcon}>
          <Popup><strong>MedEvac Zone</strong></Popup>
        </Marker>

        <Polyline positions={routeToVictim} color="#EF4444" weight={4} dashArray="10, 10" />
        <Polyline positions={routeToShelter} color="#10B981" weight={3} dashArray="5, 5" opacity={0.5} />
      </MapContainer>
    </div>
  );
};
