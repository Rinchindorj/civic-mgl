"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, ReactNode } from "react";
import { Bell, Bookmark, Menu } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { BrandLogo } from "./BrandLogo";
import { NavExtras, NavHome, NavProfile, NavServices } from "./Art";
import { QR_FAB } from "@/lib/icons";
import { cn } from "@/lib/utils";

const iconBtn =
  "relative grid size-10 shrink-0 place-items-center rounded-2xl text-brand active:scale-95 transition hover:bg-brand/5";

/* ------------------------------ Header pieces ------------------------------ */

function HeaderShell({ children }: { children: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 bg-app/80 backdrop-blur-md pt-[max(env(safe-area-inset-top),10px)]">
      <div className="flex min-h-[56px] items-center gap-0.5 pr-2.5 pl-4 pb-2">{children}</div>
    </header>
  );
}

function HomeLink() {
  return (
    <Link href="/" aria-label="Нүүр хуудас" className="mr-auto min-w-0">
      <BrandLogo />
    </Link>
  );
}

function BellLink() {
  const unread = useAppState().state.notifications.filter((n) => !n.read).length;
  return (
    <Link href="/notifications" aria-label={`Мэдэгдэл, ${unread} уншаагүй`} className={iconBtn}>
      <Bell className="size-[25px]" />
      {unread > 0 && (
        <span className="absolute top-1.5 right-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-app">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}

/* ------------------------------ Per-tab headers ------------------------------ */

/** Нүүр (screen_01): logo · bell · drawer. Theme toggle lives in the drawer. */
function HomeHeader() {
  const { setDrawerOpen } = useAppState();
  return (
    <HeaderShell>
      <HomeLink />
      <BellLink />
      <button type="button" aria-label="Цэс нээх" onClick={() => setDrawerOpen(true)} className={iconBtn}>
        <Menu className="size-7" strokeWidth={2.2} />
      </button>
    </HeaderShell>
  );
}

/** Үйлчилгээ (screen_08): logo · Хадгалсан pill. */
function ServicesHeader() {
  return (
    <HeaderShell>
      <HomeLink />
      <Link
        href="/services/saved"
        className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-card px-4 text-[15px] font-semibold text-ink shadow-sm ring-1 ring-line/60 active:scale-95 transition"
      >
        <Bookmark className="size-5 fill-orange-400 text-orange-400" />
        Хадгалсан
      </Link>
    </HeaderShell>
  );
}

/** Нэмэлт (screen_13): logo · bell. */
function ExtrasHeader() {
  return (
    <HeaderShell>
      <HomeLink />
      <BellLink />
    </HeaderShell>
  );
}

/** Профайл (screen_15): no logo and no utility icons — the profile card starts right at the top. */
function ProfileHeader() {
  return <div aria-hidden className="h-[max(env(safe-area-inset-top),14px)]" />;
}

export function TopBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/services")) return <ServicesHeader />;
  if (pathname.startsWith("/extras")) return <ExtrasHeader />;
  if (pathname.startsWith("/profile")) return <ProfileHeader />;
  return <HomeHeader />;
}

/* -------------------------------- Bottom nav -------------------------------- */

type NavIcon = ComponentType<{ active?: boolean; className?: string }>;
const NAV: { href: string; label: string; icon?: NavIcon; center?: boolean }[] = [
  { href: "/", label: "Нүүр", icon: NavHome },
  { href: "/services", label: "Үйлчилгээ", icon: NavServices },
  { href: "/qr", label: "QR", center: true },
  { href: "/extras", label: "Нэмэлт", icon: NavExtras },
  { href: "/profile", label: "Профайл", icon: NavProfile },
];

export function BottomNav() {
  const pathname = usePathname();
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav
      aria-label="Үндсэн навигаци"
      className="frame-fixed bottom-0 z-40 border-t border-line/70 bg-card/95 backdrop-blur-md pb-[max(env(safe-area-inset-bottom),8px)]"
    >
      <ul className="grid grid-cols-5 items-end">
        {NAV.map(({ href, label, icon: Icon, center }) =>
          center || !Icon ? (
            <li key={href} className="flex justify-center">
              <Link
                href={href}
                aria-label="QR код уншуулах"
                className="-mt-9 grid size-[72px] place-items-center rounded-full bg-card p-1 shadow-[0_10px_24px_-10px_var(--brand-primary)] active:scale-95 transition"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- user-provided PNG with an encoded path */}
                <img src={QR_FAB} alt="" className="size-full rounded-full object-contain" draggable={false} />
              </Link>
            </li>
          ) : (
            <li key={href}>
              <Link
                href={href}
                aria-current={active(href) ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 pt-2.5 pb-1 text-[13px] font-semibold transition",
                  active(href) ? "text-brand" : "text-muted",
                )}
              >
                <span className="relative">
                  <Icon active={active(href)} className="size-[28px]" />
                  {active(href) && <span className="absolute -top-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-brand" />}
                </span>
                {label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
