"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRightToLine, ChevronRight, Moon, Phone, Sun, Settings2, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { themeVars, useAppState } from "@/context/AppStateContext";
import { ConfirmDialog } from "./ui";
import { AI_ICON, PROFILE_ICONS } from "@/lib/icons";
import { cn } from "@/lib/utils";

export const APP_VERSION = "v5.0.9";
export const APP_BUILD = "5.0.9-v97";

const TAB_PATHS = new Set(["/", "/services", "/extras", "/profile"]);

export default function AppShell({ children }: { children: ReactNode }) {
  const { state, currentEmail } = useAppState();
  const pathname = usePathname();
  const router = useRouter();
  const signedIn = !!currentEmail;
  const onLogin = pathname === "/login";
  // Auth gate: signed out → only /login renders; signed in → /login bounces to Нүүр.
  const redirect = !signedIn && !onLogin ? "/login" : signedIn && onLogin ? "/" : null;

  useEffect(() => {
    if (redirect) router.replace(redirect);
  }, [redirect, router]);

  return (
    <div
      id="civic-app"
      style={themeVars(state.themeConfig)}
      className={cn(
        "relative mx-auto min-h-screen max-w-[430px] overflow-x-hidden bg-app text-ink shadow-2xl",
        state.themeConfig.darkMode && "dark",
      )}
    >
      {redirect ? null : children}
      {signedIn && !redirect && (
        <>
          <EdgeSwipe showHandle={TAB_PATHS.has(pathname)} />
          <AiOrb />
          <Drawer />
        </>
      )}
      <Toasts />
    </div>
  );
}

/* --------------------------------- Toasts --------------------------------- */
function Toasts() {
  const { toasts } = useAppState();
  return (
    <div className="frame-fixed top-3 z-[80] flex flex-col items-center gap-2 px-4 pointer-events-none" aria-live="polite">
      {toasts.map((t) => {
        const Icon = t.tone === "success" ? CheckCircle2 : t.tone === "error" ? AlertCircle : Info;
        return (
          <div
            key={t.id}
            className="animate-toast flex items-center gap-2 rounded-2xl bg-[#0B1530]/95 px-4 py-3 text-[14px] font-semibold text-white shadow-xl"
          >
            <Icon className={cn("size-5", t.tone === "success" ? "text-emerald-400" : t.tone === "error" ? "text-red-400" : "text-sky-300")} />
            {t.message}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------- Right-edge swipe to open ------------------------- */
/**
 * Swiping left from the right edge of the mobile frame opens the drawer.
 * A slim pull handle on the tab pages makes the same gesture easy with a mouse
 * (click it, or drag it left).
 */
function EdgeSwipe({ showHandle }: { showHandle: boolean }) {
  const { drawerOpen, setDrawerOpen } = useAppState();
  const start = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (drawerOpen) return;
    const frameRight = () => document.getElementById("civic-app")?.getBoundingClientRect().right ?? window.innerWidth;
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      start.current = frameRight() - t.clientX <= 28 ? { x: t.clientX, y: t.clientY } : null;
    };
    const onEnd = (e: TouchEvent) => {
      const s0 = start.current;
      start.current = null;
      const t = e.changedTouches[0];
      if (!s0 || !t) return;
      const dx = t.clientX - s0.x;
      const dy = t.clientY - s0.y;
      if (dx < -50 && Math.abs(dx) > Math.abs(dy) * 1.5) setDrawerOpen(true);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [drawerOpen, setDrawerOpen]);

  if (!showHandle || drawerOpen) return null;

  return (
    <div className="frame-fixed inset-y-0 z-30 pointer-events-none">
      <button
        type="button"
        aria-label="Цэс нээх (зүүн тийш чирэх)"
        title="Цэс нээх"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          start.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const s0 = start.current;
          start.current = null;
          // A click or a leftward drag both open the drawer.
          if (s0 && e.clientX - s0.x < 8) setDrawerOpen(true);
        }}
        className="group pointer-events-auto absolute top-1/2 right-0 flex h-24 w-5 -translate-y-1/2 touch-none items-center justify-end"
      >
        <span className="h-14 w-1.5 rounded-l-full bg-brand/25 transition-all group-hover:h-20 group-hover:w-2.5 group-hover:bg-brand/60" />
      </button>
    </div>
  );
}

/* ---------------------------- Floating AI orb ---------------------------- */
const ORB = 56;
const ORB_KEY = "civic-mgl-orb-pos";

function readOrbPos(): { x: number; y: number } | null {
  try {
    const v = JSON.parse(localStorage.getItem(ORB_KEY) ?? "null");
    return v && typeof v.x === "number" && typeof v.y === "number" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Draggable AI helper. Drag anywhere inside the mobile frame (clamped to it);
 * a tap without movement spins it and refreshes live data.
 */
function AiOrb() {
  const { refreshRates, toast } = useAppState();
  const router = useRouter();
  const layer = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(readOrbPos);
  const [spinning, setSpinning] = useState(false);
  const drag = useRef<{ dx: number; dy: number; sx: number; sy: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const clamp = useCallback((x: number, y: number) => {
    const box = layer.current?.getBoundingClientRect();
    if (!box) return { x, y };
    return {
      x: Math.min(Math.max(8, x), box.width - ORB - 8),
      y: Math.min(Math.max(8, y), box.height - ORB - 8),
    };
  }, []);

  // Keep the orb on screen when the viewport changes.
  useEffect(() => {
    const onResize = () => setPos((p) => (p ? clamp(p.x, p.y) : p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clamp]);

  const run = async () => {
    if (spinning) return;
    setSpinning(true);
    await Promise.all([refreshRates(), new Promise((r) => setTimeout(r, 900))]);
    router.refresh();
    setSpinning(false);
    toast("AI туслах шинэчлэгдлээ", "success");
  };

  return (
    <div ref={layer} className="frame-fixed inset-y-0 z-40 pointer-events-none">
      <button
        type="button"
        aria-label="AI туслах — дарж шинэчлэх, чирж зөөх"
        style={pos ? { left: pos.x, top: pos.y } : { right: 16, bottom: 116 }}
        className="pointer-events-auto absolute touch-none select-none"
        onPointerDown={(e) => {
          const el = e.currentTarget;
          const box = layer.current!.getBoundingClientRect();
          const me = el.getBoundingClientRect();
          el.setPointerCapture(e.pointerId);
          drag.current = { dx: e.clientX - me.left, dy: e.clientY - me.top, sx: e.clientX, sy: e.clientY, moved: false };
          // Pin to explicit coordinates so the first move doesn't jump.
          setPos({ x: me.left - box.left, y: me.top - box.top });
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 6) return;
          d.moved = true;
          const box = layer.current!.getBoundingClientRect();
          setPos(clamp(e.clientX - box.left - d.dx, e.clientY - box.top - d.dy));
        }}
        onPointerUp={() => {
          const d = drag.current;
          drag.current = null;
          if (d?.moved) {
            suppressClick.current = true;
            setPos((p) => {
              try {
                if (p) localStorage.setItem(ORB_KEY, JSON.stringify(p));
              } catch {}
              return p;
            });
          }
        }}
        onPointerCancel={() => (drag.current = null)}
        onClick={() => {
          if (suppressClick.current) {
            suppressClick.current = false;
            return;
          }
          void run();
        }}
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400/40 [animation-duration:2.4s]" aria-hidden />
        <span
          className={cn(
            "relative block size-14 overflow-hidden rounded-full bg-white shadow-[0_8px_20px_-6px_rgba(67,56,202,0.65)] ring-2 ring-brand/40",
            spinning && "animate-orb-spin",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- user-provided JPG with an encoded path */}
          <img src={AI_ICON} alt="" draggable={false} className="size-full object-cover" />
        </span>
      </button>
    </div>
  );
}

/* --------------------------------- Drawer --------------------------------- */
const DRAWER_LINKS = [
  { href: "/support/help", label: "Тусламж" },
  { href: "/support/feedback", label: "Санал хүсэлт" },
  { href: "/support/faq", label: "Түгээмэл асуулт хариулт" },
  { href: "/support/terms", label: "Үйлчилгээний нөхцөл" },
  { gap: true, href: "/support/contact", label: "Холбоо барих" },
  { href: "/support/locations", label: "Хаяг байршил" },
];

/** Right-side slide-over (screen_07). Scrolls vertically; swipe right to dismiss. */
function Drawer() {
  const { drawerOpen, setDrawerOpen, state, setTheme, logout } = useAppState();
  const [confirm, setConfirm] = useState(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const close = () => setDrawerOpen(false);
  const dark = state.themeConfig.darkMode;

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, setDrawerOpen]);

  return (
    <>
      {drawerOpen && (
        <div className="frame-fixed inset-y-0 z-[70]" role="dialog" aria-modal="true" aria-label="Үндсэн цэс">
          <button
            type="button"
            aria-label="Цэс хаах"
            onClick={close}
            className="absolute inset-0 bg-[#050b1a]/45 animate-fade"
          />
          <aside
            onTouchStart={(e) => (swipe.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
            onTouchEnd={(e) => {
              const s0 = swipe.current;
              swipe.current = null;
              const t = e.changedTouches[0];
              if (s0 && t.clientX - s0.x > 70 && Math.abs(t.clientX - s0.x) > Math.abs(t.clientY - s0.y) * 1.5) close();
            }}
            className="animate-drawer absolute inset-y-0 right-0 flex w-[82%] max-w-[340px] flex-col overflow-y-auto overscroll-contain rounded-l-[28px] bg-card px-5 pt-[max(env(safe-area-inset-top),20px)] pb-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={close}
                aria-label="Цэс хаах"
                className="grid size-11 place-items-center rounded-xl bg-soft text-ink"
              >
                <ArrowRightToLine className="size-5" />
              </button>
              <button
                type="button"
                role="switch"
                aria-checked={dark}
                aria-label="Харанхуй горим"
                onClick={() => setTheme({ darkMode: !dark })}
                className={cn(
                  "relative h-11 w-[88px] rounded-full transition-colors",
                  dark ? "bg-[#1E2A47]" : "bg-gradient-to-r from-sky-300 to-sky-500",
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 left-1 grid size-9 place-items-center rounded-full bg-white shadow transition-transform",
                    dark && "translate-x-[44px]",
                  )}
                >
                  {dark ? <Moon className="size-5 text-slate-700" /> : <Sun className="size-5 text-amber-500" />}
                </span>
              </button>
            </div>

            <nav className="mt-8 flex flex-col">
              {DRAWER_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  className={cn("flex items-center justify-between py-3.5 text-[17px] font-medium text-ink", l.gap && "mt-4")}
                >
                  {l.label}
                  <ChevronRight className="size-5 text-ink/70" />
                </Link>
              ))}
            </nav>

            <div className="mt-auto space-y-3 pt-8">
              <Link
                href="/sos"
                onClick={close}
                className="relative block overflow-hidden rounded-2xl bg-gradient-to-br from-red-700 via-red-500 to-red-400 p-4 text-white shadow-lg"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-white/20 text-[15px] font-black ring-1 ring-white/40">
                  SOS
                </span>
                <span className="mt-3 block pr-12 text-[16px] font-bold">Яаралтай тусламж дуудах</span>
                <span className="absolute right-4 bottom-4 grid size-10 place-items-center rounded-full bg-white/20 ring-1 ring-white/40">
                  <Phone className="size-5" />
                </span>
              </Link>
              {/* Admin sits at the bottom of the list, right above logout. */}
              <Link
                href="/admin"
                onClick={close}
                className="flex items-center gap-3 rounded-2xl bg-brand/10 px-4 py-3.5 text-[16px] font-bold text-brand"
              >
                <Settings2 className="size-5" />
                <span className="flex-1">Админ удирдлага (CMS)</span>
                <span className="rounded-md bg-brand px-1.5 py-0.5 text-[10px] font-black tracking-wider text-white">ADMIN</span>
              </Link>
              <button
                type="button"
                onClick={() => setConfirm(true)}
                className="flex w-full items-center gap-3 rounded-2xl bg-red-500/10 px-4 py-4 text-[17px] font-bold text-red-500"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- user-provided PNG */}
                <img src={PROFILE_ICONS.logout} alt="" className="size-10 rounded-xl object-cover" />
                Системээс гарах
              </button>
              <p className="pt-2 text-center text-[13px] text-muted">{APP_BUILD}</p>
            </div>
          </aside>
        </div>
      )}
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Системээс гарах уу?"
        message="Демо сессээс гарч, нэвтрэх хуудас руу шилжинэ. Таны тохиргоо энэ төхөөрөмжид хадгалагдана."
        confirmLabel="Гарах"
        danger
        onConfirm={logout}
      />
    </>
  );
}
