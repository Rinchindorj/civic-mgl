"use client";

import { RefreshCw } from "lucide-react";
import { CURRENCIES, useAppState, type AqiData, type WeatherData } from "@/context/AppStateContext";
import { Button } from "@/components/ui";
import { aqiLabel, cn } from "@/lib/utils";
import { AdminCard, NumField, TextField } from "./fields";

export function DataTab() {
  const { state, setLive, refreshRates, ratesLoading, toast } = useAppState();
  const d = state.liveData;
  const setW = (patch: Partial<WeatherData>) => setLive({ weather: { ...d.weather, ...patch } });
  const setA = (patch: Partial<AqiData>) => setLive({ aqi: { ...d.aqi, ...patch } });
  const aq = aqiLabel(d.aqi.value);

  return (
    <>
      <AdminCard title="Цаг агаар (Улаанбаатар)">
        <div className="grid grid-cols-2 gap-2.5">
          <NumField label="Өдрийн хэм" value={d.weather.temp} onChange={(temp) => setW({ temp })} suffix="°C" />
          <NumField label="Шөнийн хэм" value={d.weather.nightTemp} onChange={(nightTemp) => setW({ nightTemp })} suffix="°C" />
          <TextField label="Төлөв" value={d.weather.condition} onChange={(condition) => setW({ condition })} />
          <TextField label="Салхины зүг" value={d.weather.windDir} onChange={(windDir) => setW({ windDir })} />
          <NumField label="Салхи" value={d.weather.wind} onChange={(wind) => setW({ wind })} suffix="м/с" />
          <NumField label="Чийгшил" value={d.weather.humidity} onChange={(humidity) => setW({ humidity })} suffix="%" />
          <NumField label="Даралт" value={d.weather.pressure} onChange={(pressure) => setW({ pressure })} suffix="гПа" />
          <TextField label="Тунадас (мм)" value={d.weather.precipitation} onChange={(precipitation) => setW({ precipitation })} />
        </div>
      </AdminCard>

      <AdminCard
        title="Агаарын чанар (AQI)"
        action={
          <span className="rounded-lg px-2 py-1 text-[12px] font-bold text-white" style={{ background: aq.color }}>
            {aq.label}
          </span>
        }
      >
        <div className="grid grid-cols-2 gap-2.5">
          <NumField label="AQI" value={d.aqi.value} onChange={(value) => setA({ value: Math.max(0, Math.round(value)) })} />
          <NumField label="PM2.5" value={d.aqi.pm25} onChange={(pm25) => setA({ pm25 })} />
          <NumField label="PM10" value={d.aqi.pm10} onChange={(pm10) => setA({ pm10 })} />
          <NumField label="NO₂" value={d.aqi.no2} onChange={(no2) => setA({ no2 })} />
          <NumField label="SO₂" value={d.aqi.so2} onChange={(so2) => setA({ so2 })} />
          <NumField label="CO" value={d.aqi.co} onChange={(co) => setA({ co })} />
        </div>
      </AdminCard>

      <AdminCard
        title="Валютын ханш (₮)"
        desc={d.ratesMode === "custom" ? "Админы тохируулсан утга ашиглаж байна" : d.ratesSource === "live" ? "open.er-api.com-оос шууд татсан" : "Нөөц утга (API холбогдоогүй)"}
        action={
          <span className={cn("rounded-lg px-2 py-1 text-[11px] font-bold", d.ratesMode === "custom" ? "bg-brand/10 text-brand" : "bg-emerald-500/12 text-emerald-600")}>
            {d.ratesMode === "custom" ? "CUSTOM" : "LIVE"}
          </span>
        }
      >
        <div key={d.ratesUpdatedAt ?? "fallback"} className="grid grid-cols-2 gap-2.5">
          {CURRENCIES.map((c) => (
            <NumField
              key={c}
              label={c}
              value={d.rates[c]}
              suffix="₮"
              onChange={(v) => setLive({ rates: { ...d.rates, [c]: v }, ratesMode: "custom", ratesSource: "custom" })}
            />
          ))}
        </div>
        <Button
          variant="soft"
          className="mt-3 w-full"
          disabled={ratesLoading}
          onClick={async () => {
            const ok = await refreshRates(true);
            toast(ok ? "Шууд ханш татагдлаа" : "API-д холбогдож чадсангүй", ok ? "success" : "error");
          }}
        >
          <RefreshCw className={cn("size-4", ratesLoading && "animate-spin")} /> Live API-аас шинэчлэх
        </Button>
      </AdminCard>

      <AdminCard title="Нээлттэй мэдээлэл (8 үзүүлэлт)">
        <div className="space-y-2.5">
          {d.stats.map((s, i) => (
            <div key={s.id} className="grid grid-cols-[1.4fr_1fr] gap-2">
              <TextField label={`#${i + 1} Нэр`} value={s.label} onChange={(label) => setLive({ stats: d.stats.map((x) => (x.id === s.id ? { ...x, label } : x)) })} />
              <TextField label="Утга" value={s.value} onChange={(value) => setLive({ stats: d.stats.map((x) => (x.id === s.id ? { ...x, value } : x)) })} />
            </div>
          ))}
        </div>
      </AdminCard>
    </>
  );
}
