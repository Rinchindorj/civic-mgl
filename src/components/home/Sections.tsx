"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronRight, Clock, CloudSun, Sparkles, Wind, BadgeDollarSign, FileCheck2 } from "lucide-react";
import {
  JobsBannerArt,
  KidsPuzzleArt,
  MnFlag,
  MongoliaMap,
  StatHandshake,
  StatIncome,
  StatJobSearch,
  StatLivestock,
  StatSalary,
} from "@/components/Art";
import { GUIDE_CARDS, RISK_BELL } from "@/lib/icons";
import { GUIDES } from "@/data/catalog";
import { useAppState, useNow, type PromoBanner, type StatItem } from "@/context/AppStateContext";
import { aqiLabel, cn, fmtMoney, fmtTime, pad, WEEKDAYS } from "@/lib/utils";
import { Sheet } from "@/components/ui";

/* ------------------------------- Hero search ------------------------------- */
export function HeroSearch() {
  return (
    <section className="hero-glow relative overflow-hidden px-4 pt-6 pb-8">
      <HeroPattern />
      <h1 className="relative mt-4 text-center text-[23px] font-bold leading-tight text-ink/85">
        Төрийн үйлчилгээ, мэдээллийг
        <br />
        нэг дороос
      </h1>
      <SearchLink className="relative mt-5" />
    </section>
  );
}

export function SearchLink({ className }: { className?: string }) {
  return (
    <Link
      href="/search"
      className={cn("search-ring flex h-[58px] items-center gap-3 rounded-[22px] px-5 shadow-sm", className)}
    >
      <span className="relative grid size-7 place-items-center rounded-full bg-brand text-white">
        <Sparkles className="size-4" />
      </span>
      <span className="text-[18px] text-ink/80">Үйлчилгээ хайх</span>
    </Link>
  );
}

function HeroPattern() {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-brand/10" viewBox="0 0 400 90" preserveAspectRatio="none">
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${-40 + i * 120} 90 q60 -${50 + (i % 2) * 18} 120 0`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <path key={`b${i}`} d={`M${20 + i * 120} 90 q40 -30 80 0`} fill="none" stroke="currentColor" strokeWidth="2" />
      ))}
    </svg>
  );
}

/* ------------------------------ Utility widgets ------------------------------ */
function Chip({ href, icon, children, className }: { href: string; icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex h-[54px] shrink-0 snap-start items-center gap-2.5 rounded-full border border-line bg-card px-4 text-[15px] font-medium text-ink shadow-sm active:scale-[0.97] transition",
        className,
      )}
    >
      {icon}
      {children}
    </Link>
  );
}

export function UtilityWidgets() {
  const { state } = useAppState();
  const now = useNow();
  const { weather, aqi, rates } = state.liveData;
  const aq = aqiLabel(aqi.value);
  const isDay = now.getHours() >= 7 && now.getHours() < 19;

  return (
    <section className="py-4" aria-label="Шуурхай мэдээлэл">
      <div className="no-scrollbar flex snap-x gap-2.5 overflow-x-auto px-4 pb-1">
        <Chip href="/calendar" icon={<span className="grid size-8 place-items-center rounded-lg bg-brand/10 text-brand"><Clock className="size-[18px]" /></span>}>
          <span className="flex flex-col leading-tight">
            <span className="font-bold tabular-nums">{fmtTime(now)}</span>
            <span className="text-[12px] text-muted">
              {pad(now.getMonth() + 1)}/{pad(now.getDate())} · {WEEKDAYS[now.getDay()]}
            </span>
          </span>
        </Chip>
        <Chip href="/weather?tab=weather" icon={<CloudSun className="size-7 text-amber-400" />}>
          {isDay ? "Өдөр" : "Шөнө"} {isDay ? weather.temp : weather.nightTemp}° C
        </Chip>
        <Chip href="/weather?tab=aqi" icon={<Wind className="size-6 text-sky-400" />}>
          <span>
            Агаарын чанар <b style={{ color: aq.color }}>{aqi.value}</b>{" "}
            <span className="text-[13px] text-muted">{aq.label}</span>
          </span>
        </Chip>
        <Chip href="/exchange" icon={<BadgeDollarSign className="size-6 text-emerald-500" />}>
          USD <b className="tabular-nums">{fmtMoney(rates.USD)}₮</b>
        </Chip>
      </div>
    </section>
  );
}

/* ------------------------------ Guides carousel ------------------------------ */
/** Screenshot order: screen_01 (Цэргийн алба, Бичиг баримт, Хүүхэд) then screen_03. */
const CAROUSEL_ORDER = ["military", "documents", "children", "going-abroad", "health", "loans"];

export function GuidesCarousel() {
  const rank = (slug: string) => {
    const i = CAROUSEL_ORDER.indexOf(slug);
    return i === -1 ? CAROUSEL_ORDER.length : i;
  };
  const featured = GUIDES.filter((g) => g.featured).sort((a, b) => rank(a.slug) - rank(b.slug));
  return (
    <section className="py-3" aria-labelledby="guides-h">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 id="guides-h" className="text-[18px] font-bold text-ink">Хөтөч</h2>
        <Link href="/guides" className="flex items-center gap-0.5 text-[16px] font-bold text-brand">
          Бүгд <ChevronRight className="size-5" />
        </Link>
      </div>
      <div className="no-scrollbar flex snap-x gap-2.5 overflow-x-auto px-4 pb-2">
        {featured.map((g) => {
          const card = GUIDE_CARDS[g.slug];
          const base = "relative h-[176px] w-[148px] shrink-0 snap-start overflow-hidden rounded-card shadow-sm active:scale-[0.97] transition";
          if (card)
            return (
              <Link key={g.slug} href={`/guides/${g.slug}`} className={base} aria-label={g.title}>
                {/* The PNG is the whole card: background, title and illustration. */}
                {/* eslint-disable-next-line @next/next/no-img-element -- user-provided PNG with an encoded path */}
                <img src={card} alt="" className="size-full object-cover" draggable={false} />
              </Link>
            );
          if (g.slug === "children")
            return (
              <Link key={g.slug} href={`/guides/${g.slug}`} className={cn(base, "bg-gradient-to-br from-[#FFF4C4] via-[#FFF9E0] to-[#FFFDF4] p-3.5")}>
                <span className="relative z-10 block text-[17px] font-medium leading-snug text-[#1B2433]">{g.title}</span>
                <KidsPuzzleArt className="absolute -right-3 -bottom-2 w-[104px]" />
              </Link>
            );
          const Icon = g.icon;
          return (
            <Link key={g.slug} href={`/guides/${g.slug}`} className={cn(base, "bg-gradient-to-br p-3.5", g.gradient)}>
              <span className="relative z-10 block text-[17px] font-medium leading-snug text-[#1B2433]">{g.title}</span>
              <span className="absolute -right-3 -bottom-3 grid size-[92px] place-items-center rounded-full bg-white/25">
                <Icon className={cn("size-12 drop-shadow-md", g.iconColor)} strokeWidth={1.6} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------- Promo banners ------------------------------- */
function BannerArt({ variant }: { variant: PromoBanner["variant"] }) {
  if (variant === "dark") return <JobsBannerArt className="absolute right-1 bottom-2 w-[150px]" />;
  if (variant === "light")
    return (
      // 3D bell cut from the user's ЭРСДЭЛ МЭДЭГДЭХ banner; edges fade into the card gradient.
      // eslint-disable-next-line @next/next/no-img-element -- user-provided PNG
      <img
        src={RISK_BELL}
        alt=""
        draggable={false}
        className="absolute -right-2 bottom-0 w-[178px] [mask-image:radial-gradient(closest-side,#000_72%,transparent)]"
      />
    );
  return (
    <span className="absolute right-4 bottom-4 grid size-24 place-items-center rounded-3xl bg-white/15 ring-1 ring-white/30">
      <FileCheck2 className="size-14 text-white" strokeWidth={1.4} />
    </span>
  );
}

export function PromoBanners() {
  const { state } = useAppState();
  const banners = state.layoutConfig.banners;
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Auto-advance every 5s.
  useEffect(() => {
    const el = ref.current;
    if (!el || banners.length < 2) return;
    const id = setInterval(() => {
      const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % banners.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    }, 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <section className="py-3" aria-label="Сурталчилгаа">
      <div
        ref={ref}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
      >
        {banners.map((b) => (
          <div key={b.id} className="w-full shrink-0 snap-center px-4">
            <Link
              href={b.href || "/"}
              className={cn(
                "relative block h-[184px] overflow-hidden rounded-card p-5 shadow-md active:scale-[0.99] transition",
                b.variant === "dark" && "bg-gradient-to-br from-[#1B2236] via-[#2A3350] to-[#11182A] text-white",
                b.variant === "light" && "bg-gradient-to-br from-[#D3DFFD] via-[#B4C7FB] to-[#8FA9F8] text-[#0B2265]",
                b.variant === "brand" && "brand-gradient text-white",
              )}
            >
              <span
                className={cn(
                  "block max-w-[62%] text-[30px] font-black leading-none tracking-tight",
                  b.variant === "dark" && "bg-gradient-to-r from-sky-300 to-violet-300 bg-clip-text text-transparent",
                  b.variant === "light" && "text-navy",
                )}
              >
                {b.title}
              </span>
              <span className="mt-2 block max-w-[60%] text-[14px] font-semibold leading-snug opacity-90">{b.subtitle}</span>
              {b.ctaLabel && (
                <span
                  className={cn(
                    "absolute bottom-5 left-5 rounded-full px-4 py-2 text-[13px] font-bold",
                    b.variant === "light" ? "bg-brand text-white" : "bg-white/15 text-white ring-1 ring-white/30",
                  )}
                >
                  {b.ctaLabel} →
                </span>
              )}
              <BannerArt variant={b.variant} />
            </Link>
          </div>
        ))}
      </div>
      {banners.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {banners.map((b, i) => (
            <button
              key={b.id}
              type="button"
              aria-label={`${i + 1}-р баннер`}
              onClick={() => ref.current?.scrollTo({ left: i * ref.current.clientWidth, behavior: "smooth" })}
              className={cn("h-2 rounded-full transition-all", i === index ? "w-6 bg-brand" : "w-2 bg-line")}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* -------------------------------- Open stats -------------------------------- */
/*
 * screen_02 bento, on 60px rows with 12px gaps:
 *   row 1–2   population (full width)
 *   rows 3–8  left: inflation (3 rows) + GDP (3 rows) = 420px
 *             right: unemployment, labour, livestock (2 rows each) = 420px
 *   rows 9–10 salary | income
 */
const STAT_META: Record<string, { art?: (p: { className?: string }) => React.ReactNode; place: string; note: string }> = {
  population: { place: "col-span-2 row-span-2", note: "Нийт бүртгэлтэй хүн амын тоо (жишээ өгөгдөл)." },
  inflation: { place: "col-start-1 row-start-3 row-span-3", note: "Жилийн инфляцын түвшин." },
  gdp: { place: "col-start-1 row-start-6 row-span-3", note: "Дотоодын нийт бүтээгдэхүүн, оны үнээр." },
  unemployment: { art: StatJobSearch, place: "col-start-2 row-start-3 row-span-2", note: "Ажиллах хүчний доторх ажилгүйчүүдийн хувь." },
  labor: { art: StatHandshake, place: "col-start-2 row-start-5 row-span-2", note: "Ажиллах насны хүн амд эзлэх ажиллах хүчний хувь." },
  livestock: { art: StatLivestock, place: "col-start-2 row-start-7 row-span-2", note: "Жилийн эцсийн мал тооллогын дүн." },
  salary: { art: StatSalary, place: "col-start-1 row-start-9 row-span-2", note: "Сарын дундаж цалин." },
  income: { art: StatIncome, place: "col-start-2 row-start-9 row-span-2", note: "Өрхийн сарын дундаж мөнгөн орлого." },
};

function Sparkline() {
  // Flat with a single sharp spike, as in screen_02.
  const pts = [22, 24, 23, 25, 23, 24, 22, 25, 26, 4, 20, 18, 21, 24, 25, 23, 25, 24];
  const d = pts.map((y, i) => `${(i / (pts.length - 1)) * 100},${y}`).join(" ");
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-x-0 top-[44%] h-[34%] w-full" aria-hidden>
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38BDF8" stopOpacity="0.28" />
          <stop offset="1" stopColor="#38BDF8" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <polygon points={`0,40 ${d} 100,40`} fill="url(#spark-fill)" />
      <polyline points={d} fill="none" stroke="#38BDF8" strokeWidth="1.6" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function OpenStats() {
  const { state } = useAppState();
  const [open, setOpen] = useState<StatItem | null>(null);
  const stats = state.liveData.stats;

  return (
    <section className="px-4 py-4" aria-labelledby="stats-h">
      <h2 id="stats-h" className="mb-3 text-[18px] font-bold text-ink">Нээлттэй мэдээлэл</h2>
      <div className="grid grid-cols-2 auto-rows-[60px] gap-3">
        {stats.map((s) => {
          const meta = STAT_META[s.id] ?? { place: "col-span-1 row-span-2", note: "" };
          const Art = meta.art;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setOpen(s)}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-card border border-line bg-card p-3.5 text-left shadow-sm active:scale-[0.98] transition",
                meta.place,
              )}
            >
              {s.id === "population" && <MongoliaMap className="absolute inset-0 size-full text-sky-500" />}
              {s.id === "inflation" && <Sparkline />}
              <span className={cn("relative z-10 text-[15px] leading-snug text-ink/85", Art && "pr-2")}>{s.label}</span>
              <span className="relative z-10 mt-auto flex items-center gap-2">
                {s.id === "gdp" && <span className="h-8 w-1 shrink-0 rounded-full bg-brand" />}
                <span className={cn("font-bold tabular-nums", s.id === "gdp" ? "text-[20px] text-brand" : "text-[21px] text-ink")}>{s.value}</span>
                {s.id === "population" && <MnFlag className="h-[18px] w-[30px]" />}
              </span>
              {Art && (
                <Art
                  className={cn(
                    "pointer-events-none absolute right-1.5 bottom-1.5",
                    s.id === "livestock" ? "h-[84px] w-[84px]" : "h-[62px] w-[78px]",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.label}>
        {open && (
          <div>
            <p className="text-[34px] font-extrabold text-brand tabular-nums">{open.value}</p>
            <p className="mt-2 text-[15px] text-muted">{STAT_META[open.id]?.note}</p>
            <p className="mt-4 rounded-2xl bg-soft p-3 text-[13px] text-muted">
              Эх сурвалж: Civic MGL жишээ өгөгдөл. Утгыг Админ удирдлага → Өгөгдөл & Ханш хэсгээс шинэчилнэ.
            </p>
          </div>
        )}
      </Sheet>
    </section>
  );
}
