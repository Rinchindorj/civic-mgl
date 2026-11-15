"use client";

import { Copy, QrCode, CircleUserRound, Receipt, Smartphone, Settings } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { Card, HeaderIconButton, MenuRow, Page } from "@/components/ui";

export default function InfoPage() {
  const { state, toast } = useAppState();
  const u = state.sampleUser;

  return (
    <Page title="Миний мэдээлэл" fallback="/profile" right={<HeaderIconButton icon={QrCode} label="Миний QR" href="/qr?tab=mine" />}>
      <Card className="p-2.5">
        <div className="flex items-center gap-3 rounded-2xl bg-soft px-3.5 py-3">
          <div className="flex-1">
            <p className="text-[14px] text-ink/80">Демо гишүүнчлэлийн дугаар</p>
            <p className="text-[16px] font-bold text-ink">{u.demoId}</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(u.demoId);
                toast("Хуулагдлаа", "success");
              } catch {
                toast("Хуулж чадсангүй", "error");
              }
            }}
            className="flex items-center gap-1.5 rounded-full bg-card px-3.5 py-2 text-[14px] font-semibold text-ink shadow-sm"
          >
            <Copy className="size-4" /> Хуулах
          </button>
        </div>
      </Card>
      <div className="mt-4 space-y-3">
        <Card className="overflow-hidden">
          <MenuRow
            icon={CircleUserRound}
            iconClass="bg-emerald-500/12 text-emerald-600"
            title="Холбоо барих мэдээлэл"
            subtitle="Хувийн имэйл хаяг болон холбоо барих дугаар"
            href="/profile/info/contact"
            className="py-5"
          />
        </Card>
        <Card className="overflow-hidden">
          <MenuRow
            icon={Receipt}
            iconClass="bg-orange-500/12 text-orange-500"
            title="E-Barimt холболт"
            badge={state.ebarimtLinked ? <span className="rounded bg-emerald-500 px-1.5 text-[11px] text-white">Холбогдсон</span> : undefined}
            href="/profile/info/ebarimt"
            className="py-5"
          />
        </Card>
        <Card className="overflow-hidden">
          <MenuRow icon={Smartphone} iconClass="bg-slate-500/12 text-slate-600" title="Хандсан төхөөрөмжүүд" href="/profile/info/devices" className="py-5" />
        </Card>
        <Card className="overflow-hidden">
          <MenuRow icon={Settings} iconClass="bg-slate-500/12 text-slate-700" title="Тохиргоо" href="/profile/info/settings" className="py-5" />
        </Card>
      </div>
    </Page>
  );
}
