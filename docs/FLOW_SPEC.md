# Civic MGL — Complete Screen Flow, Admin CMS & Inferred Routes

## SECTION A: ADMIN CMS (`/admin`) — LAYOUT, THEME & CONTENT CUSTOMIZER

- **Route:** `/admin`
- **Access Points:**
  1. Left Hamburger Drawer (`screen_07.png`) → Top item `Админ удирдлага (CMS)` with a blue `ADMIN` badge.
  2. Profile Tab (`screen_15.png`) → Menu item `Админ хэсэг (Загвар & Бүтэц)` + clickable `"Хоосон байна"` card inside `/profile/petitions`.
- **Style Reference:** `screen_40.png` & `screen_50.png` (`<` back button, centered header `Админ удирдлага`, clean white rounded-2xl setting cards, live preview banner at top).
- **4 Interactive Tabs inside `/admin`:**
  1. **Өнгө & Загвар (Theme & Appearance):**
     - Color pickers + preset swatches (`E-Blue #0066FF`, `Emerald #059669`, `Royal Purple #6D28D9`, `Crimson #DC2626`, `Slate #1E293B`) for Primary Color, Secondary Navy, and App Background.
     - Card corner radius selector (`12px`, `16px`, `24px`) and Dark Mode switch.
  2. **Нүүр хуудасны бүтэц (Home Layout Builder):**
     - Reorder (`↑` / `↓` buttons) and toggle visibility (`On/Off` switches) for the 5 Home sections (`Hero Search`, `Utility Widgets`, `Хөтөч Carousel`, `Promo Banners`, `Нээлттэй мэдээлэл Stats`).
     - Edit Promo Banner text & CTA links live.
  3. **Хэрэглэгч & Баримт (Sample User Profile):**
     - Upload avatar photo (`FileReader` base64), edit Clan Name, Last Name, First Name, Birthdate (updates age automatically), Demo ID (`CMGL-...`), Phone, and Email.
  4. **Өгөгдөл & Ханш (Live Data Overrides):**
     - Customize Weather (`°C`, condition), Air Quality (`AQI`), Currency Exchange rates (or click `"Live API-аас шинэчлэх"`), and the 8 `Нээлттэй мэдээлэл` statistics numbers.
     - Bottom bar with `"Хадгалах"` (saves to `localStorage` + toast) and `"Анхны загвар сэргээх"` (resets all settings to initial screenshot defaults).

---

## SECTION B: GLOBAL CHROME, DRAWER, NOTIFICATIONS & QR

### 1. Left Slide-Over Drawer (`screen_07.png`)[cite: 8]
- **Trigger:** Top-left `≡` button on main tabs.
- **Items:**
  - `Админ удирдлага` → `/admin`
  - `Тусламж` → **`[INFERRED: /support/help]`** (Style ref: `screen_23.png`[cite: 24])
  - `Санал хүсэлт` → **`[INFERRED: /support/feedback]`** (Style ref: `screen_40.png`[cite: 41])
  - `Түгээмэл асуулт хариулт` → **`[INFERRED: /support/faq]`** (Style ref: `screen_23.png`[cite: 24])
  - `Үйлчилгээний нөхцөл` → **`[INFERRED: /support/terms]`** (Style ref: `screen_26.png`[cite: 27])
  - `Холбоо барих` → **`[INFERRED: /support/contact]`** (Style ref: `screen_36.png`[cite: 37])
  - `Хаяг байршил` → **`[INFERRED: /support/locations]`** (Style ref: `screen_24.png`[cite: 25])
  - `Яаралтай тусламж дуудах` (`SOS` badge)[cite: 8] → **`[INFERRED: /sos]`** (`101`, `102`, `103`, `105` emergency cards)
  - `Системээс гарах` → Confirmation modal -> Demo Login screen.

### 2. Notifications (`Сонордуулга` — `screen_04.png`, `screen_05.png`, `screen_06.png`)[cite: 5, 6, 7]
- **Route:** `/notifications`
- **Tabs:** `Бүх мэдэгдэл` (`screen_04`)[cite: 5], `Нэхэмжлэл` (`screen_05`)[cite: 6], `Шийдвэрлэлт` (`screen_06`)[cite: 7]. Working `"Бүх мэдэгдлийг уншсан болгох"` action and detail modals.

### 3. QR Scanner & My QR (`QR код уншуулах` — `screen_11.png`, `screen_12.png`)[cite: 12, 13]
- **Route:** `/qr`
- **Tabs:** `QR уншуулах` (`screen_11` — simulated scanner + `AR камер нээх`)[cite: 12] | `Миний QR` (`screen_12` — dynamically displays `sampleUser` name, `demo.user@civicmgl.mn`, and sample QR code)[cite: 13].

---

## SECTION C: TAB 1 — НҮҮР (HOME) & WIDGETS

### 1. Home Screen (`screen_01.png`, `screen_02.png`, `screen_03.png`)[cite: 2, 3, 4]
- **Route:** `/`
- **Dynamic Layout:** Renders sections in the order and visibility defined by `layoutConfig` (defaulting to the exact layout of `screen_01` -> `screen_03` -> `screen_02`)[cite: 2, 3, 4]:
  1. **Hero Banner & Search Bar** (`"Төрийн үйлчилгээ, мэдээллийг нэг дороос"`, `"Үйлчилгээ хайх"`[cite: 2] -> `/search` `screen_25`/`27`[cite: 26, 28]).
  2. **4 Utility Widgets (`screen_01.png`):**[cite: 2]
     - **Real-Time Clock & Date** (Live `HH:mm` clock + current date/day) -> `/calendar` (`screen_30.png`)[cite: 31]
     - **Weather** (`-7°C Өдөр` or custom override)[cite: 2] -> `/weather?tab=weather` (`screen_28.png`)[cite: 29]
     - **Air Quality** (`31 Цэвэр` or custom override)[cite: 2] -> `/weather?tab=aqi` (`screen_29.png`)[cite: 30]
     - **Currency Exchange** (`3603.46₮` live/custom USD rate)[cite: 2] -> `/exchange` (`screen_31.png`)[cite: 32]
  3. **Хөтөч Carousel (`screen_01.png`, `screen_03.png`):** `Бүгд >` -> `/guides` (`screen_23.png`)[cite: 2, 4, 24]. Cards: `Гадаад явах` (`screen_17`)[cite: 18], `Эрүүл мэнддээ анхаарах` (`screen_18`)[cite: 19], `Зээлийн мэдээлэл` (`screen_19`)[cite: 20], `Цэргийн алба` (`screen_20`)[cite: 21], `Бичиг баримт` (`screen_21`)[cite: 22], `Хүүхэд` (`screen_22`)[cite: 23].
  4. **Promo Banners (`screen_01.png`, `screen_03.png`):** `20,000+ Нээлттэй ажлын байр` (`screen_01` -> `/extras/jobs` `screen_39`)[cite: 2, 40] and `ЭРСДЭЛ МЭДЭГДЭХ` (`screen_03` -> `/extras/risk-report`)[cite: 4].
  5. **Нээлттэй мэдээлэл (`screen_02.png`):** 8-card bento grid reading from `statsConfig` (`Хүн амын тоо`, `Инфляцын түвшин`, `Ажилгүйдлийн түвшин`, `Ажиллах хүчний оролцоо`, `ДНБ`, `Малын тоо`, `Дундаж цалин`, `Өрхийн дундаж орлого`)[cite: 3].

### 2. Weather & Air Quality (`screen_28.png`, `screen_29.png`)[cite: 29, 30]
- **Route:** `/weather`
- **Features:** City selector dropdown (`Улаанбаатар`, `Дархан-Уул`, `Орхон`), `Цаг агаар` tab (`screen_28`)[cite: 29], and **`[INFERRED TAB: Агаарын чанар]`** showing station AQI readings and pollutant metrics in the same 2x3 grid style.

### 3. Real-Time Calendar (`Цагалбар` — `screen_30.png`)[cite: 31]
- **Route:** `/calendar`
- **Features:** Live clock header, defaults to current real-world month/year, highlights today's date, `<` `>` month switching, public holidays, and custom event creation on any clicked date.

### 4. Live Currency Exchange (`Ханшийн мэдээлэл` — `screen_31.png`)[cite: 32]
- **Route:** `/exchange`
- **Features:** Fetches live rates from `https://open.er-api.com/v6/latest/MNT` (with fallback/admin overrides), interactive currency selector (`USD`, `EUR`, `JPY`, `CHF`, `SEK`, `GBP`), trend chart, and live MNT currency converter[cite: 32].

### 5. Guides List (`screen_23.png`) & Guide Detail Pages (`screen_17.png` – `screen_22.png`)[cite: 18, 19, 20, 21, 22, 23, 24]
- **Routes:** `/guides` and `/guides/[slug]`. Clicking `Асуулга эхлүүлэх` opens a 3-step interactive questionnaire modal recommending services[cite: 18, 19, 20, 21, 22, 23]. Additional items in `screen_23.png` route to `/guides/[slug]` using `screen_18.png` layout[cite: 19, 24].

---

## SECTION D: TAB 2 — ҮЙЛЧИЛГЭЭ (SERVICES), CATEGORIES & SEARCH

- **Routes:** `/services` (`screen_08`–`10`)[cite: 9, 10, 11], `/services/saved` (**`[INFERRED]`** bookmarked services), `/categories` (`screen_24.png` — 12 category cards)[cite: 25], `/search` (`screen_25.png`, `screen_27.png` — live search + removable chips)[cite: 26, 28], and `/services/[slug]` (`screen_26`, `32`, `33`, `34`, `35` + inferred service detail pages)[cite: 27, 33, 34, 35, 36].
- **Interactive Service Request:** Clicking `Үйлчилгээ авах` generates a clearly watermarked **`SAMPLE / ЗАГВАР`** digital reference slip populated with `sampleUser` details and logs it to `/profile/history`[cite: 27, 33, 34, 35, 36, 44].

---

## SECTION E: TAB 3 — НЭМЭЛТ (EXTRAS) & SUB-PAGES

- **Route:** `/extras` (`screen_13.png`, `screen_14.png`)[cite: 14, 15]
- **9 Mini-Apps:**
  1. `Нээлттэй Парламент` → `/extras/parliament` (`screen_36.png`[cite: 37] + interactive sub-modals)
  2. `Төрийн албан хаагчийн цэс` → `/extras/civil-servant` (`screen_37.png`[cite: 38] + sub-sheets)
  3. `Оюутан` → `/extras/student` (`screen_38.png`[cite: 39] + student info card)
  4. `Ажлын байр` → `/extras/jobs` (`screen_39.png`[cite: 40] + Zangia/Worki job listings sheet)
  5. `Нийтийн тээврийн тасалбар захиалга` → **`[INFERRED: /extras/transit-tickets]`** (Style ref: `screen_40.png`[cite: 41])
  6. `11-11 төвд өргөдөл, гомдол илгээх` → `/extras/1111-complaint` (`screen_40.png`[cite: 41] — auto-filled from `sampleUser`)
  7. `АТГ-т хандах` → **`[INFERRED: /extras/iaac-report]`** (Style ref: `screen_40.png`[cite: 41])
  8. `Өмгөөлөгчид хандах` → **`[INFERRED: /extras/lawyer-consult]`** (Style ref: `screen_39.png`[cite: 40])
  9. `Эрсдэл мэдэгдэх` (`screen_14.png`)[cite: 15] → **`[INFERRED: /extras/risk-report]`** (Style ref: `screen_40.png`[cite: 41])

---

## SECTION F: TAB 4 — ПРОФАЙЛ (PROFILE) & SAMPLE DOCUMENTS

- **Route:** `/profile` (`screen_15.png`, `screen_16.png`)[cite: 16, 17]
- **Menu Rows:**
  1. `Миний бичиг баримт` → `/profile/documents` (`screen_41.png`)[cite: 42]: Renders **3 Sample Civic Cards** (`Иргэний цахим карт - SAMPLE`, `Жолоочийн бүртгэлийн карт - SAMPLE`, `Гадаад зорчих карт - SAMPLE`) with a diagonal **`SAMPLE / ЗАГВАР`** watermark, populated dynamically from `sampleUser` (including uploaded photo).
  2. `Төрд байгаа миний мэдээлэл` → **`[INFERRED: /profile/state-data]`** (Style ref: `screen_50.png`[cite: 51])
  3. `Цахим хэтэвч` → `/profile/wallet` (`screen_42.png`[cite: 43] — `Карт нэмэх` modal + payment history)
  4. `Үйлчилгээний түүх` → `/profile/history` (`screen_43.png`[cite: 44])
  5. `Үндэсний шуудан` → `/profile/mail` (`screen_44.png` / `screen_45.png`[cite: 45, 46] — tabs + compose modal)
  6. `Талархал` → `/profile/gratitude` (`screen_46.png`[cite: 47] — sample appreciation certificate)
  7. `Санал асуулга` → `/profile/polls` (`screen_47.png` / `screen_48.png`[cite: 48, 49])
  8. `Өргөдөл, гомдол` → `/profile/petitions` (Style ref: `screen_49.png`[cite: 50] — shows empty state `"Хоосон байна"` + direct button to submit a petition or open `/admin`)
  9. `Баталгаажуулалт` → `/profile/verification` (`screen_49.png`[cite: 50])
  10. `Админ хэсэг (Загвар & Бүтэц)` → `/admin` (Opens the full Admin CMS)
  11. `Системээс гарах` → Logout confirmation modal
- **My Personal Info (`Миний мэдээлэл` — `screen_50.png`):**[cite: 51]
  - **Route:** `/profile/info` — Displays `sampleUser.demoId` with copy button[cite: 51], plus sub-pages for `Холбоо барих мэдээлэл`, `E-Barimt холболт`, `Хандсан төхөөрөмжүүд`, and `Тохиргоо`.