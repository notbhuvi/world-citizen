export interface CurrencyRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export async function fetchRates(base: string): Promise<CurrencyRates> {
  const res = await fetch(`https://api.frankfurter.app/latest?from=${base}`);
  if (!res.ok) throw new Error("Failed to fetch exchange rates");
  return res.json();
}

export async function fetchCurrencies(): Promise<Record<string, string>> {
  const res = await fetch("https://api.frankfurter.app/currencies");
  if (!res.ok) throw new Error("Failed to fetch currency list");
  return res.json();
}
