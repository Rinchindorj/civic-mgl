"use client";

import { useState } from "react";
import { FileSignature, Info, Users, UsersRound } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { Button, MenuGroup, MenuRow, Page, Sheet, textareaCls, useTransient } from "@/components/ui";
import { cn } from "@/lib/utils";

const DRAFTS = [
  { id: "d1", title: "Эрүүл мэндийн тухай хуулийн шинэчилсэн найруулгын төсөл", until: "2026-12-01" },
  { id: "d2", title: "Тариалангийн индексжүүлсэн даатгалын тухай хуулийн төсөл", until: "2026-11-30" },
  { id: "d3", title: "Нийтийн тээврийн тухай хуульд нэмэлт өөрчлөлт оруулах төсөл", until: "2026-12-20" },
];
const PETITIONS = [
  { id: "pp1", title: "Сургуулийн өмнөх боловсролын хүртээмжийг нэмэгдүүлэх", base: 8214, goal: 10000 },
  { id: "pp2", title: "Агаарын бохирдлыг бууруулах нэмэлт арга хэмжээ авах", base: 15420, goal: 20000 },
  { id: "pp3", title: "Хөдөө орон нутгийн замын сүлжээг сайжруулах", base: 3902, goal: 10000 },
];
const MEMBERS = [
  { name: "Гишүүн А (жишээ)", rate: 96 },
  { name: "Гишүүн Б (жишээ)", rate: 88 },
  { name: "Гишүүн В (жишээ)", rate: 74 },
  { name: "Гишүүн Г (жишээ)", rate: 91 },
  { name: "Гишүүн Д (жишээ)", rate: 67 },
];

type SheetId = "drafts" | "petitions" | "members" | "feedback" | null;

export default function ParliamentPage() {
  const { toast } = useAppState();
  const [sheet, setSheet] = useTransient<SheetId>(null);
  const [votes, setVotes] = useState<Record<string, "yes" | "no">>({});
  const [signed, setSigned] = useState<Record<string, boolean>>({});
  const [text, setText] = useState("");

  return (
    <Page title="Нээлттэй Парламент">
      <MenuGroup>
        <MenuRow icon={FileSignature} iconClass="bg-sky-500/10 text-sky-700" title="Хууль тогтоомжийн төсөлд санал өгөх" onClick={() => setSheet("drafts")} />
        <MenuRow icon={UsersRound} iconClass="bg-sky-500/10 text-sky-700" title="Нийтийн өргөдөл санаачлах, дэмжих" onClick={() => setSheet("petitions")} />
        <MenuRow icon={Users} iconClass="bg-sky-500/10 text-sky-700" title="УИХ-ын гишүүдийн ирцийн мэдээлэлтэй танилцах" onClick={() => setSheet("members")} />
      </MenuGroup>

      <div className="mt-6 rounded-card bg-sky-400/15 p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white">
            <Info className="size-6 fill-brand text-white" />
          </span>
          <div>
            <p className="text-[18px] font-medium text-ink">Парламент таныг сонсож байна</p>
            <p className="mt-1 text-[14px] tracking-[0.12em] text-ink/80">/Хуулийн хэрэгжилт - Таны амьдралд/</p>
          </div>
        </div>
        <Button className="mt-4 w-full" onClick={() => setSheet("feedback")}>
          Санал илгээх
        </Button>
      </div>

      <Sheet open={sheet === "drafts"} onClose={() => setSheet(null)} title="Хуулийн төслүүд">
        <ul className="space-y-3">
          {DRAFTS.map((d) => (
            <li key={d.id} className="rounded-2xl bg-soft p-4">
              <p className="text-[15px] font-semibold text-ink">{d.title}</p>
              <p className="mt-1 text-[12.5px] text-muted">Санал авах хугацаа: {d.until}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["yes", "no"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      setVotes((s) => ({ ...s, [d.id]: v }));
                      toast("Таны санал бүртгэгдлээ", "success");
                    }}
                    className={cn(
                      "rounded-xl py-2.5 text-[14px] font-bold",
                      votes[d.id] === v ? (v === "yes" ? "bg-emerald-500 text-white" : "bg-red-500 text-white") : "bg-card text-ink ring-1 ring-line",
                    )}
                  >
                    {v === "yes" ? "Дэмжиж байна" : "Дэмжихгүй"}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Sheet>

      <Sheet open={sheet === "petitions"} onClose={() => setSheet(null)} title="Нийтийн өргөдөл">
        <ul className="space-y-3">
          {PETITIONS.map((p) => {
            const count = p.base + (signed[p.id] ? 1 : 0);
            return (
              <li key={p.id} className="rounded-2xl bg-soft p-4">
                <p className="text-[15px] font-semibold text-ink">{p.title}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${Math.min(100, (count / p.goal) * 100)}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-[13px] text-muted">
                  <span>
                    {count.toLocaleString()} / {p.goal.toLocaleString()} дэмжигч
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSigned((s) => ({ ...s, [p.id]: !s[p.id] }));
                      toast(signed[p.id] ? "Дэмжлэгээ цуцаллаа" : "Өргөдлийг дэмжлээ", "success");
                    }}
                    className={cn("rounded-lg px-3 py-1.5 text-[13px] font-bold", signed[p.id] ? "bg-emerald-500 text-white" : "bg-brand text-white")}
                  >
                    {signed[p.id] ? "Дэмжсэн ✓" : "Дэмжих"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </Sheet>

      <Sheet open={sheet === "members"} onClose={() => setSheet(null)} title="Чуулганы ирц (жишээ)">
        <ul className="space-y-3">
          {MEMBERS.map((m) => (
            <li key={m.name} className="rounded-2xl bg-soft p-3.5">
              <div className="flex justify-between text-[15px]">
                <span className="font-semibold text-ink">{m.name}</span>
                <span className="font-bold tabular-nums text-ink">{m.rate}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-brand" style={{ width: `${m.rate}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </Sheet>

      <Sheet
        open={sheet === "feedback"}
        onClose={() => setSheet(null)}
        title="Парламентад санал илгээх"
        footer={
          <Button
            className="w-full"
            disabled={!text.trim()}
            onClick={() => {
              setText("");
              setSheet(null);
              toast("Таны санал илгээгдлээ (демо)", "success");
            }}
          >
            Илгээх
          </Button>
        }
      >
        <textarea value={text} onChange={(e) => setText(e.target.value)} className={textareaCls} placeholder="Хуулийн хэрэгжилтийн талаарх саналаа бичнэ үү" />
      </Sheet>
    </Page>
  );
}
