"use client"

import Link from "next/link"
import type { ReactNode } from "react"

import { StatusBadge } from "@/components/status-badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatTanggal, selisihHari, useToday } from "@/lib/format"
import { penghuniNama, unitLabel } from "@/lib/lookup"
import { useDb } from "@/lib/store"

function Panel({
  title,
  description,
  href,
  empty,
  children,
}: {
  title: string
  description: string
  href: string
  empty: boolean
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Link
            href={href}
            className="text-xs font-medium text-primary-foreground underline-offset-4 hover:underline dark:text-primary"
          >
            Lihat semua
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {empty ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Tidak ada data.
          </p>
        ) : (
          <ul className="divide-y">{children}</ul>
        )}
      </CardContent>
    </Card>
  )
}

function Item({
  primary,
  secondary,
  badge,
}: {
  primary: string
  secondary: string
  badge: string
}) {
  return (
    <li className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{primary}</p>
        <p className="truncate text-xs text-muted-foreground">{secondary}</p>
      </div>
      <StatusBadge status={badge} />
    </li>
  )
}

export function DashboardLists() {
  const db = useDb()
  const today = useToday()

  const pengajuan = db.pengajuan
    .filter((p) => p.status === "Menunggu" || p.status === "Diverifikasi")
    .slice(0, 5)
  const pengaduan = db.pengaduan
    .filter((p) => p.status !== "Selesai")
    .slice(0, 5)
  const kontrak = db.kontrak
    .filter(
      (k) =>
        k.status === "Akan Berakhir" ||
        (today !== "" &&
          k.status === "Aktif" &&
          selisihHari(today, k.tanggalBerakhir) <= 30)
    )
    .slice(0, 5)
  const jadwal = db.jadwal
    .filter(
      (j) =>
        (j.status === "Terjadwal" || j.status === "Berlangsung") &&
        (today === "" || j.tanggal >= today)
    )
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal))
    .slice(0, 5)

  return (
    <div className="grid gap-4 @3xl/main:grid-cols-2">
      <Panel
        title="Pengajuan Terbaru"
        description="Menunggu verifikasi atau keputusan"
        href="/administrasi/pengajuan"
        empty={pengajuan.length === 0}
      >
        {pengajuan.map((p) => (
          <Item
            key={p.id}
            primary={p.nama}
            secondary={`${p.nomor} · ${formatTanggal(p.tanggal)}`}
            badge={p.status}
          />
        ))}
      </Panel>
      <Panel
        title="Pengaduan Aktif"
        description="Belum selesai ditangani"
        href="/administrasi/pengaduan"
        empty={pengaduan.length === 0}
      >
        {pengaduan.map((p) => (
          <Item
            key={p.id}
            primary={p.judul}
            secondary={`${penghuniNama(db, p.penghuniId)} · ${formatTanggal(p.tanggal)}`}
            badge={p.prioritas}
          />
        ))}
      </Panel>
      <Panel
        title="Kontrak Segera Berakhir"
        description="Berakhir dalam 30 hari"
        href="/administrasi/kontrak"
        empty={kontrak.length === 0}
      >
        {kontrak.map((k) => (
          <Item
            key={k.id}
            primary={penghuniNama(db, k.penghuniId)}
            secondary={`Unit ${unitLabel(db, k.unitId)} · s.d. ${formatTanggal(k.tanggalBerakhir)}`}
            badge={k.status}
          />
        ))}
      </Panel>
      <Panel
        title="Kegiatan Mendatang"
        description="Agenda rusun terdekat"
        href="/administrasi/jadwal"
        empty={jadwal.length === 0}
      >
        {jadwal.map((j) => (
          <Item
            key={j.id}
            primary={j.nama}
            secondary={`${formatTanggal(j.tanggal)} · ${j.waktu} · ${j.lokasi}`}
            badge={j.status}
          />
        ))}
      </Panel>
    </div>
  )
}
