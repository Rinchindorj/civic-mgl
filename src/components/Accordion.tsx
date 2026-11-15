"use client";

import { useState } from "react";
import { ChevronDown, CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={it.q} className="overflow-hidden rounded-card bg-card shadow-sm">
          <button
            type="button"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center gap-3 px-4 py-4 text-left"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-soft text-brand">
              <CircleHelp className="size-5" />
            </span>
            <span className="flex-1 text-[16px] font-semibold text-ink">{it.q}</span>
            <ChevronDown className={cn("size-5 text-muted transition", open === i && "rotate-180")} />
          </button>
          {open === i && <p className="px-4 pb-4 pl-[68px] text-[15px] leading-relaxed text-muted">{it.a}</p>}
        </li>
      ))}
    </ul>
  );
}
