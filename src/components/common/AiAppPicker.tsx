"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, X } from "lucide-react";
import { AI_APPS, type AiAppOption } from "@/lib/aiApps";

export default function AiAppPicker({
  open,
  isFirstRun,
  onChoose,
  onDismiss,
}: {
  open: boolean;
  isFirstRun: boolean;
  onChoose: (app: AiAppOption) => void;
  onDismiss: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isFirstRun ? undefined : onDismiss}
            className="fixed inset-0 z-[60] bg-black/40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="safe-bottom glass fixed inset-x-3 bottom-3 z-[60] rounded-2xl p-5"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {isFirstRun ? "Which AI app do you use?" : "Choose your AI app"}
                  </p>
                  <p className="text-xs text-muted">
                    {isFirstRun
                      ? "World Citizen hands off research questions to it — pick the one you already have."
                      : "Used for research lookups across the app."}
                  </p>
                </div>
              </div>
              {!isFirstRun && (
                <button onClick={onDismiss} className="rounded-full p-1.5 text-muted">
                  <X size={18} />
                </button>
              )}
            </div>
            <div className="space-y-2">
              {AI_APPS.map((app) => (
                <button
                  key={app.id}
                  onClick={() => onChoose(app)}
                  className="flex w-full items-center gap-3 rounded-xl bg-black/5 px-3.5 py-3 text-left text-sm font-medium dark:bg-white/5"
                >
                  <Bot size={16} className="text-accent" />
                  {app.name}
                </button>
              ))}
            </div>
            {isFirstRun && (
              <button onClick={onDismiss} className="mt-3 w-full rounded-xl py-2 text-center text-xs text-muted">
                Skip for now
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
