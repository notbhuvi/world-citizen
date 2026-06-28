"use client";

import { ExternalLink, Bot } from "lucide-react";
import { useState } from "react";
import GlassCard from "./GlassCard";
import SearchBar from "./SearchBar";
import BookmarkButton from "./BookmarkButton";
import { useAiApp } from "../layout/AiAppProvider";

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
  const { research, selectedApp } = useAiApp();
  const filtered = topics.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));

  const scopedQuery = (topic: GuidedTopic) =>
    countryName ? `${countryName} ${topic.searchTerms}` : topic.searchTerms;

  const searchUrl = (topic: GuidedTopic) => `https://www.google.com/search?q=${encodeURIComponent(scopedQuery(topic))}`;

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
              <BookmarkButton
                record={{ id: `${sectionId}-${topic.id}`, section: sectionId, title: topic.title, subtitle: topic.description }}
              />
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => research(`Research this for me: ${scopedQuery(topic)}`)}
                className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-white"
              >
                <Bot size={11} /> Ask {selectedApp?.name ?? "AI"}
              </button>
              <a
                href={searchUrl(topic)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium text-muted dark:bg-white/10"
              >
                <ExternalLink size={11} /> Web search
              </a>
            </div>
          </GlassCard>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-muted">
        These are guided pointers — rules vary by country and change often, so always confirm with an official source.
      </p>
    </div>
  );
}
