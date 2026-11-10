import type { Metadata } from "next"

import { EntityPage } from "@/components/crud/entity-page"

export const metadata: Metadata = { title: "Manajemen User" }

export default function Page() {
  return <EntityPage entity="user" />
}
