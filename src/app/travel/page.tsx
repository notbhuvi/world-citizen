"use client";

import { useState } from "react";
import SectionShell from "@/components/common/SectionShell";
import FilterChips from "@/components/common/FilterChips";
import GuidedSearchSection, { type GuidedTopic } from "@/components/common/GuidedSearchSection";
import NearbyFinder from "@/components/common/NearbyFinder";
import WorldClock from "@/components/common/WorldClock";
import PackingChecklist from "@/components/common/PackingChecklist";
import TravelNotes from "@/components/common/TravelNotes";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getSection } from "@/lib/sections";

const TOPICS: GuidedTopic[] = [
  { id: "visa", title: "Visa Information", description: "Entry requirements for your nationality.", searchTerms: "visa requirements entry" },
  { id: "passport-rules", title: "Passport Rules", description: "Validity and entry passport rules.", searchTerms: "passport validity entry rules" },
  { id: "currency-rules", title: "Currency Import/Export Rules", description: "Limits on carrying cash across borders.", searchTerms: "currency import export declaration limit" },
  { id: "time-zone", title: "Time Zone", description: "Current local time zone.", searchTerms: "current time zone" },
  { id: "country-guide", title: "Country Guide", description: "General travel guide and etiquette.", searchTerms: "travel guide tourist information" },
];

const ESSENTIALS_CATEGORIES = [
  { key: "toilets" as const, label: "Public Toilets" },
  { key: "waterRefill" as const, label: "Water Refill" },
  { key: "laundromats" as const, label: "Laundromats" },
];

const TABS = ["Guides", "Attractions", "Embassies", "Essentials", "World Clock", "Checklist", "Notes"];

export default function TravelPage() {
  const meta = getSection("travel")!;
  const { location } = useGeolocation();
  const [tab, setTab] = useState("Guides");

  return (
    <SectionShell title={meta.title} description={meta.description} icon={meta.icon} color={meta.color}>
      <div className="mb-4">
        <FilterChips options={TABS} active={tab} onChange={setTab} />
      </div>
      {tab === "Guides" && <GuidedSearchSection sectionId="travel" topics={TOPICS} countryName={location?.country} />}
      {tab === "Attractions" && (
        <NearbyFinder sectionId="travel-attractions" categories={[{ key: "attractions", label: "Attractions" }]} />
      )}
      {tab === "Embassies" && (
        <NearbyFinder sectionId="travel-embassies" categories={[{ key: "embassies", label: "Embassies" }]} />
      )}
      {tab === "Essentials" && <NearbyFinder sectionId="travel-essentials" categories={ESSENTIALS_CATEGORIES} />}
      {tab === "World Clock" && <WorldClock />}
      {tab === "Checklist" && <PackingChecklist />}
      {tab === "Notes" && <TravelNotes />}
    </SectionShell>
  );
}
