"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";
import GlassCard from "./GlassCard";
import SearchBar from "./SearchBar";
import BookmarkButton from "./BookmarkButton";

export interface GuidedTopic {
  id: string;
  title: string;
  description: string;
  searchTerms: string;
}

export default function GuidedSearchSection({
  sectionId,
  topics,
  countryName,
}: {
  sectionId: string;
  topics: GuidedTopic[];
  countryName?: string;
}) {
  const [query, setQuery] = useState("");
  const filtered = topics.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));

  const searchUrl = (topic: GuidedTopic) => {
    const scoped = countryName ? `${countryName} ${topic.searchTerms}` : topic.searchTerms;
    return `https://www.google.com/search?q=${encodeURIComponent(scoped)}`;
  };

  return (
    <div>
      <div className="mb-4">
        <SearchBar placeholder="Search topics..." value={query} onChange={setQuery} />
      </div>
      <div className="space-y-2.5">
        {filtered.map((topic) => (
          <GlassCard key={topic.id}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium">{topic.title}</p>
                <p className="text-xs text-muted">{topic.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={searchUrl(topic)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent"
                >
                  <ExternalLink size={11} /> Find official source
                </a>
                <BookmarkButton
                  record={{ id: `${sectionId}-${topic.id}`, section: sectionId, title: topic.title, subtitle: topic.description }}
                />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-muted">
        These are guided pointers to official sources — rules vary by country and change often, so always confirm with the
        linked authority.
      </p>
    </div>
  );
}
