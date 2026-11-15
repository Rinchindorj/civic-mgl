import type { HolderCard } from "@/context/AppStateContext";

export interface DocMeta {
  id: string;
  /** Short name; the reference page title is `${name} лавлагаа`. */
  name: string;
  title: string;
  about: string;
}

/** Reference metadata for an admin-uploaded Personal Card Holder card. */
export function holderMeta(card: HolderCard): DocMeta {
  const name = card.title.trim();
  return {
    id: card.id,
    name: name || "Картын",
    title: name || "Карт",
    about: `${name ? `“${name}”` : "Таны"} картын лавлагаа.\nКартын бүртгэл, эзэмшигчийн мэдээлэл болон бүртгэгдсэн огноог агуулсан QR кодтой лавлагааг шууд үүсгэнэ.\nКартын зургийг Админ удирдлагын “Карт & Бичиг баримт” хэсгээс шинэчилнэ.`,
  };
}

/** Href of a card's dedicated reference page. */
export const referenceHref = (cardId: string) => `/profile/documents/${encodeURIComponent(cardId)}/reference`;
