"use client";

import SectionShell from "@/components/common/SectionShell";
import GuidedSearchSection, { type GuidedTopic } from "@/components/common/GuidedSearchSection";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getSection } from "@/lib/sections";

const TOPICS: GuidedTopic[] = [
  { id: "electricity", title: "Electricity Provider", description: "Pay bills or report outages.", searchTerms: "electricity board pay bill outage" },
  { id: "gas", title: "Gas Supply", description: "Book refills or check connection status.", searchTerms: "gas supply provider booking" },
  { id: "water", title: "Water Supply", description: "Water board contacts and bill payment.", searchTerms: "water board bill payment" },
  { id: "broadband", title: "Broadband / Internet", description: "Providers and outage status.", searchTerms: "broadband internet provider outage" },
  { id: "mobile", title: "Mobile Recharge", description: "Recharge or pay your mobile bill.", searchTerms: "mobile recharge bill payment" },
  { id: "support", title: "Customer Support Numbers", description: "Utility helpline numbers.", searchTerms: "utility customer support helpline" },
];

export default function UtilitiesPage() {
  const meta = getSection("utilities")!;
  const { location } = useGeolocation();
  return (
    <SectionShell title={meta.title} description={meta.description} icon={meta.icon} color={meta.color}>
      <GuidedSearchSection sectionId="utilities" topics={TOPICS} countryName={location?.country} />
    </SectionShell>
  );
}
