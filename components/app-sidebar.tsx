"use client"

import * as React from "react"
import Link from "next/link"
import {
  BuildingsIcon,
  CalendarIcon,
  ChartBarIcon,
  ClipboardIcon,
  ClipboardTextIcon,
  DoorOpenIcon,
  FilePdfIcon,
  FileTextIcon,
  GearIcon,
  ReceiptIcon,
  SquaresFourIcon,
  UsersIcon,
  UsersThreeIcon,
  WarningCircleIcon,
  WrenchIcon,
} from "@phosphor-icons/react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NAV_MAIN, NAV_SECONDARY } from "@/lib/navigation"
import { useDb } from "@/lib/store"

const ICONS: Record<string, React.ReactNode> = {
  "/administrasi": <SquaresFourIcon />,
  "/administrasi/rusun": <BuildingsIcon />,
  "/administrasi/pengajuan": <ClipboardTextIcon />,
  "/administrasi/penghuni": <UsersThreeIcon />,
  "/administrasi/unit": <DoorOpenIcon />,
  "/administrasi/transaksi": <ReceiptIcon />,
  "/administrasi/kontrak": <FileTextIcon />,
  "/administrasi/pemeliharaan": <WrenchIcon />,
  "/administrasi/pengaduan": <WarningCircleIcon />,
  "/administrasi/inspeksi": <ClipboardIcon />,
  "/administrasi/jadwal": <CalendarIcon />,
  "/administrasi/laporan": <ChartBarIcon />,
  "/administrasi/dokumen": <FilePdfIcon />,
  "/administrasi/manajemen-user": <UsersIcon />,
  "/administrasi/pengaturan": <GearIcon />,
}

const withIcons = (items: { title: string; url: string }[]) =>
  items.map((i) => ({ ...i, icon: ICONS[i.url] }))

const navMain = withIcons(NAV_MAIN)
const navSecondary = withIcons(NAV_SECONDARY)

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const db = useDb()
  const admin = db.user.find((u) => u.role === "Administrator") ?? db.user[0]
  const user = {
    name: admin?.nama ?? "Administrator",
    email: admin?.email ?? "",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/administrasi" />}
            >
              <BuildingsIcon className="size-5!" />
              <span className="text-base font-semibold">
                {db.settings.namaAplikasi}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
