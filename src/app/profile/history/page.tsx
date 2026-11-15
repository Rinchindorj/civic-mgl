"use client";

import { ChevronRight } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import type { HistoryItem } from "@/data/seed";
import { ButtonLink, EmptyState, Page, StatusPill, useTransient } from "@/components/ui";
import { SlipSheet } from "@/components/Slip";

export default function HistoryPage() {
  const { state } = useAppState();
  const [slip, setSlip] = useTransient<HistoryItem | null>(null);

  return (
    <Page title="Миний авсан үйлчилгээ" fallback="/profile">
      {state.history.length === 0 ? (
        <EmptyState>
          <ButtonLink href="/services" className="w-full">Үйлчилгээ авах</ButtonLink>
        </EmptyState>
      ) : (
        <ul className="space-y-4">
          {state.history.map((h) => (
            <li key={h.id} className="overflow-hidden rounded-card bg-card shadow-sm">
              <div className="p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-muted">{h.date}</span>
                  <StatusPill status={h.status} />
                </div>
                <p className="mt-1 text-[17px] leading-snug text-ink">{h.title}</p>
              </div>
              <button type="button" onClick={() => setSlip(h)} className="flex w-full items-center justify-between border-t border-line px-3.5 py-3 text-[16px] font-bold text-brand">
                Дэлгэрэнгүй
                <span className="grid size-7 place-items-center rounded-full bg-brand text-white">
                  <ChevronRight className="size-4" strokeWidth={3} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <SlipSheet item={slip} onClose={() => setSlip(null)} />
    </Page>
  );
}
