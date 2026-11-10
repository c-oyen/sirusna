"use client"

import {
  BuildingsIcon,
  CurrencyCircleDollarIcon,
  UsersThreeIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatPeriode, formatRupiah, useToday } from "@/lib/format"
import { useDb } from "@/lib/store"

export function SectionCards() {
  const db = useDb()
  const today = useToday()

  const totalUnit = db.unit.length
  const dihuni = db.unit.filter((u) => u.status === "Dihuni").length
  const okupansi = totalUnit ? Math.round((dihuni / totalUnit) * 100) : 0
  const penghuniAktif = db.penghuni.filter((p) => p.status === "Aktif").length

  const latest = db.transaksi.reduce(
    (m, t) => (t.periode > m ? t.periode : m),
    ""
  )
  const periode = today ? today.slice(0, 7) : latest
  const bulanIni = db.transaksi.filter((t) => t.periode === periode)
  const tagihanBulanIni = bulanIni.reduce((s, t) => s + t.jumlah, 0)
  const terbayar = bulanIni
    .filter((t) => t.status === "Lunas")
    .reduce((s, t) => s + t.jumlah, 0)

  const tunggakan = today
    ? db.transaksi.filter((t) => t.status !== "Lunas" && t.jatuhTempo < today)
    : []
  const nilaiTunggakan = tunggakan.reduce((s, t) => s + t.jumlah, 0)
  const unitPerbaikan = db.unit.filter((u) => u.status === "Perbaikan").length

  const cards = [
    {
      title: "Okupansi Hunian",
      value: `${okupansi}%`,
      badge: `${dihuni}/${totalUnit}`,
      icon: <BuildingsIcon />,
      line: `${dihuni} dari ${totalUnit} unit dihuni`,
      hint: `${unitPerbaikan} unit dalam perbaikan`,
    },
    {
      title: "Penghuni Aktif",
      value: String(penghuniAktif),
      badge: `${db.rusun.length} rusun`,
      icon: <UsersThreeIcon />,
      line: "Penghuni dengan status aktif",
      hint: `${db.penghuni.length - penghuniAktif} penghuni nonaktif`,
    },
    {
      title: "Pendapatan Bulan Ini",
      value: formatRupiah(terbayar),
      badge: tagihanBulanIni
        ? `${Math.round((terbayar / tagihanBulanIni) * 100)}%`
        : "0%",
      icon: <CurrencyCircleDollarIcon />,
      line: `Dari tagihan ${formatRupiah(tagihanBulanIni)}`,
      hint: periode ? `Periode ${formatPeriode(periode)}` : "",
    },
    {
      title: "Total Tunggakan",
      value: formatRupiah(nilaiTunggakan),
      badge: `${tunggakan.length} tagihan`,
      icon: <WarningCircleIcon />,
      line: "Tagihan lewat jatuh tempo",
      hint: "Perlu tindak lanjut",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map((c) => (
        <Card key={c.title} className="@container/card">
          <CardHeader>
            <CardDescription>{c.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {c.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">{c.badge}</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex gap-2 font-medium [&_svg]:size-4">
              {c.line} {c.icon}
            </div>
            <div className="text-muted-foreground">{c.hint}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
