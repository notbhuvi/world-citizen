"use client";

import SectionShell from "@/components/common/SectionShell";
import NearbyFinder from "@/components/common/NearbyFinder";
import { getSection } from "@/lib/sections";

const CATEGORIES = [
  { key: "restaurants" as const, label: "Restaurants" },
  { key: "cafes" as const, label: "Cafes" },
];

export default function FoodPage() {
  const meta = getSection("food")!;
  return (
    <SectionShell title={meta.title} description={meta.description} icon={meta.icon} color={meta.color}>
      <NearbyFinder sectionId="food" categories={CATEGORIES} />
    </SectionShell>
  );
}
