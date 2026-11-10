/** Builds a UTF-8 (with BOM, so Excel reads accents correctly) CSV download. */
export function downloadCsv(
  filename: string,
  headers: string[],
  rows: (string | number)[][]
) {
  const esc = (v: string | number) => {
    const s = String(v)
    // Neutralise spreadsheet formula injection.
    const safe = /^[=+\-@\t\r]/.test(s) && Number.isNaN(Number(s)) ? `'${s}` : s
    return /[",\n\r;]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
  }
  const body = [headers, ...rows].map((r) => r.map(esc).join(",")).join("\r\n")
  const blob = new Blob(["﻿" + body], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
