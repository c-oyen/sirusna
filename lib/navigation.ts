export type NavItem = { title: string; url: string }

export const NAV_MAIN: NavItem[] = [
  { title: "Dasbor", url: "/administrasi" },
  { title: "Data Rusun", url: "/administrasi/rusun" },
  { title: "Pengajuan Rusun", url: "/administrasi/pengajuan" },
  { title: "Data Penghuni", url: "/administrasi/penghuni" },
  { title: "Unit Hunian", url: "/administrasi/unit" },
  { title: "Tagihan & Transaksi", url: "/administrasi/transaksi" },
  { title: "Kontrak Sewa", url: "/administrasi/kontrak" },
  { title: "Pemeliharaan", url: "/administrasi/pemeliharaan" },
  { title: "Pengaduan", url: "/administrasi/pengaduan" },
  { title: "Inspeksi Hunian", url: "/administrasi/inspeksi" },
  { title: "Jadwal & Kegiatan", url: "/administrasi/jadwal" },
  { title: "Laporan", url: "/administrasi/laporan" },
]

export const NAV_SECONDARY: NavItem[] = [
  { title: "Dokumen", url: "/administrasi/dokumen" },
  { title: "Manajemen User", url: "/administrasi/manajemen-user" },
  { title: "Pengaturan", url: "/administrasi/pengaturan" },
]

export const NAV_ALL: NavItem[] = [...NAV_MAIN, ...NAV_SECONDARY]

export function titleForPath(pathname: string): string {
  const exact = NAV_ALL.find((n) => n.url === pathname)
  if (exact) return exact.title
  const prefix = NAV_ALL.filter((n) => n.url !== "/administrasi").find((n) =>
    pathname.startsWith(`${n.url}/`)
  )
  return prefix?.title ?? "SIRUSNA"
}
