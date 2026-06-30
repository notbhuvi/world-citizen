"use client";

import { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import TopBar from "./TopBar";
import BottomTabs from "./BottomTabs";
import OfflineBanner from "../common/OfflineBanner";
import { AiAppProvider } from "./AiAppProvider";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AiAppProvider>
        <div className="relative flex min-h-screen flex-col">
          <div className="blob-bg" />
          <TopBar />
          <OfflineBanner />
          <main className="flex-1 pb-24">{children}</main>
          <BottomTabs />
        </div>
      </AiAppProvider>
    </MotionConfig>
  );
}
