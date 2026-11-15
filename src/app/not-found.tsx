import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-[64px] font-black text-brand">404</p>
      <p className="mt-2 text-[17px] font-semibold text-ink">Хуудас олдсонгүй</p>
      <p className="mt-1 text-[14px] text-muted">Таны хайсан хуудас байхгүй эсвэл зөөгдсөн байна.</p>
      <Link href="/" className="mt-6 rounded-2xl brand-gradient px-6 py-3 font-semibold text-white">
        Нүүр хуудас руу буцах
      </Link>
    </div>
  );
}
