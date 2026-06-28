"use client";

import SectionShell from "@/components/common/SectionShell";
import NearbyFinder from "@/components/common/NearbyFinder";
import { getSection } from "@/lib/sections";

const CATEGORIES = [
  { key: "hospitals" as const, label: "Hospitals" },
  { key: "clinics" as const, label: "Clinics" },
  { key: "pharmacies" as const, label: "Pharmacies" },
  { key: "dentists" as const, label: "Dentists" },
];

export default function HealthPage() {
  const meta = getSection("health")!;
  return (
    <SectionShell title={meta.title} description={meta.description} icon={meta.icon} color={meta.color}>
      <NearbyFinder sectionId="health" categories={CATEGORIES} />
    </SectionShell>
  );
}
