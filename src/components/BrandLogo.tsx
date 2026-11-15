"use client";

import { useAppState } from "@/context/AppStateContext";
import { Logo } from "./Logo";

/** Logo wired to the admin-editable brand (themeConfig.brandName / brandSubtitle / brandLogoUrl). */
export function BrandLogo({ className, compact }: { className?: string; compact?: boolean }) {
  const t = useAppState().state.themeConfig;
  return <Logo className={className} compact={compact} name={t.brandName || "Civic MGL"} subtitle={t.brandSubtitle} logoUrl={t.brandLogoUrl} />;
}
