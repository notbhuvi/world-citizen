"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import AuthScreenLayout from "./AuthScreenLayout";
import type { UseAuthReturn } from "@/hooks/useAuth";

export default function SignupScreen({
  auth,
  onSignedUp,
}: {
  auth: UseAuthReturn;
  onSignedUp: (recoveryCode: string) => void;
}) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    if (!name.trim()) {
      setError("Tell us what to call you.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    const recoveryCode = await auth.signup(name, password);
    setLoading(false);
    onSignedUp(recoveryCode);
  };

  return (
    <AuthScreenLayout title="Create your account" subtitle="Stored only on this device — nothing is sent anywhere.">
      <div className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="glass w-full rounded-xl px-3.5 py-3 text-sm outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min. 6 characters)"
          className="glass w-full rounded-xl px-3.5 py-3 text-sm outline-none"
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm password"
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="glass w-full rounded-xl px-3.5 py-3 text-sm outline-none"
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        <button
          onClick={submit}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          <ShieldCheck size={16} />
          {loading ? "Creating…" : "Create account"}
        </button>
      </div>
      <p className="mt-4 text-center text-[11px] text-muted">
        No email, no server — your password is hashed and kept only in this app&apos;s local storage on this phone.
      </p>
    </AuthScreenLayout>
  );
}
