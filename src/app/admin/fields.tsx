"use client";

import { useState, type ReactNode } from "react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

export function AdminCard({ title, desc, children, action }: { title: string; desc?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-bold text-ink">{title}</h3>
          {desc && <p className="mt-0.5 text-[13px] text-muted">{desc}</p>}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

export const smallInput =
  "w-full rounded-xl bg-soft px-3 h-11 text-[15px] text-ink outline-none ring-1 ring-transparent focus:ring-brand";

export function TextField({ label, value, onChange, type = "text", className }: { label: string; value: string; onChange: (v: string) => void; type?: string; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-[12.5px] font-semibold text-muted">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={smallInput} />
    </label>
  );
}

/** Numeric input that tolerates partial typing ("-", "3.") and only commits valid numbers. */
export function NumField({ label, value, onChange, step = "any", suffix }: { label: string; value: number; onChange: (v: number) => void; step?: string; suffix?: string }) {
  const [draft, setDraft] = useState(String(value));
  return (
    <label className="block">
      <span className="mb-1 block text-[12.5px] font-semibold text-muted">{label}</span>
      <span className="relative block">
        <input
          inputMode="decimal"
          step={step}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            const n = parseFloat(e.target.value);
            if (!Number.isNaN(n)) onChange(n);
          }}
          onBlur={() => setDraft(String(value))}
          className={cn(smallInput, suffix && "pr-12")}
        />
        {suffix && <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[13px] text-muted">{suffix}</span>}
      </span>
    </label>
  );
}
