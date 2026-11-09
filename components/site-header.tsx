"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import NotificationPopover from "@/components/notification/popover"
import { AdminSearch } from "@/components/admin-search"

export function SiteHeader() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const pageTitle =
    segments.length === 1 ? segments[0] : segments[1].split("-").join(" ")
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <h1 className="text-base font-medium capitalize">{pageTitle}</h1>
      </div>
      <div className="flex w-fit items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <AdminSearch />
        <NotificationPopover />
        <ModeToggle />
      </div>
    </header>
  )
}
