"use client";

import Link from "next/link";
import { Pill } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  compact?: boolean;
};

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <motion.div
      className={cn("flex items-center gap-2 font-heading text-xl", className)}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Link
        href="/"
        className="group flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 shadow-sm ring-1 ring-border/40 transition hover:bg-white"
      >
        <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Pill className="h-5 w-5" aria-hidden />
        </span>
        {!compact && (
          <span className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-secondary">
              AnalyticsPill
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Knowledge
            </span>
          </span>
        )}
      </Link>
    </motion.div>
  );
}
