import { z } from "zod"

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const wajib = (pesan = "Wajib diisi") => z.string().trim().min(1, pesan)
const tanggal = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal tidak valid")
const tanggalOpsional = z
  .string()
  .refine(
    (v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v),
    "Tanggal tidak valid"
  )
const periode = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Periode tidak valid")
const waktu = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Waktu tidak valid")
const angka = (min = 0) =>
  z.number("Harus berupa angka").min(min, `Minimal ${min}`)
const bulat = (min = 0, max?: number) => {
  const base = z
    .number("Harus berupa angka")
    .int("Harus bilangan bulat")
    .min(min, `Minimal ${min}`)
  return max === undefined ? base : base.max(max, `Maksimal ${max}`)
}
const nik = z.string().regex(/^\d{16}$/, "NIK harus 16 digit angka")
const telepon = z
  .string()
  .regex(/^(\+62|62|0)8\d{7,12}$/, "Nomor telepon tidak valid (contoh: 0812…)")
const emailWajib = z.email("Format email tidak valid")
const emailOpsional = z
  .string()
  .trim()
  .refine(
    (v) => v === "" || z.email().safeParse(v).success,
    "Format email tidak valid"
  )

/* -------------------------------------------------------------------------- */
/*  Enumerations (shared by forms, filters and badges)                         */
/* -------------------------------------------------------------------------- */

export const STATUS_RUSUN = ["Aktif", "Nonaktif"] as const
export const STATUS_UNIT = ["Tersedia", "Dihuni", "Perbaikan"] as const
export const JENIS_KELAMIN = ["Laki-laki", "Perempuan"] as const
export const STATUS_PENGHUNI = ["Aktif", "Nonaktif"] as const
export const STATUS_PENGAJUAN = [
  "Menunggu",
  "Diverifikasi",
  "Diterima",
  "Ditolak",
] as const
export const STATUS_KONTRAK = ["Aktif", "Akan Berakhir", "Berakhir"] as const
export const STATUS_TRANSAKSI = ["Belum Dibayar", "Menunggu", "Lunas"] as const
export const METODE_BAYAR = ["Tunai", "Transfer Bank", "QRIS"] as const
export const STATUS_PEMELIHARAAN = ["Diajukan", "Diproses", "Selesai"] as const
export const KATEGORI_PENGADUAN = [
  "Fasilitas",
  "Kebersihan",
  "Keamanan",
  "Administrasi",
  "Lainnya",
] as const
export const PRIORITAS = ["Rendah", "Sedang", "Tinggi"] as const
export const STATUS_PENGADUAN = ["Baru", "Diproses", "Selesai"] as const
export const KONDISI_INSPEKSI = ["Baik", "Cukup", "Buruk"] as const
export const HASIL_INSPEKSI = [
  "Terjadwal",
  "Lulus",
  "Perlu Tindak Lanjut",
] as const
export const STATUS_JADWAL = [
  "Terjadwal",
  "Berlangsung",
  "Selesai",
  "Dibatalkan",
] as const
export const KATEGORI_DOKUMEN = [
  "Kontrak",
  "Identitas",
  "Pengajuan",
  "Surat",
  "Lainnya",
] as const
export const ROLE_USER = ["Administrator", "Petugas", "Operator"] as const
export const STATUS_USER = ["Aktif", "Nonaktif"] as const

/* -------------------------------------------------------------------------- */
/*  Entity input schemas (what a form submits)                                 */
/* -------------------------------------------------------------------------- */

export const rusunSchema = z.object({
  nama: wajib("Nama rusun wajib diisi"),
  alamat: wajib("Alamat wajib diisi"),
  jumlahLantai: bulat(1, 50),
  status: z.enum(STATUS_RUSUN),
})

export const unitSchema = z.object({
  rusunId: wajib("Pilih rusun"),
  blok: wajib("Blok wajib diisi").max(10, "Maksimal 10 karakter"),
  lantai: bulat(1, 50),
  nomor: wajib("Nomor unit wajib diisi").max(20, "Maksimal 20 karakter"),
  kapasitas: bulat(1, 20),
  status: z.enum(STATUS_UNIT),
})

export const penghuniSchema = z.object({
  nik,
  nama: wajib("Nama wajib diisi"),
  jenisKelamin: z.enum(JENIS_KELAMIN),
  telepon,
  email: emailOpsional,
  pekerjaan: z.string().trim(),
  unitId: z.string(),
  tanggalMasuk: tanggal,
  status: z.enum(STATUS_PENGHUNI),
})

export const pengajuanSchema = z.object({
  nama: wajib("Nama pemohon wajib diisi"),
  nik,
  telepon,
  rusunId: wajib("Pilih rusun tujuan"),
  tanggal,
  status: z.enum(STATUS_PENGAJUAN),
  catatan: z.string().trim(),
})

export const kontrakSchema = z.object({
  penghuniId: wajib("Pilih penghuni"),
  unitId: wajib("Pilih unit"),
  tanggalMulai: tanggal,
  tanggalBerakhir: tanggal,
  tarif: angka(0),
  status: z.enum(STATUS_KONTRAK),
})

export const transaksiSchema = z.object({
  penghuniId: wajib("Pilih penghuni"),
  periode,
  jumlah: angka(1),
  jatuhTempo: tanggal,
  status: z.enum(STATUS_TRANSAKSI),
  tanggalBayar: tanggalOpsional,
  metode: z.string(),
})

export const pemeliharaanSchema = z.object({
  rusunId: wajib("Pilih rusun"),
  lokasi: wajib("Lokasi wajib diisi"),
  jenis: wajib("Jenis kerusakan wajib diisi"),
  tanggal,
  petugas: wajib("Petugas wajib diisi"),
  status: z.enum(STATUS_PEMELIHARAAN),
  catatan: z.string().trim(),
})

export const pengaduanSchema = z.object({
  penghuniId: wajib("Pilih penghuni"),
  judul: wajib("Judul wajib diisi"),
  kategori: z.enum(KATEGORI_PENGADUAN),
  deskripsi: z.string().trim(),
  tanggal,
  prioritas: z.enum(PRIORITAS),
  status: z.enum(STATUS_PENGADUAN),
})

export const inspeksiSchema = z.object({
  unitId: wajib("Pilih unit"),
  petugas: wajib("Petugas wajib diisi"),
  tanggal,
  kondisi: z.enum(KONDISI_INSPEKSI),
  hasil: z.enum(HASIL_INSPEKSI),
  catatan: z.string().trim(),
})

export const jadwalSchema = z.object({
  nama: wajib("Nama kegiatan wajib diisi"),
  lokasi: wajib("Lokasi wajib diisi"),
  tanggal,
  waktu,
  penanggungJawab: wajib("Penanggung jawab wajib diisi"),
  status: z.enum(STATUS_JADWAL),
  keterangan: z.string().trim(),
})

export const dokumenSchema = z.object({
  nama: wajib("Nama dokumen wajib diisi"),
  kategori: z.enum(KATEGORI_DOKUMEN),
  nomorDokumen: wajib("Nomor dokumen wajib diisi"),
  tanggal,
  pengunggah: wajib("Pengunggah wajib diisi"),
  namaFile: z.string().trim(),
})

export const userSchema = z.object({
  nama: wajib("Nama wajib diisi"),
  email: emailWajib,
  role: z.enum(ROLE_USER),
  rusunId: z.string(),
  status: z.enum(STATUS_USER),
  terakhirLogin: z.string().optional(),
})

export const settingsSchema = z.object({
  namaAplikasi: wajib("Nama aplikasi wajib diisi"),
  instansi: wajib("Nama instansi wajib diisi"),
  alamat: z.string().trim(),
  email: emailOpsional,
  telepon: z.string().trim(),
  tarif: angka(0),
  jatuhTempo: bulat(1, 31),
  denda: angka(0).max(100, "Maksimal 100"),
})

/* -------------------------------------------------------------------------- */
/*  Stored record schemas (id + optional auto number)                          */
/* -------------------------------------------------------------------------- */

const withId = { id: z.string() }
const withNomor = { id: z.string(), nomor: z.string() }

export const dbSchema = z.object({
  rusun: z.array(rusunSchema.extend(withId)),
  unit: z.array(unitSchema.extend(withId)),
  penghuni: z.array(penghuniSchema.extend(withId)),
  pengajuan: z.array(pengajuanSchema.extend(withNomor)),
  kontrak: z.array(kontrakSchema.extend(withNomor)),
  transaksi: z.array(transaksiSchema.extend(withNomor)),
  pemeliharaan: z.array(pemeliharaanSchema.extend(withNomor)),
  pengaduan: z.array(pengaduanSchema.extend(withNomor)),
  inspeksi: z.array(inspeksiSchema.extend(withNomor)),
  jadwal: z.array(jadwalSchema.extend(withId)),
  dokumen: z.array(dokumenSchema.extend(withId)),
  user: z.array(userSchema.extend(withId)),
  settings: settingsSchema,
  dibaca: z.array(z.string()),
})

export type Db = z.infer<typeof dbSchema>
export type ListKey = Exclude<
  {
    [K in keyof Db]: Db[K] extends unknown[] ? K : never
  }[keyof Db],
  "dibaca"
>

export type Rusun = Db["rusun"][number]
export type Unit = Db["unit"][number]
export type Penghuni = Db["penghuni"][number]
export type Pengajuan = Db["pengajuan"][number]
export type Kontrak = Db["kontrak"][number]
export type Transaksi = Db["transaksi"][number]
export type Pemeliharaan = Db["pemeliharaan"][number]
export type Pengaduan = Db["pengaduan"][number]
export type Inspeksi = Db["inspeksi"][number]
export type Jadwal = Db["jadwal"][number]
export type Dokumen = Db["dokumen"][number]
export type User = Db["user"][number]
export type Settings = Db["settings"]

/** Schema used to validate a form submission, per collection. */
export const inputSchemas = {
  rusun: rusunSchema,
  unit: unitSchema,
  penghuni: penghuniSchema,
  pengajuan: pengajuanSchema,
  kontrak: kontrakSchema,
  transaksi: transaksiSchema,
  pemeliharaan: pemeliharaanSchema,
  pengaduan: pengaduanSchema,
  inspeksi: inspeksiSchema,
  jadwal: jadwalSchema,
  dokumen: dokumenSchema,
  user: userSchema,
} as const
