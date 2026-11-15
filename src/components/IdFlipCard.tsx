"use client";

import { useId, useState, type ReactNode } from "react";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

/* =============================== Flip shell =============================== */

/**
 * Two-faced card that turns over around its vertical centre axis (rotateY).
 * Both faces share one grid cell, so the card takes the taller face's height.
 */
export function FlipCard({ front, back, label }: { front: ReactNode; back: ReactNode; label: string }) {
  const [flipped, setFlipped] = useState(false);
  const hintId = useId();
  const face = "[grid-area:1/1] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]";

  return (
    <div>
      <div className="[perspective:1000px]">
        <div
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-describedby={hintId}
          aria-label={`${label}: ${flipped ? "ар тал" : "нүүр тал"}. Дарж эргүүлэх`}
          onClick={() => setFlipped((f) => !f)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlipped((f) => !f);
            }
          }}
          className="grid cursor-pointer rounded-2xl outline-none [transform-origin:center_center] [transform-style:preserve-3d] transition-transform duration-700 ease-[cubic-bezier(.3,.7,.2,1)] focus-visible:ring-4 focus-visible:ring-brand/40 motion-reduce:transition-none"
          style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          <div className={face}>{front}</div>
          <div className={cn(face, "[transform:rotateY(180deg)]")}>{back}</div>
        </div>
      </div>
      <p id={hintId} className="mt-3 flex items-center justify-center gap-1.5 text-[13px] text-muted">
        <RotateCw className="size-3.5" /> Карт дээр дарж {flipped ? "нүүр" : "ар"} талыг харна
      </p>
    </div>
  );
}

/* ========================= Admin-uploaded photo cards ========================= */

/**
 * One face of a Personal Card Holder card. The box takes the uploaded photo's own
 * aspect ratio, and the image is contained (never cropped or stretched).
 */
export function PhotoCardFace({ src, aspectRatio, alt, hidden }: { src: string; aspectRatio: number; alt: string; hidden?: boolean }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-soft shadow-md" style={{ aspectRatio }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded data URL */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={cn("h-auto w-full object-contain transition-[filter]", hidden && "blur-lg")}
        style={{ aspectRatio }}
      />
    </div>
  );
}
