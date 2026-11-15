"use client";

import { Download, Share2 } from "lucide-react";
import type { HistoryItem } from "@/data/seed";
import type { Service } from "@/data/catalog";
import { useAppState } from "@/context/AppStateContext";
import { Button, Sheet, StatusPill } from "./ui";
import { SampleQr, SampleWatermark } from "./Sample";
import { Emblem } from "./Logo";
import { fmtDate, fmtTime, refNumber, uid } from "@/lib/utils";

/** Creates a SAMPLE request record for a service and logs it to history + notifications. */
export function useServiceRequest() {
  const { addHistory, addNotification } = useAppState();
  return (service: Pick<Service, "slug" | "title" | "paid">, kind: HistoryItem["kind"] = "service", details?: Record<string, string>) => {
    const now = new Date();
    const item: HistoryItem = {
      id: uid("h"),
      ref: refNumber("SMP"),
      date: `${fmtDate(now, "/")} ${fmtTime(now, false)}`,
      title: service.title,
      status: service.paid ? "Хянагдаж буй" : "Зөвшөөрсөн",
      serviceSlug: service.slug,
      kind,
      details,
    };
    addHistory(item);
    addNotification({
      type: "resolution",
      title: service.paid ? "Хүсэлт хүлээн авлаа" : "Лавлагаа бэлэн боллоо",
      body: `“${service.title}” — ${item.ref} дугаартай ЗАГВАР лавлагаа Үйлчилгээний түүхэнд хадгалагдлаа.`,
    });
    return item;
  };
}

export function SlipSheet({ item, onClose }: { item: HistoryItem | null; onClose: () => void }) {
  const { state, toast } = useAppState();
  const u = state.sampleUser;
  if (!item) return null;

  const rows: [string, string][] = [
    ["Лавлагааны дугаар", item.ref],
    ["Огноо", item.date],
    ["Овог", u.clan],
    ["Эцэг/эхийн нэр", u.lastName],
    ["Нэр", u.firstName],
    ["Демо регистр", u.sampleReg],
    ["Демо гишүүнчлэлийн ID", u.demoId],
    ...Object.entries(item.details ?? {}),
  ];

  return (
    <Sheet
      open={!!item}
      onClose={onClose}
      title="Цахим лавлагааны хуудас"
      footer={
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => { window.print(); }}>
            <Download className="size-5" /> Хэвлэх
          </Button>
          <Button
            onClick={async () => {
              const text = `${item.title} — ${item.ref} (SAMPLE / ЗАГВАР, Civic MGL демо)`;
              try {
                if (navigator.share) await navigator.share({ title: "Civic MGL", text });
                else {
                  await navigator.clipboard.writeText(text);
                  toast("Лавлагааны мэдээллийг хуулсан", "success");
                }
              } catch {
                /* user cancelled share */
              }
            }}
          >
            <Share2 className="size-5" /> Хуваалцах
          </Button>
        </div>
      }
    >
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-brand/40 bg-white p-4 text-[#1B2433]">
        <SampleWatermark dense />
        <div className="relative z-0 flex items-center gap-3 border-b border-slate-200 pb-3">
          <Emblem className="size-10" />
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Civic MGL · Демо лавлагаа</p>
            <p className="text-[15px] font-bold leading-snug">{item.title}</p>
          </div>
          <StatusPill status={item.status} />
        </div>
        <dl className="relative z-0 mt-3 space-y-2 text-[13.5px]">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <dt className="text-slate-500">{k}</dt>
              <dd className="text-right font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="relative z-0 mt-4 flex items-end justify-between border-t border-slate-200 pt-3">
          <p className="max-w-[60%] text-[11px] leading-snug text-slate-500">
            Энэхүү баримт нь зөвхөн демо зорилготой ЗАГВАР бөгөөд албан ёсны хүчин төгөлдөр баримт бичиг биш.
          </p>
          <SampleQr seed={item.ref} className="size-20 rounded-md" />
        </div>
      </div>
    </Sheet>
  );
}
