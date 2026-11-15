import { Emblem } from "./Logo";

/** Prerendered placeholder shown until the browser-only app shell mounts. */
export default function Splash() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[430px] flex-col items-center justify-center gap-4 bg-[#F3F7FC] shadow-2xl">
      <Emblem className="size-16 animate-pulse" />
      <p className="text-[15px] font-bold text-[#0B2265]">
        Civic <span className="text-[#0066FF]">MGL</span>
      </p>
      <p className="text-[12px] text-[#6B7689]">Ачаалж байна…</p>
    </div>
  );
}
