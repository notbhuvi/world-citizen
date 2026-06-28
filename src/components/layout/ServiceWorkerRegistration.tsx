"use client";

import { useEffect } from "react";
import { BASE_PATH } from "@/lib/basePath";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    window.addEventListener("load", () => {
      navigator.serviceWorker.register(`${BASE_PATH}/sw.js`, { scope: `${BASE_PATH}/` }).catch((err) => {
        console.error("Service worker registration failed:", err);
      });
    });
  }, []);

  return null;
}
