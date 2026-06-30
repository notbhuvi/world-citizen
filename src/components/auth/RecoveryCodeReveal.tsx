"use client";

import { useEffect, useState } from "react";
import { KeyRound, Copy, Check } from "lucide-react";
import AuthScreenLayout from "./AuthScreenLayout";
import ConfettiBurst from "../common/ConfettiBurst";

export default function RecoveryCodeReveal({ code, onContinue }: { code: string; onContinue: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    (async () => {
      await Promise.resolve();
      setBurst((b) => b + 1);
    })();
  }, []);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AuthScreenLayout title="Save your recovery code" subtitle="This is the only way to reset your password — we can't recover it for you.">
      <div className="mb-4 flex items-center gap-2 rounded-xl bg-warning/15 px-3 py-2.5 text-xs text-warning">
        <KeyRound size={14} className="shrink-0" />
        There&apos;s no email or server, so this code is the only backup. Write it down or save it in another app now.
      </div>

      <div className="mb-4 flex items-center justify-between rounded-xl bg-black/5 px-4 py-4 dark:bg-white/10">
        <span className="font-mono text-lg font-semibold tracking-wider">{code}</span>
        <button onClick={copy} className="rounded-full p-1.5 text-muted">
          {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
        </button>
      </div>

      <label className="mb-4 flex items-start gap-2 text-xs">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5"
        />
        I&apos;ve saved this code somewhere safe.
      </label>

      <button
        onClick={onContinue}
        disabled={!confirmed}
        className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white disabled:opacity-40"
      >
        Continue
      </button>
      <ConfettiBurst trigger={burst} />
    </AuthScreenLayout>
  );
}
