import { SERVICES } from "@/data/catalog";
import ServiceDetail from "./ServiceDetail";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  return <ServiceDetail slug={slug} />;
}
