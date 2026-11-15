"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpenText, Search, X } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { GUIDES, POPULAR_SLUGS } from "@/data/catalog";
import { BackButton } from "@/components/ui";

export default function SearchPage() {
  const { state, update, services } = useAppState();
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) return null;
    return {
      services: services.filter((s) => `${s.title} ${s.org} ${s.about}`.toLowerCase().includes(term)),
      guides: GUIDES.filter((g) => g.title.toLowerCase().includes(term)),
    };
  }, [term, services]);

  const remember = (text: string) => {
    const t = text.trim();
    if (!t) return;
    update("recentSearches", (r) => [t, ...r.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 10));
  };

  const popular = POPULAR_SLUGS.map((s) => services.find((x) => x.slug === s)).filter((s) => s !== undefined);

  return (
    <div className="min-h-screen px-4 pt-[max(env(safe-area-inset-top),12px)] pb-12">
      <BackButton fallback="/" />
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          remember(q);
        }}
        className="mt-4 flex h-[52px] items-center gap-3 rounded-full bg-card px-4 ring-1 ring-line focus-within:ring-2 focus-within:ring-brand"
      >
        <Search className="size-6 text-ink" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Үйлчилгээ хайх"
          aria-label="Үйлчилгээ хайх"
          enterKeyHint="search"
          className="flex-1 bg-transparent text-[17px] text-ink outline-none placeholder:text-muted/70"
        />
        {q && (
          <button type="button" aria-label="Цэвэрлэх" onClick={() => setQ("")} className="text-muted">
            <X className="size-5" />
          </button>
        )}
      </form>

      {results ? (
        <div className="mt-5">
          <h2 className="text-[16px] font-bold text-ink">
            Илэрц ({results.services.length + results.guides.length})
          </h2>
          <ul className="mt-3 space-y-2.5">
            {results.guides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guides/${g.slug}`}
                  onClick={() => remember(q)}
                  className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 text-[16px] text-ink"
                >
                  <BookOpenText className="size-5 text-brand" /> Хөтөч: {g.title}
                </Link>
              </li>
            ))}
            {results.services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} onClick={() => remember(q)} className="block rounded-xl bg-card px-4 py-3 text-[16px] leading-snug text-ink">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
          {results.services.length + results.guides.length === 0 && (
            <p className="mt-6 text-center text-[15px] text-muted">“{q}” гэсэн илэрц олдсонгүй.</p>
          )}
        </div>
      ) : (
        <>
          {state.recentSearches.length > 0 && (
            <>
              <div className="mt-5 flex items-center justify-between">
                <h2 className="text-[16px] font-bold text-ink">Сүүлд хайсан</h2>
                <button type="button" onClick={() => update("recentSearches", [])} className="text-[13px] font-semibold text-brand">
                  Бүгдийг устгах
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {state.recentSearches.map((r) => (
                  <span key={r} className="flex items-center gap-1 rounded-xl bg-card pl-5 pr-2 shadow-sm">
                    <button type="button" onClick={() => setQ(r)} className="py-2.5 text-[16px] text-ink">
                      {r}
                    </button>
                    <button
                      type="button"
                      aria-label={`${r} устгах`}
                      onClick={() => update("recentSearches", (rs) => rs.filter((x) => x !== r))}
                      className="ml-2 grid size-6 place-items-center rounded-full bg-ink text-card"
                    >
                      <X className="size-3.5" strokeWidth={3} />
                    </button>
                  </span>
                ))}
              </div>
            </>
          )}
          <h2 className="mt-6 text-[16px] font-bold text-ink">Эрэлттэй</h2>
          <ul className="mt-3 space-y-2.5">
            {popular.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="block rounded-xl bg-card px-5 py-3 text-[16px] leading-snug text-ink">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
