"use client";

import { Building2, Clock, MapPin, Phone } from "lucide-react";
import { SERVICE_CENTERS } from "@/data/seed";
import { Page, Sheet, useTransient } from "@/components/ui";

export default function LocationsPage() {
  const [open, setOpen] = useTransient<(typeof SERVICE_CENTERS)[number] | null>(null);
  return (
    <Page title="Хаяг байршил">
      <div className="grid grid-cols-2 gap-3">
        {SERVICE_CENTERS.map((c) => (
          <button key={c.id} type="button" onClick={() => setOpen(c)} className="relative h-[112px] rounded-card bg-card p-3.5 text-left shadow-sm">
            <span className="block pr-6 text-[16px] font-semibold leading-snug text-ink">{c.name}</span>
            <Building2 className="absolute right-3 bottom-3 size-8 text-slate-500" />
          </button>
        ))}
      </div>
      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.name}>
        {open && (
          <div className="space-y-3 text-[15px] text-ink">
            <p className="flex gap-3"><MapPin className="size-5 shrink-0 text-brand" /> {open.address}</p>
            <p className="flex gap-3"><Clock className="size-5 shrink-0 text-brand" /> {open.hours}</p>
            <p className="flex gap-3"><Phone className="size-5 shrink-0 text-brand" /> {open.phone} (жишээ)</p>
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(open.address)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex h-12 items-center justify-center rounded-2xl brand-gradient font-semibold text-white"
            >
              Газрын зураг дээр харах
            </a>
          </div>
        )}
      </Sheet>
    </Page>
  );
}
