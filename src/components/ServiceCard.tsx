"use client";

import Link from "next/link";
import { Bookmark, Smartphone, Monitor, UserRound } from "lucide-react";
import type { Service, Channel } from "@/data/catalog";
import { useAppState } from "@/context/AppStateContext";
import { cn } from "@/lib/utils";

const CHANNEL_ICON: Record<Channel, { icon: typeof Smartphone; label: string }> = {
  mobile: { icon: Smartphone, label: "Гар утас" },
  web: { icon: Monitor, label: "Вэб" },
  agent: { icon: UserRound, label: "Үйлчилгээний ажилтан" },
};

export function ChannelIcons({ channels }: { channels: Channel[] }) {
  return (
    <span className="flex gap-1.5">
      {(["mobile", "web", "agent"] as Channel[]).map((c) => {
        const { icon: Icon, label } = CHANNEL_ICON[c];
        const on = channels.includes(c);
        return (
          <span
            key={c}
            title={label}
            aria-label={`${label}${on ? "" : " (боломжгүй)"}`}
            className={cn(
              "grid size-8 place-items-center rounded-lg",
              on ? "bg-emerald-500/12 text-emerald-600" : "bg-soft text-muted/50",
            )}
          >
            <Icon className="size-[18px]" />
          </span>
        );
      })}
    </span>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  const { state, toggleSaved } = useAppState();
  const saved = state.savedServices.includes(service.slug);
  return (
    <article className="relative rounded-card border border-line bg-card p-4 pt-3.5">
      <div className="flex items-start justify-between">
        <span className={cn("text-[13px] font-semibold", service.paid ? "text-amber-500" : "text-ink/80")}>
          {service.paid ? "Төлбөртэй" : "Төлбөргүй"}
          {service.custom && <span className="ml-2 rounded bg-brand/10 px-1.5 py-0.5 text-[11px] text-brand">Админ</span>}
        </span>
        <button
          type="button"
          onClick={() => toggleSaved(service.slug)}
          aria-pressed={saved}
          aria-label={saved ? "Хадгалснаас хасах" : "Хадгалах"}
          className="-mt-1 -mr-1 grid size-10 place-items-center rounded-xl text-muted active:scale-90 transition"
        >
          <Bookmark className={cn("size-6", saved && "fill-orange-400 text-orange-400")} strokeWidth={1.7} />
        </button>
      </div>
      <Link href={`/services/${service.slug}`} className="block">
        <h3 className="mt-1 pr-4 text-[18px] font-bold leading-snug text-ink after:absolute after:inset-0 after:content-['']">
          {service.title}
        </h3>
      </Link>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-[12.5px] font-medium text-ink/80">Үйлчилгээ авах боломжтой суваг</span>
        <ChannelIcons channels={service.channels} />
      </div>
    </article>
  );
}
