import { useSyncExternalStore } from "react"

import { todayISO } from "@/lib/format"
import { dbSchema, type Db, type ListKey } from "@/lib/schemas"
import { seed } from "@/lib/seed"

/**
 * Client-side persistence layer.
 *
 * The whole database lives in one localStorage entry and is exposed through
 * `useSyncExternalStore`, so every component stays in sync (also across tabs)
 * and server rendering/hydration always sees the stable `seed` snapshot.
 * Swapping this module for real API calls is the only change needed to move
 * to a backend: components only use `useDb` and the helpers below.
 */

const STORAGE_KEY = "sirusna:db:v1"

type Row = { id: string; nomor?: string }
export type NewRow<K extends ListKey> = Omit<Db[K][number], "id" | "nomor">

let cache: Db | null = null
const listeners = new Set<() => void>()

function load(): Db {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = dbSchema.safeParse(JSON.parse(raw))
      if (parsed.success) return parsed.data
    }
  } catch {
    // corrupted or unavailable storage: fall back to seed data
  }
  return seed
}

function getSnapshot(): Db {
  if (cache === null) cache = load()
  return cache
}

function getServerSnapshot(): Db {
  return seed
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      cache = null
      listener()
    }
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

function commit(next: Db) {
  cache = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // storage full/blocked: keep working in memory for this session
  }
  listeners.forEach((l) => l())
}

export function useDb(): Db {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** Non-reactive read, for event handlers. */
export function readDb(): Db {
  return getSnapshot()
}

function uid(prefix: string): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  return `${prefix}-${rand}`
}

const NOMOR_PREFIX: Partial<Record<ListKey, string>> = {
  pengajuan: "PGJ",
  kontrak: "KTR",
  transaksi: "TRX",
  pemeliharaan: "PML",
  pengaduan: "PGD",
  inspeksi: "INS",
}

function nextNomor(prefix: string, rows: Row[]): string {
  const year = todayISO().slice(0, 4)
  const pattern = new RegExp(`^${prefix}-${year}-(\\d+)$`)
  let max = 0
  for (const r of rows) {
    const m = r.nomor ? pattern.exec(r.nomor) : null
    if (m) max = Math.max(max, Number(m[1]))
  }
  return `${prefix}-${year}-${String(max + 1).padStart(4, "0")}`
}

export function insertRow<K extends ListKey>(key: K, input: NewRow<K>) {
  const db = getSnapshot()
  const rows = db[key] as unknown as Row[]
  const prefix = NOMOR_PREFIX[key]
  const row: Row = {
    ...(input as object),
    id: uid(key),
    ...(prefix ? { nomor: nextNomor(prefix, rows) } : {}),
  }
  commit({ ...db, [key]: [row, ...rows] } as Db)
}

export function updateRow<K extends ListKey>(
  key: K,
  id: string,
  patch: Partial<NewRow<K>>
) {
  const db = getSnapshot()
  const rows = db[key] as unknown as Row[]
  commit({
    ...db,
    [key]: rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
  } as Db)
}

export function removeRow(key: ListKey, id: string) {
  const db = getSnapshot()
  const rows = db[key] as unknown as Row[]
  commit({ ...db, [key]: rows.filter((r) => r.id !== id) } as Db)
}

export function saveSettings(settings: Db["settings"]) {
  commit({ ...getSnapshot(), settings })
}

export function markNotificationsRead(ids: string[]) {
  const db = getSnapshot()
  commit({ ...db, dibaca: Array.from(new Set([...db.dibaca, ...ids])) })
}

/** Replace the whole database after validating it. Returns false if invalid. */
export function restoreDb(json: unknown): boolean {
  const parsed = dbSchema.safeParse(json)
  if (!parsed.success) return false
  commit(parsed.data)
  return true
}

export function resetDb() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  cache = seed
  listeners.forEach((l) => l())
}
