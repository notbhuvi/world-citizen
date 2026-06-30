"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import AuthScreenLayout from "./AuthScreenLayout";
import type { UseAuthReturn } from "@/hooks/useAuth";

export default function RecoveryScreen({
  auth,
  onBack,
  onReset,
}: {
  auth: UseAuthReturn;
  onBack: () => void;
  onReset: (newRecoveryCode: string) => void;
}) {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    if (!code.trim()) {
      setError("Enter your recovery code.");
      return;
    }
    if (password.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    const newRecoveryCode = await auth.resetWithRecoveryCode(code, password);
    setLoading(false);
    if (!newRecoveryCode) {
      setError("That recovery code doesn't match.");
      return;
    }
    onReset(newRecoveryCode);
  };

  return (
    <AuthScreenLayout title="Reset your password" subtitle="Enter the recovery code you saved at signup.">
      <div className="space-y-3">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
          className="glass w-full rounded-xl px-3.5 py-3 text-center font-mono text-sm uppercase outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password (min. 6 characters)"
          className="glass w-full rounded-xl px-3.5 py-3 text-sm outline-none"
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm new password"
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="glass w-full rounded-xl px-3.5 py-3 text-sm outline-none"
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Resetting…" : "Reset password"}
        </button>
        <button onClick={onBack} className="flex w-full items-center justify-center gap-1 text-xs text-muted">
          <ArrowLeft size={12} /> Back to login
        </button>
      </div>
    </AuthScreenLayout>
  );
}
