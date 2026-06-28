import {
  Home,
  HeartPulse,
  Siren,
  Landmark,
  Wallet,
  ShoppingBag,
  UtensilsCrossed,
  GraduationCap,
  Briefcase,
  Building2,
  Globe2,
  Phone,
  Scale,
  CalendarDays,
  Bot,
  Map,
  type LucideIcon,
} from "lucide-react";

export interface SectionMeta {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  status: "live" | "scaffold";
}

export const SECTIONS: SectionMeta[] = [
  { slug: "", title: "Dashboard", description: "Your daily overview", icon: Home, color: "#0A84FF", status: "live" },
  { slug: "emergency", title: "Emergency", description: "SOS, helplines, disasters", icon: Siren, color: "#FF453A", status: "live" },
  { slug: "maps", title: "Maps & Nearby", description: "Hospitals, fuel, transit", icon: Map, color: "#30D158", status: "live" },
  { slug: "health", title: "Health", description: "Hospitals, pharmacies, advisories", icon: HeartPulse, color: "#FF375F", status: "live" },
  { slug: "government", title: "Government", description: "Citizen services & schemes", icon: Landmark, color: "#5E5CE6", status: "live" },
  { slug: "finance", title: "Finance", description: "Currency, calculators, rates", icon: Wallet, color: "#FFD60A", status: "live" },
  { slug: "shopping", title: "Shopping", description: "Stores, malls, deals", icon: ShoppingBag, color: "#FF9F0A", status: "live" },
  { slug: "food", title: "Food", description: "Restaurants & food safety", icon: UtensilsCrossed, color: "#BF5AF2", status: "live" },
  { slug: "education", title: "Education", description: "Schools, exams, scholarships", icon: GraduationCap, color: "#64D2FF", status: "live" },
  { slug: "jobs", title: "Jobs", description: "Careers & internships", icon: Briefcase, color: "#0A84FF", status: "live" },
  { slug: "housing", title: "Housing", description: "Rentals & home services", icon: Building2, color: "#30D158", status: "live" },
  { slug: "travel", title: "Travel", description: "Visas, guides, embassies", icon: Globe2, color: "#FF453A", status: "live" },
  { slug: "utilities", title: "Utilities", description: "Electricity, water, bills", icon: Phone, color: "#5E5CE6", status: "live" },
  { slug: "laws", title: "Laws", description: "Rights, rules, fines", icon: Scale, color: "#98989F", status: "live" },
  { slug: "calendar", title: "Calendar", description: "Holidays & deadlines", icon: CalendarDays, color: "#FF9F0A", status: "live" },
  { slug: "ai", title: "AI Assistant", description: "Voice, translate, ask anything", icon: Bot, color: "#0A84FF", status: "live" },
];

export function getSection(slug: string): SectionMeta | undefined {
  return SECTIONS.find((s) => s.slug === slug);
}
