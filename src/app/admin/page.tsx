"use client";

import { useState } from "react";
import { Palette, LayoutList, UserRound, Database, RotateCcw, Save } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { Button, ConfirmDialog, Page, useTransient } from "@/components/ui";
import { Emblem } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { ThemeTab } from "./ThemeTab";
import { LayoutTab } from "./LayoutTab";
import { UserTab } from "./UserTab";
import { DataTab } from "./DataTab";

const TABS = [
  { id: "theme", label: "Өнгө & Загвар", icon: Palette },
  { id: "layout", label: "Нүүр хуудасны бүтэц", icon: LayoutList },
  { id: "user", label: "Хэрэглэгч & Баримт", icon: UserRound },
  { id: "data", label: "Өгөгдөл & Ханш", icon: Database },
] as const;
type TabId = (typeof TABS)[number]["id"];

function LivePreview() {
  const { state, currentEmail } = useAppState();
  const t = state.themeConfig;
  const enabled = state.layoutConfig.sections.filter((s) => s.enabled).length;
  return (
    <div className="overflow-hidden rounded-card bg-card shadow-sm">
      <div className="flex items-center gap-2 bg-soft px-4 py-2 text-[12px] font-bold text-muted">
        <span className="size-2 animate-pulse rounded-full bg-emerald-500" /> ШУУД ХАРАГДАЦ
        <span className="ml-auto truncate font-semibold normal-case" title="Зөвхөн энэ бүртгэлд хадгалагдана">
          {currentEmail}
        </span>
      </div>
      <div className="flex gap-4 p-4">
        <div className="w-[108px] shrink-0 overflow-hidden rounded-[18px] bg-app ring-4 ring-navy/80">
          <div className="flex items-center gap-1 px-2 pt-2">
            {t.brandLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded data URL
              <img src={t.brandLogoUrl} alt="" className="size-4 rounded object-contain" />
            ) : (
              <Emblem className="size-4" />
            )}
            <span className="truncate text-[8px] font-extrabold text-navy">{t.brandName || "Civic MGL"}</span>
          </div>
          <div className="m-2 h-5 rounded-full search-ring" />
          <div className="mx-2 grid grid-cols-2 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-7 rounded-card bg-card" style={{ borderRadius: t.cardRadius / 3 }} />
            ))}
          </div>
          <div className="mx-2 mt-2 h-5 brand-gradient" style={{ borderRadius: t.cardRadius / 3 }} />
          <div className="mt-2 flex items-center justify-around bg-card py-1.5">
            <span className="size-1.5 rounded-full bg-brand" />
            <span className="size-1.5 rounded-full bg-line" />
            <span className="size-4 rounded-full brand-gradient" />
            <span className="size-1.5 rounded-full bg-line" />
            <span className="size-1.5 rounded-full bg-line" />
          </div>
        </div>
        <dl className="flex-1 space-y-1.5 text-[13px]">
          {[
            ["Primary", t.primaryColor, true],
            ["Navy", t.secondaryColor, true],
            ["Background", t.bgColor, true],
            ["Radius", `${t.cardRadius}px`, false],
            ["Горим", t.darkMode ? "Харанхуй" : "Гэгээлэг", false],
            ["Нүүр хэсэг", `${enabled}/5 идэвхтэй`, false],
          ].map(([k, v, swatch]) => (
            <div key={String(k)} className="flex items-center justify-between gap-2">
              <dt className="text-muted">{k}</dt>
              <dd className="flex items-center gap-1.5 font-mono font-semibold text-ink">
                {swatch && <span className="size-3.5 rounded ring-1 ring-line" style={{ background: String(v) }} />}
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { saveNow, resetAll } = useAppState();
  const [tab, setTab] = useState<TabId>("theme");
  const [confirm, setConfirm] = useTransient(false);
  // Bumped on reset so local field drafts re-read the restored defaults.
  const [version, setVersion] = useState(0);

  return (
    <Page title="Админ удирдлага" className="pb-32">
      <LivePreview />

      <div role="tablist" className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-[14px] font-semibold whitespace-nowrap transition",
              tab === id ? "brand-gradient text-white shadow-md" : "bg-card text-ink shadow-sm",
            )}
          >
            <Icon className="size-4" /> {label}
          </button>
        ))}
      </div>

      <div key={version} className="mt-4 space-y-4">
        {tab === "theme" && <ThemeTab />}
        {tab === "layout" && <LayoutTab />}
        {tab === "user" && <UserTab />}
        {tab === "data" && <DataTab />}
      </div>

      <div className="frame-fixed bottom-0 z-30 border-t border-line bg-card/95 px-4 pt-3 pb-[max(env(safe-area-inset-bottom),14px)] backdrop-blur-md">
        <div className="grid grid-cols-[1fr_1.2fr] gap-3">
          <Button variant="outline" className="!px-3 text-[14px]" onClick={() => setConfirm(true)}>
            <RotateCcw className="size-4" /> Анхны загвар сэргээх
          </Button>
          <Button onClick={saveNow}>
            <Save className="size-5" /> Хадгалах
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Анхны төлөвт оруулах уу?"
        message="Зөвхөн таны бүртгэлийн өнгө, нүүр хуудасны бүтэц, хэрэглэгчийн мэдээлэл, өгөгдөл болон түүх анхны төлөвт буцна. Бусад бүртгэлд нөлөөлөхгүй."
        confirmLabel="Сэргээх"
        danger
        onConfirm={() => {
          resetAll();
          setVersion((v) => v + 1);
        }}
      />
    </Page>
  );
}
