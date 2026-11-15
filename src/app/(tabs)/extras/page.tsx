"use client";

import Link from "next/link";
import { RiskTileArt } from "@/components/Art";
import { EXTRA_TILES } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** screen_13 / screen_14 order. Icons come from public/icons/optoins in nemelt/ (see lib/icons.ts). */
const EXTRAS: { slug: string; title: string }[] = [
  { slug: "parliament", title: "Нээлттэй Парламент" },
  { slug: "civil-servant", title: "Төрийн албан хаагчийн цэс" },
  { slug: "student", title: "Оюутан" },
  { slug: "jobs", title: "Ажлын байр" },
  { slug: "transit-tickets", title: "Нийтийн тээврийн тасалбар захиалга" },
  { slug: "1111-complaint", title: "11-11 төвд өргөдөл, гомдол илгээх" },
  { slug: "iaac-report", title: "АТГ-т хандах" },
  { slug: "lawyer-consult", title: "Өмгөөлөгчид хандах" },
  { slug: "risk-report", title: "Эрсдэл мэдэгдэх" },
];

function Tile({ slug }: { slug: string }) {
  const t = EXTRA_TILES[slug];
  if (!t)
    // Эрсдэл мэдэгдэх has no PNG crop: SVG warning triangle on the same pastel tile.
    return (
      <span className="grid size-[52px] place-items-center rounded-2xl" style={{ background: "#EEF7FB" }}>
        <RiskTileArt className="size-7" />
      </span>
    );
  return (
    <span className="grid size-[52px] place-items-center overflow-hidden rounded-2xl" style={{ background: t.tile }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- user-provided PNG with an encoded path */}
      <img src={t.src} alt="" draggable={false} className={cn("object-contain", t.fill ? "size-[42px]" : "size-7")} />
    </span>
  );
}

export default function ExtrasPage() {
  return (
    <div className="grid grid-cols-2 gap-3.5 px-4 pt-3">
      {EXTRAS.map(({ slug, title }) => (
        <Link
          key={slug}
          href={`/extras/${slug}`}
          className="flex min-h-[128px] flex-col rounded-card bg-card p-4 shadow-sm active:scale-[0.98] transition"
        >
          <Tile slug={slug} />
          <span className="mt-4 text-[16px] font-semibold leading-snug text-ink">{title}</span>
        </Link>
      ))}
    </div>
  );
}
