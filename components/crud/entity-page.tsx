"use client"

import { CrudView } from "@/components/crud/crud-view"
import { entities, type EntityName } from "@/components/crud/entities"

/**
 * Entry point used by the (server) route files: they only pass a plain string
 * key, because entity configs contain functions that can't cross the
 * server/client boundary.
 */
export function EntityPage({ entity }: { entity: EntityName }) {
  return <CrudView config={entities[entity]} />
}
