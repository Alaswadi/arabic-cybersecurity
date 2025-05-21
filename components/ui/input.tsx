import * as React from "react"

import { cn } from "@/lib/utils"
import { adminTheme } from "@/lib/admin-theme"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    // Default styles for admin pages
    const defaultStyle = {
      backgroundColor: adminTheme.colors.background.card,
      borderColor: adminTheme.colors.border.main,
      color: adminTheme.colors.text.primary
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        style={{
          ...defaultStyle,
          ...(props.style || {})
        }}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
