export interface CountryOption {
  code: string;
  name: string;
}

const FALLBACK_COUNTRIES: CountryOption[] = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "IN", name: "India" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "ZA", name: "South Africa" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SG", name: "Singapore" },
  { code: "NZ", name: "New Zealand" },
  { code: "RU", name: "Russia" },
  { code: "KR", name: "South Korea" },
  { code: "PK", name: "Pakistan" },
  { code: "BD", name: "Bangladesh" },
  { code: "ID", name: "Indonesia" },
  { code: "NG", name: "Nigeria" },
];

let cachedList: CountryOption[] | null = null;

export function getCountryList(): CountryOption[] {
  if (cachedList) return cachedList;

  const supportedValuesOf = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf;

  if (typeof supportedValuesOf !== "function") {
    cachedList = FALLBACK_COUNTRIES;
    return cachedList;
  }

  try {
    const regions = supportedValuesOf("region");
    const display = new Intl.DisplayNames(["en"], { type: "region" });
    const list = regions
      .filter((code) => /^[A-Z]{2}$/.test(code))
      .map((code) => ({ code, name: display.of(code) ?? code }))
      .filter((c) => c.name !== c.code)
      .sort((a, b) => a.name.localeCompare(b.name));
    cachedList = list.length > 0 ? list : FALLBACK_COUNTRIES;
  } catch {
    cachedList = FALLBACK_COUNTRIES;
  }

  return cachedList;
}

export function getCountryName(code: string): string {
  return getCountryList().find((c) => c.code === code)?.name ?? code;
}
