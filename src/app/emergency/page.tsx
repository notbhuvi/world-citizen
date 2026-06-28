"use client";

import { useState } from "react";
import { Phone, Share2, Siren, ShieldAlert, Flame, HeartPulse, Users, Baby } from "lucide-react";
import SectionShell from "@/components/common/SectionShell";
import GlassCard from "@/components/common/GlassCard";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getEmergencyNumbers } from "@/lib/emergencyNumbers";
import { getSection } from "@/lib/sections";

export default function EmergencyPage() {
  const meta = getSection("emergency")!;
  const { location } = useGeolocation();
  const [sharing, setSharing] = useState(false);
  const numbers = getEmergencyNumbers(location?.countryCode);

  const shareLocation = async () => {
    if (!location) return;
    setSharing(true);
    const url = `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=17/${location.latitude}/${location.longitude}`;
    const text = `I need help. My live location: ${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My location", text, url });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Location link copied — paste it to whoever you need to reach.");
      }
    } catch {
      /* cancelled */
    } finally {
      setSharing(false);
    }
  };

  const callButtons = [
    { label: "Emergency", icon: Siren, number: numbers.general ?? numbers.police, color: "#FF453A" },
    { label: "Police", icon: ShieldAlert, number: numbers.police, color: "#0A84FF" },
    { label: "Ambulance", icon: HeartPulse, number: numbers.ambulance, color: "#30D158" },
    { label: "Fire", icon: Flame, number: numbers.fire, color: "#FF9F0A" },
  ];

  return (
    <SectionShell title={meta.title} description={meta.description} icon={meta.icon} color={meta.color}>
      <GlassCard className="mb-4 !bg-danger/10">
        <button
          onClick={shareLocation}
          disabled={!location || sharing}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-danger py-3.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          <Share2 size={18} />
          {sharing ? "Sharing…" : "SOS — Share My Live Location"}
        </button>
        <p className="mt-2 text-center text-[11px] text-muted">
          {location ? "Sends your current GPS location to whoever you choose." : "Waiting for location access…"}
        </p>
      </GlassCard>

      <div className="mb-5 grid grid-cols-2 gap-3">
        {callButtons.map(({ label, icon: Icon, number, color }) => (
          <a key={label} href={`tel:${number}`} className="glass flex items-center gap-3 rounded-2xl p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ backgroundColor: color }}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xs text-muted">{label}</p>
              <p className="text-lg font-semibold">{number}</p>
            </div>
          </a>
        ))}
      </div>

      {(numbers.womenHelpline || numbers.childHelpline) && (
        <div className="mb-5 space-y-2.5">
          {numbers.womenHelpline && (
            <a href={`tel:${numbers.womenHelpline}`} className="glass flex items-center justify-between rounded-2xl p-3.5">
              <span className="flex items-center gap-2 text-sm"><Users size={16} /> Women&apos;s Helpline</span>
              <span className="flex items-center gap-1 font-medium text-accent"><Phone size={14} /> {numbers.womenHelpline}</span>
            </a>
          )}
          {numbers.childHelpline && (
            <a href={`tel:${numbers.childHelpline}`} className="glass flex items-center justify-between rounded-2xl p-3.5">
              <span className="flex items-center gap-2 text-sm"><Baby size={16} /> Child Helpline</span>
              <span className="flex items-center gap-1 font-medium text-accent"><Phone size={14} /> {numbers.childHelpline}</span>
            </a>
          )}
        </div>
      )}

      <p className="text-[11px] text-muted">
        Numbers are based on your detected country{location?.country ? ` (${location.country})` : ""} and may vary by region.
        Always confirm with local authorities when possible.
      </p>
    </SectionShell>
  );
}
