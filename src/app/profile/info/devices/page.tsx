"use client";

import { Laptop, Smartphone } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { Page } from "@/components/ui";

export default function DevicesPage() {
  const { state, update, toast } = useAppState();

  return (
    <Page title="Хандсан төхөөрөмжүүд" fallback="/profile/info">
      <ul className="space-y-3">
        {state.devices.map((d) => {
          const Icon = d.name.includes("Mac") ? Laptop : Smartphone;
          return (
            <li key={d.id} className="flex items-center gap-3 rounded-card bg-card p-4 shadow-sm">
              <span className="grid size-12 place-items-center rounded-xl bg-soft text-slate-600">
                <Icon className="size-6" />
              </span>
              <div className="flex-1">
                <p className="text-[16px] font-semibold text-ink">{d.name}</p>
                <p className="text-[13px] text-muted">
                  {d.place} · {d.last}
                </p>
              </div>
              {d.current ? (
                <span className="rounded-lg bg-emerald-500/12 px-2.5 py-1 text-[12px] font-bold text-emerald-600">Энэ төхөөрөмж</span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    update("devices", (all) => all.filter((x) => x.id !== d.id));
                    toast(`${d.name} төхөөрөмжөөс гаргалаа`, "success");
                  }}
                  className="rounded-lg bg-red-500/10 px-3 py-2 text-[13px] font-bold text-red-600"
                >
                  Гаргах
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </Page>
  );
}
