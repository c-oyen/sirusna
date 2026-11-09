"use client"

import { useState, useEffect } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BellIcon as IconBell,
  CheckIcon as IconCheck,
  EnvelopeIcon as IconMail,
  WarningCircleIcon as IconAlertCircle,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

// 1. Data simulasi dalam Bahasa Indonesia
const initialNotifications = [
  {
    id: "1",
    title: "Pesanan baru diterima",
    description: "Pesanan #1234 berhasil dibuat.",
    time: "5 mnt yang lalu",
    unread: true,
    icon: IconBell,
  },
  {
    id: "2",
    title: "Pembaruan Sistem",
    description: "Sistem akan dimatikan untuk pemeliharaan pada jam 2 pagi.",
    time: "1 jam yang lalu",
    unread: true,
    icon: IconAlertCircle,
  },
  {
    id: "3",
    title: "Pesan baru",
    description: "Alice meninggalkan komentar di kiriman Anda.",
    time: "2 jam yang lalu",
    unread: false,
    icon: IconMail,
  },
]

export default function NotificationPopover() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [isRinging, setIsRinging] = useState(false)

  // Menghitung jumlah notifikasi yang belum dibaca
  const unreadCount = notifications.filter((n) => n.unread).length

  // Efek untuk memicu animasi lonceng ketika ada notifikasi baru/belum dibaca
  useEffect(() => {
    if (unreadCount > 0) {
      // Menunda state update agar tidak berjalan sinkron sesaat setelah render
      const startTimer = setTimeout(() => setIsRinging(true), 0)

      // Matikan animasi setelah 2.5 detik agar tidak mengganggu
      const stopTimer = setTimeout(() => setIsRinging(false), 2500)

      return () => {
        clearTimeout(startTimer)
        clearTimeout(stopTimer)
      }
    }
  }, [unreadCount])

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    )
  }

  return (
    <>
      {/* CSS Keyframes disematkan langsung agar animasi berjalan tanpa perlu edit tailwind.config */}
      <style>{`
        @keyframes ring {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          50% { transform: rotate(-10deg); }
          75% { transform: rotate(5deg); }
        }
      `}</style>

      <Popover>
        {/* TRIGGER MENGGUNAKAN BASE UI (render prop) */}
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-full"
            />
          }
        >
          <IconBell
            className="h-[1.2rem] w-[1.2rem] origin-top"
            style={{
              animation: isRinging ? "ring 0.5s ease-in-out 5" : "none",
            }}
          />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </PopoverTrigger>

        {/* CONTENT */}
        <PopoverContent className="w-80 p-0 sm:w-96" align="end">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="text-sm font-semibold">Notifikasi</span>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <IconCheck className="mr-1 h-3 w-3" />
                Tandai semua dibaca
              </Button>
            )}
          </div>

          {/* Scrollable Body */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Tidak ada notifikasi baru.
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-4 border-b p-4 transition-colors last:border-b-0 hover:bg-muted/50",
                      notification.unread ? "bg-muted/20" : "opacity-70"
                    )}
                  >
                    <div className="mt-0.5 rounded-full bg-primary/10 p-2">
                      <notification.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {notification.title}
                      </p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {notification.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground/80">
                        {notification.time}
                      </p>
                    </div>
                    {/* Indikator titik untuk yang belum dibaca */}
                    {notification.unread && (
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-2">
            <Button variant="ghost" className="w-full text-xs" size="sm">
              Lihat semua notifikasi
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
