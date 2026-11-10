"use client"

import { usePathname } from "next/navigation"

import { AdminSearch } from "@/components/admin-search"
import { ModeToggle } from "@/components/mode-toggle"
import NotificationPopover from "@/components/notification/popover"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { titleForPath } from "@/lib/navigation"

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full min-w-0 items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <p className="truncate text-base font-medium">
          {titleForPath(pathname)}
        </p>
      </div>
      <div className="flex w-fit items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <AdminSearch />
        <NotificationPopover />
        <ModeToggle />
      </div>
    </header>
  )
}
