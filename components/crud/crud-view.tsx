"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  ArrowsDownUpIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  DotsThreeVerticalIcon,
  DownloadSimpleIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react"

import { EntityForm } from "@/components/crud/entity-form"
import type { EntityConfig, Row } from "@/components/crud/types"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { downloadCsv } from "@/lib/csv"
import { useToday } from "@/lib/format"
import { insertRow, readDb, removeRow, updateRow, useDb } from "@/lib/store"

const PAGE_SIZE = 10

type SortState = { index: number; dir: "asc" | "desc" } | null

function compare(a: string | number, b: string | number) {
  if (typeof a === "number" && typeof b === "number") return a - b
  return String(a).localeCompare(String(b), "id", { numeric: true })
}

export function CrudView({ config }: { config: EntityConfig }) {
  const db = useDb()
  const today = useToday()
  const rows = db[config.key] as unknown as Row[]

  const [query, setQuery] = React.useState("")
  const [filters, setFilters] = React.useState<Record<string, string>>({})
  const [sort, setSort] = React.useState<SortState>(null)
  const [page, setPage] = React.useState(1)
  const [editing, setEditing] = React.useState<Row | "new" | null>(null)
  const [deleting, setDeleting] = React.useState<Row | null>(null)

  const hasFilters = query !== "" || Object.values(filters).some(Boolean)

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = rows.filter((row) => {
      if (q && !config.search(row, db).toLowerCase().includes(q)) return false
      for (const f of config.filters ?? []) {
        const chosen = filters[f.name]
        if (chosen && f.value(row, db) !== chosen) return false
      }
      return true
    })
    if (sort) {
      const col = config.columns[sort.index]
      const dir = sort.dir === "asc" ? 1 : -1
      list = [...list].sort(
        (a, b) => dir * compare(col.value(a, db), col.value(b, db))
      )
    }
    return list
  }, [rows, db, config, query, filters, sort])

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = visible.slice(start, start + PAGE_SIZE)

  function toggleSort(index: number) {
    setSort((s) => {
      if (!s || s.index !== index) return { index, dir: "asc" }
      if (s.dir === "asc") return { index, dir: "desc" }
      return null
    })
  }

  function resetFilters() {
    setQuery("")
    setFilters({})
    setPage(1)
  }

  function handleSave(data: Record<string, unknown>) {
    if (editing === "new") {
      insertRow(config.key, data as never)
      toast.success(`${config.singular} berhasil ditambahkan`)
    } else if (editing) {
      updateRow(config.key, editing.id, data as never)
      toast.success(`${config.singular} berhasil diperbarui`)
    }
    setEditing(null)
  }

  function handleDelete() {
    if (!deleting) return
    removeRow(config.key, deleting.id)
    toast.success(`${config.singular} berhasil dihapus`)
    setDeleting(null)
  }

  function blockers(row: Row): string[] {
    const fresh = readDb()
    const out: string[] = []
    for (const dep of config.dependents ?? []) {
      const list = fresh[dep.entity] as unknown as Row[]
      const n = list.filter((r) => r[dep.field] === row.id).length
      if (n > 0) out.push(`${n} data ${dep.label}`)
    }
    return out
  }

  function exportCsv() {
    downloadCsv(
      `${config.key}-${today || "data"}.csv`,
      config.columns.map((c) => c.header),
      visible.map((r) => config.columns.map((c) => c.value(r, db)))
    )
    toast.success(`${visible.length} baris diekspor`)
  }

  const deleteBlockers = deleting ? blockers(deleting) : []

  return (
    <div className="space-y-6">
      <PageHeader title={config.title} description={config.description}>
        <Button
          variant="outline"
          onClick={exportCsv}
          disabled={!visible.length}
        >
          <DownloadSimpleIcon />
          Ekspor CSV
        </Button>
        <Button onClick={() => setEditing("new")}>
          <PlusIcon />
          {config.addLabel}
        </Button>
      </PageHeader>

      {config.summary ? config.summary(rows, db, today) : null}

      <Card>
        <CardHeader>
          <CardTitle>Daftar {config.singular}</CardTitle>
          <CardDescription>
            {visible.length === rows.length
              ? `${rows.length} data`
              : `${visible.length} dari ${rows.length} data`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative sm:max-w-xs sm:flex-1">
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                aria-label={config.searchPlaceholder}
                placeholder={config.searchPlaceholder}
                className="pl-7"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            {(config.filters ?? []).map((f) => (
              <div key={f.name} className="sm:w-48">
                <NativeSelect
                  aria-label={f.label}
                  value={filters[f.name] ?? ""}
                  onChange={(e) => {
                    setFilters((s) => ({ ...s, [f.name]: e.target.value }))
                    setPage(1)
                  }}
                >
                  <option value="">{f.label}</option>
                  {(typeof f.options === "function"
                    ? f.options(db)
                    : f.options
                  ).map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            ))}
            {hasFilters ? (
              <Button variant="ghost" onClick={resetFilters}>
                <XIcon />
                Atur ulang
              </Button>
            ) : null}
          </div>

          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  {config.columns.map((c, i) => {
                    const dir = sort && sort.index === i ? sort.dir : null
                    return (
                      <TableHead
                        key={c.header}
                        className={c.align === "right" ? "text-right" : ""}
                        aria-sort={
                          dir === "asc"
                            ? "ascending"
                            : dir === "desc"
                              ? "descending"
                              : "none"
                        }
                      >
                        <button
                          type="button"
                          onClick={() => toggleSort(i)}
                          className="inline-flex items-center gap-1 rounded-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                          {c.header}
                          {dir === "asc" ? (
                            <CaretUpIcon className="size-3" />
                          ) : dir === "desc" ? (
                            <CaretDownIcon className="size-3" />
                          ) : (
                            <ArrowsDownUpIcon className="size-3 text-muted-foreground/60" />
                          )}
                        </button>
                      </TableHead>
                    )
                  })}
                  <TableHead className="w-12 text-right">
                    <span className="sr-only">Aksi</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={config.columns.length + 2}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {hasFilters
                        ? "Tidak ada data yang cocok dengan pencarian."
                        : config.emptyText}
                    </TableCell>
                  </TableRow>
                ) : (
                  pageRows.map((row, i) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-muted-foreground">
                        {start + i + 1}
                      </TableCell>
                      {config.columns.map((c) => (
                        <TableCell
                          key={c.header}
                          className={c.align === "right" ? "text-right" : ""}
                        >
                          {c.cell ? c.cell(row, db) : c.value(row, db)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <RowMenu
                          row={row}
                          config={config}
                          today={today}
                          onEdit={() => setEditing(row)}
                          onDelete={() => setDeleting(row)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              {visible.length === 0
                ? "0 data"
                : `${start + 1}–${Math.min(start + PAGE_SIZE, visible.length)} dari ${visible.length}`}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label="Halaman sebelumnya"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <CaretLeftIcon />
              </Button>
              <span aria-live="polite">
                Halaman {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                aria-label="Halaman berikutnya"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                <CaretRightIcon />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
      >
        <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-xl">
          {editing !== null ? (
            <EntityForm
              key={editing === "new" ? "new" : editing.id}
              config={config}
              db={db}
              today={today}
              row={editing === "new" ? null : editing}
              onSubmit={handleSave}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deleteBlockers.length
                ? `${config.singular} tidak dapat dihapus`
                : `Hapus ${config.singular}?`}
            </DialogTitle>
            <DialogDescription>
              {deleteBlockers.length
                ? `Masih digunakan oleh ${deleteBlockers.join(", ")}. Hapus atau ubah data tersebut terlebih dahulu.`
                : "Data yang dihapus tidak dapat dikembalikan."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              {deleteBlockers.length ? "Tutup" : "Batal"}
            </Button>
            {deleteBlockers.length ? null : (
              <Button variant="destructive" onClick={handleDelete}>
                <TrashIcon />
                Hapus
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function RowMenu({
  row,
  config,
  today,
  onEdit,
  onDelete,
}: {
  row: Row
  config: EntityConfig
  today: string
  onEdit: () => void
  onDelete: () => void
}) {
  const actions = (config.actions ?? []).filter((a) => a.show(row))
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Aksi untuk ${config.singular} ${row.nomor ?? ""}`.trim()}
          />
        }
      >
        <DotsThreeVerticalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        {actions.map((a) => (
          <DropdownMenuItem
            key={a.label}
            onClick={() => {
              updateRow(config.key, row.id, a.patch(row, today) as never)
              toast.success(a.message)
            }}
          >
            {a.label}
          </DropdownMenuItem>
        ))}
        {actions.length ? <DropdownMenuSeparator /> : null}
        <DropdownMenuItem onClick={onEdit}>
          <PencilSimpleIcon />
          Ubah
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <TrashIcon />
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
