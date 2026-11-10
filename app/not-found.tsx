import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-heading text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Halaman tidak ditemukan.</p>
      <Link href="/administrasi" className={buttonVariants()}>
        Kembali ke Dasbor
      </Link>
    </main>
  )
}
