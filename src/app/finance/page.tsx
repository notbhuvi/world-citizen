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
        <FilterChips options={["Currency", "EMI / Loan", "Salary / Tax"]} active={tab} onChange={setTab} />
      </div>
      {tab === "Currency" && <CurrencyConverter />}
      {tab === "EMI / Loan" && <EmiCalculator />}
      {tab === "Salary / Tax" && <SalaryCalculator />}
    </SectionShell>
  );
}
