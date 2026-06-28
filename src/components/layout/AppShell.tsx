"use client";

import { ReactNode } from "react";
import TopBar from "./TopBar";
import BottomTabs from "./BottomTabs";
import OfflineBanner from "../common/OfflineBanner";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <OfflineBanner />
      <main className="flex-1 pb-24">{children}</main>
      <BottomTabs />
    </div>
  );
}
