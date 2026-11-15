"use client";

import Link from "next/link";
import { ChevronRight, FileCheck2, HeartPulse, Car, CalendarClock } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { FOR_YOU_SLUGS } from "@/data/catalog";
import { ServiceCard } from "@/components/ServiceCard";
import { SearchLink } from "@/components/home/Sections";
import { SERVICES_STORY } from "@/lib/icons";

const FOR_YOU_ICON = [HeartPulse, Car, FileCheck2, CalendarClock];

export default function ServicesPage() {
  const { services } = useAppState();
  const forYou = FOR_YOU_SLUGS.map((s) => services.find((x) => x.slug === s)).filter(Boolean);

  return (
    <div className="px-4">
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pt-3 pb-1">
        <Link
          href="/services/e-apostille"
          aria-label="Цахим апостиль гэрчилгээ — 12 лавлагаа"
          className="relative h-[180px] w-[128px] shrink-0 overflow-hidden rounded-card bg-[#141B3A] shadow-md active:scale-[0.98] transition"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- user-provided PNG (Cyrillic filename, encoded) */}
          <img src={SERVICES_STORY} alt="" draggable={false} className="size-full object-cover" />
        </Link>
      </div>

      <SearchLink className="mt-6" />

      <h2 className="mt-7 text-[18px] font-bold text-ink">Танд зориулсан</h2>
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2.5 overflow-x-auto px-4 pb-1">
        {forYou.map((s, i) => {
          const Icon = FOR_YOU_ICON[i % FOR_YOU_ICON.length];
          return (
            <Link
              key={s!.slug}
              href={`/services/${s!.slug}`}
              className="flex w-[200px] shrink-0 items-center gap-3 rounded-card bg-card p-3 shadow-sm ring-1 ring-line/60"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                <Icon className="size-5" />
              </span>
              <span className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-ink">{s!.title}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-7 mb-3 flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-ink">Бүх үйлчилгээ</h2>
        <Link href="/categories" className="flex items-center gap-0.5 text-[16px] font-bold text-brand">
          Ангилал <ChevronRight className="size-5" />
        </Link>
      </div>
      <div className="space-y-4">
        {services.map((s) => (
          <ServiceCard key={s.slug} service={s} />
        ))}
      </div>
    </div>
  );
}
