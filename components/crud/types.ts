import type { ReactNode } from "react"

import type { Db, ListKey } from "@/lib/schemas"

/** Loosely typed row used by the generic engine. */
export type Row = { id: string; nomor?: string } & Record<
  string,
  string | number | undefined
>

export type FieldType =
  | "text"
  | "number"
  | "date"
  | "month"
  | "time"
  | "email"
  | "tel"
  | "select"
  | "textarea"

export interface FieldDef {
  name: string
  label: string
  type: FieldType
  /** Static options for `select`. */
  options?: readonly string[]
  /** Options taken from another collection. */
  relation?: {
    entity: ListKey
    label: (row: Row, db: Db) => string
    optional?: boolean
    filter?: (row: Row, db: Db, values: Record<string, string>) => boolean
  }
  /** Allow an empty choice for static selects. */
  optional?: boolean
  required?: boolean
  placeholder?: string
  wide?: boolean
  inputMode?: "text" | "numeric" | "tel" | "email" | "decimal"
  maxLength?: number
}

export interface ColumnDef<R = Row> {
  header: string
  /** Plain value: used for sorting and CSV export. */
  value: (row: R, db: Db) => string | number
  /** Optional rich rendering; defaults to `value`. */
  cell?: (row: R, db: Db) => ReactNode
  align?: "right"
}

export interface FilterDef<R = Row> {
  name: string
  label: string
  options: readonly string[] | ((db: Db) => string[])
  value: (row: R, db: Db) => string
}

export interface RowAction<R = Row> {
  label: string
  show: (row: R) => boolean
  patch: (row: R, today: string) => Record<string, string | number>
  message: string
}

export interface EntityConfig<R = Row> {
  key: ListKey
  title: string
  description: string
  singular: string
  addLabel: string
  searchPlaceholder: string
  emptyText: string
  fields: FieldDef[]
  columns: ColumnDef<R>[]
  search: (row: R, db: Db) => string
  filters?: FilterDef<R>[]
  actions?: RowAction<R>[]
  /** Blocks deletion while other records still reference this one. */
  dependents?: { entity: ListKey; field: string; label: string }[]
  /** Extra business validation. Return field -> message. */
  validate?: (
    values: Record<string, unknown>,
    db: Db,
    existingId?: string
  ) => Record<string, string>
  defaults?: (today: string, db: Db) => Record<string, string>
  summary?: (rows: R[], db: Db, today: string) => ReactNode
}

type Typed<K extends ListKey> = Db[K][number]

/** Type-safe authoring helper; erases the row type for the generic engine. */
export function defineEntity<K extends ListKey>(
  def: EntityConfig<Typed<K>> & { key: K }
): EntityConfig {
  return def as unknown as EntityConfig
}
