"use client";

export default function FilterChips({
  options,
  active,
  onChange,
}: {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto px-0.5 py-1 [&::-webkit-scrollbar]:hidden">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
            active === option
              ? "bg-accent text-white"
              : "glass text-muted"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
