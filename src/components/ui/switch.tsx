"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { CheckIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Switch({
  className,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const [internalChecked, setInternalChecked] = React.useState(
    defaultChecked ?? false
  )

  const checked =
    checkedProp !== undefined ? checkedProp : internalChecked

  const handleCheckedChange = (value: boolean) => {
    if (checkedProp === undefined) {
      setInternalChecked(value)
    }
    onCheckedChange?.(value)
  }

  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={handleCheckedChange}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full shadow-blue-800 shadow-inner ",
        "bg-input/50 data-[state=checked]:bg-primary",
        "transition-colors duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className="
          flex items-center justify-center
          size-[18px]
          rounded-full
          bg-background
          shadow-sm
          translate-x-[3px]
          transition-transform duration-300
          ease-[cubic-bezier(0.16,1,0.3,1)]
          data-[state=checked]:translate-x-[23px] "
      >
        {checked ? (
          <CheckIcon className="size-3 text-primary" />
        ) : (
          <XIcon className="size-3 text-primary" />
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }