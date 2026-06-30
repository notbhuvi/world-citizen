"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import GlassCard from "./GlassCard";
import { useTravelNotes } from "@/hooks/useTravelNotes";

export default function TravelNotes() {
  const { notes, ready, addNote, removeNote } = useTravelNotes();
  const [draft, setDraft] = useState("");

  if (!ready) return null;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addNote(draft);
              setDraft("");
            }
          }}
          placeholder="Jot a note — confirmation codes, addresses, reminders…"
          className="glass flex-1 rounded-xl px-3 py-2 text-sm outline-none"
        />
        <button
          onClick={() => {
            addNote(draft);
            setDraft("");
          }}
          className="rounded-xl bg-accent px-3 py-2 text-white"
        >
          <Plus size={16} />
        </button>
      </div>

      {notes.length === 0 && <p className="text-sm text-muted">No notes yet — everything you add stays only on this device.</p>}

      <div className="space-y-2">
        {notes.map((note) => (
          <GlassCard key={note.id} className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm">{note.text}</p>
              <p className="mt-1 text-[10px] text-muted">{new Date(note.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={() => removeNote(note.id)} className="text-muted">
              <Trash2 size={14} />
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
