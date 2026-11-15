"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { POLLS } from "@/data/seed";
import { Page, PillTabs } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function PollsPage() {
  const { state, update, toast } = useAppState();
  const [tab, setTab] = useState<"all" | "mine">("all");
  const votes = state.pollVotes;
  const list = tab === "all" ? POLLS.filter((p) => !votes[p.id]) : POLLS.filter((p) => votes[p.id]);

  return (
    <Page title="Санал асуулга" fallback="/profile">
      <PillTabs
        tabs={[
          { value: "all", label: "Бүгд" },
          { value: "mine", label: "Миний өгсөн" },
        ]}
        value={tab}
        onChange={setTab}
      />
      <p className="mt-4 text-[16px] leading-relaxed text-muted">
        Төрийн үйлчилгээ, бодлого, шийдвэрүүдийг сайжруулахад таны оролцоо үнэтэй хувь нэмэр болно.
      </p>
      {list.length === 0 ? (
        <p className="mt-3 text-[16px] text-muted">
          {tab === "all" ? "Одоогоор санал асуулга байхгүй байна." : "Та одоогоор санал өгөөгүй байна."}
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {list.map((p) => (
            <li key={p.id} className="rounded-card bg-card p-4 shadow-sm">
              <p className="text-[12.5px] text-muted">
                {p.org} · {p.deadline} хүртэл
              </p>
              <p className="mt-1 text-[16px] font-bold leading-snug text-ink">{p.title}</p>
              <div className="mt-3 space-y-2">
                {p.options.map((o) => {
                  const mine = votes[p.id] === o;
                  return (
                    <button
                      key={o}
                      type="button"
                      disabled={!!votes[p.id]}
                      onClick={() => {
                        update("pollVotes", (v) => ({ ...v, [p.id]: o }));
                        toast("Таны санал бүртгэгдлээ. Баярлалаа!", "success");
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[15px] transition",
                        mine ? "bg-brand text-white" : "bg-soft text-ink",
                      )}
                    >
                      {o}
                      {mine && <CheckCircle2 className="size-5" />}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Page>
  );
}
