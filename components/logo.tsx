"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  compact?: boolean;
};

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <motion.div
      className={cn("flex items-center font-heading", className)}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Link
        href="/"
        className="group flex items-center gap-2 rounded-2xl border border-border/30 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-secondary/60 dark:hover:border-primary/40 dark:hover:bg-secondary/80"
      >
        {/* Logo icon with subtle animation */}
        <motion.div
          className="flex items-center justify-center"
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src="/MedLogo.svg"
            alt="MedLogo"
            width={26}
            height={26}
            className="h-6.5 w-6.5"
          />
        </motion.div>
        
        {/* Text content */}
        {!compact && (
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight text-secondary dark:text-white">
              AnalyticsPill
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary/70 dark:text-accent/70">
              Knowledge
            </span>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
