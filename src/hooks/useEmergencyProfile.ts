"use client";

import { useCallback, useEffect, useState } from "react";
import { getSetting, setSetting } from "@/lib/db";
import { EMPTY_MEDICAL_PROFILE, type IceContact, type MedicalProfile } from "@/lib/emergencyProfile";

const PROFILE_KEY = "medical_profile";
const CONTACTS_KEY = "ice_contacts";

export function useEmergencyProfile() {
  const [profile, setProfileState] = useState<MedicalProfile>(EMPTY_MEDICAL_PROFILE);
  const [contacts, setContactsState] = useState<IceContact[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const [p, c] = await Promise.all([
        getSetting<MedicalProfile>(PROFILE_KEY, EMPTY_MEDICAL_PROFILE),
        getSetting<IceContact[]>(CONTACTS_KEY, []),
      ]);
      setProfileState(p);
      setContactsState(c);
      setReady(true);
    })();
  }, []);

  const setProfile = useCallback(async (next: MedicalProfile) => {
    setProfileState(next);
    await setSetting(PROFILE_KEY, next);
  }, []);

  const setContacts = useCallback(async (next: IceContact[]) => {
    setContactsState(next);
    await setSetting(CONTACTS_KEY, next);
  }, []);

  return { profile, setProfile, contacts, setContacts, ready };
}
