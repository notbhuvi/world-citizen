"use client";

import { ReactNode } from "react";

export default function AuthScreenLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-10">
      <div className="mb-6 flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-lg font-bold text-white">
          M
        </div>
        <div className="text-center">
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>
      </div>
      <div className="glass w-full max-w-sm rounded-2xl p-5">{children}</div>
    </div>
  );
}
