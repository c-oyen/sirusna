"use client"

import * as React from "react"
import { toast } from "sonner"
import { DownloadSimpleIcon, PrinterIcon } from "@phosphor-icons/react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { downloadCsv } from "@/lib/csv"
import {
  formatPeriode,
  formatRupiah,
  formatTanggal,
  selisihHari,
  useToday,
} from "@/lib/format"
import {
  findById,
  penghuniNama,
  rusunIdPenghuni,
  rusunNama,
  unitLabel,
} from "@/lib/lookup"
import type { Db } from "@/lib/schemas"
import { useDb } from "@/lib/store"

const JENIS = [
  { value: "penghuni", label: "Laporan Penghuni" },
  { value: "hunian", label: "Laporan Hunian" },
  { value: "pengajuan", label: "Laporan Pengajuan" },
  { value: "keuangan", label: "Laporan Keuangan" },
  { value: "tunggakan", label: "Laporan Tunggakan" },
  { value: "pemeliharaan", label: "Laporan Pemeliharaan" },
] as const

type Jenis = (typeof JENIS)[number]["value"]
type Cell = string | number

interface Filters {
  jenis: Jenis
  rusunId: string
  mulai: string
  akhir: string
}

interface Report {
  title: string
  headers: string[]
  /** Column indexes holding rupiah amounts. */
  money: number[]
  /** Column indexes holding ISO dates (displayed formatted). */
  dates: number[]
  rows: Cell[][]
  summary: { label: string; value: string }[]
}

const inRange = (value: string, f: Filters) =>
  (!f.mulai || value >= f.mulai) && (!f.akhir || value <= f.akhir)

function build(db: Db, f: Filters, today: string): Report {
  const rusunOk = (id: string) => !f.rusunId || id === f.rusunId
  const label = JENIS.find((j) => j.value === f.jenis)?.label ?? "Laporan"
  const sum = (rows: Cell[][], col: number) =>
    rows.reduce((s, r) => s + Number(r[col]), 0)

  switch (f.jenis) {
    case "penghuni": {
      const rows = db.penghuni
        .filter((p) => rusunOk(findById(db, "unit", p.unitId)?.rusunId ?? ""))
        .filter((p) => inRange(p.tanggalMasuk, f))
        .map((p) => [
          p.nama,
          p.nik,
          p.telepon,
          rusunNama(db, findById(db, "unit", p.unitId)?.rusunId),
          unitLabel(db, p.unitId),
          p.tanggalMasuk,
          p.status,
        ])
      return {
        title: label,
        headers: [
          "Nama",
          "NIK",
          "Telepon",
          "Rusun",
          "Unit",
          "Tanggal Masuk",
          "Status",
        ],
        money: [],
        dates: [5],
        rows,
        summary: [
          { label: "Total penghuni", value: String(rows.length) },
          {
            label: "Aktif",
            value: String(rows.filter((r) => r[6] === "Aktif").length),
          },
        ],
      }
    }
    case "hunian": {
      const rows = db.unit
        .filter((u) => rusunOk(u.rusunId))
        .map((u) => [
          rusunNama(db, u.rusunId),
          u.blok,
          u.nomor,
          u.lantai,
          u.kapasitas,
          db.penghuni
            .filter((p) => p.unitId === u.id && p.status === "Aktif")
            .map((p) => p.nama)
            .join(", ") || "-",
          u.status,
        ])
      const dihuni = rows.filter((r) => r[6] === "Dihuni").length
      return {
        title: label,
        headers: [
          "Rusun",
          "Blok",
          "Unit",
          "Lantai",
          "Kapasitas",
          "Penghuni",
          "Status",
        ],
        money: [],
        dates: [],
        rows,
        summary: [
          { label: "Total unit", value: String(rows.length) },
          { label: "Dihuni", value: String(dihuni) },
          {
            label: "Okupansi",
            value: rows.length
              ? `${Math.round((dihuni / rows.length) * 100)}%`
              : "0%",
          },
        ],
      }
    }
    case "pengajuan": {
      const rows = db.pengajuan
        .filter((p) => rusunOk(p.rusunId) && inRange(p.tanggal, f))
        .map((p) => [
          p.nomor,
          p.nama,
          rusunNama(db, p.rusunId),
          p.tanggal,
          p.status,
        ])
      return {
        title: label,
        headers: ["Nomor", "Pemohon", "Rusun Tujuan", "Tanggal", "Status"],
        money: [],
        dates: [3],
        rows,
        summary: [
          { label: "Total pengajuan", value: String(rows.length) },
          {
            label: "Diterima",
            value: String(rows.filter((r) => r[4] === "Diterima").length),
          },
          {
            label: "Ditolak",
            value: String(rows.filter((r) => r[4] === "Ditolak").length),
          },
        ],
      }
    }
    case "keuangan": {
      const rows = db.transaksi
        .filter(
          (t) =>
            rusunOk(rusunIdPenghuni(db, t.penghuniId)) &&
            inRange(t.jatuhTempo, f)
        )
        .map((t) => [
          t.nomor,
          penghuniNama(db, t.penghuniId),
          rusunNama(db, rusunIdPenghuni(db, t.penghuniId)),
          t.periode,
          t.jatuhTempo,
          t.tanggalBayar ?? "",
          t.jumlah,
          t.status,
        ])
      const lunas = rows.filter((r) => r[7] === "Lunas")
      return {
        title: label,
        headers: [
          "Nomor",
          "Penghuni",
          "Rusun",
          "Periode",
          "Jatuh Tempo",
          "Tanggal Bayar",
          "Jumlah",
          "Status",
        ],
        money: [6],
        dates: [4, 5],
        rows,
        summary: [
          { label: "Total tagihan", value: formatRupiah(sum(rows, 6)) },
          { label: "Total pembayaran", value: formatRupiah(sum(lunas, 6)) },
          {
            label: "Belum terbayar",
            value: formatRupiah(sum(rows, 6) - sum(lunas, 6)),
          },
        ],
      }
    }
    case "tunggakan": {
      const rows = db.transaksi
        .filter(
          (t) =>
            t.status !== "Lunas" &&
            !!today &&
            t.jatuhTempo < today &&
            rusunOk(rusunIdPenghuni(db, t.penghuniId)) &&
            inRange(t.jatuhTempo, f)
        )
        .map((t) => [
          t.nomor,
          penghuniNama(db, t.penghuniId),
          rusunNama(db, rusunIdPenghuni(db, t.penghuniId)),
          t.periode,
          t.jatuhTempo,
          selisihHari(t.jatuhTempo, today),
          t.jumlah,
        ])
      return {
        title: label,
        headers: [
          "Nomor",
          "Penghuni",
          "Rusun",
          "Periode",
          "Jatuh Tempo",
          "Terlambat (hari)",
          "Jumlah",
        ],
        money: [6],
        dates: [4],
        rows,
        summary: [
          { label: "Jumlah tagihan", value: String(rows.length) },
          { label: "Total tunggakan", value: formatRupiah(sum(rows, 6)) },
        ],
      }
    }
    case "pemeliharaan": {
      const rows = db.pemeliharaan
        .filter((p) => rusunOk(p.rusunId) && inRange(p.tanggal, f))
        .map((p) => [
          p.nomor,
          rusunNama(db, p.rusunId),
          p.lokasi,
          p.jenis,
          p.tanggal,
          p.petugas,
          p.status,
        ])
      return {
        title: label,
        headers: [
          "Nomor",
          "Rusun",
          "Lokasi",
          "Jenis Kerusakan",
          "Tanggal",
          "Petugas",
          "Status",
        ],
        money: [],
        dates: [4],
        rows,
        summary: [
          { label: "Total laporan", value: String(rows.length) },
          {
            label: "Selesai",
            value: String(rows.filter((r) => r[6] === "Selesai").length),
          },
        ],
      }
    }
  }
}

export function ReportView() {
  const db = useDb()
  const today = useToday()
  const [form, setForm] = React.useState<Filters>({
    jenis: "keuangan",
    rusunId: "",
    mulai: "",
    akhir: "",
  })
  const [applied, setApplied] = React.useState<Filters | null>(null)
  const [error, setError] = React.useState("")

  const report = React.useMemo(
    () => (applied ? build(db, applied, today) : null),
    [db, applied, today]
  )

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (form.mulai && form.akhir && form.mulai > form.akhir) {
      setError("Tanggal mulai tidak boleh melebihi tanggal akhir.")
      return
    }
    setError("")
    setApplied(form)
  }

  function exportCsv() {
    if (!report) return
    downloadCsv(
      `${applied?.jenis ?? "laporan"}-${today || "data"}.csv`,
      report.headers,
      report.rows
    )
    toast.success("Laporan diekspor")
  }

  const show = (c: Cell, i: number) => {
    if (report?.money.includes(i)) return formatRupiah(Number(c))
    if (report?.dates.includes(i)) return formatTanggal(String(c))
    if (report && report.headers[i] === "Periode")
      return formatPeriode(String(c))
    return c
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan"
        description="Buat dan ekspor laporan operasional rusun."
      />

      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={submit}
            className="grid gap-4 sm:grid-cols-2"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="jenis">Jenis Laporan</Label>
              <NativeSelect
                id="jenis"
                value={form.jenis}
                onChange={(e) =>
                  setForm({ ...form, jenis: e.target.value as Jenis })
                }
              >
                {JENIS.map((j) => (
                  <option key={j.value} value={j.value}>
                    {j.label}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rusun">Rusun</Label>
              <NativeSelect
                id="rusun"
                value={form.rusunId}
                onChange={(e) => setForm({ ...form, rusunId: e.target.value })}
              >
                <option value="">Semua Rusun</option>
                {db.rusun.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nama}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mulai">Tanggal Mulai</Label>
              <Input
                id="mulai"
                type="date"
                value={form.mulai}
                onChange={(e) => setForm({ ...form, mulai: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="akhir">Tanggal Akhir</Label>
              <Input
                id="akhir"
                type="date"
                value={form.akhir}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "laporan-error" : undefined}
                onChange={(e) => setForm({ ...form, akhir: e.target.value })}
              />
              {error ? (
                <p
                  id="laporan-error"
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {error}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <Button type="submit">Tampilkan Laporan</Button>
              <Button
                type="button"
                variant="outline"
                onClick={exportCsv}
                disabled={!report || !report.rows.length}
              >
                <DownloadSimpleIcon />
                Ekspor CSV
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.print()}
                disabled={!report}
              >
                <PrinterIcon />
                Cetak
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{report ? report.title : "Hasil Laporan"}</CardTitle>
          {report ? (
            <CardDescription>
              {report.rows.length} baris
              {applied?.rusunId
                ? ` · ${rusunNama(db, applied.rusunId)}`
                : " · Semua rusun"}
              {applied?.mulai ? ` · dari ${formatTanggal(applied.mulai)}` : ""}
              {applied?.akhir
                ? ` · sampai ${formatTanggal(applied.akhir)}`
                : ""}
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          {!report ? (
            <p className="text-sm text-muted-foreground">
              Pilih filter lalu klik “Tampilkan Laporan”.
            </p>
          ) : (
            <>
              <dl className="grid gap-3 sm:grid-cols-3">
                {report.summary.map((s) => (
                  <div key={s.label} className="rounded-lg border p-3">
                    <dt className="text-xs text-muted-foreground">{s.label}</dt>
                    <dd className="text-lg font-semibold tabular-nums">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">No</TableHead>
                      {report.headers.map((h, i) => (
                        <TableHead
                          key={h}
                          className={
                            report.money.includes(i) ? "text-right" : ""
                          }
                        >
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.rows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={report.headers.length + 1}
                          className="h-24 text-center text-muted-foreground"
                        >
                          Tidak ada data untuk filter ini.
                        </TableCell>
                      </TableRow>
                    ) : (
                      report.rows.map((row, ri) => (
                        <TableRow key={ri}>
                          <TableCell className="text-muted-foreground">
                            {ri + 1}
                          </TableCell>
                          {row.map((c, ci) => (
                            <TableCell
                              key={ci}
                              className={
                                report.money.includes(ci)
                                  ? "text-right tabular-nums"
                                  : ""
                              }
                            >
                              {show(c, ci)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
