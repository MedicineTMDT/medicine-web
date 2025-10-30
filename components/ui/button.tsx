"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[calc(var(--radius)_-_0.25rem)] text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_20px_40px_-20px_rgba(2,135,190,0.65)] hover:shadow-[0_24px_50px_-22px_rgba(2,135,190,0.70)] hover:bg-[#0274a4]",
        outline:
          "border border-primary/50 bg-transparent text-primary hover:bg-primary/10 hover:text-primary",
        ghost:
          "text-foreground hover:text-primary hover:bg-primary/10 active:bg-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground shadow-card hover:bg-[#12395f]",
        muted:
          "bg-muted text-muted-foreground hover:bg-muted/90 hover:text-foreground",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 rounded-xl px-4 text-sm",
        lg: "h-12 rounded-[1.5rem] px-7 text-base",
        icon: "h-10 w-10 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
