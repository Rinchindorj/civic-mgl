"use client";

import { Award, RefreshCw } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { Card, HeaderIconButton, MenuRow, Page, Sheet, useTransient } from "@/components/ui";
import { SampleWatermark } from "@/components/Sample";
import { Emblem } from "@/components/Logo";

const LETTERS = [
  { id: "tax", title: "Татварын талархалын бичиг", org: "Татварын алба (жишээ)", reason: "татвараа хугацаанд нь, бүрэн төлсөн" },
  { id: "volunteer", title: "Сайн дурын ажлын талархал", org: "Civic MGL нийгэмлэг", reason: "иргэний оролцооны аянд идэвхтэй оролцсон" },
];

export default function GratitudePage() {
  const { state, toast } = useAppState();
  const u = state.sampleUser;
  const [open, setOpen] = useTransient<(typeof LETTERS)[number] | null>(null);

  return (
    <Page title="Талархал" fallback="/profile" right={<HeaderIconButton icon={RefreshCw} label="Шинэчлэх" onClick={() => toast("Шинэ талархал алга байна")} />}>
      <div className="space-y-3">
        {LETTERS.map((l) => (
          <Card key={l.id} className="overflow-hidden">
            <MenuRow icon={Award} iconClass="bg-navy/10 text-navy" title={l.title} onClick={() => setOpen(l)} />
          </Card>
        ))}
      </div>
      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.title}>
        {open && (
          <div className="relative overflow-hidden rounded-2xl border-4 border-double border-amber-500/60 bg-gradient-to-b from-amber-50 to-white p-6 text-center text-[#3b2a12]">
            <SampleWatermark />
            <Emblem className="mx-auto size-12" />
            <p className="mt-3 text-[12px] font-bold tracking-[0.3em] text-amber-700">ТАЛАРХАЛ</p>
            <p className="mt-3 text-[15px]">Эрхэм</p>
            <p className="text-[22px] font-extrabold">
              {u.lastName} {u.firstName}
            </p>
            <p className="mt-3 text-[14px] leading-relaxed">
              Таныг {open.reason} тул энэхүү талархлын бичгээр шагнаж байна.
            </p>
            <p className="mt-5 text-[12px] text-slate-500">{open.org} · 2026 он</p>
            <p className="mt-2 text-[10px] font-bold text-red-600">SAMPLE / ЗАГВАР — албан ёсны баримт биш</p>
          </div>
        )}
      </Sheet>
    </Page>
  );
}
