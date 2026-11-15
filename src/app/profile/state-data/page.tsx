"use client";

import { Users, GraduationCap, ShieldCheck, Car, Home, HeartPulse } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { Card, MenuRow, Page, Sheet, useTransient } from "@/components/ui";
import { SampleBadge } from "@/components/Sample";
import { ageFrom } from "@/lib/utils";

export default function StateDataPage() {
  const { state } = useAppState();
  const u = state.sampleUser;
  const [open, setOpen] = useTransient<string | null>(null);

  const groups: { id: string; title: string; sub: string; icon: LucideIcon; tone: string; rows: [string, string][] }[] = [
    {
      id: "civil",
      title: "Иргэний бүртгэл",
      sub: "Овог нэр, төрсөн огноо, хаяг",
      icon: Users,
      tone: "bg-emerald-500/12 text-emerald-600",
      rows: [
        ["Ургийн овог", u.clan],
        ["Овог нэр", `${u.lastName} ${u.firstName}`],
        ["Төрсөн огноо", u.birthdate],
        ["Нас", String(ageFrom(u.birthdate) ?? "—")],
        ["Демо регистр", u.sampleReg],
        ["Хаяг", "Улаанбаатар, Сүхбаатар дүүрэг (жишээ)"],
      ],
    },
    {
      id: "edu",
      title: "Боловсрол",
      sub: "Сургууль, диплом",
      icon: GraduationCap,
      tone: "bg-indigo-500/12 text-indigo-600",
      rows: [
        ["Бүрэн дунд боловсрол", "Демо сургууль, 2025"],
        ["Дээд боловсрол", "Демо их сургууль — суралцаж буй"],
      ],
    },
    {
      id: "social",
      title: "Нийгмийн даатгал",
      sub: "Шимтгэл төлөлт",
      icon: ShieldCheck,
      tone: "bg-sky-500/12 text-sky-600",
      rows: [
        ["Даатгуулагчийн төрөл", "Сайн дурын (жишээ)"],
        ["Сүүлд төлсөн", "2026-10"],
        ["Нийт төлсөн сар", "14"],
      ],
    },
    {
      id: "health",
      title: "Эрүүл мэнд",
      sub: "Даатгал, харьяалах эмнэлэг",
      icon: HeartPulse,
      tone: "bg-rose-500/12 text-rose-600",
      rows: [
        ["ЭМД төлөлт", "Хэвийн"],
        ["Өрхийн эмнэлэг", "Демо өрхийн эрүүл мэндийн төв"],
      ],
    },
    {
      id: "vehicle",
      title: "Тээврийн хэрэгсэл",
      sub: "Бүртгэлтэй тээврийн хэрэгсэл",
      icon: Car,
      tone: "bg-amber-500/12 text-amber-600",
      rows: [["Бүртгэлтэй", "Байхгүй"]],
    },
    {
      id: "property",
      title: "Үл хөдлөх хөрөнгө",
      sub: "Өмчлөлийн мэдээлэл",
      icon: Home,
      tone: "bg-violet-500/12 text-violet-600",
      rows: [["Бүртгэлтэй", "Байхгүй"]],
    },
  ];
  const g = groups.find((x) => x.id === open);

  return (
    <Page title="Төрд байгаа миний мэдээлэл" fallback="/profile">
      <Card className="mb-4 p-4">
        <p className="text-[14px] text-muted">Демо гишүүнчлэлийн дугаар</p>
        <p className="text-[17px] font-bold text-ink">{u.demoId}</p>
        <SampleBadge className="mt-2" />
      </Card>
      <div className="space-y-3">
        {groups.map((x) => (
          <Card key={x.id} className="overflow-hidden">
            <MenuRow icon={x.icon} iconClass={x.tone} title={x.title} subtitle={x.sub} onClick={() => setOpen(x.id)} className="py-4" />
          </Card>
        ))}
      </div>
      <Sheet open={!!g} onClose={() => setOpen(null)} title={g?.title}>
        {g && (
          <>
            <SampleBadge />
            <dl className="mt-3 space-y-2.5 rounded-2xl bg-soft p-4 text-[14.5px]">
              {g.rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </Sheet>
    </Page>
  );
}
