"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  formatRupiah,
  geserPeriode,
  namaBulanSingkat,
  useToday,
} from "@/lib/format"
import { useDb } from "@/lib/store"

const config = {
  tagihan: { label: "Tagihan", color: "var(--chart-2)" },
  pemasukan: { label: "Pemasukan", color: "var(--chart-5)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  maximumFractionDigits: 1,
})

export function RevenueChart() {
  const db = useDb()
  const today = useToday()

  const latest = db.transaksi.reduce(
    (m, t) => (t.periode > m ? t.periode : m),
    ""
  )
  const base = today ? today.slice(0, 7) : latest || "2026-01"

  const data = Array.from({ length: 6 }, (_, i) => {
    const periode = geserPeriode(base, i - 5)
    const rows = db.transaksi.filter((t) => t.periode === periode)
    return {
      bulan: namaBulanSingkat(periode),
      tagihan: rows.reduce((s, t) => s + t.jumlah, 0),
      pemasukan: rows
        .filter((t) => t.status === "Lunas")
        .reduce((s, t) => s + t.jumlah, 0),
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tagihan & Pemasukan</CardTitle>
        <CardDescription>Perbandingan 6 bulan terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="aspect-auto h-[260px] w-full"
        >
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="bulan"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(v: number) => compact.format(v)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value, name) => (
                    <div className="flex w-full justify-between gap-4">
                      <span className="text-muted-foreground">
                        {config[name as keyof typeof config]?.label ?? name}
                      </span>
                      <span className="font-medium tabular-nums">
                        {formatRupiah(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="tagihan" fill="var(--color-tagihan)" radius={4} />
            <Bar dataKey="pemasukan" fill="var(--color-pemasukan)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
