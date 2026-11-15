"use client";

import { useAppState } from "@/context/AppStateContext";
import { Logo } from "./Logo";

/** Header logo: the admin-uploaded image (themeConfig.brandLogoUrl), or the built-in one. */
export function BrandLogo({ className }: { className?: string }) {
  const t = useAppState().state.themeConfig;
  return <Logo className={className} logoUrl={t.brandLogoUrl} />;
}
