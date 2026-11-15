"use client";

import { Settings2 } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { Card, MenuRow, Page, Toggle } from "@/components/ui";

export default function SettingsPage() {
  const { state, setTheme, update } = useAppState();
  const rows: [string, boolean, (v: boolean) => void][] = [
    ["Харанхуй горим", state.themeConfig.darkMode, (v) => setTheme({ darkMode: v })],
    ["Push мэдэгдэл", state.notifPrefs.push, (v) => update("notifPrefs", (p) => ({ ...p, push: v }))],
    ["И-мэйл мэдэгдэл", state.notifPrefs.email, (v) => update("notifPrefs", (p) => ({ ...p, email: v }))],
    ["SMS мэдэгдэл", state.notifPrefs.sms, (v) => update("notifPrefs", (p) => ({ ...p, sms: v }))],
  ];

  return (
    <Page title="Тохиргоо" fallback="/profile/info">
      <Card className="divide-y divide-line">
        {rows.map(([label, value, set]) => (
          <div key={label} className="flex items-center justify-between px-4 py-4">
            <span className="text-[16px] text-ink">{label}</span>
            <Toggle checked={value} onChange={set} label={label} />
          </div>
        ))}
      </Card>
      <Card className="mt-4 overflow-hidden">
        <MenuRow icon={Settings2} title="Өнгө, загвар, нүүр хуудас" subtitle="Админ удирдлага" href="/admin" />
      </Card>
      <p className="mt-6 text-center text-[13px] text-muted">Civic MGL v5.0.9 · Демо хувилбар</p>
    </Page>
  );
}
