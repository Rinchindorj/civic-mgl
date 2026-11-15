"use client";

import { useRef } from "react";
import { Check, Moon, RotateCcw, Sun, Trash2, Upload } from "lucide-react";
import { DEFAULT_THEME, useAppState, type ThemeConfig } from "@/context/AppStateContext";
import { Button, Toggle } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { cn, fileToLogo } from "@/lib/utils";
import { AdminCard, TextField } from "./fields";

/** Brand Logo uploader + name/subtitle shown in the Нүүр / Үйлчилгээ / Нэмэлт headers. */
function BrandCard() {
  const { state, setTheme, toast } = useAppState();
  const t = state.themeConfig;
  const fileRef = useRef<HTMLInputElement>(null);
  const changed =
    t.brandName !== DEFAULT_THEME.brandName || t.brandSubtitle !== DEFAULT_THEME.brandSubtitle || t.brandLogoUrl !== DEFAULT_THEME.brandLogoUrl;

  return (
    <AdminCard
      title="Брэнд лого & нэр"
      desc="Нүүр, Үйлчилгээ, Нэмэлт хуудасны толгой хэсэгт харагдана"
      action={
        changed && (
          <button
            type="button"
            onClick={() => setTheme({ brandName: DEFAULT_THEME.brandName, brandSubtitle: DEFAULT_THEME.brandSubtitle, brandLogoUrl: "" })}
            className="flex items-center gap-1 text-[12.5px] font-bold text-brand"
          >
            <RotateCcw className="size-3.5" /> Анхны
          </button>
        )
      }
    >
      <div className="rounded-xl bg-app p-3 ring-1 ring-line">
        <Logo name={t.brandName || "Civic MGL"} subtitle={t.brandSubtitle} logoUrl={t.brandLogoUrl} />
      </div>
      <div className="mt-3 flex gap-2">
        <Button variant="soft" className="h-11 flex-1" onClick={() => fileRef.current?.click()}>
          <Upload className="size-4" /> Лого оруулах
        </Button>
        {t.brandLogoUrl && (
          <Button variant="danger" className="h-11" onClick={() => setTheme({ brandLogoUrl: "" })} aria-label="Лого устгах">
            <Trash2 className="size-4" />
          </Button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            if (!f.type.startsWith("image/")) return toast("Зөвхөн зураг оруулна уу", "error");
            try {
              setTheme({ brandLogoUrl: await fileToLogo(f) });
              toast("Лого шинэчлэгдлээ", "success");
            } catch {
              toast("Зургийг уншиж чадсангүй", "error");
            }
          }}
        />
      </div>
      <div className="mt-3 space-y-2.5">
        <TextField label="Брэнд нэр (brandName)" value={t.brandName} onChange={(brandName) => setTheme({ brandName })} />
        <TextField label="Дэд гарчиг (brandSubtitle)" value={t.brandSubtitle} onChange={(brandSubtitle) => setTheme({ brandSubtitle })} />
      </div>
      <p className="mt-2 text-[12px] text-muted">Сүүлийн үг үндсэн өнгөөр харагдана. Лого 256px хүртэл жижигрээд хадгалагдана.</p>
    </AdminCard>
  );
}

const PRESETS = [
  { name: "E-Blue", primary: "#0066FF", secondary: "#0B2265", bg: "#F3F7FC" },
  { name: "Emerald", primary: "#059669", secondary: "#064E3B", bg: "#EFFAF5" },
  { name: "Royal Purple", primary: "#6D28D9", secondary: "#2E1065", bg: "#F6F3FD" },
  { name: "Crimson", primary: "#DC2626", secondary: "#7F1D1D", bg: "#FDF4F4" },
  { name: "Slate", primary: "#1E293B", secondary: "#0F172A", bg: "#F1F5F9" },
];

function ColorPicker({
  label,
  value,
  swatches,
  onChange,
}: {
  label: string;
  value: string;
  swatches: { name: string; hex: string }[];
  onChange: (hex: string) => void;
}) {
  const valid = /^#[0-9a-fA-F]{6}$/.test(value);
  return (
    <AdminCard title={label}>
      <div className="flex items-center gap-3">
        <label className="relative size-12 shrink-0 cursor-pointer overflow-hidden rounded-xl ring-1 ring-line" style={{ background: value }}>
          <input type="color" value={valid ? value : "#000000"} onChange={(e) => onChange(e.target.value.toUpperCase())} className="absolute inset-0 cursor-pointer opacity-0" aria-label={`${label} сонгох`} />
        </label>
        <input
          value={value}
          onChange={(e) => {
            const v = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v.toUpperCase());
          }}
          className={cn("h-12 flex-1 rounded-xl bg-soft px-3 font-mono text-[15px] text-ink outline-none ring-1", valid ? "ring-transparent focus:ring-brand" : "ring-red-500")}
          aria-label={`${label} HEX`}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {swatches.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() => onChange(s.hex)}
            className="flex items-center gap-1.5 rounded-full bg-soft py-1 pr-3 pl-1 text-[12px] font-semibold text-ink"
          >
            <span className="grid size-6 place-items-center rounded-full ring-1 ring-black/10" style={{ background: s.hex }}>
              {value.toUpperCase() === s.hex.toUpperCase() && <Check className="size-3.5 text-white mix-blend-difference" strokeWidth={3} />}
            </span>
            {s.name}
          </button>
        ))}
      </div>
    </AdminCard>
  );
}

export function ThemeTab() {
  const { state, setTheme } = useAppState();
  const t = state.themeConfig;

  return (
    <>
      <BrandCard />

      <AdminCard title="Бэлэн загварууд" desc="Primary, Navy, Background гурвыг нэг дор солино">
        <div className="grid grid-cols-5 gap-2">
          {PRESETS.map((p) => {
            const active = t.primaryColor === p.primary && t.secondaryColor === p.secondary && t.bgColor === p.bg;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => setTheme({ primaryColor: p.primary, secondaryColor: p.secondary, bgColor: p.bg })}
                className={cn("flex flex-col items-center gap-1 rounded-xl p-1.5", active && "bg-soft ring-2 ring-brand")}
                aria-pressed={active}
              >
                <span className="relative size-10 overflow-hidden rounded-full ring-1 ring-black/10" style={{ background: p.bg }}>
                  <span className="absolute inset-y-0 left-0 w-1/2" style={{ background: p.primary }} />
                  <span className="absolute right-0 bottom-0 size-1/2" style={{ background: p.secondary }} />
                </span>
                <span className="text-center text-[10.5px] leading-tight font-semibold text-ink">{p.name}</span>
              </button>
            );
          })}
        </div>
      </AdminCard>

      <ColorPicker label="Primary Color" value={t.primaryColor} onChange={(primaryColor) => setTheme({ primaryColor })} swatches={PRESETS.map((p) => ({ name: p.name, hex: p.primary }))} />
      <ColorPicker label="Secondary Navy" value={t.secondaryColor} onChange={(secondaryColor) => setTheme({ secondaryColor })} swatches={PRESETS.map((p) => ({ name: p.name, hex: p.secondary }))} />
      <ColorPicker label="App Background" value={t.bgColor} onChange={(bgColor) => setTheme({ bgColor })} swatches={PRESETS.map((p) => ({ name: p.name, hex: p.bg }))} />

      <AdminCard title="Картын булангийн радиус">
        <div className="grid grid-cols-3 gap-2">
          {([12, 16, 24] as ThemeConfig["cardRadius"][]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setTheme({ cardRadius: r })}
              aria-pressed={t.cardRadius === r}
              className={cn("flex flex-col items-center gap-2 rounded-xl p-3 ring-1", t.cardRadius === r ? "bg-brand/10 ring-brand" : "ring-line")}
            >
              <span className="size-10 border-2 border-brand bg-brand/10" style={{ borderRadius: r }} />
              <span className="text-[13px] font-bold text-ink">{r}px</span>
            </button>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="Харанхуй горим" desc="Бүх дэлгэцийн гадаргуу, текстийн өнгийг сольно">
        <div className="flex items-center justify-between rounded-xl bg-soft p-3">
          <span className="flex items-center gap-2 text-[15px] font-semibold text-ink">
            {t.darkMode ? <Moon className="size-5" /> : <Sun className="size-5 text-amber-500" />}
            {t.darkMode ? "Харанхуй" : "Гэгээлэг"}
          </span>
          <Toggle checked={t.darkMode} onChange={(darkMode) => setTheme({ darkMode })} label="Харанхуй горим" />
        </div>
      </AdminCard>
    </>
  );
}
