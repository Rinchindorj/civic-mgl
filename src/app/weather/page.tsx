"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronDown, CloudSun, Wind, Gauge, Navigation, CloudRain, Droplets, Snowflake, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAppState, useNow } from "@/context/AppStateContext";
import { AQI_STATIONS, CITIES } from "@/data/seed";
import { Page, PillTabs } from "@/components/ui";
import { aqiLabel, fmtDate, WEEKDAYS_SHORT } from "@/lib/utils";

type Tab = "weather" | "aqi";

export default function WeatherPage() {
  const params = useSearchParams();
  const initial: Tab = params.get("tab") === "aqi" ? "aqi" : "weather";
  return <Weather key={initial} initial={initial} />;
}

function Weather({ initial }: { initial: Tab }) {
  const [tab, setTab] = useState<Tab>(initial);
  const [cityId, setCityId] = useState("ub");
  const { state } = useAppState();
  const now = useNow(60_000);
  const city = CITIES.find((c) => c.id === cityId) ?? CITIES[0];
  const w = state.liveData.weather;
  const a = state.liveData.aqi;
  const off = city.tempOffset;
  const aqiCity = Math.max(0, a.value + off * -4);
  const q = aqiLabel(aqiCity);

  return (
    <Page title={tab === "weather" ? "Цаг агаар" : "Агаарын чанар"}>
      <PillTabs
        tabs={[
          { value: "weather", label: "Цаг агаар" },
          { value: "aqi", label: "Агаарын чанар" },
        ]}
        value={tab}
        onChange={setTab}
      />

      <label className="mt-6 block">
        <span className="text-[17px] font-bold text-ink">Аймаг, нийслэл сонгох:</span>
        <span className="relative mt-3 block">
          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            className="h-14 w-full appearance-none rounded-2xl bg-card px-4 text-[17px] text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-brand"
          >
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted" />
        </span>
      </label>

      <div className="mt-5 rounded-card bg-gradient-to-b from-sky-400 to-blue-600 p-3.5 text-white shadow-lg">
        <div className="flex justify-between px-1 text-[14px] text-white/85">
          <span>Сүүлд шинэчлэгдсэн:</span>
          <span>{fmtDate(now)}</span>
        </div>

        {tab === "weather" ? (
          <>
            <div className="mt-3 flex items-center gap-4 rounded-2xl bg-white/15 p-4">
              <CloudSun className="size-16 shrink-0 text-amber-200" strokeWidth={1.4} />
              <div>
                <p className="flex items-center gap-2 text-[15px] text-white/90">
                  {city.name} (өдөр) <Navigation className="size-4 fill-white" />
                </p>
                <p className="text-[24px] font-bold">
                  {w.nightTemp + off}°/ <span className="text-[20px]">{w.temp + off}°C</span>{" "}
                  <span className="text-[16px] font-medium">({WEEKDAYS_SHORT[now.getDay()]})</span>
                </p>
                <p className="text-[15px] text-white/90">{w.condition}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Metric icon={Wind} label="Салхины хурд" value={`${w.wind} м/с`} />
              <Metric icon={Gauge} label="Агаарын даралт" value={`${w.pressure} гПа`} />
              <Metric icon={Navigation} label="Салхины зүг" value={w.windDir} />
              <Metric icon={CloudRain} label="Тунадас" value={`${w.precipitation} мм`} />
              <Metric icon={Droplets} label="Агаарын чийг" value={`${w.humidity} %`} />
              <Metric icon={Snowflake} label="Цасны зузаан" value={`${w.snow} см`} />
            </div>
          </>
        ) : (
          <>
            <div className="mt-3 flex items-center gap-4 rounded-2xl bg-white/15 p-4">
              <span
                className="grid size-20 shrink-0 place-items-center rounded-full text-[28px] font-black ring-4 ring-white/40"
                style={{ background: q.color }}
              >
                {aqiCity}
              </span>
              <div>
                <p className="text-[15px] text-white/90">{city.name} · AQI</p>
                <p className="text-[24px] font-bold">{q.label}</p>
                <p className="text-[13px] text-white/85">
                  {aqiCity <= 50 ? "Гадаа идэвхтэй байхад тохиромжтой." : "Мэдрэг бүлгийн иргэд гадаа удаан байхаас зайлсхийнэ үү."}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Metric label="PM2.5" value={`${Math.max(0, a.pm25 - off * 2)} мкг/м³`} />
              <Metric label="PM10" value={`${Math.max(0, a.pm10 - off * 3)} мкг/м³`} />
              <Metric label="NO₂" value={`${a.no2} мкг/м³`} />
              <Metric label="SO₂" value={`${a.so2} мкг/м³`} />
              <Metric label="CO" value={`${a.co} мг/м³`} />
              <Metric label="O₃" value={`${a.o3} мкг/м³`} />
            </div>
          </>
        )}
      </div>

      {tab === "aqi" && (
        <section className="mt-6">
          <h2 className="mb-3 text-[17px] font-bold text-ink">Хэмжилтийн цэгүүд</h2>
          <ul className="space-y-2.5">
            {AQI_STATIONS.map((s) => {
              const v = Math.max(0, aqiCity + s.offset);
              const l = aqiLabel(v);
              return (
                <li key={s.name} className="flex items-center gap-3 rounded-card bg-card p-3.5 shadow-sm">
                  <MapPin className="size-5 text-muted" />
                  <span className="flex-1 text-[15px] font-semibold text-ink">{s.name}</span>
                  <span className="text-[13px] text-muted">{l.label}</span>
                  <span className="grid h-8 min-w-12 place-items-center rounded-lg px-2 text-[14px] font-bold text-white" style={{ background: l.color }}>
                    {v}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[12px] text-muted">Жишээ хэмжилт. Утгыг Админ → Өгөгдөл & Ханш хэсгээс өөрчилнө.</p>
        </section>
      )}
    </Page>
  );
}

function Metric({ icon: Icon, label, value }: { icon?: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white/15 px-2 py-4 text-center">
      {Icon && <Icon className="size-6 text-white/90" />}
      <span className="mt-1.5 text-[15px] text-white/90">{label}</span>
      <span className="mt-1 text-[20px] font-bold">{value}</span>
    </div>
  );
}
