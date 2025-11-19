"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-8 lg:px-12">
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1600&q=80"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-auth-pattern mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#051629]/90 via-[#0b2746]/92 to-[#061222]/94" />
      </div>

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-10 text-white lg:flex-row lg:items-center lg:justify-between lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex w-full max-w-xl flex-col items-center gap-6 text-center lg:w-1/2 lg:items-start lg:text-left"
        >
          <Logo className="text-white" />
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold leading-tight sm:text-[2.75rem]">
              Clinical intel for every workflow.
            </h1>
            <p className="text-base text-white/80 sm:text-lg">
              Search meds, run interaction checks, and keep patient tools in one streamlined workspace.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/70 lg:justify-start">
            <Link href="/legal/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/legal/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/legal/disclaimer" className="hover:text-white">
              Disclaimer
            </Link>
            <span className="basis-full text-center text-xs uppercase tracking-[0.3em] text-white/60 lg:basis-auto lg:text-left">
              © {new Date().getFullYear()} AnalyticsPill
            </span>
          </div>
        </motion.div>

        <div className="flex w-full max-w-md -translate-x-6 items-center justify-center lg:-translate-x-14">
          {children}
        </div>
      </div>
    </div>
  );
}
