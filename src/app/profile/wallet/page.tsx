"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, CreditCard, FileText, Receipt, Settings, Trash2, Zap } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { Button, Field, HeaderIconButton, Page, Sheet, StatusPill, Toggle, inputCls, useTransient } from "@/components/ui";
import { cn, uid } from "@/lib/utils";

type S = "add" | "cards" | "settings" | "utility" | "service" | null;

export default function WalletPage() {
  const { state, update, toast } = useAppState();
  const [sheet, setSheet] = useTransient<S>(null);
  const [all, setAll] = useState(false);
  const [num, setNum] = useState("");
  const [holder, setHolder] = useState(`${state.sampleUser.firstName.toUpperCase()} ${state.sampleUser.lastName.toUpperCase()}`);
  const [exp, setExp] = useState("");
  const [autoPay, setAutoPay] = useState(false);
  const digits = num.replace(/\D/g, "");
  const cards = state.cards;
  const payments = all ? state.payments : state.payments.slice(0, 2);

  const addCard = () => {
    if (digits.length < 16 || !/^\d{2}\/\d{2}$/.test(exp)) return toast("Картын мэдээллээ зөв оруулна уу", "error");
    // Only the last 4 digits are kept — this is a demo wallet.
    update("cards", (c) => [...c, { id: uid("card"), holder, last4: digits.slice(-4), expiry: exp, brand: digits.startsWith("4") ? "VISA" : "CARD" }]);
    setNum("");
    setExp("");
    setSheet(null);
    toast("Карт амжилттай холбогдлоо (демо)", "success");
  };

  return (
    <Page title="Хэтэвч" fallback="/profile" right={<HeaderIconButton icon={Settings} label="Тохиргоо" onClick={() => setSheet("settings")} />}>
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-ink">Холбосон карт</h2>
        <button type="button" onClick={() => setSheet("cards")} className="flex items-center text-[16px] font-semibold text-brand">
          Бүх карт <ChevronRight className="size-5" />
        </button>
      </div>
      <div className="mt-3 rounded-card bg-gradient-to-b from-brand to-transparent p-4 pb-6">
        {cards.length === 0 ? (
          <div className="rounded-2xl bg-card px-4 py-8 text-center">
            <p className="text-[16px] font-bold text-ink">Та хараахан карт холбоогүй байна</p>
            <p className="mt-1 text-[15px] text-ink/80">“Карт нэмэх” дээр дарж картаа холбоно уу.</p>
          </div>
        ) : (
          <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto">
            {cards.map((c) => (
              <div key={c.id} className="relative h-[170px] w-[85%] shrink-0 snap-center rounded-2xl bg-gradient-to-br from-navy to-[#1c3a8a] p-5 text-white shadow-lg">
                <p className="text-[12px] font-bold tracking-widest opacity-75">CIVIC MGL WALLET · DEMO</p>
                <p className="mt-8 font-mono text-[19px] tracking-[0.2em]">•••• •••• •••• {c.last4}</p>
                <div className="mt-3 flex justify-between text-[12px]">
                  <span>{c.holder}</span>
                  <span>{c.expiry}</span>
                </div>
                <span className="absolute top-4 right-4 text-[14px] font-black italic">{c.brand}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <button type="button" onClick={() => setSheet("add")} className="mt-1 flex w-full items-center gap-3 rounded-2xl bg-card px-4 py-4 text-[16px] font-medium text-ink shadow-sm">
        <CreditCard className="size-5" /> Карт нэмэх
      </button>

      <div className="mt-5 grid grid-cols-3 divide-x divide-line rounded-card bg-card py-4 shadow-sm">
        {[
          { icon: Zap, label: "Хэрэглээний төлбөр", tone: "bg-cyan-500/12 text-cyan-600", onClick: () => setSheet("utility") },
          { icon: FileText, label: "Үйлчилгээний төлбөр", tone: "bg-orange-500/12 text-orange-500", onClick: () => setSheet("service") },
          { icon: Receipt, label: "Төлбөрийн нэхэмжлэл", tone: "bg-violet-500/12 text-violet-600", href: "/notifications?tab=invoice" },
        ].map((a) => {
          const inner = (
            <>
              <span className={cn("grid size-12 place-items-center rounded-xl", a.tone)}>
                <a.icon className="size-6" />
              </span>
              <span className="mt-2 text-center text-[13.5px] leading-tight text-ink">{a.label}</span>
            </>
          );
          return a.href ? (
            <Link key={a.label} href={a.href} className="flex flex-col items-center px-1">
              {inner}
            </Link>
          ) : (
            <button key={a.label} type="button" onClick={a.onClick} className="flex flex-col items-center px-1">
              {inner}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-ink">Төлбөрийн түүх</h2>
        <button type="button" onClick={() => setAll((v) => !v)} className="flex items-center text-[16px] font-semibold text-brand">
          {all ? "Хураах" : "Бүгд"} <ChevronRight className={cn("size-5 transition", all && "rotate-90")} />
        </button>
      </div>
      <ul className="mt-3 space-y-3">
        {payments.map((p) => (
          <li key={p.id} className="rounded-card bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[16px] text-ink">{p.date}</span>
              <StatusPill status={p.status} />
            </div>
            <div className="mt-3 flex gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-soft text-slate-600">
                <FileText className="size-5" />
              </span>
              <div className="flex-1">
                <div className="flex justify-between gap-2">
                  <p className="text-[15px] font-bold text-ink">{p.title}</p>
                  <p className="text-[15px] font-bold text-ink">{p.amount.toLocaleString()}₮</p>
                </div>
                <p className="mt-0.5 text-[14.5px] leading-snug text-ink/85">{p.desc}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Sheet open={sheet === "add"} onClose={() => setSheet(null)} title="Карт нэмэх" footer={<Button className="w-full" onClick={addCard}>Холбох</Button>}>
        <p className="mb-4 rounded-2xl bg-amber-500/10 p-3 text-[13px] text-amber-700">
          Демо хэтэвч: бодит картын мэдээлэл бүү оруулна уу. Зөвхөн сүүлийн 4 орон хадгалагдана.
        </p>
        <div className="space-y-4">
          <Field label="Картын дугаар" required>
            <input
              inputMode="numeric"
              value={digits.replace(/(.{4})/g, "$1 ").trim()}
              maxLength={19}
              onChange={(e) => setNum(e.target.value)}
              placeholder="0000 0000 0000 0000"
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Дуусах хугацаа" required>
              <input
                value={exp}
                maxLength={5}
                onChange={(e) => {
                  const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setExp(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                }}
                placeholder="MM/YY"
                className={inputCls}
              />
            </Field>
            <Field label="Эзэмшигч">
              <input value={holder} onChange={(e) => setHolder(e.target.value)} className={inputCls} />
            </Field>
          </div>
        </div>
      </Sheet>

      <Sheet open={sheet === "cards"} onClose={() => setSheet(null)} title="Бүх карт">
        {cards.length === 0 ? (
          <p className="text-[15px] text-muted">Холбосон карт алга байна.</p>
        ) : (
          <ul className="space-y-2.5">
            {cards.map((c) => (
              <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-soft p-3.5">
                <CreditCard className="size-5 text-brand" />
                <span className="flex-1 text-[15px] font-semibold text-ink">
                  {c.brand} •••• {c.last4} <span className="text-[13px] font-normal text-muted">({c.expiry})</span>
                </span>
                <button
                  type="button"
                  aria-label="Карт устгах"
                  onClick={() => {
                    update("cards", (all) => all.filter((x) => x.id !== c.id));
                    toast("Картыг салгалаа");
                  }}
                  className="grid size-9 place-items-center rounded-xl text-red-500"
                >
                  <Trash2 className="size-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <Button variant="soft" className="mt-4 w-full" onClick={() => setSheet("add")}>
          Карт нэмэх
        </Button>
      </Sheet>

      <Sheet open={sheet === "settings"} onClose={() => setSheet(null)} title="Хэтэвчний тохиргоо">
        <div className="flex items-center justify-between rounded-2xl bg-soft p-4">
          <span className="text-[15px] text-ink">Нэхэмжлэлийг автоматаар төлөх</span>
          <Toggle checked={autoPay} onChange={(v) => { setAutoPay(v); toast(v ? "Автомат төлөлт идэвхжлээ" : "Автомат төлөлт унтарлаа"); }} label="Автомат төлөлт" />
        </div>
      </Sheet>

      <Sheet open={sheet === "utility" || sheet === "service"} onClose={() => setSheet(null)} title={sheet === "utility" ? "Хэрэглээний төлбөр" : "Үйлчилгээний төлбөр"}>
        <ul className="space-y-2.5">
          {(sheet === "utility"
            ? [["Цахилгаан", 48200], ["Дулаан", 61500], ["Ус", 12800]]
            : [["Зөрчлийн торгууль", 0], ["Апостиль гэрчилгээ", 10000]]
          ).map(([name, amt]) => (
            <li key={String(name)} className="flex items-center justify-between rounded-2xl bg-soft p-4">
              <span className="text-[15px] font-semibold text-ink">{name}</span>
              {Number(amt) > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    update("payments", (p) => [
                      {
                        id: uid("p"),
                        date: `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
                        title: sheet === "utility" ? "Хэрэглээний төлбөр" : "Үйлчилгээний төлбөр",
                        desc: `${name} (ЗАГВАР төлбөр)`,
                        amount: Number(amt),
                        status: "Төлөгдсөн",
                      },
                      ...p,
                    ]);
                    toast(`${Number(amt).toLocaleString()}₮ төлөгдлөө (демо)`, "success");
                    setSheet(null);
                  }}
                  className="rounded-xl bg-brand px-3 py-2 text-[13px] font-bold text-white"
                >
                  {Number(amt).toLocaleString()}₮ төлөх
                </button>
              ) : (
                <span className="text-[13px] text-emerald-600">Өргүй</span>
              )}
            </li>
          ))}
        </ul>
      </Sheet>
    </Page>
  );
}
