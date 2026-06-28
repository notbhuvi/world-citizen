"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MapPin, X } from "lucide-react";
import { MAP_APPS, openInMapApp, type MapDestination } from "@/lib/mapApps";

export default function MapAppChooser({
  destination,
  onClose,
}: {
  destination: MapDestination | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {destination && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="safe-bottom glass fixed inset-x-3 bottom-3 z-50 rounded-2xl p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Open in Maps</p>
                <p className="text-xs text-muted">{destination.label}</p>
              </div>
              <button onClick={onClose} className="rounded-full p-1.5 text-muted">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2">
              {MAP_APPS.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    openInMapApp(app, destination);
                    onClose();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl bg-black/5 px-3.5 py-3 text-left text-sm font-medium dark:bg-white/5"
                >
                  <MapPin size={16} className="text-accent" />
                  {app.name}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
