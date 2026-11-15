\# Civic MGL — Master Architecture & Visual Specification

## 1. Project Overview
You are building **Civic MGL** (`v5.0.9`), an original civic-services mobile web application built with **Next.js (App Router) + TypeScript + Tailwind CSS**, replicating the exact layout hierarchy, UX flows, and visual polish of the 50 UI reference screenshots in `./docs/screenshots/screen_01.png` through `screen_50.png`.

- **Branding:** Original brand **Civic MGL** (subtitle: `Цахим үйлчилгээний нэгдсэн систем`) with an original geometric emblem.
- **Sample Cards:** Profile document cards (`Миний бичиг баримт`) use clearly watermarked **`SAMPLE / ЗАГВАР`** placeholder styling and demo IDs (`CMGL-2026-8841`, `SAMPLE-998877`).
- **Open Admin CMS (`/admin`):** Accessible from the Right Slide-Over Drawer (`Админ удирдлага`) and Profile menu (`Админ хэсэг`), allowing live customization of theme colors, Home page section layout/order, promo banners, sample user profile/photo, and live data overrides.

---

## 2. Exact Icon Mapping (`public/icons/`)
Before writing UI components, list and visually inspect EVERY `.png` file inside `public/icons/` (including subfolders `options in nuur `, `icons in profile`, and `optoins in nemelt`).
- **Use the exact user-provided PNGs via `<img>` (with `object-contain` and `mix-blend-multiply` where appropriate) for every icon present in `public/icons/`:**
  - `public/icons/qr scanner icon.png` → Center floating QR FAB button in the Bottom Navigation Bar.
  - `public/icons/ .png` → Active `Нүүр` (yurt) icon in Bottom Navigation Bar.
  - `public/icons/options in nuur /*.png` → Visually inspect each of the 6 PNGs and match them to the 6 `Хөтөч` cards (`Цэргийн алба`, `Бичиг баримт`, `Хүүхэд`, `Гадаад явах`, `Эрүүл мэнддээ анхаарах`, `Зээлийн мэдээлэл`).
  - `public/icons/optoins in nemelt/*.png` → Visually inspect each of the 9 PNGs (`Layer.png` + `screen_13 copy*.png`) and match them to the 9 cards on the `Нэмэлт` (`/extras`) tab (`Нээлттэй Парламент`, `Төрийн албан хаагчийн цэс`, `Оюутан`, `Ажлын байр`, `Нийтийн тээврийн тасалбар захиалга`, `11-11 төвд өргөдөл, гомдол илгээх`, `АТГ-т хандах`, `Өмгөөлөгчид хандах`, `Эрсдэл мэдэгдэх`).
  - `public/icons/icons in profile/*.png` → Visually inspect each of the 11 PNGs (`screen_15 copy*.png` & `screen_16 copy*.png`) and match them to the 11 menu rows on the `Профайл` (`/profile`) tab (`Миний бичиг баримт`, `Төрд байгаа миний мэдээлэл`, `Цахим хэтэвч`, `Үйлчилгээний түүх`, `Үндэсний шуудан`, `Талархал`, `Санал асуулга`, `Өргөдөл, гомдол`, `Баталгаажуулалт`, `Системээс гарах`).
- **Icons NOT in `public/icons/`:** Inspect the corresponding screenshot (`screen_01.png`, `screen_02.png`, `screen_03.png`) and craft high-detail, glossy multi-color 3D-style SVGs inspired by the user's PNGs for:
  - Promo banners (`20,000+ Нээлттэй ажлын байр` 3D briefcase + paper airplane; `Эрсдэл мэдэгдэх` 3D white bell + red `!` badge).
  - `Нээлттэй мэдээлэл` stat illustrations (briefcase + magnifier, handshake + check, 3D sheep/camel/cow group, briefcase + gold coins, blue banknotes stack).
  - Bottom nav inactive/active icons (`Үйлчилгээ`, `Нэмэлт`, `Профайл`).

---

## 3. Per-Tab Top Headers (Strictly Distinct Per Page)
NEVER hide the header on non-Home pages, and NEVER use the same header across all tabs. Replicate each screenshot's exact header:
1. **`Нүүр` (`/`, `screen_01.png`):**
   - Left: **Civic MGL** logo + subtitle (`Цахим үйлчилгээний нэгдсэн систем`).
   - Right: Dark/Light mode toggle icon, Chat/Support icon, Bell icon (`/notifications`), and Right-Drawer menu trigger (`≡`).
2. **`Үйлчилгээ` (`/services`, `screen_08.png`):**
   - Left: **Civic MGL** logo + subtitle.
   - Right: `Хадгалсан` bookmark button (`/services/saved`) and Bell icon (`/notifications`).
3. **`Нэмэлт` (`/extras`, `screen_13.png`):**
   - Left: **Civic MGL** logo + subtitle ONLY.
   - Right: Bell icon (`/notifications`).
4. **`Профайл` (`/profile`, `screen_15.png`):**
   - **NO Civic MGL logo at the top.**
   - Top-right utility bar (Dark/Light toggle, Bell icon `/notifications`), followed immediately by the User Profile Card (`Avatar`, `Б.Ринчиндорж`, `demo.user@civicmgl.mn`, `>`).
5. **Sub-Pages (`/weather`, `/calendar`, `/exchange`, `/guides/*`, `/services/*`, `/extras/*`, `/profile/*`, `/admin`):**
   - Sticky white/translucent header with `<` back chevron on the left and centered bold page title.

---

## 4. Right-Side Scrollable Drawer (`screen_07.png`)
- **Position & Behavior:** Slides in from the **RIGHT side (`right-0`)** of the mobile viewport (`w-[82%] max-w-[340px]`), is **vertically scrollable (`overflow-y-auto`)**, and can be opened either by tapping the header menu icon OR by swiping left from the right edge of the screen (plus a subtle right-edge pull handle so it is effortless on desktop browsers too).
- **Contents (`screen_07.png`):** Close button (`→` / `✕`), `Админ удирдлага (CMS)` -> `/admin`, `Тусламж`, `Санал хүсэлт`, `Түгээмэл асуулт хариулт`, `Үйлчилгээний нөхцөл`, `Холбоо барих`, `Хаяг байршил`, `Яаралтай тусламж дуудах (SOS)`, `Системээс гарах`, and `5.0.9-v97` at the bottom.

---

## 5. Floating Draggable AI Helper Orb
- Render a sleek floating circular **AI Helper Widget** (`48px × 48px` glossy blue/indigo orb with subtle AI sparkle/wave icon and pulse ring) floating above the UI (`z-40`).
- **Draggable Anywhere:** Implement pointer/mouse/touch drag handlers (`onPointerDown`, `onPointerMove`, `onPointerUp`) so the user can drag and drop the AI helper orb freely to any position inside the mobile viewport (clamped within bounds, distinguishing a drag from a click).
- **Click Behavior:** When clicked (without dragging), it triggers a smooth spin/reload animation and refreshes the app's dynamic state / data with a subtle toast (`"AI туслах шинэчлэгдлээ"`).

---

## 6. Home (`Нүүр`) Asymmetric Bento Grid (`screen_02.png`)
Replicate the exact asymmetric bento layout of `Нээлттэй мэдээлэл` in `screen_02.png`:
- **Row 1 (Full Width):** `Хүн амын тоо` (`3,591,120` + Mongolian flag + faint Mongolia aimag map background).
- **Rows 2–4 (2-Column Asymmetric Split):**
  - **Left Column (2 tall stacked cards):**
    1. `Инфляцын түвшин` (`13 %` + light-blue area sparkline chart across the middle).
    2. `Дотоодын нийт бүтээгдэхүүн` (`52.5 их наяд` + vertical blue accent bar on the bottom-left).
  - **Right Column (3 stacked medium cards):**
    1. `Ажилгүйдлийн түвшин` (`5.5 %` + icon on right).
    2. `Ажиллах хүчний оролцоо` (`61.5 %` + icon on right).
    3. `Малын тоо` (`58.1 сая` + 3D livestock group icon on right).
- **Row 5 (2 Equal Side-by-Side Cards):**
  - Left: `Дундаж цалин` (`2.5 сая` + icon).
  - Right: `Өрхийн дундаж орлого` (`3.0 сая` + icon).

---

## 7. Global State (`AppStateContext` + `localStorage`) & Admin CMS (`/admin`)
- **`themeConfig`:** Primary color (`#0066FF`), Secondary navy (`#0B2265`), Background (`#F3F7FC`), Card radius (`16px`), Dark mode toggle—applied via live CSS variables.
- **`layoutConfig`:** Toggle visibility and reorder (`↑`/`↓`) the 5 Home sections (`Hero Search`, `Utility Widgets`, `Хөтөч Carousel`, `Promo Banners`, `Нээлттэй мэдээлэл`) + edit promo banner text in `/admin`.
- **`sampleUser`:** Editable photo upload, Clan Name, Last Name, First Name, Birthdate (auto-calculates age), Demo ID, Phone, Email—synced across `Профайл`, `Миний QR`, `Миний бичиг баримт` (`SAMPLE` cards), `11-11 өргөдөл`, and generated service slips.
- **Real-Time Clock, Calendar & Live Currency Exchange:** Live `1000ms` clock/date, interactive Calendar (`/calendar`, `screen_30.png`) defaulting to current real-world month/year, and live MNT exchange rates from `https://open.er-api.com/v6/latest/MNT` (`/exchange`, `screen_31.png`) with fallback and `/admin` overrides.