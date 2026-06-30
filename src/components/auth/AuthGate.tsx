"use client";

import { ReactNode, useState } from "react";
import { useAuthContext } from "./AuthProvider";
import SignupScreen from "./SignupScreen";
import LoginScreen from "./LoginScreen";
import RecoveryScreen from "./RecoveryScreen";
import RecoveryCodeReveal from "./RecoveryCodeReveal";

export default function AuthGate({ children }: { children: ReactNode }) {
  const auth = useAuthContext();
  const [pendingRecoveryCode, setPendingRecoveryCode] = useState<string | null>(null);
  const [showRecoveryFlow, setShowRecoveryFlow] = useState(false);

  if (!auth.ready) return null;

  if (pendingRecoveryCode) {
    return (
      <RecoveryCodeReveal
        code={pendingRecoveryCode}
        onContinue={() => {
          setPendingRecoveryCode(null);
          setShowRecoveryFlow(false);
        }}
      />
    );
  }

  if (!auth.account) {
    return <SignupScreen auth={auth} onSignedUp={setPendingRecoveryCode} />;
  }

  if (!auth.unlocked) {
    if (showRecoveryFlow) {
      return (
        <RecoveryScreen auth={auth} onBack={() => setShowRecoveryFlow(false)} onReset={setPendingRecoveryCode} />
      );
    }
    return <LoginScreen auth={auth} onForgotPassword={() => setShowRecoveryFlow(true)} />;
  }

  return <>{children}</>;
}
