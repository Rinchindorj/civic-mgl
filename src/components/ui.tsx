"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------ */
/* Transient state: resets when the page is hidden by Next's <Activity>.     */
/* ------------------------------------------------------------------------ */
export function useTransient<T>(initial: T) {
  const [value, setValue] = useState<T>(initial);
  useLayoutEffect(() => {
    return () => setValue(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [value, setValue] as const;
}

/* --------------------------------- Card --------------------------------- */
export function Card({ className, children, ...rest }: ComponentProps<"div">) {
  return (
    <div className={cn("bg-card rounded-card shadow-[0_1px_2px_rgba(16,24,40,0.04)]", className)} {...rest}>
      {children}
    </div>
  );
}

/* ------------------------------ Page header ------------------------------ */
export function BackButton({ fallback = "/", className }: { fallback?: string; className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="Буцах"
      onClick={() => (window.history.length > 1 ? router.back() : router.push(fallback))}
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-2xl bg-card/80 text-ink shadow-sm ring-1 ring-line/60 active:scale-95 transition",
        className,
      )}
    >
      <ChevronLeft className="size-6" />
    </button>
  );
}

export function PageHeader({
  title,
  right,
  fallback,
}: {
  title: ReactNode;
  right?: ReactNode;
  fallback?: string;
}) {
  return (
    <header className="sticky top-0 z-30 bg-app/85 backdrop-blur-md px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3">
      <div className="flex items-center gap-3 min-h-11">
        <BackButton fallback={fallback} />
        <h1 className="flex-1 text-center text-[17px] font-bold text-ink leading-tight line-clamp-2">{title}</h1>
        <div className="flex size-11 shrink-0 items-center justify-center">{right}</div>
      </div>
    </header>
  );
}

export function HeaderIconButton({
  icon: Icon,
  label,
  onClick,
  href,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const cls =
    "grid size-11 place-items-center rounded-2xl bg-card/80 text-ink shadow-sm ring-1 ring-line/60 active:scale-95 transition";
  if (href)
    return (
      <Link href={href} aria-label={label} className={cls}>
        <Icon className="size-5" />
      </Link>
    );
  return (
    <button type="button" aria-label={label} onClick={onClick} className={cls}>
      <Icon className="size-5" />
    </button>
  );
}

export function Page({
  title,
  right,
  fallback,
  children,
  className,
}: {
  title: ReactNode;
  right?: ReactNode;
  fallback?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen">
      <PageHeader title={title} right={right} fallback={fallback} />
      <main className={cn("px-4 pb-12 pt-1", className)}>{children}</main>
    </div>
  );
}

/* -------------------------------- Buttons -------------------------------- */
type BtnVariant = "primary" | "soft" | "outline" | "danger" | "ghost" | "white";
const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-5 h-12 text-[15px] font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
const btnVariants: Record<BtnVariant, string> = {
  primary: "brand-gradient text-white shadow-[0_6px_16px_-6px_var(--brand-primary)]",
  soft: "bg-brand/10 text-brand",
  outline: "bg-card text-ink ring-1 ring-line",
  danger: "bg-red-500/10 text-red-600",
  ghost: "text-brand",
  white: "bg-white text-[#0B2265]",
};

export function Button({
  variant = "primary",
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  return <button type="button" className={cn(btnBase, btnVariants[variant], className)} {...rest} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  ...rest
}: ComponentProps<typeof Link> & { variant?: BtnVariant }) {
  return <Link className={cn(btnBase, btnVariants[variant], className)} {...rest} />;
}

/* --------------------------------- Tabs --------------------------------- */
export function PillTabs<T extends string>({
  tabs,
  value,
  onChange,
  variant = "pill",
  className,
}: {
  tabs: { value: T; label: string; badge?: number }[];
  value: T;
  onChange: (v: T) => void;
  variant?: "pill" | "segment";
  className?: string;
}) {
  if (variant === "segment") {
    return (
      <div role="tablist" className={cn("flex rounded-2xl bg-card p-1.5 shadow-sm", className)}>
        {tabs.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={value === t.value}
            onClick={() => onChange(t.value)}
            className={cn(
              "flex-1 rounded-xl py-3 text-[15px] font-semibold transition",
              value === t.value ? "bg-brand text-white shadow" : "text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div role="tablist" className={cn("flex gap-2 overflow-x-auto no-scrollbar", className)}>
      {tabs.map((t) => (
        <button
          key={t.value}
          role="tab"
          aria-selected={value === t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            "relative shrink-0 rounded-2xl px-5 py-3 text-[15px] font-semibold transition whitespace-nowrap",
            value === t.value ? "brand-gradient text-white shadow-md" : "bg-card text-ink shadow-sm",
          )}
        >
          {t.label}
          {!!t.badge && (
            <span className="ml-1.5 inline-grid min-w-5 h-5 place-items-center rounded-full bg-red-500 px-1 text-[11px] text-white">
              {t.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------- Menu rows ------------------------------- */
export function MenuRow({
  icon: Icon,
  image,
  art,
  iconClass = "bg-brand/10 text-brand",
  title,
  subtitle,
  href,
  onClick,
  trailing = "chevron",
  badge,
  className,
}: {
  icon?: LucideIcon;
  /** PNG tile (already includes its own pastel background). Takes precedence over `icon`. */
  image?: string;
  /** Custom SVG tile, for rows without a PNG. */
  art?: ReactNode;
  iconClass?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  href?: string;
  onClick?: () => void;
  trailing?: "chevron" | "external" | "none" | ReactNode;
  badge?: ReactNode;
  className?: string;
}) {
  const content = (
    <>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- user-provided PNG with an encoded path
        <img src={image} alt="" draggable={false} className="size-12 shrink-0 rounded-full object-cover" />
      ) : art ? (
        <span className="grid size-12 shrink-0 place-items-center">{art}</span>
      ) : (
        Icon && (
          <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl", iconClass)}>
            <Icon className="size-6" />
          </span>
        )
      )}
      <span className="flex-1 min-w-0 text-left">
        <span className="flex items-center gap-2 text-[16px] font-semibold text-ink leading-snug">
          {title}
          {badge}
        </span>
        {subtitle && <span className="mt-0.5 block text-[14px] text-muted leading-snug">{subtitle}</span>}
      </span>
      {trailing === "chevron" ? (
        <ChevronRight className="size-5 shrink-0 text-muted" />
      ) : trailing === "external" ? (
        <ArrowUpRight className="size-5 shrink-0 text-muted" />
      ) : trailing === "none" ? null : (
        trailing
      )}
    </>
  );
  const cls = cn("flex w-full items-center gap-4 px-4 py-3.5 active:bg-soft/70 transition", className);
  if (href)
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  return (
    <button type="button" onClick={onClick} className={cls}>
      {content}
    </button>
  );
}

export function MenuGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <Card className={cn("overflow-hidden py-1.5", className)}>{children}</Card>;
}

/* --------------------------------- Toggle --------------------------------- */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-8 w-[52px] shrink-0 rounded-full transition-colors",
        checked ? "bg-brand" : "bg-line",
      )}
    >
      <span
        className={cn(
          "absolute top-1 left-1 size-6 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

/* ------------------------------ Sheet / Modal ------------------------------ */
const SHEET_EXIT_MS = 280;

/**
 * Bottom sheet: slides up from the very bottom edge over a plain dark tint
 * (no blur), and slides back down when closed. `center` renders a modal card.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  center = false,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  center?: boolean;
  footer?: ReactNode;
}) {
  // Stay mounted while the exit animation plays.
  const [phase, setPhase] = useState<"closed" | "open" | "closing">(open ? "open" : "closed");
  if (open && phase !== "open") setPhase("open");
  if (!open && phase === "open") setPhase("closing");

  useEffect(() => {
    if (phase !== "closing") return;
    const id = setTimeout(() => setPhase("closed"), SHEET_EXIT_MS);
    return () => clearTimeout(id);
  }, [phase]);

  // Callers often render `{item && ...}`, which is empty once closed; keep the
  // last open content so the sheet doesn't slide away blank.
  const last = useRef({ title, children, footer });
  useLayoutEffect(() => {
    if (open) last.current = { title, children, footer };
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (phase === "closed") return null;
  const closing = phase === "closing";
  // eslint-disable-next-line react-hooks/refs -- snapshot is only read during the exit animation
  const view = open ? { title, children, footer } : last.current;

  return (
    <div className={cn("frame-fixed inset-y-0 z-[60] flex flex-col justify-end", closing && "pointer-events-none")} role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Хаах"
        onClick={onClose}
        className={cn("absolute inset-0 bg-[#050b1a]/40", closing ? "animate-fade-out" : "animate-fade")}
      />
      <div
        className={cn(
          "relative flex max-h-[88vh] flex-col bg-card text-ink",
          center ? "mx-4 mb-auto mt-auto rounded-3xl" : "rounded-t-[28px] shadow-[0_-8px_30px_-12px_rgba(5,11,26,0.35)]",
          center ? (closing ? "animate-fade-out" : "animate-pop") : closing ? "animate-sheet-out" : "animate-sheet",
        )}
      >
        {!center && <div className="mx-auto mt-2.5 h-1.5 w-11 rounded-full bg-line" />}
        <div className="flex items-start gap-3 px-5 pt-4 pb-2">
          <h2 className="flex-1 text-[18px] font-bold leading-snug">{view.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Хаах"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-soft text-muted"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-5">{view.children}</div>
        {view.footer && <div className="border-t border-line px-5 py-4 pb-[max(env(safe-area-inset-bottom),16px)]">{view.footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Тийм",
  danger,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Sheet open={open} onClose={onClose} title={title} center>
      {message && <p className="text-[15px] text-muted">{message}</p>}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={onClose}>
          Болих
        </Button>
        <Button
          variant={danger ? "danger" : "primary"}
          className={danger ? "!bg-red-600 !text-white" : undefined}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Sheet>
  );
}

/* ------------------------------- Empty state ------------------------------- */
export function EmptyBox({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 130" className={cn("w-40", className)} aria-hidden>
      <defs>
        <linearGradient id="eb1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#E8ECF6" />
          <stop offset="1" stopColor="#C9D0E2" />
        </linearGradient>
      </defs>
      <rect x="62" y="6" width="9" height="24" rx="4.5" transform="rotate(-30 66 18)" fill="var(--brand-primary)" />
      <rect x="76" y="0" width="9" height="26" rx="4.5" fill="var(--brand-primary)" />
      <rect x="90" y="6" width="9" height="24" rx="4.5" transform="rotate(30 94 18)" fill="var(--brand-primary)" />
      <path d="M30 58 80 42l50 16-50 16z" fill="#DCE1EE" />
      <path d="M30 58v44l50 20V74z" fill="url(#eb1)" />
      <path d="M130 58v44l-50 20V74z" fill="#D5DBEA" />
      <path d="M30 58 14 76l50 18 16-20zM130 58l16 18-50 18-16-20z" fill="#EEF1F8" />
    </svg>
  );
}

export function EmptyState({ title = "Хоосон байна", children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <EmptyBox />
      <p className="mt-4 text-[16px] text-ink/80">{title}</p>
      {children && <div className="mt-4 w-full">{children}</div>}
    </div>
  );
}

/* ---------------------------------- Forms ---------------------------------- */
export const inputCls =
  "w-full rounded-2xl bg-card px-4 h-[52px] text-[16px] text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-brand placeholder:text-muted/70 [&:read-only:not(select)]:bg-soft [&:read-only:not(select)]:text-muted";
export const textareaCls =
  "w-full rounded-2xl bg-card px-4 py-3 text-[16px] text-ink ring-1 ring-line outline-none focus:ring-2 focus:ring-brand placeholder:text-muted/70 min-h-28";

export function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[15px] font-bold text-ink">
        {required && <span className="mr-1 text-red-500">*</span>}
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[13px] text-muted">{hint}</span>}
    </label>
  );
}

/* --------------------------------- Badges --------------------------------- */
export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Зөвшөөрсөн: "bg-lime-500",
    Төлөгдсөн: "bg-emerald-500",
    Илгээсэн: "bg-cyan-500",
    "Хүлээн авсан": "bg-cyan-500",
    "Хянагдаж буй": "bg-amber-500",
    "Шийдвэрлэж буй": "bg-amber-500",
    "Хүлээгдэж буй": "bg-amber-500",
    Шийдвэрлэсэн: "bg-lime-500",
    Татгалзсан: "bg-red-500",
  };
  return (
    <span className={cn("rounded-lg px-2.5 py-1 text-[12px] font-bold text-white", map[status] ?? "bg-slate-400")}>
      {status}
    </span>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-6 flex items-center justify-between">
      <h2 className="text-[18px] font-bold text-ink">{children}</h2>
      {action}
    </div>
  );
}
