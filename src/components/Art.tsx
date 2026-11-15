"use client";

/**
 * Glossy, multi-colour 3D-style illustrations for UI slots that have no
 * user-provided PNG in public/icons/. Styled after those PNGs: soft top-left
 * highlights, saturated gradients, and a subtle drop shadow.
 * Gradient ids go through useId so several copies can share a page.
 */
import { useId } from "react";
import { cn } from "@/lib/utils";

type P = { className?: string };

function useIds<const K extends readonly string[]>(...keys: K) {
  const base = useId().replace(/:/g, "");
  return Object.fromEntries(keys.map((k) => [k, `${base}-${k}`])) as Record<K[number], string>;
}
const url = (id: string) => `url(#${id})`;

function Shadow({ id }: { id: string }) {
  return (
    <filter id={id} x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0B2265" floodOpacity="0.22" />
    </filter>
  );
}

/* ------------------------------ Bottom nav ------------------------------ */

/** Нүүр: a yurt (ger) — filled when active, outlined otherwise. */
export function NavHome({ active, className }: P & { active?: boolean }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      {active ? (
        <>
          <path d="M14 3.2c-1 0-1.9.4-2.6 1L4.6 10.6A4 4 0 0 0 3.4 13.5V22a3 3 0 0 0 3 3h15.2a3 3 0 0 0 3-3v-8.5a4 4 0 0 0-1.2-2.9l-6.8-6.4c-.7-.6-1.6-1-2.6-1Z" fill="currentColor" />
          <rect x="12.3" y="17.2" width="3.4" height="5.6" rx="1.7" fill="#fff" />
        </>
      ) : (
        <>
          <path d="M14 3.9c-.8 0-1.6.3-2.2.9L5.2 11a3.4 3.4 0 0 0-1 2.5V22a2.4 2.4 0 0 0 2.4 2.4h14.8a2.4 2.4 0 0 0 2.4-2.4v-8.5c0-1-.4-1.9-1-2.5l-6.6-6.2c-.6-.6-1.4-.9-2.2-.9Z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
          <path d="M14 18v4.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/** Үйлчилгээ: a document with a folded corner and two lines. */
export function NavServices({ active, className }: P & { active?: boolean }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      <path
        d="M8 3.5h8.2c.6 0 1.2.2 1.6.7l5 5c.5.4.7 1 .7 1.6V22a2.5 2.5 0 0 1-2.5 2.5H8A2.5 2.5 0 0 1 5.5 22V6A2.5 2.5 0 0 1 8 3.5Z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M16.5 3.8v4.4c0 1 .8 1.8 1.8 1.8h4.4" fill="none" stroke={active ? "#fff" : "currentColor"} strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M10 16h8M10 20h5.5" stroke={active ? "#fff" : "currentColor"} strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

/** Нэмэлт: a stacked tray. */
export function NavExtras({ active, className }: P & { active?: boolean }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      <path d="M9 4.2h10M7.2 7.6h13.6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path
        d="M5 12.6c0-1 .8-1.8 1.8-1.8h14.4c1 0 1.8.8 1.8 1.8l-1.3 9.2a3 3 0 0 1-3 2.6H9.3a3 3 0 0 1-3-2.6L5 12.6Z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      {!active && <path d="M5.4 15h17.2" stroke="currentColor" strokeWidth="1.9" />}
    </svg>
  );
}

/** Профайл: a person inside a ring. */
export function NavProfile({ active, className }: P & { active?: boolean }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      <circle cx="14" cy="14" r="11" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" />
      <circle cx="14" cy="11.3" r="3.6" fill={active ? "#fff" : "none"} stroke={active ? "#fff" : "currentColor"} strokeWidth="1.9" />
      <path d="M7.6 21.6c1.4-2.6 3.7-3.9 6.4-3.9s5 1.3 6.4 3.9" fill="none" stroke={active ? "#fff" : "currentColor"} strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------- Banners -------------------------------- */

/** 20,000+ ажлын байр: 3D briefcase with a glass paper airplane. */
export function JobsBannerArt({ className }: P) {
  const g = useIds("body", "top", "handle", "plane", "planeDark", "shadow", "shine");
  return (
    <svg viewBox="0 0 220 160" className={className} aria-hidden>
      <defs>
        <linearGradient id={g.body} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8E93B8" />
          <stop offset=".45" stopColor="#4C5276" />
          <stop offset="1" stopColor="#262B45" />
        </linearGradient>
        <linearGradient id={g.top} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B9BEDD" />
          <stop offset="1" stopColor="#5E648A" />
        </linearGradient>
        <linearGradient id={g.handle} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E9ECFF" />
          <stop offset=".5" stopColor="#A7AEDB" />
          <stop offset="1" stopColor="#F3F0FF" />
        </linearGradient>
        <linearGradient id={g.plane} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".95" />
          <stop offset="1" stopColor="#B8C6E8" stopOpacity=".75" />
        </linearGradient>
        <linearGradient id={g.planeDark} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9FB0DA" stopOpacity=".9" />
          <stop offset="1" stopColor="#5A6A9A" stopOpacity=".8" />
        </linearGradient>
        <linearGradient id={g.shine} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <Shadow id={g.shadow} />
      </defs>
      <g filter={url(g.shadow)}>
        {/* handle */}
        <path d="M58 46V34a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8v12" fill="none" stroke={url(g.handle)} strokeWidth="8" strokeLinecap="round" />
        {/* body */}
        <rect x="18" y="44" width="128" height="94" rx="16" fill={url(g.body)} />
        <rect x="18" y="44" width="128" height="34" rx="16" fill={url(g.top)} />
        <rect x="24" y="48" width="116" height="6" rx="3" fill={url(g.shine)} />
        {/* straps */}
        <rect x="46" y="60" width="12" height="54" rx="5" fill={url(g.handle)} />
        <rect x="106" y="60" width="12" height="54" rx="5" fill={url(g.handle)} />
        <rect x="44" y="96" width="16" height="12" rx="3" fill="#2C3150" stroke="#C9CEF0" strokeWidth="2" />
        <rect x="104" y="96" width="16" height="12" rx="3" fill="#2C3150" stroke="#C9CEF0" strokeWidth="2" />
      </g>
      {/* paper airplane */}
      <g transform="translate(150 30) rotate(-8)">
        <path d="M0 26 62 0 40 58 28 38Z" fill={url(g.plane)} stroke="#fff" strokeOpacity=".8" />
        <path d="M28 38 62 0 22 44Z" fill={url(g.planeDark)} />
        <path d="M22 44 28 38 30 54Z" fill="#7F90C2" opacity=".8" />
      </g>
      <path d="M150 104c14 8 30 6 44-6" fill="none" stroke="#C9D4FF" strokeOpacity=".5" strokeWidth="2" strokeDasharray="3 5" />
    </svg>
  );
}

/** Хүүхэд guide card art: interlocking 3D puzzle pieces (screen_01, third card). */
export function KidsPuzzleArt({ className }: P) {
  const g = useIds("red", "yellow", "blue", "shadow");
  const piece = "M0 0h14a7 7 0 1 1 14 0h14v14a7 7 0 1 0 0 14v14H28a7 7 0 1 1-14 0H0V28a7 7 0 1 0 0-14Z";
  return (
    <svg viewBox="0 0 120 110" className={className} aria-hidden>
      <defs>
        <linearGradient id={g.red} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF8A8A" />
          <stop offset="1" stopColor="#E5243B" />
        </linearGradient>
        <linearGradient id={g.yellow} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE58A" />
          <stop offset="1" stopColor="#F5B400" />
        </linearGradient>
        <linearGradient id={g.blue} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8FD3FF" />
          <stop offset="1" stopColor="#2B7BF2" />
        </linearGradient>
        <Shadow id={g.shadow} />
      </defs>
      <g filter={url(g.shadow)}>
        <path d={piece} transform="translate(62 8) rotate(12 21 21)" fill={url(g.red)} />
        <path d={piece} transform="translate(16 52) rotate(-6 21 21)" fill={url(g.yellow)} />
        <path d={piece} transform="translate(68 58) rotate(20 21 21) scale(.8)" fill={url(g.blue)} />
      </g>
      <ellipse cx="80" cy="22" rx="8" ry="4" fill="#fff" opacity=".45" transform="rotate(-20 80 22)" />
      <ellipse cx="32" cy="62" rx="8" ry="4" fill="#fff" opacity=".5" transform="rotate(-20 32 62)" />
    </svg>
  );
}

/* ----------------------------- Stat icons ------------------------------- */

/** Ажилгүйдлийн түвшин: briefcase + magnifier in hand. */
export function StatJobSearch({ className }: P) {
  const g = useIds("case", "lid", "glass", "rim", "sleeve", "shadow");
  return (
    <svg viewBox="0 0 100 80" className={className} aria-hidden>
      <defs>
        <linearGradient id={g.case} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B86A45" />
          <stop offset="1" stopColor="#7A3B22" />
        </linearGradient>
        <linearGradient id={g.lid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D58A60" />
          <stop offset="1" stopColor="#A35733" />
        </linearGradient>
        <radialGradient id={g.glass} cx=".35" cy=".35" r=".7">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".95" />
          <stop offset="1" stopColor="#C9C3FF" stopOpacity=".6" />
        </radialGradient>
        <linearGradient id={g.rim} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#B7A6FF" />
          <stop offset="1" stopColor="#6A4FE0" />
        </linearGradient>
        <linearGradient id={g.sleeve} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8E7BFF" />
          <stop offset="1" stopColor="#5B3FD6" />
        </linearGradient>
        <Shadow id={g.shadow} />
      </defs>
      <g filter={url(g.shadow)}>
        <path d="M18 30v-5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v5" fill="none" stroke="#5A2C18" strokeWidth="3.5" />
        <rect x="6" y="29" width="42" height="34" rx="6" fill={url(g.case)} />
        <rect x="6" y="29" width="42" height="13" rx="6" fill={url(g.lid)} />
        <rect x="14" y="45" width="6" height="5" rx="1.5" fill="#fff" />
        <rect x="34" y="45" width="6" height="5" rx="1.5" fill="#fff" />
        {/* hand + sleeve */}
        <path d="M60 56c4-3 9-3 13 0l10 7v12H68c-5 0-9-3-10-8l-1-5Z" fill="#F5C9A6" />
        <rect x="80" y="58" width="16" height="20" rx="4" fill={url(g.sleeve)} />
        {/* magnifier */}
        <path d="M62 47 70 58" stroke="#4A35B8" strokeWidth="7" strokeLinecap="round" />
        <circle cx="54" cy="30" r="17" fill={url(g.glass)} stroke={url(g.rim)} strokeWidth="6" />
        <path d="M45 24a11 11 0 0 1 9-6" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

/** Ажиллах хүчний оролцоо: handshake + green check. */
export function StatHandshake({ className }: P) {
  const g = useIds("cuffL", "cuffR", "skin", "check", "shadow");
  return (
    <svg viewBox="0 0 100 80" className={className} aria-hidden>
      <defs>
        <linearGradient id={g.cuffL} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7CB8FF" />
          <stop offset="1" stopColor="#1F66E0" />
        </linearGradient>
        <linearGradient id={g.cuffR} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7CB8FF" />
          <stop offset="1" stopColor="#1F66E0" />
        </linearGradient>
        <linearGradient id={g.skin} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD6B0" />
          <stop offset="1" stopColor="#E9A06C" />
        </linearGradient>
        <radialGradient id={g.check} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#7FF0A0" />
          <stop offset="1" stopColor="#13A84B" />
        </radialGradient>
        <Shadow id={g.shadow} />
      </defs>
      <g filter={url(g.shadow)}>
        <rect x="2" y="30" width="26" height="18" rx="5" transform="rotate(-30 15 39)" fill={url(g.cuffL)} />
        <rect x="72" y="30" width="26" height="18" rx="5" transform="rotate(30 85 39)" fill={url(g.cuffR)} />
        <path d="M24 42c6-6 14-8 22-6l10 3c6 2 12 1 18-2l6 8c-4 6-10 12-18 16l-10 6c-4 2-8 1-10-2l-10-8c-4-3-6-8-8-15Z" fill={url(g.skin)} />
        <path d="M44 50c4 2 8 6 10 10M50 46c4 2 8 6 10 10M56 43c3 2 6 5 8 8" stroke="#C97A47" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="52" cy="16" r="11" fill={url(g.check)} />
        <path d="m46.5 16 4 4 7-8" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="48" cy="11" rx="4" ry="2" fill="#fff" opacity=".5" />
      </g>
    </svg>
  );
}

/** Малын тоо: 3D camel, sheep and cow grouped on grass. */
export function StatLivestock({ className }: P) {
  const g = useIds("camel", "cow", "wool", "grass", "shadow");
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <linearGradient id={g.camel} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9A06E" />
          <stop offset="1" stopColor="#9C5E33" />
        </linearGradient>
        <radialGradient id={g.cow} cx=".4" cy=".3" r=".8">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D9DDE6" />
        </radialGradient>
        <radialGradient id={g.wool} cx=".4" cy=".3" r=".8">
          <stop offset="0" stopColor="#FFFDF5" />
          <stop offset="1" stopColor="#E3D9C4" />
        </radialGradient>
        <linearGradient id={g.grass} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7DD85E" />
          <stop offset="1" stopColor="#2E8B32" />
        </linearGradient>
        <Shadow id={g.shadow} />
      </defs>
      <g filter={url(g.shadow)}>
        {/* camel (back, centre) */}
        <path d="M40 30c0-9 6-16 14-16s13 7 13 16v34H40Z" fill={url(g.camel)} />
        <ellipse cx="53" cy="12" rx="5" ry="3" fill="#7A4524" />
        <circle cx="48" cy="28" r="2.6" fill="#2A1A10" />
        <circle cx="60" cy="28" r="2.6" fill="#2A1A10" />
        <ellipse cx="54" cy="40" rx="8" ry="5.5" fill="#F0C79E" />
        <circle cx="51" cy="40" r="1.2" fill="#5A3018" />
        <circle cx="57" cy="40" r="1.2" fill="#5A3018" />
        {/* sheep (front left) */}
        <circle cx="26" cy="66" r="15" fill={url(g.wool)} />
        <circle cx="17" cy="58" r="6" fill={url(g.wool)} />
        <circle cx="35" cy="57" r="6" fill={url(g.wool)} />
        <ellipse cx="26" cy="70" rx="8" ry="9" fill="#8C5A3C" />
        <circle cx="23" cy="68" r="1.6" fill="#1D1D1D" />
        <circle cx="29" cy="68" r="1.6" fill="#1D1D1D" />
        <ellipse cx="26" cy="74" rx="3.5" ry="2.2" fill="#E9B6A0" />
        {/* cow (front right) */}
        <path d="M60 50c-3-4-9-3-9-3s2 6 7 6M86 50c3-4 9-3 9-3s-2 6-7 6" fill="#F3F3F3" stroke="#C7CCD6" />
        <rect x="58" y="46" width="30" height="34" rx="14" fill={url(g.cow)} />
        <path d="M60 52c4-2 8 0 8 5s-5 6-8 4Z" fill="#222" />
        <circle cx="66" cy="60" r="1.8" fill="#111" />
        <circle cx="80" cy="60" r="1.8" fill="#111" />
        <ellipse cx="73" cy="72" rx="11" ry="7" fill="#F7A6B8" />
        <circle cx="69" cy="72" r="1.6" fill="#B0546A" />
        <circle cx="77" cy="72" r="1.6" fill="#B0546A" />
      </g>
      <path d="M4 96c4-10 6-12 8-4 2-8 5-9 7 0 2-9 5-10 7 0 3-8 6-9 8 0h56c2-8 5-9 7 0 1-6 3-7 5-2v10H4Z" fill={url(g.grass)} />
    </svg>
  );
}

/** Дундаж цалин: orange briefcase + stacked gold coins + ledger. */
export function StatSalary({ className }: P) {
  const g = useIds("case", "coin", "edge", "paper", "shadow");
  return (
    <svg viewBox="0 0 100 80" className={className} aria-hidden>
      <defs>
        <linearGradient id={g.case} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF9C6B" />
          <stop offset="1" stopColor="#D9481C" />
        </linearGradient>
        <radialGradient id={g.coin} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#FFF0A8" />
          <stop offset="1" stopColor="#E9A400" />
        </radialGradient>
        <linearGradient id={g.edge} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2B500" />
          <stop offset="1" stopColor="#B27800" />
        </linearGradient>
        <linearGradient id={g.paper} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#DCE6F5" />
        </linearGradient>
        <Shadow id={g.shadow} />
      </defs>
      <g filter={url(g.shadow)}>
        <rect x="62" y="6" width="30" height="62" rx="4" fill={url(g.paper)} />
        {[16, 24, 32, 40, 48, 56].map((y) => (
          <rect key={y} x="74" y={y} width="14" height="4" rx="2" fill="#2E6BE6" />
        ))}
        <path d="M36 26v-5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v5" fill="none" stroke="#9B3412" strokeWidth="3.5" />
        <rect x="24" y="25" width="46" height="40" rx="7" fill={url(g.case)} />
        <path d="M24 38h46" stroke="#B53A12" strokeWidth="2" />
        <rect x="42" y="34" width="10" height="8" rx="2" fill="#FFD9A0" />
        <rect x="27" y="27" width="40" height="4" rx="2" fill="#fff" opacity=".35" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <ellipse cx="18" cy={70 - i * 6} rx="14" ry="5" fill={url(g.edge)} />
            <ellipse cx="18" cy={67 - i * 6} rx="14" ry="5" fill={url(g.coin)} />
          </g>
        ))}
        <circle cx="30" cy="44" r="12" fill={url(g.coin)} stroke="#D89A00" strokeWidth="2" />
        <text x="30" y="48.5" textAnchor="middle" fontSize="12" fontWeight="900" fill="#B27800">₮</text>
      </g>
    </svg>
  );
}

/** Өрхийн дундаж орлого: glossy blue banknote bundle. */
export function StatIncome({ className }: P) {
  const g = useIds("note", "note2", "band", "shadow");
  return (
    <svg viewBox="0 0 100 80" className={className} aria-hidden>
      <defs>
        <linearGradient id={g.note} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9AE0FF" />
          <stop offset="1" stopColor="#1C8CEB" />
        </linearGradient>
        <linearGradient id={g.note2} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#66C3FF" />
          <stop offset="1" stopColor="#1366C9" />
        </linearGradient>
        <linearGradient id={g.band} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D3DBEA" />
        </linearGradient>
        <Shadow id={g.shadow} />
      </defs>
      <g filter={url(g.shadow)} transform="rotate(-18 50 40)">
        <rect x="14" y="30" width="70" height="34" rx="5" fill={url(g.note2)} />
        <rect x="12" y="22" width="70" height="34" rx="5" fill={url(g.note)} />
        <rect x="18" y="27" width="58" height="24" rx="3" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="1.5" />
        <circle cx="30" cy="39" r="6" fill="#fff" opacity=".45" />
        <rect x="52" y="18" width="12" height="44" rx="2" fill={url(g.band)} />
        <rect x="14" y="24" width="66" height="4" rx="2" fill="#fff" opacity=".4" />
      </g>
    </svg>
  );
}

/** Small Mongolian flag shown beside the population figure. */
export function MnFlag({ className }: P) {
  return (
    <svg viewBox="0 0 30 18" className={cn("rounded-[3px] shadow-sm", className)} aria-label="Монгол Улсын туг" role="img">
      <rect width="10" height="18" fill="#C4272F" />
      <rect x="10" width="10" height="18" fill="#015197" />
      <rect x="20" width="10" height="18" fill="#C4272F" />
      <g fill="#F9CF02">
        <circle cx="5" cy="3.2" r="1" />
        <circle cx="5" cy="5.6" r="1.4" />
        <path d="M3.4 7.6h3.2v.8H3.4zM3.4 13.4h3.2v.8H3.4zM2.4 8.8h.8v4.2h-.8zM6.8 8.8h.8v4.2h-.8z" />
        <circle cx="5" cy="10.9" r="1.3" />
      </g>
    </svg>
  );
}

/** Faint aimag-boundary map of Mongolia for the population card background. */
export function MongoliaMap({ className }: P) {
  return (
    <svg viewBox="0 0 400 190" className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <path
        d="M10 70 34 46l40-6 22-22 38 4 26-14 36 12 30-8 26 18 44 2 30 14 30-4 28 22-6 26 20 18-22 14-30-2-26 18-36 4-24 22-40-4-34 16-40-10-30 8-26-20-34-4-20-22-22-6-8-26Z"
        fill="currentColor"
        fillOpacity=".08"
        stroke="currentColor"
        strokeOpacity=".35"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <g fill="none" stroke="currentColor" strokeOpacity=".28" strokeWidth="1.1" strokeLinejoin="round">
        <path d="M74 40 82 96 60 150" />
        <path d="M134 22 128 70 150 120 140 172" />
        <path d="M196 18 206 64 190 110 214 158" />
        <path d="M252 26 246 78 268 120 260 160" />
        <path d="M310 30 318 82 300 130" />
        <path d="M30 90h80l40 18 60-12 60 14 70-10 46 6" />
        <path d="M60 130l60-6 40 16 50-10 56 8 52-14" />
        <path d="M206 64h50M150 70h50M300 82h56" />
        <path d="M222 92l10 10-6 10-12-4z" />
      </g>
    </svg>
  );
}

/* ------------------------------ Menu tiles ------------------------------ */

/** Эрсдэл мэдэгдэх tile glyph: amber warning triangle (screen_13 last card). */
export function RiskTileArt({ className }: P) {
  const g = useIds("tri");
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id={g.tri} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC94D" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path d="M17.4 6.5a3 3 0 0 1 5.2 0l13 22.6a3 3 0 0 1-2.6 4.5H7a3 3 0 0 1-2.6-4.5Z" fill={url(g.tri)} />
      <rect x="18.3" y="13" width="3.4" height="11" rx="1.7" fill="#fff" />
      <circle cx="20" cy="28.3" r="2" fill="#fff" />
    </svg>
  );
}

/** Админ хэсэг tile, drawn to sit beside the profile PNG tiles: glossy blue gear. */
export function AdminTileArt({ className }: P) {
  const g = useIds("bg", "gear");
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id={g.gear} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6FB6FF" />
          <stop offset="1" stopColor="#1F5FE0" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="24" fill="#E3F0FF" />
      <path
        d="M21.6 10h4.8l.8 3.6 2.6 1.1 3.1-2 3.4 3.4-2 3.1 1.1 2.6 3.6.8v4.8l-3.6.8-1.1 2.6 2 3.1-3.4 3.4-3.1-2-2.6 1.1-.8 3.6h-4.8l-.8-3.6-2.6-1.1-3.1 2-3.4-3.4 2-3.1-1.1-2.6-3.6-.8v-4.8l3.6-.8 1.1-2.6-2-3.1 3.4-3.4 3.1 2 2.6-1.1Z"
        fill={url(g.gear)}
      />
      <circle cx="24" cy="24" r="5" fill="#fff" />
      <path d="M17 15.5a11 11 0 0 1 8-3" stroke="#fff" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
