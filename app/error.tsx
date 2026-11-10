"use client"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-heading text-2xl font-bold">Terjadi kesalahan</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {error.message || "Silakan coba lagi."}
      </p>
      <Button onClick={reset}>Coba Lagi</Button>
    </main>
  )
}
