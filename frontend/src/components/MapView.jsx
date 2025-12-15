import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";

import L from "leaflet";
import { useEffect } from "react";

const dropoffIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const FitBounds = ({ route, pickup, dropoff }) => {
  const map = useMap();

  useEffect(() => {
    if (route && route.length > 0) {
      map.fitBounds(route, { padding: [60, 60] });
    }
  }, [route, map]);

  return null;
};

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

      {/* THIS IS THE MAGIC */}
      <FitBounds route={route} pickup={pickup} dropoff={dropoff} />

      {pickup && (
        <Marker position={pickup}>
          <Popup>Pickup</Popup>
        </Marker>
      )}

      {route && route.length > 0 && (
        <Polyline positions={route} color="black" weight={4} />
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
