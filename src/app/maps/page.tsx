"use client";

import dynamic from "next/dynamic";
import { useGeolocation } from "@/hooks/useGeolocation";
import SectionShell from "@/components/common/SectionShell";
import NearbyFinder from "@/components/common/NearbyFinder";
import { getSection } from "@/lib/sections";

const LeafletMap = dynamic(() => import("@/components/common/LeafletMap"), { ssr: false });

const CATEGORIES = [
  { key: "hospitals" as const, label: "Hospitals" },
  { key: "pharmacies" as const, label: "Pharmacies" },
  { key: "police" as const, label: "Police" },
  { key: "fuel" as const, label: "Fuel" },
  { key: "atms" as const, label: "ATMs" },
  { key: "restaurants" as const, label: "Restaurants" },
  { key: "busStops" as const, label: "Bus Stops" },
  { key: "evCharging" as const, label: "EV Charging" },
  { key: "parking" as const, label: "Parking" },
];

export default function MapsPage() {
  const meta = getSection("maps")!;
  const { location } = useGeolocation();

  return (
    <SectionShell title={meta.title} description={meta.description} icon={meta.icon} color={meta.color}>
      {location && (
        <div className="mb-4 overflow-hidden rounded-2xl">
          <LeafletMap center={{ lat: location.latitude, lon: location.longitude }} markers={[]} />
        </div>
      )}
      <NearbyFinder sectionId="maps" categories={CATEGORIES} />
    </SectionShell>
  );
}
