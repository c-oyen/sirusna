import type { Metadata } from "next"

import { EntityPage } from "@/components/crud/entity-page"

export const metadata: Metadata = { title: "Tagihan & Transaksi" }

export default function Page() {
  return <EntityPage entity="transaksi" />
}
