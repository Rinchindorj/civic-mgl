"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { JOB_PLATFORMS } from "@/data/seed";
import { Page, Sheet, useTransient } from "@/components/ui";

export default function JobsPage() {
  const [open, setOpen] = useTransient<string | null>(null);
  const platform = JOB_PLATFORMS.find((p) => p.id === open);

  return (
    <Page title="Ажлын байр">
      <h2 className="text-[18px] font-bold text-ink">Платформ сонгох</h2>
      <p className="mt-1 text-[16px] leading-snug text-muted">Ажлын байрны зар үзэхийн тулд аль платформ дээр үргэлжлүүлэхээ сонгоно уу.</p>
      <div className="mt-5 space-y-4">
        {JOB_PLATFORMS.map((p) => (
          <div key={p.id} className="flex gap-4 rounded-card border border-line bg-card p-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl ring-1 ring-line">
              <span className="grid size-12 place-items-center rounded-xl text-[13px] font-black text-white" style={{ background: p.color }}>
                {p.name.slice(0, 2).toUpperCase()}
              </span>
            </span>
            <div className="flex-1">
              <p className="text-[18px] font-semibold text-ink">{p.name}</p>
              <p className="mt-1 text-[15px] leading-snug text-muted">{p.desc}</p>
              <div className="mt-2 flex justify-end">
                <button type="button" onClick={() => setOpen(p.id)} className="rounded-xl bg-brand/10 px-4 py-3 text-[15px] font-bold text-brand">
                  Дэлгэрэнгүй
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Sheet open={!!platform} onClose={() => setOpen(null)} title={`${platform?.name ?? ""} — шинэ зарууд`}>
        {platform && (
          <>
            <ul className="space-y-3">
              {platform.jobs.map((j) => (
                <li key={j.title} className="rounded-2xl bg-soft p-4">
                  <p className="text-[15px] font-bold text-ink">{j.title}</p>
                  <p className="text-[13px] text-muted">{j.company} (жишээ)</p>
                  <div className="mt-2 flex justify-between text-[13px]">
                    <span className="flex items-center gap-1 text-muted">
                      <MapPin className="size-4" /> {j.place}
                    </span>
                    <span className="font-bold text-brand">{j.salary}</span>
                  </div>
                </li>
              ))}
            </ul>
            <a
              href={platform.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex h-12 items-center justify-center gap-2 rounded-2xl brand-gradient font-semibold text-white"
            >
              {platform.name} руу орох <ExternalLink className="size-4" />
            </a>
            <p className="mt-2 text-center text-[12px] text-muted">Дээрх зарууд жишээ. Гадаад сайт шинэ цонхонд нээгдэнэ.</p>
          </>
        )}
      </Sheet>
    </Page>
  );
}
