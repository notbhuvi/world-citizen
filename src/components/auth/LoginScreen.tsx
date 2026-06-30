"use client";

import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import AuthScreenLayout from "./AuthScreenLayout";
import type { UseAuthReturn } from "@/hooks/useAuth";

export default function LoginScreen({ auth, onForgotPassword }: { auth: UseAuthReturn; onForgotPassword: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setLoading(true);
    const ok = await auth.login(password);
    setLoading(false);
    if (!ok) {
      setError("Incorrect password.");
      setPassword("");
    }
  };

  return (
    <AuthScreenLayout title={`Welcome back${auth.account ? `, ${auth.account.name}` : ""}`} subtitle="Enter your password to continue.">
      <div className="space-y-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Password"
          autoFocus
          className="glass w-full rounded-xl px-3.5 py-3 text-sm outline-none"
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        <button
          onClick={submit}
          disabled={loading || !password}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          <LockKeyhole size={16} />
          {loading ? "Checking…" : "Unlock"}
        </button>
        <button onClick={onForgotPassword} className="w-full text-center text-xs text-muted">
          Forgot password?
        </button>
      </div>
    </AuthScreenLayout>
  );
}
