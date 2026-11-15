import { CATEGORIES } from "@/data/catalog";
import CategoryDetail from "./CategoryDetail";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  return <CategoryDetail slug={slug} />;
}
