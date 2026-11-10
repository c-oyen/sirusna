"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Tone = "success" | "warning" | "danger" | "info" | "neutral"

const TONES: Record<string, Tone> = {
  // success
  Aktif: "success",
  Lunas: "success",
  Selesai: "success",
  Diterima: "success",
  Tersedia: "success",
  Lulus: "success",
  Baik: "success",
  Rendah: "neutral",
  // warning
  Menunggu: "warning",
  Diproses: "warning",
  Diverifikasi: "info",
  "Akan Berakhir": "warning",
  Cukup: "warning",
  Sedang: "warning",
  Berlangsung: "info",
  Diajukan: "warning",
  Dihuni: "info",
  Baru: "info",
  Terjadwal: "info",
  // danger
  Ditolak: "danger",
  "Belum Dibayar": "danger",
  Buruk: "danger",
  Tinggi: "danger",
  Perbaikan: "danger",
  "Perlu Tindak Lanjut": "danger",
  Dibatalkan: "danger",
  // neutral
  Nonaktif: "neutral",
  Berakhir: "neutral",
}

const TONE_CLASS: Record<Exclude<Tone, "danger">, string> = {
  success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  info: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  neutral: "bg-muted text-muted-foreground",
}

export function StatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const tone = TONES[status] ?? "neutral"
  if (tone === "danger") {
    return (
      <Badge variant="destructive" className={className}>
        {status}
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className={cn(TONE_CLASS[tone], className)}>
      {status}
    </Badge>
  )
}
