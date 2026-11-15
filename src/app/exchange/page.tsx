"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, ChevronDown, RefreshCw } from "lucide-react";
import { CURRENCIES, useAppState, type Currency } from "@/context/AppStateContext";
import { Page, inputCls } from "@/components/ui";
import { cn, fmtDate, fmtMoney, hash, pad } from "@/lib/utils";

const META: Record<Currency, { flag: string; name: string }> = {
  USD: { flag: "🇺🇸", name: "АНУ-ын доллар" },
  EUR: { flag: "🇪🇺", name: "Евро" },
  JPY: { flag: "🇯🇵", name: "Японы иен" },
  CHF: { flag: "🇨🇭", name: "Швейцарийн франк" },
  SEK: { flag: "🇸🇪", name: "Шведийн крон" },
  GBP: { flag: "🇬🇧", name: "Английн фунт" },
};

/** 7-day illustrative trend ending at today's rate (the free API has no history). */
function trend(cur: Currency, rate: number) {
  let h = hash(cur) || 7;
  const out: number[] = [rate];
  for (let i = 0; i < 6; i++) {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0;
    const step = ((h % 1000) / 1000) * 0.004 * rate;
    out.unshift(out[0] - step);
  }
  return out.map((v) => Math.round(v * 100) / 100);
}

function TrendChart({ cur, rate }: { cur: Currency; rate: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const values = useMemo(() => trend(cur, rate), [cur, rate]);
  const labels = values.map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (values.length - 1 - i));
    return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
  });
  const W = 320, H = 190, L = 54, R = 12, T = 12, B = 28;
  const min = Math.min(...values), max = Math.max(...values);
  const pad5 = (max - min) * 0.1 || rate * 0.001;
  const lo = min - pad5, hi = max + pad5;
  const x = (i: number) => L + (i / (values.length - 1)) * (W - L - R);
  const y = (v: number) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const ticks = [0, 1, 2, 3].map((k) => lo + ((hi - lo) * k) / 3);
  const digits = rate < 100 ? 2 : 0;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none"
        role="img"
        aria-label={`${cur} ханшийн 7 хоногийн хандлага`}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round(((px - L) / (W - L - R)) * (values.length - 1));
          setHover(Math.max(0, Math.min(values.length - 1, i)));
        }}
        onPointerLeave={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeDasharray="3 4" />
            <text x={L - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill="var(--text-muted)">
              {fmtMoney(t, digits)}₮
            </text>
          </g>
        ))}
        {labels.map((l, i) => (
          <text key={l} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--text-muted)">
            {l}
          </text>
        ))}
        <path d={`${line} L${x(values.length - 1)},${H - B} L${L},${H - B} Z`} fill="var(--brand-primary)" opacity="0.12" />
        <path d={line} fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinejoin="round" />
        {hover !== null && (
          <line x1={x(hover)} x2={x(hover)} y1={T} y2={H - B} stroke="var(--text-muted)" strokeWidth="1" />
        )}
        {values.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={hover === i ? 5 : 4} fill="var(--brand-primary)" stroke="var(--surface-card)" strokeWidth="2" />
        ))}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg bg-[#0B1530] px-2.5 py-1.5 text-[12px] font-semibold whitespace-nowrap text-white shadow-lg"
          style={{ left: `${(x(hover) / W) * 100}%` }}
        >
          {labels[hover]} · {fmtMoney(values[hover])}₮
        </div>
      )}
    </div>
  );
}

export default function ExchangePage() {
  const { state, refreshRates, ratesLoading, toast } = useAppState();
  const { rates, ratesSource, ratesUpdatedAt } = state.liveData;
  const [cur, setCur] = useState<Currency>("USD");
  const [amount, setAmount] = useState("100");
  const [toMnt, setToMnt] = useState(true);
  const rate = rates[cur];
  const n = parseFloat(amount.replace(/,/g, "")) || 0;
  const converted = toMnt ? n * rate : n / rate;

  const sourceLabel =
    ratesSource === "live" ? "Шууд ханш (open.er-api.com)" : ratesSource === "custom" ? "Админы тохируулсан ханш" : "Нөөц ханш (офлайн)";

  return (
    <Page title="Ханшийн мэдээлэл">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[17px] font-semibold text-ink">Валютын ханш (MNT)</p>
          <p className="mt-1 text-[15px] text-muted">
            {ratesUpdatedAt ? `${fmtDate(new Date(ratesUpdatedAt))}-ны ханш` : `${fmtDate(new Date())} · нөөц утга`}
          </p>
          <span
            className={cn(
              "mt-2 inline-block rounded-md px-2 py-0.5 text-[12px] font-bold",
              ratesSource === "live" ? "bg-emerald-500/15 text-emerald-600" : ratesSource === "custom" ? "bg-brand/10 text-brand" : "bg-amber-500/15 text-amber-600",
            )}
          >
            {sourceLabel}
          </span>
        </div>
        <button
          type="button"
          aria-label="Ханш шинэчлэх"
          disabled={ratesLoading}
          onClick={async () => {
            if (state.liveData.ratesMode === "custom") return toast("Админ тохируулсан ханш ашиглаж байна. Админ хэсгээс шууд ханш руу шилжүүлнэ үү.");
            const ok = await refreshRates(true);
            toast(ok ? "Ханш шинэчлэгдлээ" : "Холболт амжилтгүй — нөөц ханш харуулж байна", ok ? "success" : "error");
          }}
          className="grid size-11 shrink-0 place-items-center rounded-2xl bg-card text-brand shadow-sm ring-1 ring-line/60"
        >
          <RefreshCw className={cn("size-5", ratesLoading && "animate-spin")} />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-ink">Ханшийн түүх</h2>
        <span className="relative">
          <select
            value={cur}
            onChange={(e) => setCur(e.target.value as Currency)}
            aria-label="Валют сонгох"
            className="h-12 appearance-none rounded-xl bg-card pr-10 pl-3 text-[16px] text-ink ring-1 ring-line outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {META[c].flag} {c}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-muted" />
        </span>
      </div>
      <p className="mt-4 text-[17px] font-semibold text-ink">
        {META[cur].flag} {fmtMoney(rate)} ₮ {META[cur].name}
      </p>
      <div className="mt-3 rounded-card bg-card p-3 shadow-sm">
        <TrendChart cur={cur} rate={rate} />
        <p className="px-1 text-[11px] text-muted">7 хоногийн хандлага нь жишээ (түүхэн өгөгдөл API-д байхгүй).</p>
      </div>

      <h2 className="mt-6 text-[17px] font-bold text-ink">Валют хөрвүүлэгч</h2>
      <div className="mt-3 rounded-card bg-card p-4 shadow-sm">
        <label className="block text-[13px] font-semibold text-muted">
          {toMnt ? cur : "MNT"}
          <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={cn(inputCls, "mt-1.5 text-[20px] font-bold")} />
        </label>
        <button
          type="button"
          onClick={() => setToMnt((v) => !v)}
          aria-label="Чиглэл солих"
          className="mx-auto my-3 grid size-10 place-items-center rounded-full bg-brand/10 text-brand"
        >
          <ArrowDownUp className="size-5" />
        </button>
        <p className="text-[13px] font-semibold text-muted">{toMnt ? "MNT" : cur}</p>
        <p className="mt-1 rounded-2xl bg-soft px-4 py-3 text-[22px] font-extrabold tabular-nums text-ink">
          {fmtMoney(converted)} {toMnt ? "₮" : cur}
        </p>
      </div>

      <h2 className="mt-6 text-[17px] font-bold text-ink">Ханшийн мэдээ жагсаалт</h2>
      <div className="mt-3 overflow-hidden rounded-card bg-card shadow-sm">
        <p className="border-b border-line px-4 py-4 text-[16px] font-medium text-ink">Төгрөгтэй харьцах ханш</p>
        <table className="w-full text-[15px]">
          <caption className="sr-only">Валютын ханш</caption>
          <tbody>
            {CURRENCIES.map((c) => (
              <tr key={c} onClick={() => setCur(c)} className={cn("cursor-pointer", c === cur && "bg-brand/5")}>
                <th scope="row" className="px-4 py-2.5 text-left font-normal text-muted">
                  {META[c].flag} {c}
                </th>
                <td className="px-4 py-2.5 text-right font-bold tabular-nums text-ink">{fmtMoney(rate === 0 ? 0 : rates[c])} ₮</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}
