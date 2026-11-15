"use client";

import { useState } from "react";
import { EyeOff, Eye, RefreshCw } from "lucide-react";
import { useAppState, type HolderCard } from "@/context/AppStateContext";
import { Button, ButtonLink, EmptyState, HeaderIconButton, Page, Sheet, Toggle } from "@/components/ui";
import { FlipCard, PhotoCardFace } from "@/components/IdFlipCard";
import { referenceHref } from "@/lib/documents";

const cardTitle = (c: HolderCard) => c.title.trim() || "Карт";

/**
 * View-only list of the cards uploaded in /admin (Хэрэглэгч & Баримт →
 * Карт & Бичиг баримт). Tapping a card slides up a sheet over a dimmed backdrop;
 * tapping the card in the sheet flips it when it has a back photo.
 */
export default function DocumentsPage() {
  const { state, toast, addNotification } = useAppState();
  const [show, setShow] = useState(true);
  const [spin, setSpin] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const cards = state.holderCards;
  const open = cards.find((c) => c.id === openId);

  return (
    <Page
      title="Миний бичиг баримт"
      fallback="/profile"
      right={
        <HeaderIconButton
          icon={RefreshCw}
          label="Шинэчлэх"
          onClick={() => {
            setSpin((s) => s + 1);
            toast("Бичиг баримтын мэдээлэл шинэчлэгдлээ", "success");
          }}
        />
      }
    >
      <div className="flex items-center gap-3 rounded-card bg-card p-3.5 shadow-sm">
        <span className="grid size-11 place-items-center rounded-xl bg-soft text-muted">{show ? <Eye className="size-6" /> : <EyeOff className="size-6" />}</span>
        <span className="flex-1 text-[16px] text-ink">Бичиг баримтын мэдээлэл</span>
        <Toggle checked={show} onChange={setShow} label="Бичиг баримтын мэдээлэл харуулах" />
      </div>

      <div key={spin} className="mt-4 space-y-4 animate-fade">
        {cards.length === 0 ? (
          <EmptyState title="Карт нэмээгүй байна">
            <p className="text-[14px] text-muted">Картаа Админ удирдлага → Хэрэглэгч & Баримт → Карт & Бичиг баримт хэсгээс нэмнэ.</p>
            <ButtonLink href="/admin" className="mt-4 w-full">
              Админ удирдлага
            </ButtonLink>
          </EmptyState>
        ) : (
          cards.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setOpenId(c.id)}
              aria-label={`${cardTitle(c)} нээх`}
              className="block w-full rounded-card bg-card p-3 text-left shadow-sm transition active:scale-[0.98]"
            >
              <PhotoCardFace src={c.frontImageUrl} aspectRatio={c.aspectRatio} alt={cardTitle(c)} hidden={!show} />
              {c.title.trim() && <p className="mt-2.5 px-1 text-[15px] font-semibold text-ink">{c.title}</p>}
            </button>
          ))
        )}
      </div>

      <Sheet open={!!open} onClose={() => setOpenId(null)} title={open && cardTitle(open)}>
        {open && (
          <div className="pb-2">
            {open.backImageUrl ? (
              <FlipCard
                label={cardTitle(open)}
                front={<PhotoCardFace src={open.frontImageUrl} aspectRatio={open.aspectRatio} alt={`${cardTitle(open)}: нүүр тал`} hidden={!show} />}
                back={<PhotoCardFace src={open.backImageUrl} aspectRatio={open.aspectRatio} alt={`${cardTitle(open)}: ар тал`} hidden={!show} />}
              />
            ) : (
              <PhotoCardFace src={open.frontImageUrl} aspectRatio={open.aspectRatio} alt={cardTitle(open)} hidden={!show} />
            )}
            <div className="mt-5 space-y-3">
              <ButtonLink href={referenceHref(open.id)} className="h-[52px] w-full text-[16px]">
                Лавлагаа авах
              </ButtonLink>
              <Button
                variant="soft"
                className="h-[52px] w-full text-[16px]"
                onClick={() => {
                  addNotification({
                    type: "general",
                    title: `${cardTitle(open)}: дахин захиалга`,
                    body: "Таны дахин захиалах хүсэлтийг хүлээн авлаа.",
                  });
                  toast("Дахин захиалах хүсэлт илгээгдлээ", "success");
                  setOpenId(null);
                }}
              >
                Дахин захиалах
              </Button>
            </div>
          </div>
        )}
      </Sheet>
    </Page>
  );
}
