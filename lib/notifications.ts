import { useMemo } from "react"

import { selisihHari, useToday } from "@/lib/format"
import { useDb } from "@/lib/store"

export type Notifikasi = {
  id: string
  title: string
  description: string
  href: string
  unread: boolean
  tone: "danger" | "warning" | "info"
}

/** Notifications are derived from live data; only "read" ids are persisted. */
export function useNotifications(): Notifikasi[] {
  const db = useDb()
  const today = useToday()

  return useMemo(() => {
    const items: Omit<Notifikasi, "unread">[] = []

    const tunggakan = today
      ? db.transaksi.filter((t) => t.status !== "Lunas" && t.jatuhTempo < today)
      : []
    if (tunggakan.length)
      items.push({
        id: `tunggakan:${tunggakan.length}`,
        title: `${tunggakan.length} tagihan melewati jatuh tempo`,
        description: "Segera tindak lanjuti pembayaran penghuni.",
        href: "/administrasi/transaksi",
        tone: "danger",
      })

    const pengajuan = db.pengajuan.filter((p) => p.status === "Menunggu")
    if (pengajuan.length)
      items.push({
        id: `pengajuan:${pengajuan.length}`,
        title: `${pengajuan.length} pengajuan menunggu verifikasi`,
        description: "Periksa kelengkapan berkas pemohon.",
        href: "/administrasi/pengajuan",
        tone: "warning",
      })

    const pengaduan = db.pengaduan.filter((p) => p.status === "Baru")
    if (pengaduan.length)
      items.push({
        id: `pengaduan:${pengaduan.length}`,
        title: `${pengaduan.length} pengaduan baru`,
        description: "Pengaduan penghuni belum ditangani.",
        href: "/administrasi/pengaduan",
        tone: "warning",
      })

    const perbaikan = db.pemeliharaan.filter((p) => p.status === "Diajukan")
    if (perbaikan.length)
      items.push({
        id: `pemeliharaan:${perbaikan.length}`,
        title: `${perbaikan.length} laporan kerusakan diajukan`,
        description: "Tugaskan petugas untuk perbaikan.",
        href: "/administrasi/pemeliharaan",
        tone: "info",
      })

    const kontrak = today
      ? db.kontrak.filter(
          (k) =>
            k.status === "Akan Berakhir" ||
            (k.status === "Aktif" &&
              selisihHari(today, k.tanggalBerakhir) <= 30)
        )
      : db.kontrak.filter((k) => k.status === "Akan Berakhir")
    if (kontrak.length)
      items.push({
        id: `kontrak:${kontrak.length}`,
        title: `${kontrak.length} kontrak akan berakhir`,
        description: "Hubungi penghuni untuk perpanjangan.",
        href: "/administrasi/kontrak",
        tone: "info",
      })

    return items.map((i) => ({ ...i, unread: !db.dibaca.includes(i.id) }))
  }, [db, today])
}
