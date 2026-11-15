"use client";

import Link from "next/link";
import { BookOpenText, ChevronRight } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { findCategory, GUIDES } from "@/data/catalog";
import { Page, EmptyState, ButtonLink, SectionTitle, Card } from "@/components/ui";
import { ServiceCard } from "@/components/ServiceCard";

export default function CategoryDetail({ slug }: { slug: string }) {
  const { services } = useAppState();
  const cat = findCategory(slug);
  const list = services.filter((s) => s.category === slug);
  const guides = GUIDES.filter((g) => g.category === slug);

  return (
    <Page title={cat?.title ?? "Ангилал"} fallback="/categories">
      {guides.length > 0 && (
        <>
          <SectionTitle>Холбогдох хөтөч</SectionTitle>
          <Card className="divide-y divide-line">
            {guides.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="flex items-center gap-3 px-4 py-3.5">
                <BookOpenText className="size-5 text-brand" />
                <span className="flex-1 text-[15px] font-semibold text-ink">{g.title}</span>
                <ChevronRight className="size-5 text-muted" />
              </Link>
            ))}
          </Card>
        </>
      )}
      <SectionTitle>Үйлчилгээ ({list.length})</SectionTitle>
      {list.length === 0 ? (
        <EmptyState title="Энэ ангилалд үйлчилгээ алга байна">
          <ButtonLink href="/services" className="w-full">
            Бүх үйлчилгээ
          </ButtonLink>
        </EmptyState>
      ) : (
        <div className="space-y-4">
          {list.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      )}
    </Page>
  );
}
