"use client";

import { useEffect, useState } from "react";
import SectionShell from "@/components/common/SectionShell";
import GlassCard from "@/components/common/GlassCard";
import FilterChips from "@/components/common/FilterChips";
import { fetchRates } from "@/lib/api/frankfurter";
import { getCache, setCache } from "@/lib/db";
import { getSection } from "@/lib/sections";

const POPULAR = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "CNY", "AED", "SGD"];

function CurrencyConverter() {
  const [from, setFrom] = useState("USD");
  const [amount, setAmount] = useState("100");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [updated, setUpdated] = useState<string | null>(null);

  useEffect(() => {
    const key = `rates-${from}`;
    (async () => {
      const cached = await getCache<{ rates: Record<string, number>; date: string }>(key, 1000 * 60 * 60 * 6);
      if (cached) {
        setRates(cached.rates);
        setUpdated(cached.date);
      }
      try {
        const data = await fetchRates(from);
        setRates(data.rates);
        setUpdated(data.date);
        await setCache(key, data);
      } catch {
        /* keep cached */
      }
    })();
  }, [from]);

  const numeric = parseFloat(amount) || 0;

  return (
    <GlassCard className="mb-5">
      <p className="mb-3 text-sm font-semibold">Currency Converter</p>
      <div className="mb-3 flex items-center gap-2">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          className="glass flex-1 rounded-xl px-3 py-2.5 text-sm outline-none"
        />
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="glass rounded-xl px-3 py-2.5 text-sm outline-none"
        >
          {POPULAR.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      {rates ? (
        <div className="grid grid-cols-2 gap-2">
          {POPULAR.filter((c) => c !== from).map((c) => (
            <div key={c} className="rounded-xl bg-black/5 px-3 py-2 text-sm dark:bg-white/5">
              <span className="text-muted">{c}</span>{" "}
              <span className="font-semibold">{(numeric * (rates[c] ?? 0)).toFixed(2)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted">Loading rates…</p>
      )}
      {updated && <p className="mt-2 text-[11px] text-muted">Rates as of {updated}</p>}
    </GlassCard>
  );
}

function EmiCalculator() {
  const [principal, setPrincipal] = useState("500000");
  const [rate, setRate] = useState("9.5");
  const [years, setYears] = useState("5");

  const p = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 12 / 100;
  const n = (parseFloat(years) || 0) * 12;
  const emi = r === 0 || n === 0 ? 0 : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;

  return (
    <GlassCard className="mb-5">
      <p className="mb-3 text-sm font-semibold">Loan / EMI Calculator</p>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Amount" value={principal} onChange={setPrincipal} />
        <Field label="Rate % / yr" value={rate} onChange={setRate} />
        <Field label="Years" value={years} onChange={setYears} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Result label="Monthly EMI" value={emi.toFixed(2)} />
        <Result label="Total Interest" value={totalInterest.toFixed(2)} />
        <Result label="Total Payment" value={totalPayment.toFixed(2)} />
      </div>
    </GlassCard>
  );
}

function SalaryCalculator() {
  const [gross, setGross] = useState("60000");
  const [taxRate, setTaxRate] = useState("20");
  const [deductions, setDeductions] = useState("2000");

  const g = parseFloat(gross) || 0;
  const t = (parseFloat(taxRate) || 0) / 100;
  const d = parseFloat(deductions) || 0;
  const net = g - g * t - d;

  return (
    <GlassCard className="mb-5">
      <p className="mb-3 text-sm font-semibold">Salary / Tax Calculator</p>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Gross / yr" value={gross} onChange={setGross} />
        <Field label="Tax %" value={taxRate} onChange={setTaxRate} />
        <Field label="Deductions" value={deductions} onChange={setDeductions} />
      </div>
      <div className="mt-3 text-center">
        <Result label="Estimated Net / yr" value={net.toFixed(2)} wide />
      </div>
      <p className="mt-2 text-[11px] text-muted">
        Simplified estimate — actual tax depends on your country&apos;s brackets and local rules.
      </p>
    </GlassCard>
  );
}

type UnitCategory = "Temperature" | "Distance" | "Weight";

const UNIT_OPTIONS: Record<UnitCategory, string[]> = {
  Temperature: ["Celsius", "Fahrenheit", "Kelvin"],
  Distance: ["Kilometers", "Miles", "Meters", "Feet"],
  Weight: ["Kilograms", "Pounds", "Grams", "Ounces"],
};

function toBase(value: number, unit: string, category: UnitCategory): number {
  if (category === "Temperature") {
    if (unit === "Fahrenheit") return ((value - 32) * 5) / 9;
    if (unit === "Kelvin") return value - 273.15;
    return value;
  }
  if (category === "Distance") {
    if (unit === "Miles") return value * 1.60934;
    if (unit === "Meters") return value / 1000;
    if (unit === "Feet") return value * 0.0003048;
    return value;
  }
  if (unit === "Pounds") return value * 0.453592;
  if (unit === "Grams") return value / 1000;
  if (unit === "Ounces") return value * 0.0283495;
  return value;
}

function fromBase(value: number, unit: string, category: UnitCategory): number {
  if (category === "Temperature") {
    if (unit === "Fahrenheit") return (value * 9) / 5 + 32;
    if (unit === "Kelvin") return value + 273.15;
    return value;
  }
  if (category === "Distance") {
    if (unit === "Miles") return value / 1.60934;
    if (unit === "Meters") return value * 1000;
    if (unit === "Feet") return value / 0.0003048;
    return value;
  }
  if (unit === "Pounds") return value / 0.453592;
  if (unit === "Grams") return value * 1000;
  if (unit === "Ounces") return value / 0.0283495;
  return value;
}

function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("Temperature");
  const [amount, setAmount] = useState("100");
  const [fromUnit, setFromUnit] = useState("Celsius");
  const [toUnit, setToUnit] = useState("Fahrenheit");

  const units = UNIT_OPTIONS[category];
  const numeric = parseFloat(amount) || 0;
  const result = fromBase(toBase(numeric, fromUnit, category), toUnit, category);

  const changeCategory = (next: UnitCategory) => {
    setCategory(next);
    setFromUnit(UNIT_OPTIONS[next][0]);
    setToUnit(UNIT_OPTIONS[next][1]);
  };

  return (
    <GlassCard className="mb-5">
      <p className="mb-3 text-sm font-semibold">Unit Converter</p>
      <div className="mb-3">
        <FilterChips options={Object.keys(UNIT_OPTIONS)} active={category} onChange={(v) => changeCategory(v as UnitCategory)} />
      </div>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        inputMode="decimal"
        className="glass mb-3 w-full rounded-xl px-3 py-2.5 text-sm outline-none"
      />
      <div className="grid grid-cols-2 gap-2">
        <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="glass rounded-xl px-3 py-2.5 text-sm outline-none">
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="glass rounded-xl px-3 py-2.5 text-sm outline-none">
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3 rounded-xl bg-accent/10 px-3 py-2.5 text-center">
        <p className="text-[10px] text-muted">Result</p>
        <p className="text-lg font-semibold text-accent">
          {result.toFixed(2)} {toUnit}
        </p>
      </div>
    </GlassCard>
  );
}

function TipCalculator() {
  const [bill, setBill] = useState("50");
  const [tipPercent, setTipPercent] = useState(15);
  const [people, setPeople] = useState("1");

  const billAmount = parseFloat(bill) || 0;
  const numPeople = Math.max(1, parseInt(people) || 1);
  const tipAmount = (billAmount * tipPercent) / 100;
  const total = billAmount + tipAmount;

  return (
    <GlassCard className="mb-5">
      <p className="mb-3 text-sm font-semibold">Tip Calculator</p>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Bill amount" value={bill} onChange={setBill} />
        <Field label="Split between" value={people} onChange={setPeople} />
      </div>
      <div className="mt-3 flex items-center gap-2">
        {[10, 15, 18, 20, 25].map((pct) => (
          <button
            key={pct}
            onClick={() => setTipPercent(pct)}
            className={`flex-1 rounded-xl py-2 text-xs font-medium ${tipPercent === pct ? "bg-accent text-white" : "bg-black/5 dark:bg-white/5"}`}
          >
            {pct}%
          </button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Result label="Tip" value={tipAmount.toFixed(2)} />
        <Result label="Total" value={total.toFixed(2)} />
        <Result label="Per person" value={(total / numPeople).toFixed(2)} />
      </div>
    </GlassCard>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="decimal"
        className="glass w-full rounded-xl px-2 py-2 text-sm outline-none"
      />
    </label>
  );
}

function Result({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-xl bg-accent/10 px-2 py-2 ${wide ? "col-span-3" : ""}`}>
      <p className="text-[10px] text-muted">{label}</p>
      <p className="text-sm font-semibold text-accent">{value}</p>
    </div>
  );
}

export default function FinancePage() {
  const meta = getSection("finance")!;
  const [tab, setTab] = useState("Currency");

  return (
    <SectionShell title={meta.title} description={meta.description} icon={meta.icon} color={meta.color}>
      <div className="mb-4">
        <FilterChips
          options={["Currency", "EMI / Loan", "Salary / Tax", "Units", "Tip"]}
          active={tab}
          onChange={setTab}
        />
      </div>
      {tab === "Currency" && <CurrencyConverter />}
      {tab === "EMI / Loan" && <EmiCalculator />}
      {tab === "Salary / Tax" && <SalaryCalculator />}
      {tab === "Units" && <UnitConverter />}
      {tab === "Tip" && <TipCalculator />}
    </SectionShell>
  );
}
