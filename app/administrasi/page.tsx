import type { Metadata } from "next"

import { DashboardLists } from "@/components/dashboard-lists"
import { PageHeader } from "@/components/page-header"
import { RevenueChart } from "@/components/revenue-chart"
import { SectionCards } from "@/components/section-cards"

export const metadata: Metadata = { title: "Dasbor" }

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dasbor"
        description="Ringkasan hunian, keuangan, dan layanan rusun."
      />
      <SectionCards />
      <RevenueChart />
      <DashboardLists />
    </div>
  )
}
