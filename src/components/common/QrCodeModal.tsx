"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import QRCode from "qrcode";

export default function QrCodeModal({
  open,
  title,
  data,
  onClose,
}: {
  open: boolean;
  title: string;
  data: string | null;
  onClose: () => void;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      await Promise.resolve();
      if (!open || !data) {
        setDataUrl(null);
        return;
      }
      try {
        const url = await QRCode.toDataURL(data, { width: 280, margin: 1, color: { dark: "#0A0A0C", light: "#FFFFFF" } });
        setDataUrl(url);
      } catch {
        setDataUrl(null);
      }
    })();
  }, [open, data]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass fixed left-1/2 top-1/2 z-[60] w-[88%] max-w-xs -translate-x-1/2 -translate-y-1/2 rounded-2xl p-5 text-center"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">{title}</p>
              <button onClick={onClose} className="rounded-full p-1.5 text-muted">
                <X size={18} />
              </button>
            </div>
            {dataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dataUrl} alt="QR code" className="mx-auto rounded-xl" width={280} height={280} />
            ) : (
              <div className="mx-auto h-[280px] w-[280px] animate-pulse rounded-xl bg-black/5 dark:bg-white/5" />
            )}
            <p className="mt-3 text-[11px] text-muted">Scan with another phone&apos;s camera to open this instantly.</p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
