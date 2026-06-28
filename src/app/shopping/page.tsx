"use client";

import SectionShell from "@/components/common/SectionShell";
import NearbyFinder from "@/components/common/NearbyFinder";
import { getSection } from "@/lib/sections";

const CATEGORIES = [
  { key: "supermarkets" as const, label: "Supermarkets" },
  { key: "groceries" as const, label: "Grocery" },
  { key: "malls" as const, label: "Malls" },
  { key: "pharmacies" as const, label: "Medical Stores" },
];

export default function ShoppingPage() {
  const meta = getSection("shopping")!;
  return (
    <SectionShell title={meta.title} description={meta.description} icon={meta.icon} color={meta.color}>
      <NearbyFinder sectionId="shopping" categories={CATEGORIES} />
    </SectionShell>
  );
}
