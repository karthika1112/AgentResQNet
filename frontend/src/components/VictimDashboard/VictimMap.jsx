import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed } from 'lucide-react';

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
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

const userIcon = createCustomIcon('blue');
const shelterIcon = createCustomIcon('green');
const disasterIcon = createCustomIcon('red');

export const VictimMap = () => {
  const [position, setPosition] = useState([37.7749, -122.4194]); // Default SF
  const [hasLocation, setHasLocation] = useState(false);

  // Mock data for step 16 visualization
  const shelters = [
    { id: 1, name: 'Downtown Community Center', lat: 37.78, lng: -122.41, capacity: 'Available' },
    { id: 2, name: 'Westside High School', lat: 37.76, lng: -122.43, capacity: 'Limited' }
  ];

  const disasters = [
    { id: 1, type: 'Flood Warning', lat: 37.77, lng: -122.42, radius: 1000 }
  ];

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setHasLocation(true);
        },
        (err) => {
          console.warn('Geolocation denied or failed:', err.message);
        }
      );
    }
  }, []);

  return (
    <div className="bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden shadow-lg h-[400px] relative">
      {!hasLocation && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-yellow-500/90 text-black px-4 py-2 rounded-full text-xs font-bold flex items-center shadow-lg">
          <LocateFixed size={14} className="mr-2" />
          Location access recommended for precise rescue routing
        </div>
      )}
      
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%', background: '#0F1523' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* User Location */}
        {hasLocation && (
          <Marker position={position} icon={userIcon}>
            <Popup className="custom-popup">
              <strong>Your Location</strong>
            </Popup>
          </Marker>
        )}

        {/* Shelters */}
        {shelters.map(shelter => (
          <Marker key={`shelter-${shelter.id}`} position={[shelter.lat, shelter.lng]} icon={shelterIcon}>
            <Popup>
              <strong>{shelter.name}</strong><br/>
              Status: {shelter.capacity}
            </Popup>
          </Marker>
        ))}

        {/* Disaster Zones */}
        {disasters.map(d => (
          <React.Fragment key={`disaster-${d.id}`}>
            <Marker position={[d.lat, d.lng]} icon={disasterIcon}>
              <Popup><strong>{d.type}</strong></Popup>
            </Marker>
            <Circle 
              center={[d.lat, d.lng]} 
              radius={d.radius} 
              pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }} 
            />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};
