export interface EmergencyNumberSet {
  general?: string;
  police: string;
  ambulance: string;
  fire: string;
  womenHelpline?: string;
  childHelpline?: string;
}

export const EMERGENCY_NUMBERS: Record<string, EmergencyNumberSet> = {
  US: { general: "911", police: "911", ambulance: "911", fire: "911" },
  CA: { general: "911", police: "911", ambulance: "911", fire: "911" },
  GB: { general: "999", police: "999", ambulance: "999", fire: "999", womenHelpline: "0808 2000 247" },
  IN: { general: "112", police: "100", ambulance: "102", fire: "101", womenHelpline: "1091", childHelpline: "1098" },
  AU: { general: "000", police: "000", ambulance: "000", fire: "000" },
  DE: { police: "110", ambulance: "112", fire: "112" },
  FR: { police: "17", ambulance: "15", fire: "18", general: "112" },
  ES: { general: "112", police: "091", ambulance: "061", fire: "080" },
  IT: { general: "112", police: "113", ambulance: "118", fire: "115" },
  JP: { police: "110", ambulance: "119", fire: "119" },
  CN: { police: "110", ambulance: "120", fire: "119" },
  BR: { police: "190", ambulance: "192", fire: "193" },
  MX: { general: "911", police: "911", ambulance: "911", fire: "911" },
  ZA: { general: "112", police: "10111", ambulance: "10177", fire: "10177" },
  AE: { police: "999", ambulance: "998", fire: "997" },
  SG: { police: "999", ambulance: "995", fire: "995" },
  NZ: { general: "111", police: "111", ambulance: "111", fire: "111" },
  RU: { general: "112", police: "102", ambulance: "103", fire: "101" },
  KR: { police: "112", ambulance: "119", fire: "119" },
  PK: { police: "15", ambulance: "1122", fire: "16" },
  BD: { general: "999", police: "999", ambulance: "999", fire: "999" },
  ID: { general: "112", police: "110", ambulance: "118", fire: "113" },
  NG: { general: "112", police: "112", ambulance: "112", fire: "112" },
  default: { general: "112", police: "112", ambulance: "112", fire: "112" },
};

export function getEmergencyNumbers(countryCode?: string): EmergencyNumberSet {
  if (!countryCode) return EMERGENCY_NUMBERS.default;
  return EMERGENCY_NUMBERS[countryCode.toUpperCase()] ?? EMERGENCY_NUMBERS.default;
}
