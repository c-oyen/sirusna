"use client"

import * as React from "react"

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

import {
  SquaresFourIcon,
  BuildingsIcon,
  ClipboardTextIcon,
  UsersThreeIcon,
  DoorOpenIcon,
  ReceiptIcon,
  FileTextIcon,
  WrenchIcon,
  WarningCircleIcon,
  ClipboardIcon,
  ChartBarIcon,
  FilePdfIcon,
  UsersIcon,
  GearIcon,
  CommandIcon,
} from "@phosphor-icons/react"

const data = {
  user: {
    name: "admin",
    email: "admin@sirusna.bangka.go.id",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Dasbor",
      url: "/administrasi",
      icon: <SquaresFourIcon />,
    },
    {
      title: "Data Rusun",
      url: "/administrasi/rusun",
      icon: <BuildingsIcon />,
    },
    {
      title: "Pengajuan Rusun",
      url: "/administrasi/pengajuan",
      icon: <ClipboardTextIcon />,
    },
    {
      title: "Data Penghuni",
      url: "/administrasi/penghuni",
      icon: <UsersThreeIcon />,
    },
    {
      title: "Unit Hunian",
      url: "/administrasi/unit",
      icon: <DoorOpenIcon />,
    },
    {
      title: "Tagihan & Transaksi",
      url: "/administrasi/transaksi",
      icon: <ReceiptIcon />,
    },
    {
      title: "Kontrak Sewa",
      url: "/administrasi/kontrak",
      icon: <FileTextIcon />,
    },
    {
      title: "Pemeliharaan",
      url: "/administrasi/pemeliharaan",
      icon: <WrenchIcon />,
    },
    {
      title: "Pengaduan",
      url: "/administrasi/pengaduan",
      icon: <WarningCircleIcon />,
    },
    {
      title: "Inspeksi Hunian",
      url: "/administrasi/inspeksi",
      icon: <ClipboardIcon />,
    },
    {
      title: "Laporan",
      url: "/administrasi/laporan",
      icon: <ChartBarIcon />,
    },
  ],

  navSecondary: [
    {
      title: "Dokumen",
      url: "/administrasi/dokumen",
      icon: <FilePdfIcon />,
    },
    {
      title: "Manajemen User",
      url: "/administrasi/manajemen-user",
      icon: <UsersIcon />,
    },
    {
      title: "Pengaturan",
      url: "/administrasi/pengaturan",
      icon: <GearIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">Acme Inc.</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
