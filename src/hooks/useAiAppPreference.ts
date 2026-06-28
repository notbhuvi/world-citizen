"use client";

import { useCallback, useEffect, useState } from "react";
import { getSetting, setSetting } from "@/lib/db";
import { getAiApp, openInAiApp, type AiAppOption } from "@/lib/aiApps";

const SETTING_KEY = "ai_app_id";
const ONBOARDED_KEY = "ai_app_onboarded";

export function useAiAppPreference() {
  const [appId, setAppId] = useState<string | null>(null);
  const [onboarded, setOnboarded] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const id = await getSetting<string | null>(SETTING_KEY, null);
      const seenOnboarding = await getSetting<boolean>(ONBOARDED_KEY, false);
      setAppId(id);
      setOnboarded(seenOnboarding);
      setReady(true);
      if (!seenOnboarding) setPickerOpen(true);
    })();
  }, []);

  const selectedApp = getAiApp(appId);

  const choose = useCallback(
    async (app: AiAppOption) => {
      setAppId(app.id);
      await setSetting(SETTING_KEY, app.id);
      await setSetting(ONBOARDED_KEY, true);
      setOnboarded(true);
      setPickerOpen(false);
      if (pendingQuery !== undefined) {
        openInAiApp(app, pendingQuery || undefined);
        setPendingQuery(undefined);
      }
    },
    [pendingQuery]
  );

  const dismissOnboarding = useCallback(async () => {
    await setSetting(ONBOARDED_KEY, true);
    setOnboarded(true);
    setPickerOpen(false);
    setPendingQuery(undefined);
  }, []);

  const research = useCallback(
    (query?: string) => {
      if (selectedApp) {
        openInAiApp(selectedApp, query);
      } else {
        setPendingQuery(query ?? "");
        setPickerOpen(true);
      }
    },
    [selectedApp]
  );

  const openPicker = useCallback(() => {
    setPendingQuery(undefined);
    setPickerOpen(true);
  }, []);

  return {
    ready,
    onboarded,
    selectedApp,
    pickerOpen,
    research,
    choose,
    dismissOnboarding,
    openPicker,
    closePicker: () => setPickerOpen(false),
  };
}
