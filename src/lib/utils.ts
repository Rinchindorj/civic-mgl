export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const WEEKDAYS = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];
export const WEEKDAYS_SHORT = ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"];

export const pad = (n: number) => String(n).padStart(2, "0");

export function fmtTime(d: Date, seconds = true) {
  const base = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return seconds ? `${base}:${pad(d.getSeconds())}` : base;
}

export function fmtDate(d: Date, sep = "-") {
  return `${d.getFullYear()}${sep}${pad(d.getMonth() + 1)}${sep}${pad(d.getDate())}`;
}

export function fmtDateTime(d: Date) {
  return `${fmtDate(d)} ${fmtTime(d, false)}`;
}

/** ISO date key (local time) used for calendar events: YYYY-MM-DD */
export const dateKey = (d: Date) => fmtDate(d, "-");

export function ageFrom(birthdate: string, now = new Date()) {
  const b = new Date(birthdate);
  if (Number.isNaN(b.getTime())) return null;
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}

export function fmtMoney(n: number, digits = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Deterministic 32-bit hash for sample QR patterns and reference numbers. */
export function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function refNumber(prefix = "SMP") {
  const d = new Date();
  return `${prefix}-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(
    100000 + Math.random() * 899999,
  )}`;
}

export function aqiLabel(v: number) {
  if (v <= 50) return { label: "Цэвэр", color: "#16A34A" };
  if (v <= 100) return { label: "Дунд зэрэг", color: "#CA8A04" };
  if (v <= 150) return { label: "Мэдрэг бүлэгт муу", color: "#EA580C" };
  if (v <= 200) return { label: "Муу", color: "#DC2626" };
  if (v <= 300) return { label: "Маш муу", color: "#9333EA" };
  return { label: "Аюултай", color: "#7F1D1D" };
}

/** Resize an uploaded image to a small square JPEG data URL so it fits in localStorage. */
export function fileToAvatar(file: File, size = 320): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("image"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(String(reader.result));
        const s = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Resize an uploaded logo to fit within `max`×`max`, keeping its aspect ratio and
 * transparency (PNG data URL), so it stays small enough for localStorage.
 */
export function fileToLogo(file: File, max = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const src = String(reader.result);
      // SVGs are already tiny and scale cleanly; keep them as-is.
      if (file.type === "image/svg+xml") return resolve(src);
      const img = new Image();
      img.onerror = () => reject(new Error("image"));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(src);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Read an uploaded card photo: measures its natural size (for aspectRatio) and
 * returns a downscaled data URL (longest side ≤ `max`) so it fits in localStorage.
 * PNGs stay PNG to keep transparent corners; everything else becomes JPEG.
 */
export function fileToCardImage(file: File, max = 1000): Promise<{ url: string; aspectRatio: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const src = String(reader.result);
      const img = new Image();
      img.onerror = () => reject(new Error("image"));
      img.onload = () => {
        const { naturalWidth: width, naturalHeight: height } = img;
        if (!width || !height) return reject(new Error("empty image"));
        const scale = Math.min(1, max / Math.max(width, height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(width * scale));
        canvas.height = Math.max(1, Math.round(height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve({ url: src, aspectRatio: width / height, width, height });
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const url = file.type === "image/png" ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.85);
        resolve({ url, aspectRatio: width / height, width, height });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}
