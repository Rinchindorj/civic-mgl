"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpenText } from "lucide-react";
import { GUIDES } from "@/data/catalog";
import { Page, PillTabs } from "@/components/ui";
import { CategoryGrid } from "@/components/CategoryGrid";

export default function GuidesPage() {
  const [tab, setTab] = useState<"list" | "cat">("list");
  return (
    <Page title="Хөтөч">
      <PillTabs
        variant="segment"
        tabs={[
          { value: "list", label: "Жагсаалт" },
          { value: "cat", label: "Ангилал" },
        ]}
        value={tab}
        onChange={setTab}
      />
      <div className="mt-5">
        {tab === "list" ? (
          <ul className="space-y-3">
            {GUIDES.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="flex items-center gap-4 rounded-card bg-card px-4 py-4 shadow-sm active:scale-[0.99] transition">
                  <span className="grid size-11 place-items-center rounded-xl bg-soft text-brand">
                    <BookOpenText className="size-6" />
                  </span>
                  <span className="text-[17px] font-semibold text-ink">{g.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <CategoryGrid />
        )}
      </div>
    </Page>
  );
}
