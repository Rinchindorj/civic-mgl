"use client";

import Link from "next/link";
import { useAppState, type SectionId } from "@/context/AppStateContext";
import { GuidesCarousel, HeroSearch, OpenStats, PromoBanners, UtilityWidgets } from "@/components/home/Sections";
import { EmptyState } from "@/components/ui";

const SECTIONS: Record<SectionId, () => React.ReactNode> = {
  heroSearch: HeroSearch,
  utilityWidgets: UtilityWidgets,
  guidesCarousel: GuidesCarousel,
  promoBanners: PromoBanners,
  openStats: OpenStats,
};

export default function HomePage() {
  const { state } = useAppState();
  const visible = [...state.layoutConfig.sections].sort((a, b) => a.order - b.order).filter((s) => s.enabled);

  return (
    <div>
      {visible.map(({ id }) => {
        const Section = SECTIONS[id];
        return <Section key={id} />;
      })}
      {visible.length === 0 && (
        <EmptyState title="Нүүр хуудасны бүх хэсэг нуугдсан байна">
          <Link href="/admin" className="font-bold text-brand">
            Админ удирдлагаас идэвхжүүлэх →
          </Link>
        </EmptyState>
      )}
    </div>
  );
}
