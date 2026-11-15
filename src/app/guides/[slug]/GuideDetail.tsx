"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { findGuide } from "@/data/catalog";
import { useAppState } from "@/context/AppStateContext";
import { Button, ButtonLink, EmptyState, Page, Sheet, useTransient } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function GuideDetail({ slug }: { slug: string }) {
  const guide = findGuide(slug);
  const { findService } = useAppState();
  const [open, setOpen] = useTransient(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  if (!guide) {
    return (
      <Page title="Хөтөч" fallback="/guides">
        <EmptyState title="Хөтөч олдсонгүй">
          <ButtonLink href="/guides" className="w-full">Бүх хөтөч</ButtonLink>
        </EmptyState>
      </Page>
    );
  }

  const done = step >= guide.steps.length;
  const current = guide.steps[step];
  const recs = guide.recommend.map(findService).filter((s) => s !== undefined);

  const start = () => {
    setStep(0);
    setAnswers([]);
    setOpen(true);
  };

  return (
    <Page title={guide.title} fallback="/guides">
      <div className="rounded-card bg-card shadow-sm">
        <div className="p-4">
          <h2 className="text-[19px] font-semibold text-ink">{guide.title}</h2>
          <p className="mt-1.5 text-[15px] text-muted">Хөтөч үүсгэсэн байгууллага</p>
          <p className="text-[16px] font-bold text-ink">{guide.org}</p>
          <p className="mt-1.5 text-[15px] text-muted">Сүүлд шинэчилсэн огноо</p>
          <p className="text-[16px] font-bold text-ink">{guide.updated}</p>
        </div>
        <div className="border-t border-line p-4">
          <p className="text-[15px] text-muted">Хөтчийн агуулга</p>
          <button type="button" onClick={start} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-soft px-2.5 py-1.5 text-[13px] font-semibold text-ink">
            <Sparkles className="size-4" /> Асуудал тодорхойлох асуулт
          </button>
        </div>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-card bg-card p-6 shadow-sm">
        <svg aria-hidden className="absolute -top-10 -right-10 size-64 text-line" viewBox="0 0 200 200">
          {[40, 70, 100, 130].map((r) => (
            <circle key={r} cx="200" cy="0" r={r} fill="none" stroke="currentColor" />
          ))}
        </svg>
        <span className="relative grid size-11 place-items-center rounded-xl bg-soft text-ink">
          <Sparkles className="size-6" />
        </span>
        <h3 className="relative mt-4 text-[19px] font-semibold text-ink">Асуудал тодорхойлох асуулт</h3>
        <p className="relative mt-2 text-[16px] leading-relaxed text-muted">
          Бид таны нөхцөл байдлыг үнэлж, хэрэгцээнд чинь нийцсэн үйлчилгээ, мэдээлэл санал болгох болно
        </p>
        <Button className="relative mt-5 w-full" onClick={start}>
          Асуулга эхлүүлэх
        </Button>
      </div>

      <h3 className="mt-6 mb-3 text-[17px] font-bold text-ink">Холбогдох үйлчилгээ</h3>
      <div className="overflow-hidden rounded-card bg-card shadow-sm divide-y divide-line">
        {recs.map((s) => (
          <Link key={s.slug} href={`/services/${s.slug}`} className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex-1 text-[15px] font-semibold text-ink">{s.title}</span>
            <ChevronRight className="size-5 text-muted" />
          </Link>
        ))}
      </div>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={done ? "Танд санал болгох үйлчилгээ" : `Асуулт ${step + 1} / ${guide.steps.length}`}
      >
        <div className="mb-4 flex gap-1.5">
          {guide.steps.map((_, i) => (
            <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < step || done ? "bg-brand" : "bg-line")} />
          ))}
        </div>
        {!done && current ? (
          <>
            <p className="text-[17px] font-semibold text-ink">{current.q}</p>
            <div className="mt-4 space-y-2.5">
              {current.options.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => {
                    setAnswers((a) => [...a, o]);
                    setStep((s) => s + 1);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl bg-soft px-4 py-4 text-left text-[16px] font-medium text-ink active:bg-brand/10"
                >
                  {o}
                  <ChevronRight className="size-5 text-muted" />
                </button>
              ))}
            </div>
            {step > 0 && (
              <button
                type="button"
                onClick={() => {
                  setStep((s) => s - 1);
                  setAnswers((a) => a.slice(0, -1));
                }}
                className="mt-4 text-[14px] font-semibold text-brand"
              >
                ← Өмнөх асуулт
              </button>
            )}
          </>
        ) : (
          <>
            <ul className="mb-4 space-y-1 rounded-2xl bg-soft p-3 text-[13px] text-muted">
              {answers.map((a, i) => (
                <li key={i}>
                  {i + 1}. {guide.steps[i]?.q} — <b className="text-ink">{a}</b>
                </li>
              ))}
            </ul>
            <div className="space-y-2.5">
              {recs.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-2xl ring-1 ring-line px-4 py-3.5"
                >
                  <span className="flex-1 text-[15px] font-semibold text-ink">{s.title}</span>
                  <span className="text-[13px] font-bold text-brand">Авах</span>
                </Link>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full" onClick={start}>
              Дахин эхлэх
            </Button>
          </>
        )}
      </Sheet>
    </Page>
  );
}
