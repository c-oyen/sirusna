import type { Metadata } from "next"

import { ReportView } from "@/components/report-view"

export const metadata: Metadata = { title: "Laporan" }

export default function LaporanPage() {
  return <ReportView />
}
