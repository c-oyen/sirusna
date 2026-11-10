"use client"

import * as React from "react"
import Link from "next/link"
import { BellIcon, CheckIcon } from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useNotifications } from "@/lib/notifications"
import { markNotificationsRead } from "@/lib/store"
import { cn } from "@/lib/utils"

const DOT: Record<string, string> = {
  danger: "bg-destructive",
  warning: "bg-amber-500",
  info: "bg-sky-500",
}

export default function NotificationPopover() {
  const items = useNotifications()
  const [open, setOpen] = React.useState(false)
  const unread = items.filter((n) => n.unread)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="relative rounded-full"
            aria-label={
              unread.length
                ? `Notifikasi, ${unread.length} belum dibaca`
                : "Notifikasi"
            }
          />
        }
      >
        <BellIcon
          className={cn(
            "h-[1.2rem] w-[1.2rem] origin-top",
            unread.length > 0 && "animate-ring"
          )}
        />
        {unread.length > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
          >
            {unread.length}
          </Badge>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 sm:w-96" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="text-sm font-semibold">Notifikasi</span>
          {unread.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markNotificationsRead(unread.map((n) => n.id))}
              className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <CheckIcon className="mr-1 h-3 w-3" />
              Tandai semua dibaca
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Tidak ada notifikasi.
            </div>
          ) : (
            <ul className="flex flex-col">
              {items.map((n) => (
                <li key={n.id} className="border-b last:border-b-0">
                  <Link
                    href={n.href}
                    onClick={() => {
                      markNotificationsRead([n.id])
                      setOpen(false)
                    }}
                    className={cn(
                      "flex items-start gap-3 p-4 transition-colors outline-none hover:bg-muted/50 focus-visible:bg-muted/50",
                      n.unread ? "bg-muted/20" : "opacity-70"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-1.5 size-2 shrink-0 rounded-full",
                        DOT[n.tone]
                      )}
                    />
                    <span className="flex-1 space-y-1">
                      <span className="block text-sm leading-none font-medium">
                        {n.title}
                      </span>
                      <span className="line-clamp-2 block text-xs text-muted-foreground">
                        {n.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
