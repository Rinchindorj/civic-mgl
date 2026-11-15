"use client";

import { useRef, useState } from "react";
import { ImagePlus, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { useAppState, type HolderCard } from "@/context/AppStateContext";
import { Button, ConfirmDialog } from "@/components/ui";
import { cn, fileToCardImage, uid } from "@/lib/utils";
import { AdminCard, smallInput } from "./fields";

type Side = "front" | "back";
type Target = { id: string | "draft"; side: Side };
interface Draft {
  title: string;
  front: string;
  back: string;
  aspectRatio: number;
}
const EMPTY: Draft = { title: "", front: "", back: "", aspectRatio: 1.586 };

/** Ratio as "1.59 : 1" for display. */
const ratio = (r: number) => `${r.toFixed(2)} : 1`;

/** Small preview that keeps the photo's own proportions. */
function Thumb({ src, aspectRatio, label, empty, onPick }: { src: string; aspectRatio: number; label: string; empty: string; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-label={src ? `${label} солих` : `${label} оруулах`}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl transition",
        src ? "bg-soft ring-1 ring-line" : "grid place-items-center border-2 border-dashed border-line bg-soft/60 text-muted hover:border-brand hover:text-brand",
      )}
      style={{ aspectRatio }}
    >
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- uploaded data URL */}
          <img src={src} alt="" className="size-full object-contain" />
          <span className="absolute inset-x-0 bottom-0 bg-black/45 py-1 text-center text-[11px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
            Солих
          </span>
        </>
      ) : (
        <span className="flex flex-col items-center gap-1 p-2 text-center text-[12px] font-semibold">
          <ImagePlus className="size-5" />
          {empty}
        </span>
      )}
    </button>
  );
}

/**
 * Personal Card Holder manager (Хэрэглэгч & Баримт tab). Cards are photos only:
 * a front, an optional back, and an optional title. The front photo's natural
 * proportions become the card's aspectRatio on /profile/documents.
 */
export function CardHolderManager() {
  const { state, update, toast } = useAppState();
  const cards = state.holderCards;
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<HolderCard | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const target = useRef<Target | null>(null);

  const pick = (t: Target) => {
    target.current = t;
    fileRef.current?.click();
  };

  const patchCard = (id: string, patch: Partial<HolderCard>) =>
    update("holderCards", (list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const onFile = async (file: File) => {
    const t = target.current;
    if (!t) return;
    if (!file.type.startsWith("image/")) return toast("Зөвхөн зураг оруулна уу", "error");
    setBusy(true);
    try {
      const img = await fileToCardImage(file);
      // The front photo defines the card's shape; the back is contained within it.
      if (t.id === "draft") {
        setDraft((d) => (t.side === "front" ? { ...d, front: img.url, aspectRatio: img.aspectRatio } : { ...d, back: img.url }));
      } else {
        patchCard(t.id, t.side === "front" ? { frontImageUrl: img.url, aspectRatio: img.aspectRatio } : { backImageUrl: img.url });
        toast(t.side === "front" ? "Нүүр талын зураг солигдлоо" : "Ар талын зураг шинэчлэгдлээ", "success");
      }
    } catch {
      toast("Зургийг уншиж чадсангүй", "error");
    } finally {
      setBusy(false);
    }
  };

  const add = () => {
    if (!draft.front) return;
    const card: HolderCard = {
      id: uid("card"),
      title: draft.title.trim(),
      frontImageUrl: draft.front,
      backImageUrl: draft.back,
      aspectRatio: draft.aspectRatio,
      createdAt: new Date().toISOString(),
    };
    update("holderCards", (list) => [...list, card]);
    setDraft(EMPTY);
    toast("Карт нэмэгдлээ", "success");
  };

  return (
    <AdminCard
      title="Карт & Бичиг баримт"
      desc="Personal Card Holder: фитнесс, гишүүнчлэл, нэвтрэх карт гэх мэт. Картын хэмжээ зургийн харьцаагаар автоматаар тохирно."
    >
      {/* ---------------- New card ---------------- */}
      <div className="rounded-xl bg-soft/60 p-3 ring-1 ring-line">
        <p className="mb-2 text-[13px] font-bold text-ink">Шинэ карт</p>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <p className="mb-1 text-[12px] font-semibold text-muted">Нүүр тал *</p>
            <Thumb src={draft.front} aspectRatio={draft.aspectRatio} label="Нүүр талын зураг" empty="Нүүр тал оруулах" onPick={() => pick({ id: "draft", side: "front" })} />
          </div>
          <div>
            <p className="mb-1 flex items-center justify-between text-[12px] font-semibold text-muted">
              Ар тал (заавал биш)
              {draft.back && (
                <button type="button" onClick={() => setDraft((d) => ({ ...d, back: "" }))} aria-label="Ар талын зураг хасах" className="text-red-500">
                  <X className="size-3.5" />
                </button>
              )}
            </p>
            <Thumb src={draft.back} aspectRatio={draft.aspectRatio} label="Ар талын зураг" empty="Ар тал оруулах" onPick={() => pick({ id: "draft", side: "back" })} />
          </div>
        </div>
        {draft.front && <p className="mt-1.5 text-[11.5px] text-muted">Харьцаа: {ratio(draft.aspectRatio)}</p>}
        <input
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          placeholder="Гарчиг (заавал биш), ж: Фитнесс карт"
          aria-label="Картын гарчиг"
          maxLength={60}
          className={cn(smallInput, "mt-2.5 bg-card")}
        />
        <Button className="mt-2.5 h-11 w-full" disabled={!draft.front || busy} onClick={add}>
          <Plus className="size-4" /> Карт нэмэх
        </Button>
      </div>

      {/* ---------------- Existing cards ---------------- */}
      {cards.length === 0 ? (
        <p className="mt-3 text-center text-[13px] text-muted">Одоогоор карт нэмээгүй байна.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {cards.map((c) => (
            <li key={c.id} className="rounded-xl p-3 ring-1 ring-line">
              <div className="grid grid-cols-2 gap-2.5">
                <Thumb src={c.frontImageUrl} aspectRatio={c.aspectRatio} label="Нүүр талын зураг" empty="" onPick={() => pick({ id: c.id, side: "front" })} />
                <Thumb src={c.backImageUrl} aspectRatio={c.aspectRatio} label="Ар талын зураг" empty="Ар тал нэмэх" onPick={() => pick({ id: c.id, side: "back" })} />
              </div>
              <p className="mt-1.5 text-[11.5px] text-muted">Харьцаа: {ratio(c.aspectRatio)} · {c.backImageUrl ? "2 талтай (эргүүлж болно)" : "1 талтай"}</p>
              <input
                value={c.title}
                onChange={(e) => patchCard(c.id, { title: e.target.value })}
                placeholder="Гарчиг (заавал биш)"
                aria-label="Картын гарчиг"
                maxLength={60}
                className={cn(smallInput, "mt-2")}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <Button variant="soft" className="h-9 px-3 text-[13px]" onClick={() => pick({ id: c.id, side: "front" })}>
                  <RefreshCw className="size-3.5" /> Нүүр солих
                </Button>
                <Button variant="soft" className="h-9 px-3 text-[13px]" onClick={() => pick({ id: c.id, side: "back" })}>
                  <RefreshCw className="size-3.5" /> {c.backImageUrl ? "Ар солих" : "Ар нэмэх"}
                </Button>
                {c.backImageUrl && (
                  <Button variant="soft" className="h-9 px-3 text-[13px]" onClick={() => patchCard(c.id, { backImageUrl: "" })}>
                    <X className="size-3.5" /> Ар хасах
                  </Button>
                )}
                <Button variant="danger" className="ml-auto h-9 px-3 text-[13px]" onClick={() => setConfirmDelete(c)}>
                  <Trash2 className="size-3.5" /> Устгах
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void onFile(f);
        }}
      />
      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Картыг устгах уу?"
        message={`"${confirmDelete?.title || "Карт"}" бүрмөсөн устна.`}
        confirmLabel="Устгах"
        danger
        onConfirm={() => {
          if (confirmDelete) update("holderCards", (list) => list.filter((x) => x.id !== confirmDelete.id));
          setConfirmDelete(null);
          toast("Карт устгагдлаа", "success");
        }}
      />
    </AdminCard>
  );
}
