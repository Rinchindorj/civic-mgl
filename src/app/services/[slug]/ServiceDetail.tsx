"use client";

import { useState } from "react";
import { Bookmark, MapPin, Phone, Building2 } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { findCategory } from "@/data/catalog";
import type { HistoryItem } from "@/data/seed";
import { BackButton, Button, ButtonLink, EmptyState, Sheet, useTransient } from "@/components/ui";
import { ChannelIcons } from "@/components/ServiceCard";
import { SlipSheet, useServiceRequest } from "@/components/Slip";
import { SampleBadge } from "@/components/Sample";
import { cn } from "@/lib/utils";

export default function ServiceDetail({ slug }: { slug: string }) {
  const { findService, state, toggleSaved } = useAppState();
  const service = findService(slug);
  const request = useServiceRequest();
  const [confirm, setConfirm] = useTransient(false);
  const [slip, setSlip] = useTransient<HistoryItem | null>(null);
  const [expanded, setExpanded] = useState(false);

  if (!service) {
    return (
      <div className="min-h-screen px-4 pt-4">
        <BackButton fallback="/services" />
        <EmptyState title="Үйлчилгээ олдсонгүй">
          <ButtonLink href="/services" className="w-full">
            Бүх үйлчилгээ
          </ButtonLink>
        </EmptyState>
      </div>
    );
  }

  const saved = state.savedServices.includes(service.slug);
  const u = state.sampleUser;

  return (
    <div className="min-h-screen pb-32">
      <div className="sticky top-0 z-20 flex items-center justify-between bg-app/85 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-2 backdrop-blur-md">
        <BackButton fallback="/services" />
        <button
          type="button"
          onClick={() => toggleSaved(service.slug)}
          aria-pressed={saved}
          aria-label={saved ? "Хадгалснаас хасах" : "Хадгалах"}
          className="grid size-11 place-items-center rounded-2xl bg-card text-muted shadow-sm ring-1 ring-line/60"
        >
          <Bookmark className={cn("size-5", saved && "fill-orange-400 text-orange-400")} />
        </button>
      </div>

      <div className="px-4">
        <h1 className="text-[20px] font-bold leading-snug text-ink">{service.title}</h1>
        <div className="mt-3 border-t-2 border-dotted border-line" />
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-[15px] text-ink/80">Хугацаа</p>
            <p className="text-[17px] font-bold text-brand">{service.duration}</p>
          </div>
          <span className={cn("rounded-xl px-4 py-2.5 text-[15px] font-semibold", service.paid ? "bg-amber-500/15 text-amber-600" : "bg-soft text-ink")}>
            {service.paid ? "Төлбөртэй" : "Төлбөргүй"}
          </span>
        </div>
        {service.fee && <p className="mt-1 text-right text-[13px] text-muted">{service.fee}</p>}
      </div>

      <div className="mt-4 flex items-center justify-between border-y-[6px] border-soft bg-card px-4 py-3">
        <span className="text-[14px] text-ink/80">Үйлчилгээ авах боломжтой сувгууд</span>
        <ChannelIcons channels={service.channels} />
      </div>

      <section className="px-4 pt-5">
        <h2 className="text-[17px] font-bold text-ink">Үйлчилгээ үзүүлэгч байгууллага</h2>
        <div className="mt-3 space-y-4 rounded-card bg-soft p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-card text-brand">
              <Building2 className="size-6" />
            </span>
            <span className="text-[17px] font-medium leading-snug text-brand">{service.org}</span>
          </div>
          <a href={`tel:${service.phone.replace(/\D/g, "")}`} className="flex items-center gap-4 text-[16px] text-ink">
            <Phone className="size-6 fill-ink text-ink" /> {service.phone}
          </a>
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(service.address)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-4 text-[16px] leading-snug text-ink"
          >
            <MapPin className="mt-0.5 size-6 shrink-0 fill-ink text-soft" /> {service.address}
          </a>
        </div>
      </section>

      <section className="px-4 pt-5">
        <h2 className="text-[17px] font-bold text-ink">Үйлчилгээний тухай</h2>
        <div className="mt-3 rounded-card bg-soft p-4 text-[16px] leading-relaxed whitespace-pre-line text-ink/90">
          <p className={cn(!expanded && "line-clamp-6")}>{service.about}</p>
          {service.about.length > 180 && (
            <button type="button" onClick={() => setExpanded((v) => !v)} className="mt-2 text-[14px] font-bold text-brand">
              {expanded ? "Хураах" : "Дэлгэрэнгүй унших"}
            </button>
          )}
        </div>
        {service.category && (
          <p className="mt-3 text-[13px] text-muted">
            Ангилал: <span className="font-semibold text-ink">{findCategory(service.category)?.title ?? "Бусад"}</span>
          </p>
        )}
      </section>

      <div className="frame-fixed bottom-0 z-30 bg-gradient-to-t from-app via-app to-transparent px-4 pt-6 pb-[max(env(safe-area-inset-bottom),20px)]">
        <Button className="w-full h-14 text-[16px]" onClick={() => setConfirm(true)}>
          Үйлчилгээ авах
        </Button>
      </div>

      <Sheet
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Хүсэлт баталгаажуулах"
        footer={
          <Button
            className="w-full"
            onClick={() => {
              const item = request(service);
              setConfirm(false);
              setSlip(item);
            }}
          >
            {service.paid ? "Төлбөр төлөх (демо) & илгээх" : "Лавлагаа үүсгэх"}
          </Button>
        }
      >
        <SampleBadge />
        <p className="mt-3 text-[15px] text-muted">Дараах мэдээллээр ЗАГВАР лавлагаа үүсгэнэ:</p>
        <dl className="mt-3 space-y-2 rounded-2xl bg-soft p-4 text-[14px]">
          {[
            ["Үйлчилгээ", service.title],
            ["Овог нэр", `${u.lastName} ${u.firstName}`],
            ["Демо регистр", u.sampleReg],
            ["Утас", u.phone],
            ["И-мэйл", u.email],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right font-semibold text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </Sheet>
      <SlipSheet item={slip} onClose={() => setSlip(null)} />
    </div>
  );
}
