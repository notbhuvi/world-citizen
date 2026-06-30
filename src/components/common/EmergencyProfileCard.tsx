"use client";

import { useState } from "react";
import { HeartPulse, Pencil, Phone, Plus, Trash2, Check, QrCode } from "lucide-react";
import GlassCard from "./GlassCard";
import ShareButton from "./ShareButton";
import QrCodeModal from "./QrCodeModal";
import { useEmergencyProfile } from "@/hooks/useEmergencyProfile";
import { formatProfileSummary, type IceContact } from "@/lib/emergencyProfile";

export default function EmergencyProfileCard() {
  const { profile, setProfile, contacts, setContacts, ready } = useEmergencyProfile();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [qrOpen, setQrOpen] = useState(false);

  if (!ready) return null;

  const startEditing = () => {
    setDraft(profile);
    setEditing(true);
  };

  const save = async () => {
    await setProfile(draft);
    setEditing(false);
  };

  const addContact = () => {
    if (contacts.length >= 3) return;
    setContacts([...contacts, { id: crypto.randomUUID(), name: "", phone: "", relation: "" }]);
  };

  const updateContact = (id: string, patch: Partial<IceContact>) => {
    setContacts(contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const hasAnyInfo = Object.values(profile).some(Boolean) || contacts.length > 0;

  return (
    <GlassCard className="mb-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <HeartPulse size={16} className="text-danger" /> Medical Info & ICE Contacts
        </div>
        <div className="flex items-center gap-1">
          {hasAnyInfo && (
            <>
              <button onClick={() => setQrOpen(true)} className="rounded-full p-1.5 text-muted">
                <QrCode size={16} />
              </button>
              <ShareButton title="Emergency medical info" text={formatProfileSummary(profile, contacts)} />
            </>
          )}
          <button onClick={editing ? save : startEditing} className="rounded-full p-1.5 text-muted">
            {editing ? <Check size={16} /> : <Pencil size={16} />}
          </button>
        </div>
      </div>

      <QrCodeModal
        open={qrOpen}
        title="Emergency Info"
        data={hasAnyInfo ? formatProfileSummary(profile, contacts) : null}
        onClose={() => setQrOpen(false)}
      />

      {!editing && !hasAnyInfo && (
        <p className="text-xs text-muted">
          Add your blood type, allergies, and emergency contacts so they&apos;re ready to show or share if you ever need help.
        </p>
      )}

      {!editing && hasAnyInfo && (
        <div className="space-y-1.5 text-xs">
          {profile.bloodType && <p><span className="text-muted">Blood type:</span> {profile.bloodType}</p>}
          {profile.allergies && <p><span className="text-muted">Allergies:</span> {profile.allergies}</p>}
          {profile.medications && <p><span className="text-muted">Medications:</span> {profile.medications}</p>}
          {profile.conditions && <p><span className="text-muted">Conditions:</span> {profile.conditions}</p>}
          {contacts.map((c) => (
            <a key={c.id} href={`tel:${c.phone}`} className="flex items-center gap-1.5 pt-1 text-accent">
              <Phone size={11} /> {c.name || "Contact"} {c.relation && `(${c.relation})`} — {c.phone}
            </a>
          ))}
        </div>
      )}

      {editing && (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <input
              value={draft.bloodType}
              onChange={(e) => setDraft({ ...draft, bloodType: e.target.value })}
              placeholder="Blood type (e.g. O+)"
              className="glass rounded-xl px-3 py-2 text-xs outline-none"
            />
            <input
              value={draft.allergies}
              onChange={(e) => setDraft({ ...draft, allergies: e.target.value })}
              placeholder="Allergies"
              className="glass rounded-xl px-3 py-2 text-xs outline-none"
            />
            <input
              value={draft.medications}
              onChange={(e) => setDraft({ ...draft, medications: e.target.value })}
              placeholder="Medications"
              className="glass rounded-xl px-3 py-2 text-xs outline-none"
            />
            <input
              value={draft.conditions}
              onChange={(e) => setDraft({ ...draft, conditions: e.target.value })}
              placeholder="Conditions"
              className="glass rounded-xl px-3 py-2 text-xs outline-none"
            />
          </div>

          <div className="space-y-2">
            {contacts.map((c) => (
              <div key={c.id} className="flex items-center gap-1.5">
                <input
                  value={c.name}
                  onChange={(e) => updateContact(c.id, { name: e.target.value })}
                  placeholder="Name"
                  className="glass w-1/3 rounded-xl px-2 py-2 text-xs outline-none"
                />
                <input
                  value={c.relation}
                  onChange={(e) => updateContact(c.id, { relation: e.target.value })}
                  placeholder="Relation"
                  className="glass w-1/4 rounded-xl px-2 py-2 text-xs outline-none"
                />
                <input
                  value={c.phone}
                  onChange={(e) => updateContact(c.id, { phone: e.target.value })}
                  placeholder="Phone"
                  inputMode="tel"
                  className="glass flex-1 rounded-xl px-2 py-2 text-xs outline-none"
                />
                <button onClick={() => removeContact(c.id)} className="text-danger">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {contacts.length < 3 && (
              <button onClick={addContact} className="flex items-center gap-1 text-xs text-accent">
                <Plus size={12} /> Add ICE contact
              </button>
            )}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
