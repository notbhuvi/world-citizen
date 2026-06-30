export interface MedicalProfile {
  bloodType: string;
  allergies: string;
  medications: string;
  conditions: string;
}

export interface IceContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export const EMPTY_MEDICAL_PROFILE: MedicalProfile = {
  bloodType: "",
  allergies: "",
  medications: "",
  conditions: "",
};

export function formatProfileSummary(profile: MedicalProfile, contacts: IceContact[]): string {
  const lines: string[] = ["Emergency medical info:"];
  if (profile.bloodType) lines.push(`Blood type: ${profile.bloodType}`);
  if (profile.allergies) lines.push(`Allergies: ${profile.allergies}`);
  if (profile.medications) lines.push(`Medications: ${profile.medications}`);
  if (profile.conditions) lines.push(`Conditions: ${profile.conditions}`);
  if (contacts.length > 0) {
    lines.push("In case of emergency, contact:");
    contacts.forEach((c) => lines.push(`${c.name} (${c.relation}): ${c.phone}`));
  }
  return lines.join("\n");
}
