"use client";

import { UserRound, Award, Gift } from "lucide-react";
import { useAppState, displayName } from "@/context/AppStateContext";
import { ButtonLink, MenuGroup, MenuRow, Page, SectionTitle, Sheet, useTransient } from "@/components/ui";
import { ServiceCard } from "@/components/ServiceCard";
import { Avatar, SampleWatermark } from "@/components/Sample";
import { ageFrom } from "@/lib/utils";

type S = "info" | "grants" | "useful" | null;

export default function StudentPage() {
  const { services, state } = useAppState();
  const u = state.sampleUser;
  const [sheet, setSheet] = useTransient<S>(null);
  const list = services.filter((s) => s.tags?.includes("student"));

  return (
    <Page title="Оюутан">
      <MenuGroup>
        <MenuRow icon={UserRound} iconClass="bg-soft text-slate-600" title="Миний мэдээлэл" onClick={() => setSheet("info")} />
        <MenuRow icon={Award} iconClass="bg-soft text-slate-600" title="Тэтгэлэг" onClick={() => setSheet("grants")} />
        <MenuRow icon={Gift} iconClass="bg-soft text-slate-600" title="Танд хэрэгтэй" onClick={() => setSheet("useful")} />
      </MenuGroup>

      <SectionTitle>Үйлчилгээ</SectionTitle>
      <div className="space-y-4">
        {list.map((s) => (
          <ServiceCard key={s.slug} service={s} />
        ))}
      </div>

      <Sheet open={sheet === "info"} onClose={() => setSheet(null)} title="Оюутны мэдээлэл">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-700 p-4 text-white">
          <SampleWatermark />
          <p className="text-[11px] font-bold tracking-widest opacity-80">CIVIC MGL · STUDENT DEMO CARD</p>
          <div className="mt-3 flex items-center gap-3">
            <Avatar user={u} className="size-16 ring-2 ring-white/60" />
            <div>
              <p className="text-[18px] font-bold">{displayName(u)}</p>
              <p className="text-[13px] opacity-85">Демо их сургууль · 1-р курс</p>
              <p className="text-[13px] opacity-85">Нас: {ageFrom(u.birthdate) ?? "—"}</p>
            </div>
          </div>
          <p className="mt-3 font-mono text-[13px] tracking-wider">SAMPLE-998877</p>
        </div>
      </Sheet>
      <Sheet open={sheet === "grants"} onClose={() => setSheet(null)} title="Тэтгэлэг">
        <ul className="space-y-3">
          {[
            ["Сурлагын тэтгэлэг", "Голч дүн 3.5-аас дээш", "2026-12-15"],
            ["Нийгмийн халамжийн тэтгэлэг", "Өрхийн орлогын шалгуур", "2026-12-31"],
            ["Гадаадад суралцах тэтгэлэг", "Хэлний түвшин B2+", "2027-02-01"],
          ].map(([t, c, d]) => (
            <li key={t} className="rounded-2xl bg-soft p-4">
              <p className="text-[15px] font-semibold text-ink">{t}</p>
              <p className="text-[13px] text-muted">
                {c} · Хүсэлт авах: {d}
              </p>
            </li>
          ))}
        </ul>
      </Sheet>
      <Sheet open={sheet === "useful"} onClose={() => setSheet(null)} title="Танд хэрэгтэй">
        <div className="space-y-3">
          <ButtonLink href="/extras/transit-tickets" variant="soft" className="w-full">Тээврийн тасалбар захиалах</ButtonLink>
          <ButtonLink href="/extras/jobs" variant="soft" className="w-full">Цагийн ажил хайх</ButtonLink>
          <ButtonLink href="/services/health-insurance-payment" variant="soft" className="w-full">ЭМД төлөх</ButtonLink>
        </div>
      </Sheet>
    </Page>
  );
}
