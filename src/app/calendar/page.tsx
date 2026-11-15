"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Clock, Plus, Trash2 } from "lucide-react";
import { useAppState, useNow } from "@/context/AppStateContext";
import { CIVIC_DAYS, HOLIDAYS, type CalendarEvent } from "@/data/seed";
import { Button, EmptyBox, Field, Page, Sheet, inputCls, useTransient } from "@/components/ui";
import { cn, dateKey, fmtTime, pad, uid, WEEKDAYS } from "@/lib/utils";

const HEAD = ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"];
type Filter = "all" | CalendarEvent["type"];
const TYPE_LABEL: Record<CalendarEvent["type"], string> = {
  holiday: "Баярын өдөр",
  civic: "Иргэний сануулга",
  personal: "Миний үйл явдал",
};
const TYPE_DOT: Record<CalendarEvent["type"], string> = {
  holiday: "bg-violet-500",
  civic: "bg-emerald-500",
  personal: "bg-brand",
};

function eventsFor(d: Date, personal: CalendarEvent[]): CalendarEvent[] {
  const key = dateKey(d);
  const md = key.slice(5);
  const out: CalendarEvent[] = [];
  HOLIDAYS.filter((h) => h.md === md).forEach((h, i) => out.push({ id: `h${key}${i}`, date: key, title: h.title, type: "holiday" }));
  CIVIC_DAYS.filter((c) => c.day === d.getDate()).forEach((c, i) => out.push({ id: `c${key}${i}`, date: key, title: c.title, type: "civic" }));
  return [...out, ...personal.filter((e) => e.date === key)];
}

export default function CalendarPage() {
  const now = useNow();
  const { state, update, toast } = useAppState();
  const [view, setView] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [selected, setSelected] = useState(() => new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  const [filter, setFilter] = useState<Filter>("all");
  const [adding, setAdding] = useTransient(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");

  const days = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7; // Monday first
    const start = new Date(first);
    start.setDate(1 - offset);
    const total = Math.ceil((offset + new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()) / 7) * 7;
    return Array.from({ length: total }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [view]);

  const todayKey = dateKey(now);
  const selKey = dateKey(selected);
  const dayEvents = eventsFor(selected, state.events).filter((e) => filter === "all" || e.type === filter);

  const shift = (m: number) => setView((v) => new Date(v.getFullYear(), v.getMonth() + m, 1));
  const goToday = () => {
    setView(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelected(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  };

  return (
    <Page title="Цагалбар">
      <div className="mb-3 flex items-center justify-between rounded-2xl bg-card px-4 py-3 shadow-sm">
        <span className="flex items-center gap-2 text-[14px] text-muted">
          <Clock className="size-4 text-brand" />
          {WEEKDAYS[now.getDay()]}, {now.getFullYear()}.{pad(now.getMonth() + 1)}.{pad(now.getDate())}
        </span>
        <span className="text-[20px] font-bold tabular-nums text-ink">{fmtTime(now)}</span>
      </div>

      <div className="overflow-hidden rounded-card bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-line p-3">
          <button type="button" onClick={goToday} className="rounded-xl brand-gradient px-4 py-2.5 text-[16px] font-bold text-white">
            {view.getFullYear()} он {view.getMonth() + 1}-р сар
          </button>
          <div className="flex gap-2">
            <button type="button" aria-label="Өмнөх сар" onClick={() => shift(-1)} className="grid size-9 place-items-center rounded-full ring-1 ring-line text-ink">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" aria-label="Дараах сар" onClick={() => shift(1)} className="grid size-9 place-items-center rounded-full ring-1 ring-line text-ink">
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
        <p className="pt-3 text-center text-[15px] font-medium text-ink">
          {view.getMonth() + 1}-р сар {view.getFullYear()}
        </p>
        <div className="grid grid-cols-7 px-2 pt-2 pb-3 text-center">
          {HEAD.map((h) => (
            <span key={h} className="pb-2 text-[13px] text-muted">
              {h}
            </span>
          ))}
          {days.map((d) => {
            const key = dateKey(d);
            const inMonth = d.getMonth() === view.getMonth();
            const isToday = key === todayKey;
            const isSel = key === selKey;
            const evs = eventsFor(d, state.events);
            const types = [...new Set(evs.map((e) => e.type))];
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelected(d);
                  if (!inMonth) setView(new Date(d.getFullYear(), d.getMonth(), 1));
                }}
                aria-label={`${key}${evs.length ? `, ${evs.length} үйл явдал` : ""}`}
                aria-pressed={isSel}
                className="flex h-11 flex-col items-center justify-center"
              >
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-full text-[16px] tabular-nums",
                    !inMonth && "text-muted/50",
                    inMonth && "text-ink",
                    isToday && "bg-brand font-bold text-white",
                    isSel && !isToday && "ring-2 ring-brand font-bold",
                  )}
                >
                  {d.getDate()}
                </span>
                <span className="mt-0.5 flex h-1.5 gap-0.5">
                  {types.map((t) => (
                    <span key={t} className={cn("size-1.5 rounded-full", TYPE_DOT[t])} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[12px] text-muted">
        {(Object.keys(TYPE_LABEL) as CalendarEvent["type"][]).map((t) => (
          <span key={t} className="flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", TYPE_DOT[t])} /> {TYPE_LABEL[t]}
          </span>
        ))}
      </div>

      <h2 className="mt-6 text-[17px] font-semibold text-ink">
        {selKey === todayKey ? "Өнөөдрийн үйл явдлууд" : "Сонгосон өдрийн үйл явдлууд"}
      </h2>
      <label className="mt-4 block">
        <span className="text-[16px] font-bold text-ink">Төрлөөр хайх</span>
        <span className="relative mt-2 block">
          <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)} className={cn(inputCls, "appearance-none")}>
            <option value="all">БҮГД</option>
            {(Object.keys(TYPE_LABEL) as CalendarEvent["type"][]).map((t) => (
              <option key={t} value={t}>
                {TYPE_LABEL[t]}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted" />
        </span>
      </label>

      <div className="mt-4 rounded-card bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[17px] font-bold text-ink">
            {selected.getMonth() + 1} сарын {selected.getDate()}
          </span>
          <span className="text-[15px] text-brand">{WEEKDAYS[selected.getDay()].slice(0, 3)}</span>
        </div>
        {dayEvents.length === 0 ? (
          <div className="flex flex-col items-center py-6">
            <EmptyBox className="w-32" />
            <p className="mt-3 text-[15px] text-muted">Үйл явдал алга байна</p>
          </div>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {dayEvents.map((e) => (
              <li key={e.id} className="flex items-center gap-3 rounded-2xl bg-soft p-3">
                <span className={cn("h-9 w-1.5 rounded-full", TYPE_DOT[e.type])} />
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold text-ink">{e.title}</span>
                  <span className="text-[12.5px] text-muted">
                    {TYPE_LABEL[e.type]}
                    {e.time && ` · ${e.time}`}
                  </span>
                </span>
                {e.type === "personal" && (
                  <button
                    type="button"
                    aria-label="Устгах"
                    onClick={() => {
                      update("events", (all) => all.filter((x) => x.id !== e.id));
                      toast("Үйл явдлыг устгалаа");
                    }}
                    className="grid size-9 place-items-center rounded-xl text-red-500"
                  >
                    <Trash2 className="size-5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        <Button variant="soft" className="mt-4 w-full" onClick={() => setAdding(true)}>
          <Plus className="size-5" /> Үйл явдал нэмэх
        </Button>
      </div>

      <Sheet
        open={adding}
        onClose={() => setAdding(false)}
        title={`${selected.getFullYear()}.${pad(selected.getMonth() + 1)}.${pad(selected.getDate())} — шинэ үйл явдал`}
        footer={
          <Button
            className="w-full"
            disabled={!title.trim()}
            onClick={() => {
              update("events", (all) => [...all, { id: uid("ev"), date: selKey, title: title.trim(), time, type: "personal" }]);
              setTitle("");
              setAdding(false);
              toast("Үйл явдал нэмэгдлээ", "success");
            }}
          >
            Хадгалах
          </Button>
        }
      >
        <div className="space-y-4">
          <Field label="Гарчиг" required>
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="Жишээ: Лавлагаа авах" />
          </Field>
          <Field label="Цаг">
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Sheet>
    </Page>
  );
}
