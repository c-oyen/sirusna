"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { unitLabelLengkap } from "@/lib/lookup"
import { NAV_ALL } from "@/lib/navigation"
import { useDb } from "@/lib/store"

const BASE = "/administrasi"

export function AdminSearch() {
  const router = useRouter()
  const db = useDb()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  function go(href: string) {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        aria-label="Buka pencarian"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:w-64 lg:w-80"
      >
        <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Pencarian...</span>
        <span className="inline-flex lg:hidden">Cari...</span>
        <kbd className="pointer-events-none absolute top-1.5 right-1.5 hidden h-6 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium select-none sm:flex">
          Ctrl K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Pencarian"
        description="Cari halaman, penghuni, unit, atau pengajuan"
      >
        <Command>
          <CommandInput placeholder="Cari halaman, penghuni, unit, pengajuan…" />
          <CommandList>
            <CommandEmpty>Tidak ada hasil.</CommandEmpty>
            <CommandGroup heading="Halaman">
              {NAV_ALL.map((n) => (
                <CommandItem
                  key={n.url}
                  value={`halaman ${n.title}`}
                  onSelect={() => go(n.url)}
                >
                  {n.title}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Penghuni">
              {db.penghuni.map((p) => (
                <CommandItem
                  key={p.id}
                  value={`penghuni ${p.nama} ${p.nik}`}
                  onSelect={() => go(`${BASE}/penghuni`)}
                >
                  {p.nama}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {p.nik}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Unit">
              {db.unit.map((u) => (
                <CommandItem
                  key={u.id}
                  value={`unit ${unitLabelLengkap(db, u.id)}`}
                  onSelect={() => go(`${BASE}/unit`)}
                >
                  {unitLabelLengkap(db, u.id)}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Pengajuan">
              {db.pengajuan.map((p) => (
                <CommandItem
                  key={p.id}
                  value={`pengajuan ${p.nomor} ${p.nama}`}
                  onSelect={() => go(`${BASE}/pengajuan`)}
                >
                  {p.nama}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {p.nomor}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
