"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { SECTION_LABELS, useAppState, type PromoBanner } from "@/context/AppStateContext";
import { CATEGORIES, type Service } from "@/data/catalog";
import type { NotificationType } from "@/data/seed";
import { Button, Toggle } from "@/components/ui";
import { cn, uid } from "@/lib/utils";
import { AdminCard, TextField, smallInput } from "./fields";

const ROUTES = [
  "/extras/jobs",
  "/extras/risk-report",
  "/services",
  "/services/e-apostille",
  "/guides",
  "/calendar",
  "/exchange",
  "/weather",
  "/extras/parliament",
  "/extras/1111-complaint",
  "/extras/transit-tickets",
  "/profile/documents",
  "/support/help",
  "/sos",
];

export function LayoutTab() {
  const { state, update, toast, addNotification } = useAppState();
  const sections = [...state.layoutConfig.sections].sort((a, b) => a.order - b.order);
  const banners = state.layoutConfig.banners;

  const move = (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[index], next[j]] = [next[j], next[index]];
    update("layoutConfig", (l) => ({ ...l, sections: next.map((s, i) => ({ ...s, order: i })) }));
  };

  const setBanner = (id: string, patch: Partial<PromoBanner>) =>
    update("layoutConfig", (l) => ({ ...l, banners: l.banners.map((b) => (b.id === id ? { ...b, ...patch } : b)) }));

  /* custom content drafts */
  const [svc, setSvc] = useState({ title: "", category: "other", paid: false });
  const [ntf, setNtf] = useState<{ type: NotificationType; title: string; body: string }>({ type: "general", title: "", body: "" });

  return (
    <>
      <AdminCard title="Нүүр хуудасны хэсгүүд" desc="Дарааллыг ↑ ↓ товчоор, харагдацыг шилжүүлэгчээр удирдана">
        <ol className="space-y-2">
          {sections.map((s, i) => (
            <li key={s.id} className={cn("flex items-center gap-2 rounded-xl bg-soft p-2.5", !s.enabled && "opacity-60")}>
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-card text-[13px] font-bold text-brand">{i + 1}</span>
              <span className="flex-1 text-[13.5px] font-semibold leading-snug text-ink">{SECTION_LABELS[s.id]}</span>
              <div className="flex flex-col">
                <button type="button" aria-label="Дээш" disabled={i === 0} onClick={() => move(i, -1)} className="grid size-7 place-items-center rounded-md text-ink disabled:opacity-25">
                  <ArrowUp className="size-4" />
                </button>
                <button type="button" aria-label="Доош" disabled={i === sections.length - 1} onClick={() => move(i, 1)} className="grid size-7 place-items-center rounded-md text-ink disabled:opacity-25">
                  <ArrowDown className="size-4" />
                </button>
              </div>
              <Toggle
                checked={s.enabled}
                label={`${SECTION_LABELS[s.id]} харуулах`}
                onChange={(v) => update("layoutConfig", (l) => ({ ...l, sections: l.sections.map((x) => (x.id === s.id ? { ...x, enabled: v } : x)) }))}
              />
            </li>
          ))}
        </ol>
      </AdminCard>

      <AdminCard
        title="Promo баннерууд"
        desc="Гарчиг, тайлбар, товч, холбоосыг шууд засна"
        action={
          <button
            type="button"
            onClick={() =>
              update("layoutConfig", (l) => ({
                ...l,
                banners: [...l.banners, { id: uid("b"), title: "Шинэ баннер", subtitle: "Тайлбар", ctaLabel: "Үзэх", href: "/services", variant: "brand" }],
              }))
            }
            className="flex items-center gap-1 rounded-xl bg-brand/10 px-3 py-2 text-[13px] font-bold text-brand"
          >
            <Plus className="size-4" /> Нэмэх
          </button>
        }
      >
        <div className="space-y-3">
          {banners.length === 0 && <p className="text-[14px] text-muted">Баннер алга байна.</p>}
          {banners.map((b, i) => (
            <div key={b.id} className="space-y-2.5 rounded-xl bg-soft/60 p-3 ring-1 ring-line">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-muted">Баннер #{i + 1}</span>
                <button
                  type="button"
                  aria-label="Баннер устгах"
                  onClick={() => update("layoutConfig", (l) => ({ ...l, banners: l.banners.filter((x) => x.id !== b.id) }))}
                  className="grid size-8 place-items-center rounded-lg text-red-500"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <TextField label="Гарчиг" value={b.title} onChange={(v) => setBanner(b.id, { title: v })} />
              <TextField label="Дэд гарчиг" value={b.subtitle} onChange={(v) => setBanner(b.id, { subtitle: v })} />
              <div className="grid grid-cols-2 gap-2">
                <TextField label="CTA текст" value={b.ctaLabel} onChange={(v) => setBanner(b.id, { ctaLabel: v })} />
                <label className="block">
                  <span className="mb-1 block text-[12.5px] font-semibold text-muted">Загвар</span>
                  <select value={b.variant} onChange={(e) => setBanner(b.id, { variant: e.target.value as PromoBanner["variant"] })} className={smallInput}>
                    <option value="dark">Бараан</option>
                    <option value="light">Цайвар</option>
                    <option value="brand">Брэнд өнгө</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="mb-1 block text-[12.5px] font-semibold text-muted">CTA холбоос</span>
                <select value={b.href} onChange={(e) => setBanner(b.id, { href: e.target.value })} className={smallInput}>
                  {(ROUTES.includes(b.href) ? ROUTES : [b.href, ...ROUTES]).map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="Нэмэлт үйлчилгээ" desc="Үйлчилгээ табд шинэ үйлчилгээ нэмэх / хасах">
        <div className="space-y-2.5">
          <TextField label="Үйлчилгээний нэр" value={svc.title} onChange={(title) => setSvc((s) => ({ ...s, title }))} />
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="mb-1 block text-[12.5px] font-semibold text-muted">Ангилал</span>
              <select value={svc.category} onChange={(e) => setSvc((s) => ({ ...s, category: e.target.value }))} className={smallInput}>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-[12.5px] font-semibold text-muted">Төлбөр</span>
              <select value={svc.paid ? "1" : "0"} onChange={(e) => setSvc((s) => ({ ...s, paid: e.target.value === "1" }))} className={smallInput}>
                <option value="0">Төлбөргүй</option>
                <option value="1">Төлбөртэй</option>
              </select>
            </label>
          </div>
          <Button
            variant="soft"
            className="w-full"
            disabled={!svc.title.trim()}
            onClick={() => {
              const s: Service = {
                slug: uid("custom"),
                title: svc.title.trim(),
                paid: svc.paid,
                org: "Civic MGL админ (жишээ)",
                phone: "7000-0000",
                address: "Демо хаяг",
                duration: "Шууд",
                about: `${svc.title.trim()} — админ хэсгээс нэмсэн демо үйлчилгээ.`,
                category: svc.category,
                channels: ["mobile", "web"],
                custom: true,
              };
              update("customServices", (all) => [...all, s]);
              setSvc({ title: "", category: "other", paid: false });
              toast("Үйлчилгээ нэмэгдлээ", "success");
            }}
          >
            <Plus className="size-5" /> Үйлчилгээ нэмэх
          </Button>
          {state.customServices.map((s) => (
            <div key={s.slug} className="flex items-center gap-2 rounded-xl bg-soft p-2.5">
              <span className="flex-1 text-[14px] font-semibold text-ink">{s.title}</span>
              <button
                type="button"
                aria-label="Устгах"
                onClick={() => {
                  update("customServices", (all) => all.filter((x) => x.slug !== s.slug));
                  update("savedServices", (all) => all.filter((x) => x !== s.slug));
                }}
                className="grid size-8 place-items-center text-red-500"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="Мэдэгдэл илгээх" desc="Сонордуулга хэсэгт шинэ мэдэгдэл нэмэх / хасах">
        <div className="space-y-2.5">
          <label className="block">
            <span className="mb-1 block text-[12.5px] font-semibold text-muted">Төрөл</span>
            <select value={ntf.type} onChange={(e) => setNtf((n) => ({ ...n, type: e.target.value as NotificationType }))} className={smallInput}>
              <option value="general">Ерөнхий</option>
              <option value="invoice">Нэхэмжлэл</option>
              <option value="resolution">Шийдвэрлэлт</option>
            </select>
          </label>
          <TextField label="Гарчиг" value={ntf.title} onChange={(title) => setNtf((n) => ({ ...n, title }))} />
          <TextField label="Агуулга" value={ntf.body} onChange={(body) => setNtf((n) => ({ ...n, body }))} />
          <Button
            variant="soft"
            className="w-full"
            disabled={!ntf.title.trim() || !ntf.body.trim()}
            onClick={() => {
              addNotification({ type: ntf.type, title: ntf.title.trim(), body: ntf.body.trim() });
              setNtf({ type: "general", title: "", body: "" });
              toast("Мэдэгдэл илгээгдлээ", "success");
            }}
          >
            <Plus className="size-5" /> Мэдэгдэл нэмэх
          </Button>
          <p className="pt-1 text-[12.5px] font-semibold text-muted">Сүүлийн мэдэгдлүүд</p>
          {state.notifications.slice(0, 5).map((n) => (
            <div key={n.id} className="flex items-center gap-2 rounded-xl bg-soft p-2.5">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold text-ink">{n.title}</span>
                <span className="text-[12px] text-muted">{n.date}</span>
              </span>
              <button
                type="button"
                aria-label="Устгах"
                onClick={() => update("notifications", (all) => all.filter((x) => x.id !== n.id))}
                className="grid size-8 place-items-center text-red-500"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </AdminCard>
    </>
  );
}
