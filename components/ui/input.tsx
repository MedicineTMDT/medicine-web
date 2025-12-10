"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, wrapperClassName, type, leadingIcon, trailingIcon, disabled, ...props },
    ref
  ) => {
    return (
      <div
        className={cn(
          "relative flex items-center rounded-[calc(var(--radius)_-_0.5rem)] border border-input/80 bg-white px-4 shadow-sm ring-offset-background transition focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 dark:border-white/20 dark:bg-slate-800",
          wrapperClassName,
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
            "flex h-12 w-full bg-transparent text-base text-secondary placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed dark:text-white",
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
