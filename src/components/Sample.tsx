"use client";

import { useMemo } from "react";
import { cn, hash } from "@/lib/utils";
import { initials, type SampleUser } from "@/context/AppStateContext";

/** Diagonal repeating "SAMPLE / ЗАГВАР" watermark. Parent must be `relative overflow-hidden`. */
export function SampleWatermark({ className, dense = false }: { className?: string; dense?: boolean }) {
  const rows = dense ? 7 : 4;
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 z-10 select-none overflow-hidden", className)}>
      <div className="absolute -inset-1/2 flex -rotate-[24deg] flex-col items-center justify-center gap-6">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="whitespace-nowrap text-[22px] font-black tracking-[0.2em] text-red-600/20">
            SAMPLE / ЗАГВАР &nbsp; SAMPLE / ЗАГВАР &nbsp; SAMPLE / ЗАГВАР
          </div>
        ))}
      </div>
    </div>
  );
}

export function SampleBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-red-600 px-1.5 py-0.5 text-[10px] font-black tracking-wider text-white",
        className,
      )}
    >
      SAMPLE / ЗАГВАР
    </span>
  );
}

export function Avatar({ user, className }: { user: SampleUser; className?: string }) {
  if (user.avatar) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={user.avatar} alt="Профайл зураг" className={cn("size-14 rounded-full object-cover", className)} />;
  }
  return (
    <span
      className={cn(
        "grid size-14 place-items-center rounded-full brand-gradient text-[18px] font-extrabold text-white",
        className,
      )}
    >
      {initials(user)}
    </span>
  );
}

/**
 * Decorative, deterministic QR-style pattern for SAMPLE codes.
 * It intentionally does not encode real data.
 */
export function SampleQr({ seed, className, fg = "#0B2265" }: { seed: string; className?: string; fg?: string }) {
  const n = 25;
  const cells = useMemo(() => {
    let h = hash(seed) || 1;
    const rand = () => {
      h ^= h << 13;
      h ^= h >>> 17;
      h ^= h << 5;
      return ((h >>> 0) % 1000) / 1000;
    };
    const out: [number, number][] = [];
    const inFinder = (x: number, y: number) =>
      (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) if (!inFinder(x, y) && rand() > 0.52) out.push([x, y]);
    return out;
  }, [seed]);

  const finder = (x: number, y: number) => (
    <g key={`f${x}${y}`}>
      <rect x={x} y={y} width={7} height={7} fill={fg} />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill={fg} />
    </g>
  );

  return (
    <svg viewBox={`-2 -2 ${n + 4} ${n + 4}`} className={cn("bg-white", className)} shapeRendering="crispEdges" role="img" aria-label="Загвар QR код">
      <rect x={-2} y={-2} width={n + 4} height={n + 4} fill="#fff" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fg} />
      ))}
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
    </svg>
  );
}
