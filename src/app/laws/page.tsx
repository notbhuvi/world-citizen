"use client";

import SectionShell from "@/components/common/SectionShell";
import GuidedSearchSection, { type GuidedTopic } from "@/components/common/GuidedSearchSection";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getSection } from "@/lib/sections";

const TOPICS: GuidedTopic[] = [
  { id: "traffic-rules", title: "Traffic Rules", description: "Local road rules and speed limits.", searchTerms: "traffic rules speed limit law" },
  { id: "citizen-rights", title: "Citizen Rights", description: "Constitutional and civil rights.", searchTerms: "citizen rights law" },
  { id: "consumer-rights", title: "Consumer Rights", description: "Refunds, warranties, and protections.", searchTerms: "consumer protection rights law" },
  { id: "emergency-laws", title: "Emergency Laws", description: "Rules during declared emergencies.", searchTerms: "emergency law regulations" },
  { id: "local-rules", title: "Local Rules", description: "City or region-specific regulations.", searchTerms: "local bylaws regulations" },
  { id: "fines", title: "Common Fines", description: "Typical fines for common violations.", searchTerms: "common traffic fines penalty" },
];

export default function LawsPage() {
  const meta = getSection("laws")!;
  const { location } = useGeolocation();
  return (
    <SectionShell title={meta.title} description={meta.description} icon={meta.icon} color={meta.color}>
      <GuidedSearchSection sectionId="laws" topics={TOPICS} countryName={location?.country} />
    </SectionShell>
  );
}
