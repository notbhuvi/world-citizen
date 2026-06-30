"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Plus, RotateCcw, Trash2, PartyPopper } from "lucide-react";
import { usePackingChecklist } from "@/hooks/usePackingChecklist";
import ConfettiBurst from "./ConfettiBurst";

export default function PackingChecklist() {
  const { items, ready, toggleItem, addItem, removeItem, resetChecks } = usePackingChecklist();
  const [draft, setDraft] = useState("");
  const [burst, setBurst] = useState(0);

  if (!ready) return null;

  const checkedCount = items.filter((i) => i.checked).length;
  const allPacked = items.length > 0 && checkedCount === items.length;

  const handleToggle = (id: string) => {
    const willBeChecked = !items.find((i) => i.id === id)?.checked;
    toggleItem(id);
    const nextCheckedCount = checkedCount + (willBeChecked ? 1 : -1);
    if (willBeChecked && items.length > 0 && nextCheckedCount === items.length) {
      setBurst((b) => b + 1);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs text-muted">
          {checkedCount} / {items.length} packed
          {allPacked && <PartyPopper size={13} className="text-warning" />}
        </p>
        <button onClick={resetChecks} className="flex items-center gap-1 text-[11px] text-muted">
          <RotateCcw size={11} /> Reset
        </button>
      </div>

      <div className="mb-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addItem(draft);
              setDraft("");
            }
          }}
          placeholder="Add an item…"
          className="glass flex-1 rounded-xl px-3 py-2 text-sm outline-none"
        />
        <button
          onClick={() => {
            addItem(draft);
            setDraft("");
          }}
          className="rounded-xl bg-accent px-3 py-2 text-white"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.id} className="glass flex items-center justify-between rounded-xl px-3 py-2.5">
            <button onClick={() => handleToggle(item.id)} className="flex flex-1 items-center gap-2.5 text-left text-sm">
              <motion.span
                animate={item.checked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  item.checked ? "border-accent bg-accent text-white" : "border-black/20 dark:border-white/20"
                }`}
              >
                {item.checked && <Check size={12} />}
              </motion.span>
              <span className={item.checked ? "text-muted line-through" : ""}>{item.label}</span>
            </button>
            <button onClick={() => removeItem(item.id)} className="text-muted">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
      <ConfettiBurst trigger={burst} />
    </div>
  );
}
