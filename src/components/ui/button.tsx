import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        destructive: "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-lg hover:shadow-xl hover:shadow-destructive/25 hover:-translate-y-0.5 active:translate-y-0",
        outline: "border-2 border-primary/20 bg-gradient-to-r from-background to-background/80 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-foreground",
        secondary: "bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
        ghost: "hover:bg-gradient-to-r hover:from-accent/80 hover:to-accent hover:text-accent-foreground hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        premium: "bg-gradient-to-r from-primary via-primary to-blue-600 text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/30 before:via-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-500",
        luxury: "bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 hover:scale-105 active:scale-100 active:translate-y-0 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/40 before:via-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-500",
        glass: "bg-white/10 backdrop-blur-xl border border-white/20 text-foreground shadow-xl hover:bg-white/20 hover:border-white/30 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0"
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
