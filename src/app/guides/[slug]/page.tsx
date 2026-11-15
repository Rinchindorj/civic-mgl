import { GUIDES } from "@/data/catalog";
import GuideDetail from "./GuideDetail";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  return <GuideDetail slug={slug} />;
}
