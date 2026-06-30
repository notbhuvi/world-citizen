"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = (isDark: boolean) => {
      const next: Theme = isDark ? "dark" : "light";
      setTheme(next);
      document.documentElement.setAttribute("data-theme", next);
    };

    (async () => {
      await Promise.resolve();
      apply(media.matches);
      setReady(true);
    })();

    const handleChange = (e: MediaQueryListEvent) => apply(e.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return { theme, ready };
}
