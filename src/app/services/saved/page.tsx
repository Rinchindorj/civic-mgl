"use client";

import { useAppState } from "@/context/AppStateContext";
import { Page, EmptyState, ButtonLink } from "@/components/ui";
import { ServiceCard } from "@/components/ServiceCard";

export default function SavedServicesPage() {
  const { state, findService } = useAppState();
  const saved = state.savedServices.map(findService).filter((s) => s !== undefined);

  return (
    <Page title="Хадгалсан үйлчилгээ" fallback="/services">
      {saved.length === 0 ? (
        <EmptyState title="Хадгалсан үйлчилгээ алга байна">
          <p className="mb-4 text-[14px] text-muted">Үйлчилгээний карт дээрх хавчуурга дүрсийг дарж хадгална уу.</p>
          <ButtonLink href="/services" className="w-full">
            Үйлчилгээ харах
          </ButtonLink>
        </EmptyState>
      ) : (
        <div className="space-y-4">
          <p className="text-[14px] text-muted">Нийт {saved.length} үйлчилгээ</p>
          {saved.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      )}
    </Page>
  );
}
