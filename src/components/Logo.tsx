import { cn } from "@/lib/utils";

/** Original Civic MGL emblem: a rounded tile with an open ring and a diamond node. */
export function Emblem({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("size-10", className)} aria-hidden>
      <rect x="2" y="2" width="44" height="44" rx="13" fill="var(--brand-secondary, #0B2265)" />
      <path
        d="M33.5 16.5A12 12 0 1 0 33.5 31.5"
        fill="none"
        stroke="var(--brand-primary, #0066FF)"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path d="M24 18.5 29.5 24 24 29.5 18.5 24z" fill="#fff" />
      <circle cx="35" cy="24" r="2.6" fill="#fff" />
    </svg>
  );
}

/**
 * Header brand. With an uploaded `logoUrl` it is that image alone, at its own
 * proportions and with no text. Otherwise the built-in Civic MGL emblem + wordmark.
 */
export function Logo({ className, logoUrl = "" }: { className?: string; logoUrl?: string }) {
  if (logoUrl)
    return (
      <span className={cn("flex min-w-0 items-center", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded data URL */}
        <img src={logoUrl} alt="Лого" className="h-11 w-auto max-w-[220px] object-contain object-left" draggable={false} />
      </span>
    );
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <Emblem className="shrink-0" />
      <span className="min-w-0 leading-none">
        <span className="block truncate text-[21px] font-extrabold tracking-tight text-navy">
          Civic <span className="text-brand">MGL</span>
        </span>
        <span className="mt-1 block truncate text-[9.5px] font-semibold text-brand/90">Цахим үйлчилгээний нэгдсэн систем</span>
      </span>
    </span>
  );
}
