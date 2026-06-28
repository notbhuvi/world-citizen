"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAiAppPreference } from "@/hooks/useAiAppPreference";
import AiAppPicker from "../common/AiAppPicker";

type AiAppContextValue = ReturnType<typeof useAiAppPreference>;

const AiAppContext = createContext<AiAppContextValue | null>(null);

export function AiAppProvider({ children }: { children: ReactNode }) {
  const value = useAiAppPreference();

  return (
    <AiAppContext.Provider value={value}>
      {children}
      <AiAppPicker
        open={value.ready && value.pickerOpen}
        isFirstRun={!value.onboarded}
        onChoose={value.choose}
        onDismiss={value.dismissOnboarding}
      />
    </AiAppContext.Provider>
  );
}

export function useAiApp() {
  const ctx = useContext(AiAppContext);
  if (!ctx) throw new Error("useAiApp must be used within AiAppProvider");
  return ctx;
}
