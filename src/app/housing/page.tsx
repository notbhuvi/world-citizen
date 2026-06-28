"use client";

import SectionShell from "@/components/common/SectionShell";
import NearbyFinder from "@/components/common/NearbyFinder";
import { getSection } from "@/lib/sections";

const CATEGORIES = [{ key: "realEstate" as const, label: "Real Estate Agents" }];

export default function HousingPage() {
  const meta = getSection("housing")!;
  return (
    <SectionShell title={meta.title} description={meta.description} icon={meta.icon} color={meta.color}>
      <p className="mb-4 text-xs text-muted">
        Property listings require a licensed real-estate data provider. Showing nearby agents you can contact directly from OpenStreetMap data.
      </p>
      <NearbyFinder sectionId="housing" categories={CATEGORIES} />
    </SectionShell>
  );
}
