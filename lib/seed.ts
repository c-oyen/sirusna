import type {
  Db,
  Inspeksi,
  Kontrak,
  Pemeliharaan,
  Pengaduan,
  Pengajuan,
  Penghuni,
  Transaksi,
  Unit,
} from "@/lib/schemas"

const rusun: Db["rusun"] = [
  {
    id: "rusun-1",
    nama: "Rusunawa Pangkalpinang",
    alamat: "Jl. Mentok No. 12, Pangkalpinang",
    jumlahLantai: 3,
    status: "Aktif",
  },
  {
    id: "rusun-2",
    nama: "Rusunawa Sungailiat",
    alamat: "Jl. Jenderal Sudirman No. 45, Sungailiat",
    jumlahLantai: 3,
    status: "Aktif",
  },
  {
    id: "rusun-3",
    nama: "Rusunawa Muntok",
    alamat: "Jl. Ahmad Yani No. 8, Muntok",
    jumlahLantai: 3,
    status: "Aktif",
  },
]

// 3 rusun x 2 blok x 3 lantai x 2 unit = 36 unit
const unit: Unit[] = []
for (const r of rusun) {
  for (const blok of ["A", "B"]) {
    for (const lantai of [1, 2, 3]) {
      for (const n of [1, 2]) {
        unit.push({
          id: `${r.id}-${blok}${lantai}0${n}`,
          rusunId: r.id,
          blok,
          lantai,
          nomor: `${blok}-${lantai}0${n}`,
          kapasitas: n === 1 ? 4 : 3,
          status: "Tersedia",
        })
      }
    }
  }
}

const namaPenghuni: [string, "Laki-laki" | "Perempuan", string][] = [
  ["Ahmad Fauzi", "Laki-laki", "Buruh Pelabuhan"],
  ["Siti Rahmawati", "Perempuan", "Pedagang"],
  ["Budi Santoso", "Laki-laki", "Nelayan"],
  ["Dewi Lestari", "Perempuan", "Guru Honorer"],
  ["Rudi Hartono", "Laki-laki", "Sopir"],
  ["Nurhayati", "Perempuan", "Penjahit"],
  ["Agus Salim", "Laki-laki", "Karyawan Swasta"],
  ["Rina Marlina", "Perempuan", "Perawat"],
  ["Hendra Gunawan", "Laki-laki", "Tukang Bangunan"],
  ["Yuliani", "Perempuan", "Pedagang"],
  ["Slamet Riyadi", "Laki-laki", "Petugas Kebersihan"],
  ["Maya Anggraini", "Perempuan", "Karyawan Toko"],
  ["Joko Prasetyo", "Laki-laki", "Satpam"],
  ["Lina Wati", "Perempuan", "Ibu Rumah Tangga"],
]

const penghuni: Penghuni[] = namaPenghuni.map(([nama, jk, pekerjaan], i) => {
  const u = unit[i * 2]
  u.status = "Dihuni"
  const nonaktif = i >= 12
  return {
    id: `penghuni-${i + 1}`,
    nik: `19710${String(1000000000 + i * 7919).padStart(11, "0")}`,
    nama,
    jenisKelamin: jk,
    telepon: `08127${String(1000000 + i * 31337).slice(0, 7)}`,
    email: "",
    pekerjaan,
    unitId: nonaktif ? "" : u.id,
    tanggalMasuk: `2026-0${(i % 6) + 1}-0${(i % 8) + 1}`,
    status: nonaktif ? "Nonaktif" : "Aktif",
  }
})
// Units for the 2 inactive residents are free again.
unit[24].status = "Tersedia"
unit[26].status = "Tersedia"
// A few units under repair.
for (const idx of [5, 17, 29]) unit[idx].status = "Perbaikan"

const aktif = penghuni.filter((p) => p.status === "Aktif")

const nomorTahun = (prefix: string, n: number) =>
  `${prefix}-2026-${String(n).padStart(4, "0")}`

const kontrak: Kontrak[] = penghuni.map((p, i) => {
  const mulai = p.tanggalMasuk
  const nonaktif = p.status === "Nonaktif"
  const segera = i === 3 || i === 8
  return {
    id: `kontrak-${i + 1}`,
    nomor: nomorTahun("KTR", i + 1),
    penghuniId: p.id,
    unitId: unit[i * 2].id,
    tanggalMulai: mulai,
    tanggalBerakhir: nonaktif
      ? "2026-10-31"
      : segera
        ? "2026-12-20"
        : `2027-0${(i % 6) + 1}-0${(i % 8) + 1}`,
    tarif: [300000, 350000, 400000][i % 3],
    status: nonaktif ? "Berakhir" : segera ? "Akan Berakhir" : "Aktif",
  }
})

const transaksi: Transaksi[] = []
let trx = 1
for (const [i, p] of aktif.entries()) {
  const tarif = kontrak.find((k) => k.penghuniId === p.id)?.tarif ?? 350000
  for (const per of ["2026-08", "2026-09", "2026-10", "2026-11"]) {
    let status: Transaksi["status"] = "Lunas"
    if (per === "2026-10" && i % 5 === 0) status = "Belum Dibayar"
    if (per === "2026-11") status = i % 3 === 0 ? "Menunggu" : "Belum Dibayar"
    if (per === "2026-11" && i % 4 === 1) status = "Lunas"
    const lunas = status === "Lunas"
    transaksi.push({
      id: `transaksi-${trx}`,
      nomor: nomorTahun("TRX", trx),
      penghuniId: p.id,
      periode: per,
      jumlah: tarif,
      jatuhTempo: `${per}-10`,
      status,
      tanggalBayar: lunas ? `${per}-0${(i % 7) + 1}` : "",
      metode: lunas ? ["Tunai", "Transfer Bank", "QRIS"][i % 3] : "",
    })
    trx++
  }
}

const pengajuan: Pengajuan[] = [
  ["Fitri Handayani", "Menunggu", "2026-11-05"],
  ["Rizky Ramadhan", "Menunggu", "2026-11-03"],
  ["Sari Puspita", "Diverifikasi", "2026-10-28"],
  ["Dedi Kurniawan", "Diverifikasi", "2026-10-25"],
  ["Ratna Sari", "Diterima", "2026-10-12"],
  ["Anwar Hidayat", "Diterima", "2026-09-30"],
  ["Bambang Setiawan", "Ditolak", "2026-09-18"],
  ["Mega Wulandari", "Menunggu", "2026-11-07"],
].map(([nama, status, tanggal], i) => ({
  id: `pengajuan-${i + 1}`,
  nomor: nomorTahun("PGJ", i + 1),
  nama,
  nik: `19720${String(2000000000 + i * 6101).padStart(11, "0")}`,
  telepon: `08138${String(2000000 + i * 4411).slice(0, 7)}`,
  rusunId: rusun[i % 3].id,
  tanggal,
  status: status as Pengajuan["status"],
  catatan: status === "Ditolak" ? "Berkas tidak lengkap" : "",
}))

const pemeliharaan: Pemeliharaan[] = [
  ["Atap bocor", "Blok A Lantai 3", "Diproses", "2026-11-04"],
  ["Pompa air rusak", "Ruang Pompa", "Diajukan", "2026-11-07"],
  ["Lampu koridor mati", "Blok B Lantai 2", "Selesai", "2026-10-29"],
  ["Pipa air bocor", "Unit A-201", "Diproses", "2026-11-02"],
  ["Pintu rusak", "Unit B-102", "Selesai", "2026-10-15"],
  ["Saluran tersumbat", "Blok A Lantai 1", "Diajukan", "2026-11-08"],
  ["Cat dinding mengelupas", "Blok B Lantai 3", "Selesai", "2026-10-05"],
  ["Lift/tangga rusak", "Blok A", "Diproses", "2026-11-06"],
].map(([jenis, lokasi, status, tanggal], i) => ({
  id: `pemeliharaan-${i + 1}`,
  nomor: nomorTahun("PML", i + 1),
  rusunId: rusun[i % 3].id,
  lokasi,
  jenis,
  tanggal,
  petugas: ["Pak Wahyu", "Pak Darto", "Pak Imam"][i % 3],
  status: status as Pemeliharaan["status"],
  catatan: "",
}))

const pengaduan: Pengaduan[] = [
  ["Air tidak mengalir", "Fasilitas", "Tinggi", "Baru", "2026-11-08"],
  [
    "Sampah menumpuk di lantai 1",
    "Kebersihan",
    "Sedang",
    "Diproses",
    "2026-11-06",
  ],
  ["Kunci gerbang rusak", "Keamanan", "Tinggi", "Diproses", "2026-11-03"],
  ["Tagihan tidak sesuai", "Administrasi", "Sedang", "Baru", "2026-11-07"],
  ["Lampu tangga redup", "Fasilitas", "Rendah", "Selesai", "2026-10-22"],
  ["Suara bising malam hari", "Lainnya", "Rendah", "Selesai", "2026-10-18"],
  ["Parkir motor tidak tertib", "Keamanan", "Sedang", "Baru", "2026-11-09"],
  ["Toilet umum kotor", "Kebersihan", "Sedang", "Selesai", "2026-10-30"],
].map(([judul, kategori, prioritas, status, tanggal], i) => ({
  id: `pengaduan-${i + 1}`,
  nomor: nomorTahun("PGD", i + 1),
  penghuniId: aktif[i % aktif.length].id,
  judul,
  kategori: kategori as Pengaduan["kategori"],
  deskripsi: "",
  tanggal,
  prioritas: prioritas as Pengaduan["prioritas"],
  status: status as Pengaduan["status"],
}))

const inspeksi: Inspeksi[] = [
  ["Baik", "Lulus", "2026-10-20"],
  ["Cukup", "Perlu Tindak Lanjut", "2026-10-21"],
  ["Baik", "Lulus", "2026-10-27"],
  ["Buruk", "Perlu Tindak Lanjut", "2026-11-02"],
  ["Baik", "Lulus", "2026-11-04"],
  ["Cukup", "Terjadwal", "2026-11-12"],
  ["Baik", "Terjadwal", "2026-11-18"],
].map(([kondisi, hasil, tanggal], i) => ({
  id: `inspeksi-${i + 1}`,
  nomor: nomorTahun("INS", i + 1),
  unitId: unit[i * 4].id,
  petugas: ["Bu Ratih", "Pak Wahyu", "Pak Imam"][i % 3],
  tanggal,
  kondisi: kondisi as Inspeksi["kondisi"],
  hasil: hasil as Inspeksi["hasil"],
  catatan: "",
}))

export const seed: Db = {
  rusun,
  unit,
  penghuni,
  pengajuan,
  kontrak,
  transaksi,
  pemeliharaan,
  pengaduan,
  inspeksi,
  jadwal: [
    [
      "Kerja bakti bulanan",
      "Halaman Rusunawa Pangkalpinang",
      "2026-11-14",
      "07:30",
      "Ketua RT",
      "Terjadwal",
    ],
    [
      "Sosialisasi tata tertib hunian",
      "Aula Rusunawa Sungailiat",
      "2026-11-16",
      "19:30",
      "Pengelola",
      "Terjadwal",
    ],
    [
      "Penyemprotan nyamuk",
      "Seluruh blok Rusunawa Muntok",
      "2026-11-20",
      "09:00",
      "Petugas Kesehatan",
      "Terjadwal",
    ],
    [
      "Rapat penghuni",
      "Aula Rusunawa Pangkalpinang",
      "2026-11-09",
      "16:00",
      "Pengelola",
      "Berlangsung",
    ],
    [
      "Pemeriksaan APAR",
      "Rusunawa Sungailiat",
      "2026-10-30",
      "10:00",
      "Pak Wahyu",
      "Selesai",
    ],
    [
      "Senam pagi bersama",
      "Lapangan Rusunawa Muntok",
      "2026-10-25",
      "06:30",
      "Karang Taruna",
      "Selesai",
    ],
    [
      "Pemadaman listrik terjadwal",
      "Rusunawa Pangkalpinang",
      "2026-11-22",
      "08:00",
      "PLN / Pengelola",
      "Terjadwal",
    ],
  ].map(([nama, lokasi, tanggal, waktu, penanggungJawab, status], i) => ({
    id: `jadwal-${i + 1}`,
    nama,
    lokasi,
    tanggal,
    waktu,
    penanggungJawab,
    status: status as Db["jadwal"][number]["status"],
    keterangan: "",
  })),
  dokumen: [
    ["Kontrak Sewa Ahmad Fauzi", "Kontrak", "KTR-2026-0001"],
    ["KTP Siti Rahmawati", "Identitas", "ID-2026-0002"],
    ["Formulir Pengajuan Fitri Handayani", "Pengajuan", "PGJ-2026-0001"],
    ["Surat Keputusan Tarif Sewa 2026", "Surat", "SK-2026-014"],
    ["Berita Acara Inspeksi Oktober", "Lainnya", "BA-2026-010"],
    ["Kontrak Sewa Budi Santoso", "Kontrak", "KTR-2026-0003"],
    ["Surat Peringatan Tunggakan", "Surat", "SP-2026-003"],
    ["KK Dewi Lestari", "Identitas", "ID-2026-0004"],
  ].map(([nama, kategori, nomorDokumen], i) => ({
    id: `dokumen-${i + 1}`,
    nama,
    kategori: kategori as Db["dokumen"][number]["kategori"],
    nomorDokumen,
    tanggal: `2026-10-${String(28 - i * 2).padStart(2, "0")}`,
    pengunggah: i % 2 ? "Petugas" : "admin",
    namaFile: "",
  })),
  user: [
    ["admin", "admin@sirusna.bangka.go.id", "Administrator", "", "Aktif"],
    [
      "Wahyu Pratama",
      "wahyu@sirusna.bangka.go.id",
      "Petugas",
      "rusun-1",
      "Aktif",
    ],
    [
      "Ratih Kusuma",
      "ratih@sirusna.bangka.go.id",
      "Petugas",
      "rusun-2",
      "Aktif",
    ],
    ["Imam Fadli", "imam@sirusna.bangka.go.id", "Operator", "rusun-3", "Aktif"],
    [
      "Nia Ramadani",
      "nia@sirusna.bangka.go.id",
      "Operator",
      "rusun-1",
      "Nonaktif",
    ],
  ].map(([nama, email, role, rusunId, status], i) => ({
    id: `user-${i + 1}`,
    nama,
    email,
    role: role as Db["user"][number]["role"],
    rusunId,
    status: status as Db["user"][number]["status"],
    terakhirLogin:
      status === "Aktif" ? `2026-11-0${(i % 8) + 1}` : "2026-08-15",
  })),
  settings: {
    namaAplikasi: "SIRUSNA",
    instansi:
      "Dinas Perumahan dan Kawasan Permukiman Provinsi Kepulauan Bangka Belitung",
    alamat: "Jl. Jenderal Sudirman, Pangkalpinang, Kepulauan Bangka Belitung",
    email: "admin@sirusna.bangka.go.id",
    telepon: "0717123456",
    tarif: 350000,
    jatuhTempo: 10,
    denda: 2,
  },
  dibaca: [],
}
