import * as React from "react"
import { CaretDownIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

function NativeSelect({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative w-full">
      <select
        data-slot="native-select"
        className={cn(
          "h-7 w-full min-w-0 appearance-none rounded-md border border-input bg-input/20 pr-7 pl-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-xs/relaxed dark:bg-input/30 dark:[&>option]:bg-popover",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <CaretDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  )
}

export { NativeSelect }
