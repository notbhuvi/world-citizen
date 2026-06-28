"use client";

import SectionShell from "@/components/common/SectionShell";
import GuidedSearchSection, { type GuidedTopic } from "@/components/common/GuidedSearchSection";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getSection } from "@/lib/sections";

const TOPICS: GuidedTopic[] = [
  { id: "citizen-services", title: "Citizen Services Portal", description: "Find your country's central e-government portal.", searchTerms: "official citizen services portal" },
  { id: "tax-deadlines", title: "Tax Deadlines", description: "Income tax filing dates for this year.", searchTerms: "income tax filing deadline" },
  { id: "voting", title: "Voting Information", description: "Voter registration and election dates.", searchTerms: "voter registration election commission" },
  { id: "passport", title: "Passport Services", description: "Apply, renew, or track a passport.", searchTerms: "passport application renewal official" },
  { id: "driving-license", title: "Driving License", description: "Apply or renew your driving license.", searchTerms: "driving license application renewal" },
  { id: "vehicle-registration", title: "Vehicle Registration", description: "Register or transfer vehicle ownership.", searchTerms: "vehicle registration official portal" },
  { id: "courts", title: "Court Services", description: "Case status and court filings.", searchTerms: "court case status official" },
  { id: "municipality", title: "Municipality Services", description: "Local civic services and complaints.", searchTerms: "municipal corporation services" },
  { id: "schemes", title: "Government Schemes & Benefits", description: "Subsidies and welfare programs you may qualify for.", searchTerms: "government schemes benefits subsidies" },
  { id: "notices", title: "Public Notices", description: "Official announcements and notices.", searchTerms: "government public notices" },
];

export default function GovernmentPage() {
  const meta = getSection("government")!;
  const { location } = useGeolocation();
  return (
    <SectionShell title={meta.title} description={meta.description} icon={meta.icon} color={meta.color}>
      <GuidedSearchSection sectionId="government" topics={TOPICS} countryName={location?.country} />
    </SectionShell>
  );
}
