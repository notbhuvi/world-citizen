"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

const userIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#0A84FF;border:3px solid white;box-shadow:0 0 0 2px rgba(10,132,255,0.4)"></div>`,
});

const placeIcon = L.divIcon({
  className: "",
  html: `<div style="width:10px;height:10px;border-radius:50%;background:#FF453A;border:2px solid white"></div>`,
});

function Recenter({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom());
  }, [lat, lon, map]);
  return null;
}

export default function LeafletMap({
  center,
  markers,
}: {
  center: { lat: number; lon: number };
  markers: { id: string; lat: number; lon: number; label: string }[];
}) {
  return (
    <MapContainer
      center={[center.lat, center.lon]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: "240px", width: "100%", borderRadius: "1rem" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter lat={center.lat} lon={center.lon} />
      <Marker position={[center.lat, center.lon]} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>
      {markers.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lon]} icon={placeIcon}>
          <Popup>{m.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
