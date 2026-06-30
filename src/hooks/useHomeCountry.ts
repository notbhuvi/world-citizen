"use client";

import { useCallback, useEffect, useState } from "react";
import { getSetting, setSetting } from "@/lib/db";
import type { CountryOption } from "@/lib/countries";

const KEY = "home_country";

export function useHomeCountry() {
  const [homeCountry, setHomeCountryState] = useState<CountryOption | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getSetting<CountryOption | null>(KEY, null).then((value) => {
      setHomeCountryState(value);
      setReady(true);
    });
  }, []);

  const setHomeCountry = useCallback(async (country: CountryOption | null) => {
    setHomeCountryState(country);
    await setSetting(KEY, country);
  }, []);

  return { homeCountry, setHomeCountry, ready };
}
