"use client";

import {
  createContext,
  use,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { browser } from "react-dom";
import { SERVICES, type Service } from "@/data/catalog";
import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  EMAIL_RE,
  MIN_PASSWORD,
  getSessionEmail,
  hashPassword,
  normalizeEmail,
  readAccounts,
  setSessionEmail,
  verifyPassword,
  writeAccountState,
  writeAccounts,
  type StoredAccount,
} from "@/lib/accounts";
import { hash } from "@/lib/utils";
import {
  SEED_HISTORY,
  SEED_MAIL,
  SEED_NOTIFICATIONS,
  SEED_PAYMENTS,
  DEVICES,
  type CalendarEvent,
  type HistoryItem,
  type MailItem,
  type NotificationItem,
  type Payment,
} from "@/data/seed";

/* ================================ Types ================================ */

export type SectionId = "heroSearch" | "utilityWidgets" | "guidesCarousel" | "promoBanners" | "openStats";

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  cardRadius: 12 | 16 | 24;
  darkMode: boolean;
  /** Header brand: name, subtitle, and an optional uploaded logo (data URL or https URL). */
  brandName: string;
  brandSubtitle: string;
  brandLogoUrl: string;
}

export interface HomeSection {
  id: SectionId;
  enabled: boolean;
  order: number;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
  variant: "dark" | "light" | "brand";
}

export interface LayoutConfig {
  sections: HomeSection[];
  banners: PromoBanner[];
}

export interface SampleUser {
  clan: string;
  lastName: string;
  firstName: string;
  gender: string;
  demoId: string;
  sampleReg: string;
  birthdate: string;
  phone: string;
  email: string;
  /** The Gmail the account was registered with. */
  personalEmail: string;
  avatar: string; // data URL or https URL, empty for initials
}

export interface WeatherData {
  temp: number;
  nightTemp: number;
  condition: string;
  wind: number;
  windDir: string;
  pressure: number;
  humidity: number;
  precipitation: string;
  snow: string;
}

export interface AqiData {
  value: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
}

export const CURRENCIES = ["USD", "EUR", "JPY", "CHF", "SEK", "GBP"] as const;
export type Currency = (typeof CURRENCIES)[number];

export interface StatItem {
  id: string;
  label: string;
  value: string;
}

export interface LiveData {
  weather: WeatherData;
  aqi: AqiData;
  rates: Record<Currency, number>;
  ratesMode: "auto" | "custom";
  ratesSource: "fallback" | "live" | "custom";
  ratesUpdatedAt: string | null;
  stats: StatItem[];
}

export interface WalletCard {
  id: string;
  holder: string;
  last4: string;
  expiry: string;
  brand: string;
}

/** Admin-uploaded card for the Personal Card Holder (gym pass, membership, …). */
export interface HolderCard {
  id: string;
  title: string;
  /** Data URLs (resized on upload). */
  frontImageUrl: string;
  backImageUrl: string;
  /** naturalWidth / naturalHeight of the front photo; drives the card's box. */
  aspectRatio: number;
  createdAt: string;
}

export interface Petition {
  id: string;
  ref: string;
  kind: string;
  title: string;
  body: string;
  date: string;
  status: "Хүлээн авсан" | "Шийдвэрлэж буй" | "Шийдвэрлэсэн";
}

export interface AppState {
  themeConfig: ThemeConfig;
  layoutConfig: LayoutConfig;
  sampleUser: SampleUser;
  liveData: LiveData;
  customServices: Service[];
  savedServices: string[];
  history: HistoryItem[];
  notifications: NotificationItem[];
  mail: MailItem[];
  cards: WalletCard[];
  holderCards: HolderCard[];
  payments: Payment[];
  events: CalendarEvent[];
  recentSearches: string[];
  petitions: Petition[];
  pollVotes: Record<string, string>;
  devices: typeof DEVICES;
  ebarimtLinked: boolean;
  notifPrefs: { push: boolean; email: boolean; sms: boolean };
}

/* =============================== Defaults =============================== */

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: "#0066FF",
  secondaryColor: "#0B2265",
  bgColor: "#F3F7FC",
  cardRadius: 16,
  darkMode: false,
  brandName: "Civic MGL",
  brandSubtitle: "Цахим үйлчилгээний нэгдсэн систем",
  brandLogoUrl: "",
};

export const SECTION_LABELS: Record<SectionId, string> = {
  heroSearch: "Hero Search — Нүүр баннер & хайлт",
  utilityWidgets: "Utility Widgets — Цаг, цаг агаар, ханш",
  guidesCarousel: "Хөтөч Carousel",
  promoBanners: "Promo Banners — Сурталчилгаа",
  openStats: "Нээлттэй мэдээлэл Stats",
};

export const DEFAULT_LAYOUT: LayoutConfig = {
  sections: [
    { id: "heroSearch", enabled: true, order: 0 },
    { id: "utilityWidgets", enabled: true, order: 1 },
    { id: "guidesCarousel", enabled: true, order: 2 },
    { id: "promoBanners", enabled: true, order: 3 },
    { id: "openStats", enabled: true, order: 4 },
  ],
  banners: [
    {
      id: "jobs",
      title: "20,000+",
      subtitle: "Нээлттэй ажлын байр",
      ctaLabel: "Ажлын байр харах",
      href: "/extras/jobs",
      variant: "dark",
    },
    {
      id: "risk",
      title: "ЭРСДЭЛ МЭДЭГДЭХ",
      subtitle: "Иргэн та эрсдэлтэй нөхцөл байдлыг Нэмэлт хэсгээс шуурхай мэдээлээрэй.",
      ctaLabel: "Мэдэгдэх",
      href: "/extras/risk-report",
      variant: "light",
    },
    {
      id: "apostille",
      title: "Цахим апостиль",
      subtitle: "12 төрлийн лавлагааг 5 хэлээр баталгаажуулна",
      ctaLabel: "Дэлгэрэнгүй",
      href: "/services/e-apostille",
      variant: "brand",
    },
  ],
};

export const DEFAULT_USER: SampleUser = {
  clan: "Унзад",
  lastName: "Батхүрэл",
  firstName: "Ринчиндорж",
  gender: "Эрэгтэй",
  demoId: "CMGL-2026-8841",
  sampleReg: "АА00112233",
  birthdate: "2007-08-09",
  phone: "85641393",
  email: "demo.user@civicmgl.mn",
  personalEmail: "demo.user@civicmgl.mn",
  avatar: "",
};

/** "bat.erdene_99@gmail.com" → "Bat Erdene 99" */
export function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "";
  const words = local
    .split(/[._\-+]+/)
    .flatMap((w) => w.split(/(?<=\D)(?=\d)/))
    .filter(Boolean);
  const name = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return name || "Хэрэглэгч";
}

/** Profile for a freshly registered account: their Gmail and a name derived from it. */
function userFor(email: string): SampleUser {
  return {
    ...DEFAULT_USER,
    clan: "",
    lastName: "",
    firstName: nameFromEmail(email),
    demoId: `CMGL-2026-${String(hash(email) % 10000).padStart(4, "0")}`,
    phone: "",
    email,
    personalEmail: email,
    avatar: "",
  };
}

export const FALLBACK_RATES: Record<Currency, number> = {
  USD: 3603.46,
  EUR: 3985.43,
  JPY: 22.54,
  CHF: 4312.16,
  SEK: 359.42,
  GBP: 4767.2,
};

export const DEFAULT_STATS: StatItem[] = [
  { id: "population", label: "Хүн амын тоо", value: "3,591,120" },
  { id: "inflation", label: "Инфляцын түвшин", value: "13 %" },
  { id: "unemployment", label: "Ажилгүйдлийн түвшин", value: "5.5 %" },
  { id: "labor", label: "Ажиллах хүчний оролцоо", value: "61.5 %" },
  { id: "gdp", label: "Дотоодын нийт бүтээгдэхүүн", value: "52.5 их наяд" },
  { id: "livestock", label: "Малын тоо", value: "58.1 сая" },
  { id: "salary", label: "Дундаж цалин", value: "2.5 сая" },
  { id: "income", label: "Өрхийн дундаж орлого", value: "3.0 сая" },
];

export const DEFAULT_LIVE: LiveData = {
  weather: {
    temp: -7,
    nightTemp: -14,
    condition: "Үүлшинэ",
    wind: 2.4,
    windDir: "ЗУ",
    pressure: 881.2,
    humidity: 80,
    precipitation: "-",
    snow: "-",
  },
  aqi: { value: 31, pm25: 12, pm10: 24, no2: 18, so2: 6, co: 0.4, o3: 29 },
  rates: FALLBACK_RATES,
  ratesMode: "auto",
  ratesSource: "fallback",
  ratesUpdatedAt: null,
  stats: DEFAULT_STATS,
};

/**
 * A fresh, independent default state. With an email (other than the demo
 * account's) the profile is seeded from that email instead of the sample user.
 */
export function createDefaultState(email?: string): AppState {
  const own = email && normalizeEmail(email) !== DEMO_EMAIL;
  return {
    themeConfig: DEFAULT_THEME,
    layoutConfig: DEFAULT_LAYOUT,
    sampleUser: own ? userFor(normalizeEmail(email)) : DEFAULT_USER,
    liveData: DEFAULT_LIVE,
    customServices: [],
    savedServices: ["health-insurance-check"],
    history: SEED_HISTORY,
    notifications: SEED_NOTIFICATIONS,
    mail: SEED_MAIL,
    cards: [],
    holderCards: [],
    payments: SEED_PAYMENTS,
    events: [],
    recentSearches: ["Торгууль", "Шүүх", "Машин", "Зөрчлийн тор", "Оюутан", "Оноо", "Жолоо"],
    petitions: [],
    pollVotes: {},
    devices: DEVICES,
    ebarimtLinked: false,
    notifPrefs: { push: true, email: true, sms: false },
  };
}

/* ============================== Persistence ============================== */

/** Pre-accounts single-user key. Migrated into the demo account once, then removed. */
const LEGACY_KEY = "civic-mgl-state-v1";

/** Merge a saved state over defaults slice by slice, so fields added in later versions get defaults. */
function hydrate(saved: Partial<AppState> | undefined, email: string): AppState {
  const defaults = createDefaultState(email);
  if (!saved) return defaults;
  const merged: AppState & { loggedIn?: unknown } = {
    ...defaults,
    ...saved,
    themeConfig: { ...defaults.themeConfig, ...saved.themeConfig },
    layoutConfig: { ...defaults.layoutConfig, ...saved.layoutConfig },
    sampleUser: { ...defaults.sampleUser, ...saved.sampleUser },
    liveData: {
      ...defaults.liveData,
      ...saved.liveData,
      weather: { ...defaults.liveData.weather, ...saved.liveData?.weather },
      aqi: { ...defaults.liveData.aqi, ...saved.liveData?.aqi },
      rates: { ...defaults.liveData.rates, ...saved.liveData?.rates },
    },
    notifPrefs: { ...defaults.notifPrefs, ...saved.notifPrefs },
  };
  delete merged.loggedIn; // removed field from the single-user version
  return merged;
}

/** One-time move of the old single-user state into the demo account. */
async function migrateLegacy() {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return;
    const accounts = readAccounts();
    if (!accounts[DEMO_EMAIL]) {
      const saved = JSON.parse(raw) as Partial<AppState> & { loggedIn?: boolean };
      accounts[DEMO_EMAIL] = {
        email: DEMO_EMAIL,
        password: await hashPassword(DEMO_EMAIL, DEMO_PASSWORD),
        state: hydrate(saved, DEMO_EMAIL),
        createdAt: new Date().toISOString(),
      };
      if (writeAccounts(accounts) && saved.loggedIn !== false && !getSessionEmail()) setSessionEmail(DEMO_EMAIL);
    }
    localStorage.removeItem(LEGACY_KEY);
  } catch {}
}

interface Session {
  /** Normalized email of the signed-in account, or null when signed out. */
  email: string | null;
  state: AppState;
}

/** Read the stored session. A session pointing at a missing account is cleared. */
function loadSession(): Session {
  const email = getSessionEmail();
  const acc = email ? readAccounts()[email] : undefined;
  if (email && acc) return { email, state: hydrate(acc.state, email) };
  if (email) setSessionEmail(null);
  return { email: null, state: createDefaultState() };
}

/** Resolves once the legacy migration (async because of password hashing) has run. */
let migration: Promise<void> | null = null;

export type AuthResult = { ok: true } | { ok: false; error: string };

/* ============================== Theme vars ============================== */

function mix(hex: string, target: string, amount: number) {
  return `color-mix(in srgb, ${hex} ${Math.round((1 - amount) * 100)}%, ${target})`;
}

export function themeVars(t: ThemeConfig): CSSProperties {
  const dark = t.darkMode;
  return {
    "--brand-primary": t.primaryColor,
    "--brand-secondary": dark ? mix(t.secondaryColor, "#ffffff", 0.55) : t.secondaryColor,
    "--bg-app": dark ? "#0A1120" : t.bgColor,
    "--surface-card": dark ? "#121B2E" : "#FFFFFF",
    "--surface-soft": dark ? "#1A2540" : mix(t.bgColor, "#1B2433", 0.05),
    "--text-main": dark ? "#E7EDF7" : "#1B2433",
    "--text-muted": dark ? "#93A1B8" : "#6B7689",
    "--line": dark ? "#24314D" : "#E3E9F2",
    "--card-radius": `${t.cardRadius}px`,
    colorScheme: dark ? "dark" : "light",
  } as CSSProperties;
}

/* ================================ Context ================================ */

type Updater<T> = T | ((prev: T) => T);

interface AppStateValue {
  state: AppState;
  /** Generic slice setter: update("history", h => [...]) */
  update: <K extends keyof AppState>(key: K, value: Updater<AppState[K]>) => void;
  setTheme: (patch: Partial<ThemeConfig>) => void;
  setUser: (patch: Partial<SampleUser>) => void;
  setLive: (patch: Partial<LiveData>) => void;
  services: Service[];
  findService: (slug: string) => Service | undefined;
  toggleSaved: (slug: string) => void;
  addHistory: (item: HistoryItem) => void;
  addNotification: (n: Omit<NotificationItem, "id" | "read" | "date"> & { date?: string }) => void;
  refreshRates: (force?: boolean) => Promise<boolean>;
  ratesLoading: boolean;
  saveNow: () => boolean;
  resetAll: () => void;
  /** Normalized email of the signed-in account (null on the login screen). */
  currentEmail: string | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string) => Promise<AuthResult>;
  loginDemo: () => Promise<AuthResult>;
  logout: () => void;
  toast: (message: string, tone?: "info" | "success" | "error") => void;
  toasts: { id: number; message: string; tone: "info" | "success" | "error" }[];
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  // The whole app state is stored in localStorage, so the first render must
  // happen in the browser. This suspends to the Splash fallback during prerender.
  use(browser("Civic MGL state is stored in localStorage."));
  use((migration ??= migrateLegacy()));

  // Email and state live together so a state write can never land in another account.
  const [session, setSession] = useState<Session>(loadSession);
  const state = session.state;
  const setState = useCallback((next: AppState | ((prev: AppState) => AppState)) => {
    setSession((s) => ({ ...s, state: typeof next === "function" ? next(s.state) : next }));
  }, []);
  const [toasts, setToasts] = useState<AppStateValue["toasts"]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ratesLoading, setRatesLoading] = useState(false);
  const toastId = useRef(0);
  const quotaWarned = useRef(false);

  const toast = useCallback<AppStateValue["toast"]>((message, tone = "info") => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  // Auto-persist every change into the signed-in account's entry only.
  useEffect(() => {
    if (!session.email) return;
    const ok = writeAccountState(session.email, session.state);
    if (!ok && !quotaWarned.current) {
      quotaWarned.current = true;
      toast("Хадгалах зай хүрэлцэхгүй байна. Зургийн хэмжээг багасгана уу.", "error");
    }
  }, [session, toast]);

  const update = useCallback<AppStateValue["update"]>((key, value) => {
    setState((s) => ({
      ...s,
      [key]: typeof value === "function" ? (value as (p: AppState[typeof key]) => AppState[typeof key])(s[key]) : value,
    }));
  }, [setState]);

  const setTheme = useCallback((patch: Partial<ThemeConfig>) => {
    setState((s) => ({ ...s, themeConfig: { ...s.themeConfig, ...patch } }));
  }, [setState]);
  const setUser = useCallback((patch: Partial<SampleUser>) => {
    setState((s) => ({ ...s, sampleUser: { ...s.sampleUser, ...patch } }));
  }, [setState]);
  const setLive = useCallback((patch: Partial<LiveData>) => {
    setState((s) => ({ ...s, liveData: { ...s.liveData, ...patch } }));
  }, [setState]);

  const services = useMemo(() => [...SERVICES, ...state.customServices], [state.customServices]);
  const findService = useCallback((slug: string) => services.find((s) => s.slug === slug), [services]);

  const toggleSaved = useCallback(
    (slug: string) => {
      const added = !state.savedServices.includes(slug);
      setState((s) => ({
        ...s,
        savedServices: added ? [slug, ...s.savedServices.filter((x) => x !== slug)] : s.savedServices.filter((x) => x !== slug),
      }));
      toast(added ? "Хадгалсан жагсаалтад нэмлээ" : "Хадгалсан жагсаалтаас хаслаа", "success");
    },
    [state.savedServices, toast, setState],
  );

  const addHistory = useCallback((item: HistoryItem) => {
    setState((s) => ({ ...s, history: [item, ...s.history] }));
  }, [setState]);

  const addNotification = useCallback<AppStateValue["addNotification"]>((n) => {
    const d = new Date();
    const p = (x: number) => String(x).padStart(2, "0");
    const date = n.date ?? `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
    setState((s) => ({
      ...s,
      notifications: [{ ...n, date, id: `n-${Date.now()}`, read: false }, ...s.notifications],
    }));
  }, [setState]);

  const ratesModeRef = useRef(state.liveData.ratesMode);
  useEffect(() => {
    ratesModeRef.current = state.liveData.ratesMode;
  }, [state.liveData.ratesMode]);

  const refreshRates = useCallback(
    async (force = false) => {
      if (!force && ratesModeRef.current === "custom") return false;
      setRatesLoading(true);
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/MNT", { cache: "no-store" });
        const json = (await res.json()) as { result?: string; rates?: Record<string, number> };
        if (json.result !== "success" || !json.rates) throw new Error("bad response");
        const rates = {} as Record<Currency, number>;
        for (const c of CURRENCIES) {
          const perMnt = json.rates[c];
          if (!perMnt) throw new Error(`missing ${c}`);
          rates[c] = Math.round((1 / perMnt) * 100) / 100;
        }
        // The account may have switched (or pinned custom rates) while fetching.
        setState((s) => (s.liveData.ratesMode === "custom" && !force ? s : {
          ...s,
          liveData: {
            ...s.liveData,
            rates,
            ratesMode: "auto",
            ratesSource: "live",
            ratesUpdatedAt: new Date().toISOString(),
          },
        }));
        return true;
      } catch {
        setState((s) =>
          s.liveData.ratesMode === "custom" && !force
            ? s
            : { ...s, liveData: { ...s.liveData, ratesSource: s.liveData.ratesSource === "live" ? "live" : "fallback" } },
        );
        return false;
      } finally {
        setRatesLoading(false);
      }
    },
    [setState],
  );

  // Fetch live exchange rates on load and whenever a different account signs in
  // (unless that account's admin pinned custom values).
  useEffect(() => {
    if (!session.email) return;
    // Deferred so the loading state isn't set synchronously during the effect.
    const id = setTimeout(() => void refreshRates(), 0);
    return () => clearTimeout(id);
  }, [refreshRates, session.email]);

  const saveNow = useCallback(() => {
    const ok = !!session.email && writeAccountState(session.email, session.state);
    toast(ok ? "Тохиргоо хадгалагдлаа" : "Хадгалж чадсангүй", ok ? "success" : "error");
    return ok;
  }, [session, toast]);

  /** Reset only the signed-in account back to its own defaults. */
  const resetAll = useCallback(() => {
    if (!session.email) return;
    setState(createDefaultState(session.email));
    toast("Анхны төлөвт орууллаа", "success");
    void refreshRates(true);
  }, [session.email, setState, toast, refreshRates]);

  const signIn = useCallback((acc: StoredAccount) => {
    const email = normalizeEmail(acc.email);
    setSessionEmail(email);
    setSession({ email, state: hydrate(acc.state, email) });
  }, []);

  const register = useCallback<AppStateValue["register"]>(
    async (rawEmail, password) => {
      const email = normalizeEmail(rawEmail);
      if (!EMAIL_RE.test(email)) return { ok: false, error: "Зөв и-мэйл хаяг оруулна уу (жишээ: name@gmail.com)" };
      if (password.length < MIN_PASSWORD) return { ok: false, error: `Нууц үг дор хаяж ${MIN_PASSWORD} тэмдэгт байна` };
      const accounts = readAccounts();
      if (accounts[email]) return { ok: false, error: "Энэ и-мэйлээр бүртгэл үүссэн байна. Нэвтэрнэ үү." };
      const acc: StoredAccount = {
        email,
        password: await hashPassword(email, password),
        state: createDefaultState(email),
        createdAt: new Date().toISOString(),
      };
      if (!writeAccounts({ ...accounts, [email]: acc })) return { ok: false, error: "Хадгалах зай хүрэлцэхгүй байна" };
      signIn(acc);
      return { ok: true };
    },
    [signIn],
  );

  const login = useCallback<AppStateValue["login"]>(
    async (rawEmail, password) => {
      const acc = readAccounts()[normalizeEmail(rawEmail)];
      if (!acc || !(await verifyPassword(acc, password))) return { ok: false, error: "И-мэйл эсвэл нууц үг буруу байна" };
      signIn(acc);
      return { ok: true };
    },
    [signIn],
  );

  /** Signs into the demo account, creating it (with the screenshot defaults) on first use. */
  const loginDemo = useCallback<AppStateValue["loginDemo"]>(async () => {
    const accounts = readAccounts();
    let acc = accounts[DEMO_EMAIL];
    if (!acc) {
      acc = {
        email: DEMO_EMAIL,
        password: await hashPassword(DEMO_EMAIL, DEMO_PASSWORD),
        state: createDefaultState(),
        createdAt: new Date().toISOString(),
      };
      if (!writeAccounts({ ...accounts, [DEMO_EMAIL]: acc })) return { ok: false, error: "Хадгалах зай хүрэлцэхгүй байна" };
    }
    signIn(acc);
    return { ok: true };
  }, [signIn]);

  const logout = useCallback(() => {
    // The account's state is already persisted; just end the session and drop
    // back to default theme variables before leaving.
    setSessionEmail(null);
    setSession({ email: null, state: createDefaultState() });
    // Full reload clears all preserved (Activity) client state, so nothing from
    // this account survives into the next one. Per Next's guidance for logout.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/login";
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({
      state,
      update,
      setTheme,
      setUser,
      setLive,
      services,
      findService,
      toggleSaved,
      addHistory,
      addNotification,
      refreshRates,
      ratesLoading,
      saveNow,
      resetAll,
      currentEmail: session.email,
      login,
      register,
      loginDemo,
      logout,
      toast,
      toasts,
      drawerOpen,
      setDrawerOpen,
    }),
    [
      state,
      update,
      setTheme,
      setUser,
      setLive,
      services,
      findService,
      toggleSaved,
      addHistory,
      addNotification,
      refreshRates,
      ratesLoading,
      saveNow,
      resetAll,
      session.email,
      login,
      register,
      loginDemo,
      logout,
      toast,
      toasts,
      drawerOpen,
    ],
  );

  return <AppStateContext value={value}>{children}</AppStateContext>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}

/* ============================ Real-time clock ============================ */

/** Live clock that ticks every 1000ms. Only rendered in the browser. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/* ============================ Derived helpers ============================ */

export function displayName(u: SampleUser) {
  return u.lastName ? `${u.lastName.charAt(0)}.${u.firstName}` : u.firstName || "Хэрэглэгч";
}

export function initials(u: SampleUser) {
  const parts = u.lastName ? [u.lastName, u.firstName] : u.firstName.split(" ");
  const text = parts.length > 1 ? parts[0].charAt(0) + parts[1].charAt(0) : (parts[0] ?? "").slice(0, 2);
  return (text || "?").toUpperCase();
}
