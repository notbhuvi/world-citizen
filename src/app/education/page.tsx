"use client";

import SectionShell from "@/components/common/SectionShell";
import NearbyFinder from "@/components/common/NearbyFinder";
import { getSection } from "@/lib/sections";

const CATEGORIES = [
  { key: "schools" as const, label: "Schools" },
  { key: "universities" as const, label: "Universities" },
  { key: "libraries" as const, label: "Libraries" },
];

export default function EducationPage() {
  const meta = getSection("education")!;
  return (
    <SectionShell title={meta.title} description={meta.description} icon={meta.icon} color={meta.color}>
      <NearbyFinder sectionId="education" categories={CATEGORIES} />
    </SectionShell>
  );
}
