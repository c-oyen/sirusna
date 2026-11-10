import { useSyncExternalStore } from "react"

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
})

const tanggalFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

const periodeFmt = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

const bulanSingkat = new Intl.DateTimeFormat("id-ID", {
  month: "short",
  timeZone: "UTC",
})

export function formatRupiah(value: number): string {
  return rupiah.format(value)
}

function parseISO(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(value)
  if (!m) return null
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3] ?? 1)))
}

/** "2026-11-09" -> "9 Nov 2026". Timezone-independent (no off-by-one days). */
export function formatTanggal(value: string | undefined): string {
  if (!value) return "-"
  const d = parseISO(value)
  return d ? tanggalFmt.format(d) : value
}

/** "2026-11" -> "November 2026" */
export function formatPeriode(value: string): string {
  const d = parseISO(value)
  return d ? periodeFmt.format(d) : value
}

/** "2026-11" -> "Nov" */
export function namaBulanSingkat(value: string): string {
  const d = parseISO(value)
  return d ? bulanSingkat.format(d) : value
}

/** Local calendar date as YYYY-MM-DD. */
export function todayISO(): string {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${mm}-${dd}`
}

/** Whole days from `from` to `to` (both YYYY-MM-DD). Negative when `to` is earlier. */
export function selisihHari(from: string, to: string): number {
  const a = parseISO(from)
  const b = parseISO(to)
  if (!a || !b) return 0
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

/** Adds `months` to a YYYY-MM period. */
export function geserPeriode(value: string, months: number): string {
  const d = parseISO(value)
  if (!d) return value
  d.setUTCMonth(d.getUTCMonth() + months)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`
}

const noopSubscribe = () => () => {}

/**
 * Today's date on the client, "" during SSR/hydration. Returning "" on the
 * server avoids hydration mismatches caused by timezone differences; callers
 * treat "" as "not known yet".
 */
export function useToday(): string {
  return useSyncExternalStore(noopSubscribe, todayISO, () => "")
}
