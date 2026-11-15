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

export const DEFAULT_BRAND = { name: "Civic MGL", subtitle: "Цахим үйлчилгээний нэгдсэн систем", logoUrl: "" };

/** Wordmark + subtitle. The last word of the name takes the primary colour ("Civic **MGL**"). */
export function Logo({
  className,
  compact,
  name = DEFAULT_BRAND.name,
  subtitle = DEFAULT_BRAND.subtitle,
  logoUrl = DEFAULT_BRAND.logoUrl,
}: {
  className?: string;
  compact?: boolean;
  name?: string;
  subtitle?: string;
  logoUrl?: string;
}) {
  const words = name.trim().split(/\s+/);
  const last = words.length > 1 ? words.pop() : "";
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded data URL
        <img src={logoUrl} alt="" className="size-10 shrink-0 rounded-xl object-contain" />
      ) : (
        <Emblem className="shrink-0" />
      )}
      {!compact && (
        <span className="min-w-0 leading-none">
          <span className="block truncate text-[21px] font-extrabold tracking-tight text-navy">
            {words.join(" ")}
            {last && <span className="text-brand"> {last}</span>}
          </span>
          {subtitle && <span className="mt-1 block truncate text-[9.5px] font-semibold text-brand/90">{subtitle}</span>}
        </span>
      )}
    </span>
  );
}
