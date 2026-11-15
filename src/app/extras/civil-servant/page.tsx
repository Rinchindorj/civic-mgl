"use client";

import { IdCard, FileBadge, UserRoundSearch, Users } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { MenuGroup, MenuRow, Page, SectionTitle, Sheet, useTransient } from "@/components/ui";
import { ServiceCard } from "@/components/ServiceCard";
import { SampleBadge } from "@/components/Sample";

const EXAMS = [
  { title: "Төрийн жинхэнэ албаны ерөнхий шалгалт", date: "2026-12-07", place: "Улаанбаатар" },
  { title: "Тусгай шалгалт — Боловсролын салбар", date: "2026-12-14", place: "Улаанбаатар, Дархан" },
  { title: "Тусгай шалгалт — Эрүүл мэндийн салбар", date: "2027-01-11", place: "Бүх аймаг" },
];
const CATEGORIES = [
  ["Төрийн улс төрийн албан тушаал", "Сонгуулийн болон томилгооны"],
  ["Төрийн захиргааны албан тушаал", "ТЗ-1 … ТЗ-12 ангилал"],
  ["Төрийн тусгай албан тушаал", "Шүүх, прокурор, цэрэг, цагдаа"],
  ["Төрийн үйлчилгээний албан тушаал", "Боловсрол, эрүүл мэнд, соёл"],
];

type S = "anket" | "exams" | "reserve" | "cats" | null;

export default function CivilServantPage() {
  const { services, state } = useAppState();
  const u = state.sampleUser;
  const [sheet, setSheet] = useTransient<S>(null);
  const list = services.filter((s) => s.tags?.includes("civil"));

  return (
    <Page title="Төрийн албан хаагч">
      <MenuGroup>
        <MenuRow icon={IdCard} iconClass="bg-soft text-slate-600" title="Анкет харах" trailing="external" onClick={() => setSheet("anket")} />
        <MenuRow icon={FileBadge} iconClass="bg-soft text-slate-600" title="Зарлагдсан шалгалтууд" trailing="external" onClick={() => setSheet("exams")} />
        <MenuRow icon={UserRoundSearch} iconClass="bg-soft text-slate-600" title="Шалгалтын нөөцөд бүртгэлтэй эсэх" onClick={() => setSheet("reserve")} />
        <MenuRow icon={Users} iconClass="bg-soft text-slate-600" title="Төрийн албаны ангилал" onClick={() => setSheet("cats")} />
      </MenuGroup>

      <SectionTitle>Үйлчилгээ</SectionTitle>
      <div className="space-y-4">
        {list.map((s) => (
          <ServiceCard key={s.slug} service={s} />
        ))}
      </div>

      <Sheet open={sheet === "anket"} onClose={() => setSheet(null)} title="Төрийн албан хаагчийн анкет">
        <SampleBadge />
        <dl className="mt-3 space-y-2 rounded-2xl bg-soft p-4 text-[14px]">
          {[
            ["Овог нэр", `${u.lastName} ${u.firstName}`],
            ["Демо ID", u.demoId],
            ["Албан тушаал", "Мэргэжилтэн (жишээ)"],
            ["Байгууллага", "Civic MGL демо яам"],
            ["Ангилал, зэрэглэл", "ТЗ-5"],
            ["Төрийн албанд ажилласан", "2 жил 3 сар"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right font-semibold text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </Sheet>
      <Sheet open={sheet === "exams"} onClose={() => setSheet(null)} title="Зарлагдсан шалгалтууд">
        <ul className="space-y-3">
          {EXAMS.map((e) => (
            <li key={e.title} className="rounded-2xl bg-soft p-4">
              <p className="text-[15px] font-semibold text-ink">{e.title}</p>
              <p className="mt-1 text-[13px] text-muted">
                {e.date} · {e.place}
              </p>
            </li>
          ))}
        </ul>
      </Sheet>
      <Sheet open={sheet === "reserve"} onClose={() => setSheet(null)} title="Шалгалтын нөөц">
        <div className="rounded-2xl bg-emerald-500/10 p-4 text-[15px] text-ink">
          <p className="font-bold text-emerald-600">Нөөцөд бүртгэлтэй (жишээ)</p>
          <p className="mt-1">
            {u.lastName} {u.firstName} — Ерөнхий шалгалтын оноо 78/100. Нөөцийн хүчинтэй хугацаа: 2027-06-30.
          </p>
        </div>
      </Sheet>
      <Sheet open={sheet === "cats"} onClose={() => setSheet(null)} title="Төрийн албаны ангилал">
        <ul className="space-y-2.5">
          {CATEGORIES.map(([t, d]) => (
            <li key={t} className="rounded-2xl bg-soft p-4">
              <p className="text-[15px] font-semibold text-ink">{t}</p>
              <p className="text-[13px] text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </Sheet>
    </Page>
  );
}
