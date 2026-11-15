/**
 * Multi-account storage for Civic MGL (browser-only demo auth).
 *
 *   localStorage["civicmgl_accounts"]        → { [normalizedEmail]: { email, password, state, createdAt } }
 *   localStorage["civicmgl_current_session"] → normalizedEmail of the signed-in account
 *
 * Each account owns a full, independent AppState, so /admin edits only ever touch
 * the signed-in account's entry. `password` holds a salted hash, never the raw
 * password. This is still client-side storage: fine for a demo, not real security.
 */
import type { AppState } from "@/context/AppStateContext";
import { hash } from "./utils";

export const ACCOUNTS_KEY = "civicmgl_accounts";
export const SESSION_KEY = "civicmgl_current_session";

export const DEMO_EMAIL = "demo.user@civicmgl.mn";
export const DEMO_PASSWORD = "demo1234";

export interface StoredAccount {
  email: string;
  password: string;
  state: AppState;
  createdAt: string;
}
export type AccountMap = Record<string, StoredAccount>;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MIN_PASSWORD = 4;

/* ------------------------------ Raw storage ------------------------------ */

export function readAccounts(): AccountMap {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as AccountMap) : {};
  } catch {
    return {};
  }
}

/** Returns false when the write fails (e.g. storage quota exceeded). */
export function writeAccounts(accounts: AccountMap): boolean {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    return true;
  } catch {
    return false;
  }
}

export function getSessionEmail(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setSessionEmail(email: string | null) {
  try {
    if (email) localStorage.setItem(SESSION_KEY, email);
    else localStorage.removeItem(SESSION_KEY);
  } catch {}
}

/** Replace one account's state, leaving every other account untouched. */
export function writeAccountState(email: string, state: AppState): boolean {
  const accounts = readAccounts();
  const acc = accounts[email];
  if (!acc) return false;
  accounts[email] = { ...acc, state };
  return writeAccounts(accounts);
}

/* -------------------------------- Passwords -------------------------------- */

/**
 * Salted hash, prefixed with the algorithm used. WebCrypto is only available in
 * secure contexts (https / localhost), so fall back to FNV elsewhere.
 */
export async function hashPassword(email: string, password: string): Promise<string> {
  const input = `civicmgl:${normalizeEmail(email)}:${password}`;
  if (globalThis.crypto?.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
    return "sha256:" + Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  return "fnv:" + hash(input).toString(16) + hash(input.split("").reverse().join("")).toString(16);
}

export async function verifyPassword(acc: StoredAccount, password: string): Promise<boolean> {
  return (await hashPassword(acc.email, password)) === acc.password;
}
