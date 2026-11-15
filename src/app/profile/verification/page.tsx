"use client";

import { ButtonLink, EmptyState, Page } from "@/components/ui";

export default function VerificationPage() {
  return (
    <Page title="Баталгаажуулалт" fallback="/profile">
      <EmptyState>
        <p className="mb-5 text-[14px] text-muted">
          Гуравдагч байгууллага таны мэдээллийг баталгаажуулах хүсэлт ирүүлбэл энд харагдана. Нэвтэрсэн төхөөрөмжөө доорх хэсгээс шалгана уу.
        </p>
        <ButtonLink href="/profile/info/devices" variant="soft" className="w-full">
          Хандсан төхөөрөмжүүд
        </ButtonLink>
      </EmptyState>
    </Page>
  );
}
