"use client"

import { StatusBadge } from "@/components/status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { defineEntity, type EntityConfig } from "@/components/crud/types"
import { formatPeriode, formatRupiah, formatTanggal } from "@/lib/format"
import {
  penghuniNama,
  rusunNama,
  unitLabel,
  unitLabelLengkap,
  findById,
} from "@/lib/lookup"
import {
  HASIL_INSPEKSI,
  JENIS_KELAMIN,
  KATEGORI_DOKUMEN,
  KATEGORI_PENGADUAN,
  KONDISI_INSPEKSI,
  METODE_BAYAR,
  PRIORITAS,
  ROLE_USER,
  STATUS_JADWAL,
  STATUS_KONTRAK,
  STATUS_PEMELIHARAAN,
  STATUS_PENGADUAN,
  STATUS_PENGAJUAN,
  STATUS_PENGHUNI,
  STATUS_RUSUN,
  STATUS_TRANSAKSI,
  STATUS_UNIT,
  STATUS_USER,
} from "@/lib/schemas"

const badge = (v: string) => <StatusBadge status={v} />
const tgl = (v: string | undefined) => formatTanggal(v)

/** Relation options shared by several forms. */
const relRusun = {
  entity: "rusun" as const,
  label: (r: { nama?: string | number }) => String(r.nama),
}
const relPenghuni = {
  entity: "penghuni" as const,
  label: (r: { nama?: string | number }) => String(r.nama),
}

/* -------------------------------------------------------------------------- */

const rusun = defineEntity<"rusun">({
  key: "rusun",
  title: "Data Rusun",
  description: "Kelola data rumah susun, lokasi, dan jumlah lantai.",
  singular: "Rusun",
  addLabel: "Tambah Rusun",
  searchPlaceholder: "Cari nama rusun atau alamat…",
  emptyText: "Belum ada data rusun.",
  fields: [
    {
      name: "nama",
      label: "Nama Rusun",
      type: "text",
      required: true,
      wide: true,
    },
    {
      name: "alamat",
      label: "Alamat",
      type: "textarea",
      required: true,
      wide: true,
    },
    {
      name: "jumlahLantai",
      label: "Jumlah Lantai",
      type: "number",
      required: true,
      inputMode: "numeric",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: STATUS_RUSUN,
      required: true,
    },
  ],
  columns: [
    { header: "Nama Rusun", value: (r) => r.nama },
    { header: "Alamat", value: (r) => r.alamat },
    { header: "Lantai", value: (r) => r.jumlahLantai },
    {
      header: "Jumlah Unit",
      value: (r, db) => db.unit.filter((u) => u.rusunId === r.id).length,
    },
    { header: "Status", value: (r) => r.status, cell: (r) => badge(r.status) },
  ],
  search: (r) => `${r.nama} ${r.alamat}`,
  filters: [
    {
      name: "status",
      label: "Semua Status",
      options: STATUS_RUSUN,
      value: (r) => r.status,
    },
  ],
  dependents: [
    { entity: "unit", field: "rusunId", label: "unit hunian" },
    { entity: "pengajuan", field: "rusunId", label: "pengajuan" },
    { entity: "pemeliharaan", field: "rusunId", label: "pemeliharaan" },
    { entity: "user", field: "rusunId", label: "pengguna" },
  ],
  validate: (v, db, id) =>
    db.rusun.some(
      (r) =>
        r.id !== id && r.nama.toLowerCase() === String(v.nama).toLowerCase()
    )
      ? { nama: "Nama rusun sudah digunakan" }
      : {},
})

const unit = defineEntity<"unit">({
  key: "unit",
  title: "Unit Hunian",
  description: "Kelola unit, kamar, dan ketersediaan hunian.",
  singular: "Unit",
  addLabel: "Tambah Unit",
  searchPlaceholder: "Cari nomor unit, blok, atau rusun…",
  emptyText: "Belum ada data unit.",
  fields: [
    {
      name: "rusunId",
      label: "Rusun",
      type: "select",
      relation: relRusun,
      required: true,
      wide: true,
    },
    {
      name: "blok",
      label: "Blok",
      type: "text",
      required: true,
      maxLength: 10,
    },
    {
      name: "lantai",
      label: "Lantai",
      type: "number",
      required: true,
      inputMode: "numeric",
    },
    {
      name: "nomor",
      label: "Nomor Unit",
      type: "text",
      required: true,
      maxLength: 20,
      placeholder: "A-101",
    },
    {
      name: "kapasitas",
      label: "Kapasitas (orang)",
      type: "number",
      required: true,
      inputMode: "numeric",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: STATUS_UNIT,
      required: true,
      wide: true,
    },
  ],
  columns: [
    { header: "Rusun", value: (r, db) => rusunNama(db, r.rusunId) },
    { header: "Blok", value: (r) => r.blok },
    { header: "Lantai", value: (r) => r.lantai },
    { header: "Nomor Unit", value: (r) => r.nomor },
    { header: "Kapasitas", value: (r) => r.kapasitas },
    {
      header: "Penghuni",
      value: (r, db) =>
        db.penghuni
          .filter((p) => p.unitId === r.id && p.status === "Aktif")
          .map((p) => p.nama)
          .join(", ") || "-",
    },
    { header: "Status", value: (r) => r.status, cell: (r) => badge(r.status) },
  ],
  search: (r, db) => `${r.nomor} ${r.blok} ${rusunNama(db, r.rusunId)}`,
  filters: [
    {
      name: "rusun",
      label: "Semua Rusun",
      options: (db) => db.rusun.map((x) => x.nama),
      value: (r, db) => rusunNama(db, r.rusunId),
    },
    {
      name: "status",
      label: "Semua Status",
      options: STATUS_UNIT,
      value: (r) => r.status,
    },
  ],
  dependents: [
    { entity: "penghuni", field: "unitId", label: "penghuni" },
    { entity: "kontrak", field: "unitId", label: "kontrak" },
    { entity: "inspeksi", field: "unitId", label: "inspeksi" },
  ],
  validate: (v, db, id) =>
    db.unit.some(
      (u) =>
        u.id !== id &&
        u.rusunId === v.rusunId &&
        u.nomor.toLowerCase() === String(v.nomor).toLowerCase()
    )
      ? { nomor: "Nomor unit sudah ada di rusun ini" }
      : {},
})

const penghuni = defineEntity<"penghuni">({
  key: "penghuni",
  title: "Data Penghuni",
  description: "Kelola data penghuni dan unit yang ditempati.",
  singular: "Penghuni",
  addLabel: "Tambah Penghuni",
  searchPlaceholder: "Cari nama atau NIK…",
  emptyText: "Belum ada data penghuni.",
  fields: [
    {
      name: "nik",
      label: "NIK",
      type: "text",
      required: true,
      inputMode: "numeric",
      maxLength: 16,
    },
    { name: "nama", label: "Nama Lengkap", type: "text", required: true },
    {
      name: "jenisKelamin",
      label: "Jenis Kelamin",
      type: "select",
      options: JENIS_KELAMIN,
      required: true,
    },
    {
      name: "telepon",
      label: "Telepon",
      type: "tel",
      required: true,
      inputMode: "tel",
      placeholder: "0812…",
    },
    { name: "email", label: "Email", type: "email" },
    { name: "pekerjaan", label: "Pekerjaan", type: "text" },
    {
      name: "unitId",
      label: "Unit Hunian",
      type: "select",
      relation: {
        entity: "unit",
        label: (r, db) => unitLabelLengkap(db, r.id),
        optional: true,
      },
    },
    {
      name: "tanggalMasuk",
      label: "Tanggal Masuk",
      type: "date",
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: STATUS_PENGHUNI,
      required: true,
    },
  ],
  columns: [
    { header: "NIK", value: (r) => r.nik },
    { header: "Nama Lengkap", value: (r) => r.nama },
    { header: "Jenis Kelamin", value: (r) => r.jenisKelamin },
    { header: "Telepon", value: (r) => r.telepon },
    {
      header: "Rusun",
      value: (r, db) => rusunNama(db, findById(db, "unit", r.unitId)?.rusunId),
    },
    { header: "Unit", value: (r, db) => unitLabel(db, r.unitId) },
    { header: "Status", value: (r) => r.status, cell: (r) => badge(r.status) },
  ],
  search: (r) => `${r.nama} ${r.nik} ${r.telepon}`,
  filters: [
    {
      name: "status",
      label: "Semua Status",
      options: STATUS_PENGHUNI,
      value: (r) => r.status,
    },
  ],
  dependents: [
    { entity: "kontrak", field: "penghuniId", label: "kontrak" },
    { entity: "transaksi", field: "penghuniId", label: "transaksi" },
    { entity: "pengaduan", field: "penghuniId", label: "pengaduan" },
  ],
  defaults: (today) => ({ tanggalMasuk: today }),
  validate: (v, db, id) => {
    const errors: Record<string, string> = {}
    if (db.penghuni.some((p) => p.id !== id && p.nik === v.nik)) {
      errors.nik = "NIK sudah terdaftar"
    }
    if (
      v.unitId &&
      v.status === "Aktif" &&
      db.penghuni.some(
        (p) => p.id !== id && p.unitId === v.unitId && p.status === "Aktif"
      )
    ) {
      errors.unitId = "Unit sudah ditempati penghuni aktif lain"
    }
    return errors
  },
})

const pengajuan = defineEntity<"pengajuan">({
  key: "pengajuan",
  title: "Pengajuan Rusun",
  description: "Verifikasi dan proses pengajuan hunian rusun.",
  singular: "Pengajuan",
  addLabel: "Tambah Pengajuan",
  searchPlaceholder: "Cari nama pemohon, NIK, atau nomor…",
  emptyText: "Belum ada pengajuan.",
  fields: [
    { name: "nama", label: "Nama Pemohon", type: "text", required: true },
    {
      name: "nik",
      label: "NIK",
      type: "text",
      required: true,
      inputMode: "numeric",
      maxLength: 16,
    },
    {
      name: "telepon",
      label: "Telepon",
      type: "tel",
      required: true,
      inputMode: "tel",
    },
    {
      name: "rusunId",
      label: "Rusun Tujuan",
      type: "select",
      relation: relRusun,
      required: true,
    },
    {
      name: "tanggal",
      label: "Tanggal Pengajuan",
      type: "date",
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: STATUS_PENGAJUAN,
      required: true,
    },
    { name: "catatan", label: "Catatan", type: "textarea", wide: true },
  ],
  columns: [
    { header: "Nomor", value: (r) => r.nomor },
    { header: "Nama Pemohon", value: (r) => r.nama },
    { header: "NIK", value: (r) => r.nik },
    { header: "Rusun Tujuan", value: (r, db) => rusunNama(db, r.rusunId) },
    { header: "Tanggal", value: (r) => r.tanggal, cell: (r) => tgl(r.tanggal) },
    { header: "Status", value: (r) => r.status, cell: (r) => badge(r.status) },
  ],
  search: (r) => `${r.nomor} ${r.nama} ${r.nik}`,
  filters: [
    {
      name: "status",
      label: "Semua Status",
      options: STATUS_PENGAJUAN,
      value: (r) => r.status,
    },
  ],
  actions: [
    {
      label: "Verifikasi",
      show: (r) => r.status === "Menunggu",
      patch: () => ({ status: "Diverifikasi" }),
      message: "Pengajuan diverifikasi",
    },
    {
      label: "Terima",
      show: (r) => r.status === "Menunggu" || r.status === "Diverifikasi",
      patch: () => ({ status: "Diterima" }),
      message: "Pengajuan diterima",
    },
    {
      label: "Tolak",
      show: (r) => r.status === "Menunggu" || r.status === "Diverifikasi",
      patch: () => ({ status: "Ditolak" }),
      message: "Pengajuan ditolak",
    },
  ],
  defaults: (today) => ({ tanggal: today }),
})

const kontrak = defineEntity<"kontrak">({
  key: "kontrak",
  title: "Kontrak Sewa",
  description: "Kelola kontrak sewa penghuni dan masa berlakunya.",
  singular: "Kontrak",
  addLabel: "Tambah Kontrak",
  searchPlaceholder: "Cari nomor kontrak atau penghuni…",
  emptyText: "Belum ada kontrak.",
  fields: [
    {
      name: "penghuniId",
      label: "Penghuni",
      type: "select",
      relation: relPenghuni,
      required: true,
    },
    {
      name: "unitId",
      label: "Unit",
      type: "select",
      relation: {
        entity: "unit",
        label: (r, db) => unitLabelLengkap(db, r.id),
      },
      required: true,
    },
    {
      name: "tanggalMulai",
      label: "Tanggal Mulai",
      type: "date",
      required: true,
    },
    {
      name: "tanggalBerakhir",
      label: "Tanggal Berakhir",
      type: "date",
      required: true,
    },
    {
      name: "tarif",
      label: "Tarif Sewa / Bulan (Rp)",
      type: "number",
      required: true,
      inputMode: "numeric",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: STATUS_KONTRAK,
      required: true,
    },
  ],
  columns: [
    { header: "Nomor", value: (r) => r.nomor },
    { header: "Penghuni", value: (r, db) => penghuniNama(db, r.penghuniId) },
    {
      header: "Rusun",
      value: (r, db) => rusunNama(db, findById(db, "unit", r.unitId)?.rusunId),
    },
    { header: "Unit", value: (r, db) => unitLabel(db, r.unitId) },
    {
      header: "Mulai",
      value: (r) => r.tanggalMulai,
      cell: (r) => tgl(r.tanggalMulai),
    },
    {
      header: "Berakhir",
      value: (r) => r.tanggalBerakhir,
      cell: (r) => tgl(r.tanggalBerakhir),
    },
    { header: "Status", value: (r) => r.status, cell: (r) => badge(r.status) },
  ],
  search: (r, db) => `${r.nomor} ${penghuniNama(db, r.penghuniId)}`,
  filters: [
    {
      name: "status",
      label: "Semua Status",
      options: STATUS_KONTRAK,
      value: (r) => r.status,
    },
  ],
  actions: [
    {
      label: "Akhiri Kontrak",
      show: (r) => r.status !== "Berakhir",
      patch: () => ({ status: "Berakhir" }),
      message: "Kontrak diakhiri",
    },
  ],
  defaults: (today, db) => ({
    tanggalMulai: today,
    tanggalBerakhir: `${Number(today.slice(0, 4)) + 1}${today.slice(4)}`,
    tarif: String(db.settings.tarif),
  }),
  validate: (v) =>
    String(v.tanggalBerakhir) <= String(v.tanggalMulai)
      ? { tanggalBerakhir: "Harus setelah tanggal mulai" }
      : {},
})

const transaksi = defineEntity<"transaksi">({
  key: "transaksi",
  title: "Tagihan & Transaksi",
  description: "Kelola tagihan sewa dan pembayaran penghuni.",
  singular: "Transaksi",
  addLabel: "Tambah Transaksi",
  searchPlaceholder: "Cari nomor transaksi atau penghuni…",
  emptyText: "Belum ada transaksi.",
  fields: [
    {
      name: "penghuniId",
      label: "Penghuni",
      type: "select",
      relation: { ...relPenghuni, filter: (r) => r.status === "Aktif" },
      required: true,
      wide: true,
    },
    { name: "periode", label: "Periode", type: "month", required: true },
    {
      name: "jumlah",
      label: "Jumlah (Rp)",
      type: "number",
      required: true,
      inputMode: "numeric",
    },
    { name: "jatuhTempo", label: "Jatuh Tempo", type: "date", required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: STATUS_TRANSAKSI,
      required: true,
    },
    { name: "tanggalBayar", label: "Tanggal Bayar", type: "date" },
    {
      name: "metode",
      label: "Metode Pembayaran",
      type: "select",
      options: METODE_BAYAR,
      optional: true,
    },
  ],
  columns: [
    { header: "Nomor", value: (r) => r.nomor },
    { header: "Penghuni", value: (r, db) => penghuniNama(db, r.penghuniId) },
    {
      header: "Unit",
      value: (r, db) =>
        unitLabel(db, findById(db, "penghuni", r.penghuniId)?.unitId),
    },
    {
      header: "Periode",
      value: (r) => r.periode,
      cell: (r) => formatPeriode(r.periode),
    },
    {
      header: "Tanggal Bayar",
      value: (r) => r.tanggalBayar,
      cell: (r) => tgl(r.tanggalBayar),
    },
    {
      header: "Jumlah",
      align: "right",
      value: (r) => r.jumlah,
      cell: (r) => formatRupiah(r.jumlah),
    },
    { header: "Status", value: (r) => r.status, cell: (r) => badge(r.status) },
  ],
  search: (r, db) => `${r.nomor} ${penghuniNama(db, r.penghuniId)}`,
  filters: [
    {
      name: "status",
      label: "Semua Status",
      options: STATUS_TRANSAKSI,
      value: (r) => r.status,
    },
  ],
  actions: [
    {
      label: "Tandai Lunas",
      show: (r) => r.status !== "Lunas",
      patch: (r, today) => ({
        status: "Lunas",
        tanggalBayar: today,
        metode: r.metode || "Tunai",
      }),
      message: "Transaksi ditandai lunas",
    },
  ],
  defaults: (today, db) => {
    const periode = today.slice(0, 7)
    return {
      periode,
      jumlah: String(db.settings.tarif),
      jatuhTempo: `${periode}-${String(db.settings.jatuhTempo).padStart(2, "0")}`,
    }
  },
  validate: (v) => {
    const errors: Record<string, string> = {}
    if (v.status === "Lunas") {
      if (!v.tanggalBayar)
        errors.tanggalBayar = "Wajib diisi untuk status Lunas"
      if (!v.metode) errors.metode = "Wajib dipilih untuk status Lunas"
    }
    return errors
  },
  summary: (rows, _db, today) => {
    const total = rows.reduce((s, r) => s + r.jumlah, 0)
    const bayar = rows
      .filter((r) => r.status === "Lunas")
      .reduce((s, r) => s + r.jumlah, 0)
    const tunggak = today
      ? rows
          .filter((r) => r.status !== "Lunas" && r.jatuhTempo < today)
          .reduce((s, r) => s + r.jumlah, 0)
      : 0
    const items = [
      { title: "Total Tagihan", value: total, hint: `${rows.length} tagihan` },
      { title: "Total Pembayaran", value: bayar, hint: "Status lunas" },
      { title: "Total Tunggakan", value: tunggak, hint: "Lewat jatuh tempo" },
    ]
    return (
      <section aria-label="Ringkasan" className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardDescription>{item.title}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {formatRupiah(item.value)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              {item.hint}
            </CardContent>
          </Card>
        ))}
      </section>
    )
  },
})

const pemeliharaan = defineEntity<"pemeliharaan">({
  key: "pemeliharaan",
  title: "Pemeliharaan",
  description: "Pantau laporan kerusakan dan pekerjaan perbaikan.",
  singular: "Laporan",
  addLabel: "Tambah Laporan",
  searchPlaceholder: "Cari nomor, lokasi, atau jenis kerusakan…",
  emptyText: "Belum ada laporan pemeliharaan.",
  fields: [
    {
      name: "rusunId",
      label: "Rusun",
      type: "select",
      relation: relRusun,
      required: true,
    },
    {
      name: "lokasi",
      label: "Lokasi",
      type: "text",
      required: true,
      placeholder: "Blok A Lantai 2",
    },
    {
      name: "jenis",
      label: "Jenis Kerusakan",
      type: "text",
      required: true,
      wide: true,
    },
    { name: "tanggal", label: "Tanggal", type: "date", required: true },
    { name: "petugas", label: "Petugas", type: "text", required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: STATUS_PEMELIHARAAN,
      required: true,
      wide: true,
    },
    { name: "catatan", label: "Catatan", type: "textarea", wide: true },
  ],
  columns: [
    { header: "Nomor", value: (r) => r.nomor },
    { header: "Rusun", value: (r, db) => rusunNama(db, r.rusunId) },
    { header: "Lokasi", value: (r) => r.lokasi },
    { header: "Jenis Kerusakan", value: (r) => r.jenis },
    { header: "Tanggal", value: (r) => r.tanggal, cell: (r) => tgl(r.tanggal) },
    { header: "Petugas", value: (r) => r.petugas },
    { header: "Status", value: (r) => r.status, cell: (r) => badge(r.status) },
  ],
  search: (r) => `${r.nomor} ${r.lokasi} ${r.jenis} ${r.petugas}`,
  filters: [
    {
      name: "status",
      label: "Semua Status",
      options: STATUS_PEMELIHARAAN,
      value: (r) => r.status,
    },
  ],
  actions: [
    {
      label: "Proses",
      show: (r) => r.status === "Diajukan",
      patch: () => ({ status: "Diproses" }),
      message: "Laporan diproses",
    },
    {
      label: "Tandai Selesai",
      show: (r) => r.status !== "Selesai",
      patch: () => ({ status: "Selesai" }),
      message: "Pekerjaan selesai",
    },
  ],
  defaults: (today) => ({ tanggal: today }),
})

const pengaduan = defineEntity<"pengaduan">({
  key: "pengaduan",
  title: "Pengaduan",
  description: "Tindak lanjuti pengaduan dari penghuni.",
  singular: "Pengaduan",
  addLabel: "Tambah Pengaduan",
  searchPlaceholder: "Cari nomor, judul, atau penghuni…",
  emptyText: "Belum ada pengaduan.",
  fields: [
    {
      name: "penghuniId",
      label: "Penghuni",
      type: "select",
      relation: relPenghuni,
      required: true,
    },
    { name: "judul", label: "Judul", type: "text", required: true },
    {
      name: "kategori",
      label: "Kategori",
      type: "select",
      options: KATEGORI_PENGADUAN,
      required: true,
    },
    {
      name: "prioritas",
      label: "Prioritas",
      type: "select",
      options: PRIORITAS,
      required: true,
    },
    { name: "tanggal", label: "Tanggal", type: "date", required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: STATUS_PENGADUAN,
      required: true,
    },
    { name: "deskripsi", label: "Deskripsi", type: "textarea", wide: true },
  ],
  columns: [
    { header: "Nomor", value: (r) => r.nomor },
    { header: "Penghuni", value: (r, db) => penghuniNama(db, r.penghuniId) },
    { header: "Judul", value: (r) => r.judul },
    { header: "Kategori", value: (r) => r.kategori },
    { header: "Tanggal", value: (r) => r.tanggal, cell: (r) => tgl(r.tanggal) },
    {
      header: "Prioritas",
      value: (r) => r.prioritas,
      cell: (r) => badge(r.prioritas),
    },
    { header: "Status", value: (r) => r.status, cell: (r) => badge(r.status) },
  ],
  search: (r, db) => `${r.nomor} ${r.judul} ${penghuniNama(db, r.penghuniId)}`,
  filters: [
    {
      name: "status",
      label: "Semua Status",
      options: STATUS_PENGADUAN,
      value: (r) => r.status,
    },
    {
      name: "prioritas",
      label: "Semua Prioritas",
      options: PRIORITAS,
      value: (r) => r.prioritas,
    },
  ],
  actions: [
    {
      label: "Proses",
      show: (r) => r.status === "Baru",
      patch: () => ({ status: "Diproses" }),
      message: "Pengaduan diproses",
    },
    {
      label: "Tandai Selesai",
      show: (r) => r.status !== "Selesai",
      patch: () => ({ status: "Selesai" }),
      message: "Pengaduan selesai",
    },
  ],
  defaults: (today) => ({ tanggal: today }),
})

const inspeksi = defineEntity<"inspeksi">({
  key: "inspeksi",
  title: "Inspeksi Hunian",
  description: "Jadwalkan dan catat hasil inspeksi unit hunian.",
  singular: "Inspeksi",
  addLabel: "Tambah Inspeksi",
  searchPlaceholder: "Cari nomor, unit, atau petugas…",
  emptyText: "Belum ada inspeksi.",
  fields: [
    {
      name: "unitId",
      label: "Unit",
      type: "select",
      relation: {
        entity: "unit",
        label: (r, db) => unitLabelLengkap(db, r.id),
      },
      required: true,
      wide: true,
    },
    { name: "petugas", label: "Petugas", type: "text", required: true },
    {
      name: "tanggal",
      label: "Tanggal Inspeksi",
      type: "date",
      required: true,
    },
    {
      name: "kondisi",
      label: "Kondisi",
      type: "select",
      options: KONDISI_INSPEKSI,
      required: true,
    },
    {
      name: "hasil",
      label: "Hasil",
      type: "select",
      options: HASIL_INSPEKSI,
      required: true,
    },
    { name: "catatan", label: "Catatan", type: "textarea", wide: true },
  ],
  columns: [
    { header: "Nomor", value: (r) => r.nomor },
    {
      header: "Rusun",
      value: (r, db) => rusunNama(db, findById(db, "unit", r.unitId)?.rusunId),
    },
    { header: "Unit", value: (r, db) => unitLabel(db, r.unitId) },
    { header: "Petugas", value: (r) => r.petugas },
    { header: "Tanggal", value: (r) => r.tanggal, cell: (r) => tgl(r.tanggal) },
    {
      header: "Kondisi",
      value: (r) => r.kondisi,
      cell: (r) => badge(r.kondisi),
    },
    { header: "Hasil", value: (r) => r.hasil, cell: (r) => badge(r.hasil) },
  ],
  search: (r, db) => `${r.nomor} ${unitLabel(db, r.unitId)} ${r.petugas}`,
  filters: [
    {
      name: "hasil",
      label: "Semua Hasil",
      options: HASIL_INSPEKSI,
      value: (r) => r.hasil,
    },
    {
      name: "kondisi",
      label: "Semua Kondisi",
      options: KONDISI_INSPEKSI,
      value: (r) => r.kondisi,
    },
  ],
  actions: [
    {
      label: "Tandai Lulus",
      show: (r) => r.hasil !== "Lulus",
      patch: () => ({ hasil: "Lulus" }),
      message: "Inspeksi dinyatakan lulus",
    },
    {
      label: "Perlu Tindak Lanjut",
      show: (r) => r.hasil !== "Perlu Tindak Lanjut",
      patch: () => ({ hasil: "Perlu Tindak Lanjut" }),
      message: "Ditandai perlu tindak lanjut",
    },
  ],
  defaults: (today) => ({ tanggal: today }),
})

const jadwal = defineEntity<"jadwal">({
  key: "jadwal",
  title: "Jadwal & Kegiatan",
  description: "Atur jadwal kegiatan dan agenda rusun.",
  singular: "Kegiatan",
  addLabel: "Tambah Kegiatan",
  searchPlaceholder: "Cari kegiatan, lokasi, atau penanggung jawab…",
  emptyText: "Belum ada kegiatan.",
  fields: [
    {
      name: "nama",
      label: "Nama Kegiatan",
      type: "text",
      required: true,
      wide: true,
    },
    {
      name: "lokasi",
      label: "Lokasi",
      type: "text",
      required: true,
      wide: true,
    },
    { name: "tanggal", label: "Tanggal", type: "date", required: true },
    { name: "waktu", label: "Waktu", type: "time", required: true },
    {
      name: "penanggungJawab",
      label: "Penanggung Jawab",
      type: "text",
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: STATUS_JADWAL,
      required: true,
    },
    { name: "keterangan", label: "Keterangan", type: "textarea", wide: true },
  ],
  columns: [
    { header: "Nama Kegiatan", value: (r) => r.nama },
    { header: "Lokasi", value: (r) => r.lokasi },
    { header: "Tanggal", value: (r) => r.tanggal, cell: (r) => tgl(r.tanggal) },
    { header: "Waktu", value: (r) => r.waktu },
    { header: "Penanggung Jawab", value: (r) => r.penanggungJawab },
    { header: "Status", value: (r) => r.status, cell: (r) => badge(r.status) },
  ],
  search: (r) => `${r.nama} ${r.lokasi} ${r.penanggungJawab}`,
  filters: [
    {
      name: "status",
      label: "Semua Status",
      options: STATUS_JADWAL,
      value: (r) => r.status,
    },
  ],
  actions: [
    {
      label: "Mulai",
      show: (r) => r.status === "Terjadwal",
      patch: () => ({ status: "Berlangsung" }),
      message: "Kegiatan dimulai",
    },
    {
      label: "Tandai Selesai",
      show: (r) => r.status === "Terjadwal" || r.status === "Berlangsung",
      patch: () => ({ status: "Selesai" }),
      message: "Kegiatan selesai",
    },
    {
      label: "Batalkan",
      show: (r) => r.status === "Terjadwal" || r.status === "Berlangsung",
      patch: () => ({ status: "Dibatalkan" }),
      message: "Kegiatan dibatalkan",
    },
  ],
  defaults: (today) => ({ tanggal: today }),
})

const dokumen = defineEntity<"dokumen">({
  key: "dokumen",
  title: "Dokumen",
  description: "Arsip metadata dokumen kontrak, identitas, dan surat.",
  singular: "Dokumen",
  addLabel: "Tambah Dokumen",
  searchPlaceholder: "Cari nama atau nomor dokumen…",
  emptyText: "Belum ada dokumen.",
  fields: [
    {
      name: "nama",
      label: "Nama Dokumen",
      type: "text",
      required: true,
      wide: true,
    },
    {
      name: "kategori",
      label: "Kategori",
      type: "select",
      options: KATEGORI_DOKUMEN,
      required: true,
    },
    {
      name: "nomorDokumen",
      label: "Nomor Dokumen",
      type: "text",
      required: true,
    },
    { name: "tanggal", label: "Tanggal Unggah", type: "date", required: true },
    { name: "pengunggah", label: "Pengunggah", type: "text", required: true },
    {
      name: "namaFile",
      label: "Nama File (opsional)",
      type: "text",
      wide: true,
      placeholder: "kontrak-ahmad.pdf",
    },
  ],
  columns: [
    { header: "Nama Dokumen", value: (r) => r.nama },
    { header: "Kategori", value: (r) => r.kategori },
    { header: "Nomor Dokumen", value: (r) => r.nomorDokumen },
    {
      header: "Tanggal Unggah",
      value: (r) => r.tanggal,
      cell: (r) => tgl(r.tanggal),
    },
    { header: "Pengunggah", value: (r) => r.pengunggah },
  ],
  search: (r) => `${r.nama} ${r.nomorDokumen} ${r.pengunggah}`,
  filters: [
    {
      name: "kategori",
      label: "Semua Kategori",
      options: KATEGORI_DOKUMEN,
      value: (r) => r.kategori,
    },
  ],
  defaults: (today) => ({ tanggal: today, pengunggah: "admin" }),
})

const user = defineEntity<"user">({
  key: "user",
  title: "Manajemen User",
  description: "Kelola pengguna dan hak akses aplikasi.",
  singular: "Pengguna",
  addLabel: "Tambah Pengguna",
  searchPlaceholder: "Cari nama atau email…",
  emptyText: "Belum ada pengguna.",
  fields: [
    { name: "nama", label: "Nama", type: "text", required: true },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      inputMode: "email",
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: ROLE_USER,
      required: true,
    },
    {
      name: "rusunId",
      label: "Rusun",
      type: "select",
      relation: { ...relRusun, optional: true },
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: STATUS_USER,
      required: true,
      wide: true,
    },
  ],
  columns: [
    { header: "Nama", value: (r) => r.nama },
    { header: "Email", value: (r) => r.email },
    { header: "Role", value: (r) => r.role },
    {
      header: "Rusun",
      value: (r, db) => (r.rusunId ? rusunNama(db, r.rusunId) : "Semua rusun"),
    },
    { header: "Status", value: (r) => r.status, cell: (r) => badge(r.status) },
    {
      header: "Terakhir Login",
      value: (r) => r.terakhirLogin ?? "",
      cell: (r) => tgl(r.terakhirLogin),
    },
  ],
  search: (r) => `${r.nama} ${r.email}`,
  filters: [
    {
      name: "role",
      label: "Semua Role",
      options: ROLE_USER,
      value: (r) => r.role,
    },
    {
      name: "status",
      label: "Semua Status",
      options: STATUS_USER,
      value: (r) => r.status,
    },
  ],
  validate: (v, db, id) =>
    db.user.some(
      (u) =>
        u.id !== id && u.email.toLowerCase() === String(v.email).toLowerCase()
    )
      ? { email: "Email sudah digunakan" }
      : {},
})

export const entities = {
  rusun,
  unit,
  penghuni,
  pengajuan,
  kontrak,
  transaksi,
  pemeliharaan,
  pengaduan,
  inspeksi,
  jadwal,
  dokumen,
  user,
} satisfies Record<string, EntityConfig>

export type EntityName = keyof typeof entities
