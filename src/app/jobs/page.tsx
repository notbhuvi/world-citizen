"use client";

import SectionShell from "@/components/common/SectionShell";
import GuidedSearchSection, { type GuidedTopic } from "@/components/common/GuidedSearchSection";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getSection } from "@/lib/sections";

const TOPICS: GuidedTopic[] = [
  { id: "govt-jobs", title: "Government Jobs", description: "Current public-sector vacancies.", searchTerms: "government job vacancies official" },
  { id: "private-jobs", title: "Private Jobs", description: "Job boards for private-sector roles.", searchTerms: "job vacancies private sector" },
  { id: "internships", title: "Internships", description: "Internship opportunities for students.", searchTerms: "internship opportunities" },
  { id: "skill-dev", title: "Skill Development Programs", description: "Government-backed training programs.", searchTerms: "skill development training program" },
  { id: "career-guidance", title: "Career Guidance", description: "Career counselling resources.", searchTerms: "career guidance counselling" },
];

export default function JobsPage() {
  const meta = getSection("jobs")!;
  const { location } = useGeolocation();
  return (
    <SectionShell title={meta.title} description={meta.description} icon={meta.icon} color={meta.color}>
      <GuidedSearchSection sectionId="jobs" topics={TOPICS} countryName={location?.country} />
    </SectionShell>
  );
}
