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
          "relative flex items-center rounded-md border border-input bg-background px-3 ring-offset-background transition focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          wrapperClassName,
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        {leadingIcon ? (
          <span className="mr-2 inline-flex items-center justify-center text-primary">
            {leadingIcon}
          </span>
        ) : null}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full bg-transparent text-sm text-secondary placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed dark:text-white",
            className
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        {trailingIcon ? (
          <span className="ml-2 inline-flex items-center justify-center text-muted-foreground">
            {trailingIcon}
          </span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

