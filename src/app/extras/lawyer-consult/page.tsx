"use client";

import { useState } from "react";
import { Scale, Star } from "lucide-react";
import { LAWYERS } from "@/data/seed";
import { useAppState } from "@/context/AppStateContext";
import { Button, Field, Page, Sheet, inputCls, textareaCls, useTransient } from "@/components/ui";
import { dateKey, fmtDate, fmtTime, refNumber, uid } from "@/lib/utils";

export default function LawyerConsultPage() {
  const { addHistory, addNotification, toast } = useAppState();
  const [pick, setPick] = useTransient<(typeof LAWYERS)[number] | null>(null);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [date, setDate] = useState(dateKey(tomorrow));
  const [time, setTime] = useState("10:00");
  const [topic, setTopic] = useState("");

  return (
    <Page title="Өмгөөлөгчид хандах">
      <h2 className="text-[18px] font-bold text-ink">Өмгөөлөгч сонгох</h2>
      <p className="mt-1 text-[16px] leading-snug text-muted">Үнэ төлбөргүй анхан шатны хууль зүйн зөвлөгөө авах цаг захиална уу (демо).</p>
      <div className="mt-5 space-y-4">
        {LAWYERS.map((l) => (
          <div key={l.id} className="flex gap-4 rounded-card border border-line bg-card p-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-amber-500/10 text-amber-600">
              <Scale className="size-8" />
            </span>
            <div className="flex-1">
              <p className="text-[17px] font-semibold text-ink">{l.name}</p>
              <p className="text-[14px] text-muted">
                {l.field} · {l.exp} жил
              </p>
              <p className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-ink">
                <Star className="size-4 fill-amber-400 text-amber-400" /> {l.rating}
              </p>
              <div className="mt-2 flex justify-end">
                <button type="button" onClick={() => setPick(l)} className="rounded-xl bg-brand/10 px-4 py-3 text-[15px] font-bold text-brand">
                  Цаг захиалах
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Sheet
        open={!!pick}
        onClose={() => setPick(null)}
        title={`Цаг захиалах — ${pick?.name ?? ""}`}
        footer={
          <Button
            className="w-full"
            disabled={!topic.trim()}
            onClick={() => {
              if (!pick) return;
              const ref = refNumber("LAW");
              const now = new Date();
              addHistory({
                id: uid("h"),
                ref,
                date: `${fmtDate(now, "/")} ${fmtTime(now, false)}`,
                title: `Өмгөөлөгчийн зөвлөгөө: ${pick.name}`,
                status: "Зөвшөөрсөн",
                kind: "booking",
                details: { Огноо: date, Цаг: time, Сэдэв: topic },
              });
              addNotification({ type: "resolution", title: "Цаг баталгаажлаа", body: `${pick.name} — ${date} ${time}. Захиалгын дугаар ${ref}.` });
              toast("Цаг амжилттай захиалагдлаа", "success");
              setTopic("");
              setPick(null);
            }}
          >
            Баталгаажуулах
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Огноо">
              <input type="date" value={date} min={dateKey(new Date())} onChange={(e) => setDate(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Цаг">
              <select value={time} onChange={(e) => setTime(e.target.value)} className={inputCls}>
                {["10:00", "11:00", "14:00", "15:30", "17:00"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Зөвлөгөө авах сэдэв" required>
            <textarea value={topic} onChange={(e) => setTopic(e.target.value)} className={textareaCls} placeholder="Асуудлаа товч бичнэ үү" />
          </Field>
        </div>
      </Sheet>
    </Page>
  );
}
