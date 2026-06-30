"use client";

import { useCallback, useEffect, useState } from "react";
import { getSetting, setSetting } from "@/lib/db";

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

const KEY = "packing_checklist";

const DEFAULT_ITEMS: ChecklistItem[] = [
  "Passport / ID",
  "Visa documents",
  "Travel insurance",
  "Phone charger",
  "Power adapter",
  "Medications",
  "Toiletries",
  "Weather-appropriate clothing",
  "Local currency / cards",
  "Emergency contacts saved",
].map((label, i) => ({ id: `default-${i}`, label, checked: false }));

export function usePackingChecklist() {
  const [items, setItemsState] = useState<ChecklistItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getSetting<ChecklistItem[] | null>(KEY, null).then((stored) => {
      setItemsState(stored ?? DEFAULT_ITEMS);
      setReady(true);
    });
  }, []);

  const persist = useCallback((next: ChecklistItem[]) => {
    setItemsState(next);
    setSetting(KEY, next);
  }, []);

  const toggleItem = useCallback(
    (id: string) => {
      persist(items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
    },
    [items, persist]
  );

  const addItem = useCallback(
    (label: string) => {
      if (!label.trim()) return;
      persist([...items, { id: crypto.randomUUID(), label: label.trim(), checked: false }]);
    },
    [items, persist]
  );

  const removeItem = useCallback(
    (id: string) => {
      persist(items.filter((i) => i.id !== id));
    },
    [items, persist]
  );

  const resetChecks = useCallback(() => {
    persist(items.map((i) => ({ ...i, checked: false })));
  }, [items, persist]);

  return { items, ready, toggleItem, addItem, removeItem, resetChecks };
}
