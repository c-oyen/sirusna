"use client"

import * as React from "react"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { inputSchemas, type Db } from "@/lib/schemas"
import type { EntityConfig, FieldDef, Row } from "@/components/crud/types"

type Values = Record<string, string>

function initialValues(
  config: EntityConfig,
  db: Db,
  today: string,
  row: Row | null
): Values {
  const base: Values = {}
  for (const f of config.fields) {
    if (f.type === "select" && !f.optional && !f.relation && f.options) {
      base[f.name] = f.options[0]
    } else {
      base[f.name] = ""
    }
  }
  if (row) {
    for (const f of config.fields) base[f.name] = String(row[f.name] ?? "")
    return base
  }
  return { ...base, ...(config.defaults?.(today, db) ?? {}) }
}

function toPayload(config: EntityConfig, values: Values) {
  const out: Record<string, unknown> = {}
  for (const f of config.fields) {
    const raw = values[f.name] ?? ""
    out[f.name] =
      f.type === "number" ? (raw.trim() === "" ? undefined : Number(raw)) : raw
  }
  return out
}

export function EntityForm({
  config,
  db,
  today,
  row,
  onSubmit,
}: {
  config: EntityConfig
  db: Db
  today: string
  row: Row | null
  onSubmit: (data: Record<string, unknown>) => void
}) {
  const formId = React.useId()
  const [values, setValues] = React.useState<Values>(() =>
    initialValues(config, db, today, row)
  )
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const set = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => {
      if (!e[name]) return e
      const next = { ...e }
      delete next[name]
      return next
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const payload = toPayload(config, values)
    const schema = inputSchemas[
      config.key as keyof typeof inputSchemas
    ] as unknown as z.ZodType
    const result = schema.safeParse(payload)
    const found: Record<string, string> = {}
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "")
        if (key && !found[key]) found[key] = issue.message
      }
    }
    if (result.success) {
      Object.assign(found, config.validate?.(payload, db, row?.id) ?? {})
    }
    if (Object.keys(found).length > 0) {
      setErrors(found)
      const first = config.fields.find((f) => found[f.name])
      if (first) document.getElementById(`${formId}-${first.name}`)?.focus()
      return
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <DialogHeader>
        <DialogTitle>
          {row ? `Ubah ${config.singular}` : config.addLabel}
        </DialogTitle>
        <DialogDescription>
          Kolom bertanda <span aria-hidden="true">*</span>
          <span className="sr-only">bintang</span> wajib diisi.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 sm:grid-cols-2">
        {config.fields.map((f) => (
          <Field
            key={f.name}
            id={`${formId}-${f.name}`}
            field={f}
            db={db}
            values={values}
            error={errors[f.name]}
            onChange={(v) => set(f.name, v)}
          />
        ))}
      </div>

      <DialogFooter>
        <Button type="submit">{row ? "Simpan Perubahan" : "Simpan"}</Button>
      </DialogFooter>
    </form>
  )
}

function Field({
  id,
  field,
  db,
  values,
  error,
  onChange,
}: {
  id: string
  field: FieldDef
  db: Db
  values: Values
  error?: string
  onChange: (value: string) => void
}) {
  const value = values[field.name] ?? ""
  const errorId = `${id}-error`
  const common = {
    id,
    name: field.name,
    value,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  } as const

  let control: React.ReactNode
  if (field.type === "select") {
    let options: { value: string; label: string }[]
    let emptyLabel: string | null
    if (field.relation) {
      const rel = field.relation
      const rows = db[rel.entity] as unknown as Row[]
      options = rows
        .filter((r) => (rel.filter ? rel.filter(r, db, values) : true))
        .map((r) => ({ value: r.id, label: rel.label(r, db) }))
        .sort((a, b) => a.label.localeCompare(b.label, "id"))
      emptyLabel = rel.optional ? "— Tidak ada —" : "Pilih…"
    } else {
      options = (field.options ?? []).map((o) => ({ value: o, label: o }))
      emptyLabel = field.optional ? "— Tidak ada —" : null
    }
    control = (
      <NativeSelect {...common} onChange={(e) => onChange(e.target.value)}>
        {emptyLabel !== null ? <option value="">{emptyLabel}</option> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </NativeSelect>
    )
  } else if (field.type === "textarea") {
    control = (
      <Textarea
        {...common}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  } else {
    control = (
      <Input
        {...common}
        type={field.type}
        inputMode={field.inputMode}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        min={field.type === "number" ? 0 : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }

  return (
    <div className={field.wide ? "space-y-2 sm:col-span-2" : "space-y-2"}>
      <Label htmlFor={id}>
        {field.label}
        {field.required ? (
          <span aria-hidden="true" className="text-destructive">
            *
          </span>
        ) : null}
      </Label>
      {control}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
