"use client";

import { FAQ } from "@/data/seed";
import { Page } from "@/components/ui";
import { Accordion } from "@/components/Accordion";

export default function FaqPage() {
  return (
    <Page title="Түгээмэл асуулт хариулт">
      <Accordion items={FAQ} />
    </Page>
  );
}
