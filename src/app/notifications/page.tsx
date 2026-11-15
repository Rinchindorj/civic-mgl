"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import type { NotificationItem, NotificationType } from "@/data/seed";
import { Button, ConfirmDialog, EmptyState, HeaderIconButton, Page, PillTabs, Sheet, useTransient } from "@/components/ui";
import { cn } from "@/lib/utils";

const TABS: { value: "all" | NotificationType; label: string }[] = [
  { value: "all", label: "Бүх мэдэгдэл" },
  { value: "invoice", label: "Нэхэмжлэл" },
  { value: "resolution", label: "Шийдвэрлэлт" },
];

type Tab = "all" | NotificationType;

export default function NotificationsPage() {
  const params = useSearchParams();
  const initial: Tab = TABS.find((t) => t.value === params.get("tab"))?.value ?? "all";
  return <Notifications key={initial} initial={initial} />;
}

function Notifications({ initial }: { initial: Tab }) {
  const [tab, setTab] = useState<Tab>(initial);
  const { state, update, toast } = useAppState();
  const [detail, setDetail] = useTransient<NotificationItem | null>(null);
  const [confirm, setConfirm] = useTransient(false);

  const list = state.notifications.filter((n) => tab === "all" || n.type === tab);
  const unreadIn = (t: string) => state.notifications.filter((n) => !n.read && (t === "all" || n.type === t)).length;

  const open = (n: NotificationItem) => {
    setDetail(n);
    if (!n.read) update("notifications", (all) => all.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
  };

  return (
    <Page
      title="Сонордуулга"
      right={<HeaderIconButton icon={Trash2} label="Мэдэгдэл устгах" onClick={() => setConfirm(true)} />}
    >
      <PillTabs tabs={TABS.map((t) => ({ ...t, badge: unreadIn(t.value) }))} value={tab} onChange={setTab} />
      <button
        type="button"
        onClick={() => {
          update("notifications", (all) => all.map((n) => (tab === "all" || n.type === tab ? { ...n, read: true } : n)));
          toast("Бүх мэдэгдлийг уншсан болголоо", "success");
        }}
        className="mx-auto mt-4 flex items-center gap-2 text-[16px] font-semibold text-ink"
      >
        <span className="grid size-6 place-items-center rounded-full bg-brand text-white">
          <CheckCheck className="size-4" />
        </span>
        Бүх мэдэгдлийг уншсан болгох
      </button>

      {list.length === 0 ? (
        <EmptyState title="Мэдэгдэл алга байна" />
      ) : (
        <ul className="mt-4 space-y-3">
          {list.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => open(n)}
                className="flex w-full gap-4 rounded-card bg-card p-4 text-left shadow-sm active:scale-[0.99] transition"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-soft text-navy">
                  <Bell className="size-6 fill-current" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-muted">{n.date}</span>
                  <span className={cn("mt-0.5 flex gap-2 text-[16px] font-bold leading-snug", n.read ? "text-ink" : "text-brand")}>
                    <span className={cn("mt-2 size-2 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-brand")} />
                    {n.title}
                  </span>
                  <span className="mt-1 line-clamp-3 block text-[15px] leading-snug text-ink/85">{n.body}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Sheet open={!!detail} onClose={() => setDetail(null)} title={detail?.title}>
        {detail && (
          <>
            <p className="text-[13px] font-semibold text-muted">{detail.date}</p>
            <p className="mt-3 text-[16px] leading-relaxed text-ink">{detail.body}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button
                variant="danger"
                onClick={() => {
                  update("notifications", (all) => all.filter((x) => x.id !== detail.id));
                  setDetail(null);
                  toast("Мэдэгдлийг устгалаа");
                }}
              >
                <Trash2 className="size-5" /> Устгах
              </Button>
              <Button onClick={() => setDetail(null)}>Хаах</Button>
            </div>
          </>
        )}
      </Sheet>
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Уншсан мэдэгдлүүдийг устгах уу?"
        message="Энэ табын уншсан бүх мэдэгдэл устна. Уншаагүй мэдэгдлүүд хэвээр үлдэнэ."
        confirmLabel="Устгах"
        danger
        onConfirm={() => {
          update("notifications", (all) => all.filter((n) => !(n.read && (tab === "all" || n.type === tab))));
          toast("Уншсан мэдэгдлүүдийг устгалаа", "success");
        }}
      />
    </Page>
  );
}
