"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Siren, Map, Bookmark, Grid2x2 } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/emergency", label: "SOS", icon: Siren },
  { href: "/maps", label: "Nearby", icon: Map },
  { href: "/bookmarks", label: "Saved", icon: Bookmark },
  { href: "/more", label: "More", icon: Grid2x2 },
];

export default function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-40 px-3 pb-3">
      <div className="glass mx-auto flex max-w-md items-center justify-between rounded-2xl px-2 py-2">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className="relative flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5">
              {active && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-xl bg-accent/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <motion.span
                animate={active ? { y: -2, scale: 1.08 } : { y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className={`relative z-10 ${active ? "text-accent" : "text-muted"}`}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              </motion.span>
              <span className={`relative z-10 text-[10px] font-semibold ${active ? "text-accent" : "text-muted"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
