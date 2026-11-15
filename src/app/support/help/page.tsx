"use client";

import { BookOpenText, Headset } from "lucide-react";
import { HELP_TOPICS } from "@/data/seed";
import { ButtonLink, Page, Sheet, useTransient } from "@/components/ui";

export default function HelpPage() {
  const [open, setOpen] = useTransient<(typeof HELP_TOPICS)[number] | null>(null);
  return (
    <Page title="Тусламж">
      <ul className="space-y-3">
        {HELP_TOPICS.map((t) => (
          <li key={t.q}>
            <button type="button" onClick={() => setOpen(t)} className="flex w-full items-center gap-4 rounded-card bg-card px-4 py-4 text-left shadow-sm">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-soft text-brand">
                <BookOpenText className="size-6" />
              </span>
              <span className="text-[16px] font-semibold text-ink">{t.q}</span>
            </button>
          </li>
        ))}
      </ul>
      <ButtonLink href="/support/contact" variant="soft" className="mt-6 w-full">
        <Headset className="size-5" /> Оператортой холбогдох
      </ButtonLink>
      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.q}>
        <p className="text-[16px] leading-relaxed text-ink">{open?.a}</p>
      </Sheet>
    </Page>
  );
}
