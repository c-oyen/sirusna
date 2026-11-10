import type { Metadata } from "next"

import { EntityPage } from "@/components/crud/entity-page"

export const metadata: Metadata = { title: "Data Penghuni" }

export default function Page() {
  return <EntityPage entity="penghuni" />
}
