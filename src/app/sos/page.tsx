"use client";

import { Phone, Siren } from "lucide-react";
import { EMERGENCY } from "@/data/seed";
import { Page } from "@/components/ui";

export default function SosPage() {
  return (
    <Page title="Яаралтай тусламж">
      <div className="flex items-center gap-3 rounded-card bg-gradient-to-br from-red-500 to-red-700 p-4 text-white shadow-lg">
        <Siren className="size-10 shrink-0" />
        <p className="text-[14.5px] font-medium leading-snug">
          Амь нас, эрүүл мэнд, эд хөрөнгөд аюул тулгарвал доорх дугаар руу шууд залгана уу. Эдгээр нь бодит яаралтай дугаар.
        </p>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {EMERGENCY.map((e) => (
          <a key={e.code} href={`tel:${e.code}`} className="flex flex-col rounded-card bg-card p-4 shadow-sm active:scale-[0.98] transition">
            <span className="text-[34px] font-black leading-none" style={{ color: e.color }}>
              {e.code}
            </span>
            <span className="mt-2 text-[15px] font-bold leading-snug text-ink">{e.title}</span>
            <span className="mt-1 text-[12.5px] leading-snug text-muted">{e.desc}</span>
            <span className="mt-3 flex items-center justify-center gap-2 rounded-xl py-2.5 text-[14px] font-bold text-white" style={{ background: e.color }}>
              <Phone className="size-4" /> Залгах
            </span>
          </a>
        ))}
      </div>
    </Page>
  );
}
