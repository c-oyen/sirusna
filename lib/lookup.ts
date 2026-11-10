import type { Db, ListKey } from "@/lib/schemas"

export function findById<K extends ListKey>(
  db: Db,
  key: K,
  id: string | undefined
): Db[K][number] | undefined {
  if (!id) return undefined
  const rows = db[key] as unknown as { id: string }[]
  return rows.find((r) => r.id === id) as Db[K][number] | undefined
}

export function rusunNama(db: Db, id: string | undefined): string {
  return findById(db, "rusun", id)?.nama ?? "-"
}

export function unitLabel(db: Db, id: string | undefined): string {
  const u = findById(db, "unit", id)
  return u ? u.nomor : "-"
}

export function unitLabelLengkap(db: Db, id: string | undefined): string {
  const u = findById(db, "unit", id)
  return u ? `${rusunNama(db, u.rusunId)} · ${u.nomor}` : "-"
}

export function penghuniNama(db: Db, id: string | undefined): string {
  return findById(db, "penghuni", id)?.nama ?? "-"
}

/** The rusun a penghuni currently lives in (via their unit). */
export function rusunIdPenghuni(db: Db, penghuniId: string): string {
  const p = findById(db, "penghuni", penghuniId)
  return findById(db, "unit", p?.unitId)?.rusunId ?? ""
}
