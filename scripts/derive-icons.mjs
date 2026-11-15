// Derives clean icon assets from the user-provided screenshot crops in public/icons/.
// Run: node scripts/derive-icons.mjs   → writes public/icons/derived/*.png
//
// The Нэмэлт crops are whole cards (tile + label text). We extract only the glyph
// so the card label can stay live text, and report the tile colour behind it.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "public/icons");
const OUT = path.join(SRC, "derived");
mkdirSync(OUT, { recursive: true });

async function raw(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = (x, y) => {
    const i = (y * info.width + x) * 3;
    return [data[i], data[i + 1], data[i + 2]];
  };
  return { info, px };
}

const isInk = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b < 190 || Math.max(r, g, b) - Math.min(r, g, b) > 70;

/** Bounding box of "ink" pixels inside a region. */
async function inkBox(file, region) {
  const { info, px } = await raw(file);
  const x1 = Math.min(region.x1, info.width), y1 = Math.min(region.y1, info.height);
  let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1;
  for (let y = region.y0; y < y1; y++)
    for (let x = region.x0; x < x1; x++)
      if (isInk(px(x, y))) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
  return { minX, minY, maxX, maxY, px, info };
}

const hex = (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

// ---- Нэмэлт glyphs -------------------------------------------------------
const EXTRAS = {
  "screen_13 copy 2.png": "student",
  "screen_13 copy 3.png": "civil-servant",
  "screen_13 copy 4.png": "jobs",
  "screen_13 copy 5.png": "transit-tickets",
  "screen_13 copy 6.png": "1111-complaint",
  "screen_13 copy 7.png": "iaac-report",
  "screen_13 copy 8.png": "lawyer-consult",
};
for (const [file, slug] of Object.entries(EXTRAS)) {
  const f = path.join(SRC, "optoins in nemelt", file);
  // This crop sits higher, so its label starts sooner: keep to the tile.
  const region = slug === "civil-servant" ? { x0: 45, y0: 10, x1: 150, y1: 110 } : { x0: 0, y0: 0, x1: 240, y1: 195 };
  const b = await inkBox(f, region);
  const pad = 6;
  const left = Math.max(0, b.minX - pad), top = Math.max(0, b.minY - pad);
  const width = Math.min(b.info.width - left, b.maxX - b.minX + 1 + pad * 2);
  const height = Math.min(b.info.height - top, b.maxY - b.minY + 1 + pad * 2);
  const tile = b.px(Math.max(0, b.minX - 14), Math.round((b.minY + b.maxY) / 2));
  await sharp(f).extract({ left, top, width, height }).png().toFile(path.join(OUT, `extras-${slug}.png`));
  console.log(`extras-${slug}.png  ${width}x${height}  tile=${hex(tile)}`);
}

// ---- QR FAB: crop the blue disc and mask it to a circle -------------------
{
  const f = path.join(SRC, "qr scanner icon.png");
  const { info, px } = await raw(f);
  // Center on the white QR glyph (a stray blue speck in the corner and the
  // glow make the disc's bounding box unreliable).
  let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1;
  for (let y = 70; y < 215; y++)
    for (let x = 75; x < 235; x++) {
      const [r, g, b] = px(x, y);
      if (r > 225 && g > 225 && b > 225) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
    }
  const cx = Math.round((minX + maxX) / 2), cy = Math.round((minY + maxY) / 2);
  // Disc radius: walk outward from the center along its row until the blue ends.
  const isBlue = ([r, g, b]) => b > 200 && r < 120 && g < 170;
  let radius = 0;
  while (cx + radius + 1 < info.width && isBlue(px(cx + radius + 1, cy))) radius++;
  // Keep the inner 92% so none of the outer glow shows.
  const size = Math.round(radius * 2 * 0.92);
  const left = cx - Math.floor(size / 2), top = cy - Math.floor(size / 2);
  const mask = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`);
  await sharp(f)
    .extract({ left, top, width: size, height: size })
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toFile(path.join(OUT, "qr-fab.png"));
  console.log(`qr-fab.png  ${size}x${size}`);
}

// ---- Risk banner: crop the 3D bell + sound waves --------------------------
{
  const f = path.join(SRC, "options in nuur ", "screen_03 copy 4.png");
  await sharp(f).extract({ left: 640, top: 70, width: 560, height: 470 }).png().toFile(path.join(OUT, "risk-bell.png"));
  console.log("risk-bell.png  560x470");
}
