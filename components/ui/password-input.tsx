"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react"
import { cn } from "cn"

export function PasswordInput({
  className,
  ref,
  ...props
}: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)} // Add right padding so text doesn't hide behind the icon
        ref={ref}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        // Clean focus rings matching Shadcn's default styling
        className="absolute inset-y-0 right-0 flex items-center rounded-r-md pr-3 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
        aria-label={
          showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
        }
      >
        {showPassword ? (
          <EyeSlashIcon size={20} weight="regular" aria-hidden="true" />
        ) : (
          <EyeIcon size={20} weight="regular" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
