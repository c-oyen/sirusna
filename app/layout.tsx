import type { Metadata, Viewport } from "next"
import { Geist_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

const spaceGroteskHeading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: { default: "SIRUSNA", template: "%s | SIRUSNA" },
  description:
    "Sistem Informasi Rumah Susun Sewa: kelola hunian, penghuni, tagihan, dan layanan rusun.",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a14" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        ibmPlexSans.variable,
        spaceGroteskHeading.variable
      )}
    >
      <body>
        <ThemeProvider>
          {children}
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
