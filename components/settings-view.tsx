"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  ArrowCounterClockwiseIcon,
  DownloadSimpleIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { settingsSchema, type Settings } from "@/lib/schemas"
import { readDb, resetDb, restoreDb, saveSettings, useDb } from "@/lib/store"

type FieldSpec = {
  name: keyof Settings
  label: string
  kind: "text" | "email" | "tel" | "number" | "textarea"
  hint?: string
}

const IDENTITAS: FieldSpec[] = [
  { name: "namaAplikasi", label: "Nama Aplikasi", kind: "text" },
  { name: "instansi", label: "Nama Instansi", kind: "text" },
  { name: "alamat", label: "Alamat Instansi", kind: "textarea" },
  { name: "email", label: "Email Instansi", kind: "email" },
  { name: "telepon", label: "Telepon Instansi", kind: "tel" },
]

const TARIF: FieldSpec[] = [
  {
    name: "tarif",
    label: "Tarif Sewa Bulanan Default (Rp)",
    kind: "number",
    hint: "Dipakai sebagai nilai awal pada kontrak dan tagihan baru.",
  },
  {
    name: "jatuhTempo",
    label: "Tanggal Jatuh Tempo (1–31)",
    kind: "number",
    hint: "Tanggal tagihan bulanan jatuh tempo.",
  },
  {
    name: "denda",
    label: "Denda Keterlambatan (%)",
    kind: "number",
    hint: "Persentase denda dari tagihan.",
  },
]

function SettingsSection({
  title,
  description,
  fields,
  settings,
}: {
  title: string
  description: string
  fields: FieldSpec[]
  settings: Settings
}) {
  const [values, setValues] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, String(settings[f.name])]))
  )
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const candidate: Record<string, unknown> = { ...settings }
    for (const f of fields) {
      const raw = values[f.name] ?? ""
      candidate[f.name] =
        f.kind === "number"
          ? raw.trim() === ""
            ? undefined
            : Number(raw)
          : raw
    }
    const result = settingsSchema.safeParse(candidate)
    if (!result.success) {
      const found: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "")
        if (key && !found[key]) found[key] = issue.message
      }
      setErrors(found)
      return
    }
    setErrors({})
    saveSettings(result.data)
    toast.success("Pengaturan disimpan")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} noValidate className="max-w-xl space-y-4">
          {fields.map((f) => {
            const id = `set-${f.name}`
            const err = errors[f.name]
            const props = {
              id,
              name: f.name,
              value: values[f.name] ?? "",
              "aria-invalid": err ? true : undefined,
              "aria-describedby": err
                ? `${id}-err`
                : f.hint
                  ? `${id}-hint`
                  : undefined,
              onChange: (
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => setValues((v) => ({ ...v, [f.name]: e.target.value })),
            }
            return (
              <div key={f.name} className="space-y-2">
                <Label htmlFor={id}>{f.label}</Label>
                {f.kind === "textarea" ? (
                  <Textarea {...props} />
                ) : (
                  <Input
                    {...props}
                    type={f.kind}
                    min={f.kind === "number" ? 0 : undefined}
                  />
                )}
                {f.hint && !err ? (
                  <p
                    id={`${id}-hint`}
                    className="text-xs text-muted-foreground"
                  >
                    {f.hint}
                  </p>
                ) : null}
                {err ? (
                  <p
                    id={`${id}-err`}
                    role="alert"
                    className="text-xs text-destructive"
                  >
                    {err}
                  </p>
                ) : null}
              </div>
            )
          })}
          <Button type="submit">Simpan Pengaturan</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function SettingsView() {
  const db = useDb()
  const fileRef = React.useRef<HTMLInputElement>(null)
  const [confirmReset, setConfirmReset] = React.useState(false)
  // Re-mount sections when stored settings change (e.g. after hydration or restore).
  const version = JSON.stringify(db.settings)

  function backup() {
    const blob = new Blob([JSON.stringify(readDb(), null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sirusna-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    toast.success("Cadangan data diunduh")
  }

  async function restore(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    try {
      const ok = restoreDb(JSON.parse(await file.text()))
      if (ok) toast.success("Data berhasil dipulihkan")
      else toast.error("Berkas cadangan tidak valid")
    } catch {
      toast.error("Berkas bukan JSON yang valid")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan"
        description="Pengaturan umum aplikasi SIRUSNA."
      />

      <SettingsSection
        key={`identitas-${version}`}
        title="Identitas Aplikasi"
        description="Informasi instansi dan identitas aplikasi."
        fields={IDENTITAS}
        settings={db.settings}
      />
      <SettingsSection
        key={`tarif-${version}`}
        title="Pengaturan Tarif"
        description="Konfigurasi tarif dan pembayaran sewa rusun."
        fields={TARIF}
        settings={db.settings}
      />

      <Card>
        <CardHeader>
          <CardTitle>Data Aplikasi</CardTitle>
          <CardDescription>
            Data disimpan di peramban ini. Cadangkan secara berkala atau
            pindahkan ke perangkat lain.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={backup}>
              <DownloadSimpleIcon />
              Unduh Cadangan
            </Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <UploadSimpleIcon />
              Pulihkan dari Berkas
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              tabIndex={-1}
              aria-label="Berkas cadangan"
              onChange={restore}
            />
          </div>
          <Separator />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Kembalikan semua data ke contoh awal. Tindakan ini tidak dapat
              dibatalkan.
            </p>
            <Button variant="destructive" onClick={() => setConfirmReset(true)}>
              <ArrowCounterClockwiseIcon />
              Atur Ulang Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atur ulang semua data?</DialogTitle>
            <DialogDescription>
              Seluruh perubahan Anda akan diganti dengan data contoh awal.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmReset(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetDb()
                setConfirmReset(false)
                toast.success("Data diatur ulang")
              }}
            >
              Atur Ulang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
