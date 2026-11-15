import CardReference from "./CardReference";

// Card ids belong to each account's own state, so this page resolves at runtime.
export default async function CardReferencePage({ params }: PageProps<"/profile/documents/[cardId]/reference">) {
  const { cardId } = await params;
  return <CardReference cardId={decodeURIComponent(cardId)} />;
}
