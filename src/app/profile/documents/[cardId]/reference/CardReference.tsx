"use client";

import { useState } from "react";
import { Building2, Phone } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import type { HistoryItem } from "@/data/seed";
import { BackButton, Button, ButtonLink, EmptyState, useTransient } from "@/components/ui";
import { ChannelIcons } from "@/components/ServiceCard";
import { SlipSheet, useServiceRequest } from "@/components/Slip";
import { holderMeta } from "@/lib/documents";
import { cn } from "@/lib/utils";

const ORG = "Цахим үйлчилгээний нэгдсэн систем — Civic MGL";
const PHONE = "11-11";

/** Reference detail for one card, styled after screen_26 (service detail). */
export default function CardReference({ cardId }: { cardId: string }) {
  const { state } = useAppState();
  const request = useServiceRequest();
  const [slip, setSlip] = useTransient<HistoryItem | null>(null);
  const [expanded, setExpanded] = useState(false);

  const holder = state.holderCards.find((c) => c.id === cardId);
  const meta = holder && holderMeta(holder);

  if (!meta) {
    return (
      <div className="min-h-screen px-4 pt-4">
        <BackButton fallback="/profile/documents" />
        <EmptyState title="Карт олдсонгүй">
          <ButtonLink href="/profile/documents" className="w-full">
            Миний бичиг баримт
          </ButtonLink>
        </EmptyState>
      </div>
    );
  }

  const title = `${meta.name} лавлагаа`;

  return (
    <div className="min-h-screen pb-32">
      <header className="sticky top-0 z-20 bg-app/85 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 backdrop-blur-md">
        <div className="flex min-h-11 items-center gap-3">
          <BackButton fallback="/profile/documents" />
          <h1 className="line-clamp-2 flex-1 text-center text-[17px] font-bold leading-tight text-ink">{title}</h1>
          <span className="size-11 shrink-0" aria-hidden />
        </div>
      </header>

      <div className="px-4">
        <div className="border-t-2 border-dotted border-line" />
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-[15px] text-ink/80">Хугацаа</p>
            <p className="text-[17px] font-bold text-brand">Шууд</p>
          </div>
          <span className="rounded-xl bg-soft px-4 py-2.5 text-[15px] font-semibold text-ink">Төлбөргүй</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-y-[6px] border-soft bg-card px-4 py-3">
        <span className="text-[14px] text-ink/80">Үйлчилгээ авах боломжтой сувгууд</span>
        <ChannelIcons channels={["mobile", "web", "agent"]} />
      </div>

      <section className="px-4 pt-5">
        <h2 className="text-[17px] font-bold text-ink">Үйлчилгээ үзүүлэгч байгууллага</h2>
        <div className="mt-3 space-y-4 rounded-card bg-soft p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-card text-brand">
              <Building2 className="size-6" />
            </span>
            <span className="text-[17px] font-medium leading-snug text-brand">{ORG}</span>
          </div>
          <a href="tel:1111" className="flex items-center gap-4 text-[16px] text-ink">
            <Phone className="size-6 fill-ink text-ink" /> {PHONE}
          </a>
        </div>
      </section>

      <section className="px-4 pt-5">
        <h2 className="text-[17px] font-bold text-ink">Үйлчилгээний тухай</h2>
        <div className="mt-3 rounded-card bg-soft p-4 text-[16px] leading-relaxed whitespace-pre-line text-ink/90">
          <p className={cn(!expanded && "line-clamp-6")}>{meta.about}</p>
          {meta.about.length > 180 && (
            <button type="button" onClick={() => setExpanded((v) => !v)} className="mt-2 text-[14px] font-bold text-brand">
              {expanded ? "Хураах" : "Дэлгэрэнгүй унших"}
            </button>
          )}
        </div>
      </section>

      <div className="frame-fixed bottom-0 z-30 bg-gradient-to-t from-app via-app to-transparent px-4 pt-6 pb-[max(env(safe-area-inset-bottom),20px)]">
        <Button
          className="h-14 w-full text-[16px]"
          onClick={() =>
            // Logs to Үйлчилгээний түүх + notifications, then shows the QR slip.
            setSlip(request({ slug: `document-${meta.id}`, title, paid: false }, "service", { Карт: meta.title }))
          }
        >
          Лавлагаа авах
        </Button>
      </div>

      <SlipSheet item={slip} onClose={() => setSlip(null)} />
    </div>
  );
}
