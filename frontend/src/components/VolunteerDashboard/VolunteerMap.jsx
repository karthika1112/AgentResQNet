import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet markers in React
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

const volIcon = createCustomIcon('blue');
const dropIcon = createCustomIcon('red');
const shelterIcon = createCustomIcon('green');

export const VolunteerMap = () => {
  const [position, setPosition] = useState([37.7749, -122.4194]); // SF
  
  // Mock Mission Data
  const missionTarget = [37.7650, -122.4200];
  const supplyShelter = [37.7800, -122.4100];
  
  // Simple straight-line route for visualization
  const route = [supplyShelter, position, missionTarget];

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        () => console.warn('Geolocation denied, using default.')
      );
    }
  }, []);

  return (
    <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden shadow-lg h-full min-h-[350px]">
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%', background: '#0F1523' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />

        {/* Volunteer Location */}
        <Marker position={position} icon={volIcon}>
          <Popup><strong>You are here</strong></Popup>
        </Marker>

        {/* Supply Pickup (Shelter) */}
        <Marker position={supplyShelter} icon={shelterIcon}>
          <Popup><strong>Pickup: Central Shelter</strong></Popup>
        </Marker>

        {/* Mission Drop Zone */}
        <Marker position={missionTarget} icon={dropIcon}>
          <Popup><strong>Drop Zone: Flood Victims</strong></Popup>
        </Marker>

        {/* Navigation Route */}
        <Polyline positions={route} color="#3B82F6" weight={3} dashArray="5, 10" />
      </MapContainer>
    </div>
  );
};
