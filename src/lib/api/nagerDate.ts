export interface PublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  global: boolean;
}

export async function fetchPublicHolidays(year: number, countryCode: string): Promise<PublicHoliday[]> {
  const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
  if (!res.ok) throw new Error("Failed to fetch public holidays");
  return res.json();
}
