"use client";

import { useCallback, useEffect, useState } from "react";
import { getSetting, setSetting } from "@/lib/db";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await getSetting<Theme | null>("theme", null);
      const preferred =
        stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      setTheme(preferred);
      document.documentElement.setAttribute("data-theme", preferred);
      setReady(true);
    })();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      setSetting("theme", next);
      return next;
    });
  }, []);

  return { theme, toggleTheme, ready };
}
