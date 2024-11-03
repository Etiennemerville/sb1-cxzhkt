import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { FoodTruck } from '../types';

interface MapProps {
  trucks: FoodTruck[];
  selectedTruck: FoodTruck | null;
  setSelectedTruck: (truck: FoodTruck | null) => void;
  startCoords: [number, number] | null;
}

// Routing control component
const RoutingControl = ({ start, end }: { start: [number, number]; end: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: '#6366f1', weight: 6 }]
      }
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end]);

  return null;
};

const Map = ({ trucks, selectedTruck, setSelectedTruck, startCoords }: MapProps) => {
  const customIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  return (
    <MapContainer
      center={[48.8156, 1.6442]}
      zoom={11}
      className="w-full h-[500px] rounded-lg shadow-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {trucks.map((truck) => (
        <Marker
          key={truck.id}
          position={truck.coordinates}
          icon={customIcon}
          eventHandlers={{
            click: () => setSelectedTruck(truck),
          }}
        >
          <Popup>
            <div className="p-2">
              <img
                src={truck.imageUrl}
                alt={truck.name}
                className="w-32 h-24 object-cover rounded-lg mb-2"
              />
              <h3 className="font-bold">{truck.name}</h3>
              <p>{truck.description}</p>
              <p className="text-sm text-gray-600">{truck.schedule}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      {startCoords && selectedTruck && (
        <RoutingControl
          start={startCoords}
          end={selectedTruck.coordinates}
        />
      )}
    </MapContainer>
  );
};

export default Map;