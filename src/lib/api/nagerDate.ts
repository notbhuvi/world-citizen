export interface PublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  global: boolean;
}

export async function fetchPublicHolidays(year: number, countryCode: string): Promise<PublicHoliday[]> {
  const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
  // The API returns 204 No Content (an "ok" status with no body) for countries it doesn't have data for.
  if (res.status === 204) return [];
  if (!res.ok) throw new Error("Failed to fetch public holidays");
  return res.json();
}
