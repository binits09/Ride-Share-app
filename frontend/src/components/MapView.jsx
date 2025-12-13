import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Polyline } from "react-leaflet";
import L from "leaflet";




const dropoffIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const MapView = ({ position, route, pickup, dropoff }) => {
  return (
    <MapContainer
      center={position}
      zoom={13}
      className="h-full w-full"
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position}>
        <Popup>Pickup location</Popup>
      </Marker>

      {route && route.length > 0 && (
  <Polyline
    positions={route.map(([lon, lat]) => [lat, lon])}
    color="black"
    weight={4}
  />
)}




{dropoff && (
  <Marker position={dropoff} icon={dropoffIcon}>
    <Popup>Dropoff</Popup>
  </Marker>
)}


    </MapContainer>
  );
};

export default MapView;
