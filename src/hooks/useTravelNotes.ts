"use client";

import { useCallback, useEffect, useState } from "react";
import { getSetting, setSetting } from "@/lib/db";

export interface TravelNote {
  id: string;
  text: string;
  createdAt: number;
}

const KEY = "travel_notes";

export function useTravelNotes() {
  const [notes, setNotesState] = useState<TravelNote[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getSetting<TravelNote[]>(KEY, []).then((value) => {
      setNotesState(value);
      setReady(true);
    });
  }, []);

  const addNote = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      setNotesState((prev) => {
        const next = [{ id: crypto.randomUUID(), text: text.trim(), createdAt: Date.now() }, ...prev];
        setSetting(KEY, next);
        return next;
      });
    },
    []
  );

  const removeNote = useCallback((id: string) => {
    setNotesState((prev) => {
      const next = prev.filter((n) => n.id !== id);
      setSetting(KEY, next);
      return next;
    });
  }, []);

  return { notes, ready, addNote, removeNote };
}
