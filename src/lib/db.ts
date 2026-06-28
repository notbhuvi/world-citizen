import { openDB, type IDBPDatabase } from "idb";

export interface BookmarkRecord {
  id: string;
  section: string;
  title: string;
  subtitle?: string;
  href?: string;
  createdAt?: number;
}

export interface SettingRecord {
  key: string;
  value: unknown;
}

export interface CacheRecord {
  key: string;
  data: unknown;
  updatedAt: number;
}

const DB_NAME = "world-citizen";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (typeof window === "undefined") return null;
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("bookmarks")) {
          db.createObjectStore("bookmarks", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" });
        }
        if (!db.objectStoreNames.contains("cache")) {
          db.createObjectStore("cache", { keyPath: "key" });
        }
      },
    });
  }
  return dbPromise;
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const db = await getDb();
  if (!db) return fallback;
  const record = (await db.get("settings", key)) as SettingRecord | undefined;
  return record ? (record.value as T) : fallback;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.put("settings", { key, value });
}

export async function listBookmarks(): Promise<BookmarkRecord[]> {
  const db = await getDb();
  if (!db) return [];
  return (await db.getAll("bookmarks")) as BookmarkRecord[];
}

export async function isBookmarked(id: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  return Boolean(await db.get("bookmarks", id));
}

export async function toggleBookmark(record: BookmarkRecord): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const existing = await db.get("bookmarks", record.id);
  if (existing) {
    await db.delete("bookmarks", record.id);
    return false;
  }
  await db.put("bookmarks", { ...record, createdAt: record.createdAt ?? Date.now() });
  return true;
}

export async function removeBookmark(id: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete("bookmarks", id);
}

export async function getCache<T>(key: string, maxAgeMs?: number): Promise<T | null> {
  const db = await getDb();
  if (!db) return null;
  const record = (await db.get("cache", key)) as CacheRecord | undefined;
  if (!record) return null;
  if (maxAgeMs && Date.now() - record.updatedAt > maxAgeMs) return null;
  return record.data as T;
}

export async function setCache(key: string, data: unknown): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.put("cache", { key, data, updatedAt: Date.now() });
}
