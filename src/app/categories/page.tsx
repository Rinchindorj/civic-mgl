"use client";

import { Page } from "@/components/ui";
import { CategoryGrid } from "@/components/CategoryGrid";

export default function CategoriesPage() {
  return (
    <Page title="Ангилал" fallback="/services">
      <CategoryGrid />
    </Page>
  );
}
