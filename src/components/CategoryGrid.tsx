"use client";

import Link from "next/link";
import { Files } from "lucide-react";
import { CATEGORIES } from "@/data/catalog";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          href={`/categories/${c.slug}`}
          className="relative h-[112px] rounded-card bg-card p-3.5 shadow-sm active:scale-[0.98] transition"
        >
          <span className="block pr-6 text-[16px] font-semibold leading-snug text-ink">{c.title}</span>
          <Files className="absolute right-3 bottom-3 size-8 text-slate-500" strokeWidth={1.8} />
        </Link>
      ))}
    </div>
  );
}
