"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, leadingIcon, trailingIcon, disabled, ...props },
    ref
  ) => {
    return (
      <div
        className={cn(
          "relative flex items-center rounded-[calc(var(--radius)_-_0.5rem)] border border-input/80 bg-white/80 px-4 shadow-sm ring-offset-background transition focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 dark:bg-card/80",
          disabled && "opacity-60"
        )}
      >
        {leadingIcon ? (
          <span className="mr-3 inline-flex h-10 w-10 items-center justify-center text-primary">
            {leadingIcon}
          </span>
        ) : null}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed",
            className
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        {trailingIcon ? (
          <span className="ml-3 inline-flex h-10 w-10 items-center justify-center text-muted-foreground">
            {trailingIcon}
          </span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
