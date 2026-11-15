"use client";

import Link from "next/link";
import { Settings2, ChevronRight } from "lucide-react";
import { useAppState, type Petition } from "@/context/AppStateContext";
import { ButtonLink, EmptyBox, Page, Sheet, StatusPill, useTransient } from "@/components/ui";

export default function PetitionsPage() {
  const { state } = useAppState();
  const [open, setOpen] = useTransient<Petition | null>(null);

  return (
    <Page title="Өргөдөл, гомдол" fallback="/profile">
      {state.petitions.length === 0 ? (
        <div className="flex flex-col items-center pt-6">
          <Link
            href="/admin"
            className="flex w-full flex-col items-center rounded-card bg-card px-6 py-8 text-center shadow-sm active:scale-[0.99] transition"
            aria-label="Хоосон байна — Админ удирдлага нээх"
          >
            <EmptyBox />
            <p className="mt-4 text-[16px] text-ink/80">Хоосон байна</p>
            <span className="mt-2 flex items-center gap-1 text-[13px] font-semibold text-brand">
              <Settings2 className="size-4" /> Админ удирдлага нээх
            </span>
          </Link>
          <ButtonLink href="/extras/1111-complaint" className="mt-5 w-full">
            Өргөдөл, гомдол илгээх
          </ButtonLink>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {state.petitions.map((p) => (
              <li key={p.id}>
                <button type="button" onClick={() => setOpen(p)} className="w-full rounded-card bg-card p-4 text-left shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-muted">{p.date}</span>
                    <StatusPill status={p.status} />
                  </div>
                  <p className="mt-1 text-[16px] font-semibold text-ink">{p.title}</p>
                  <p className="mt-0.5 flex items-center justify-between text-[13px] text-muted">
                    {p.ref} <ChevronRight className="size-4" />
                  </p>
                </button>
              </li>
            ))}
          </ul>
          <ButtonLink href="/extras/1111-complaint" variant="soft" className="mt-5 w-full">
            Шинэ өргөдөл илгээх
          </ButtonLink>
        </>
      )}
      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.title}>
        {open && (
          <div className="space-y-3 text-[15px]">
            <p className="text-muted">
              {open.kind} · {open.ref} · {open.date}
            </p>
            <p className="rounded-2xl bg-soft p-4 leading-relaxed text-ink">{open.body || "—"}</p>
            <ol className="space-y-2 border-l-2 border-brand/30 pl-4 text-[14px]">
              <li><b className="text-ink">Хүлээн авсан</b> — {open.date}</li>
              <li className="text-muted">Холбогдох байгууллагад шилжүүлэх (хүлээгдэж буй)</li>
              <li className="text-muted">Шийдвэрлэх (хүлээгдэж буй)</li>
            </ol>
          </div>
        )}
      </Sheet>
    </Page>
  );
}
