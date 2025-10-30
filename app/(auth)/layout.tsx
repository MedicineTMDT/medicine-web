"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 hidden lg:block" aria-hidden>
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

      <div className="relative hidden w-0 flex-1 flex-col justify-between px-12 py-10 text-[rgb(229,243,255)] dark:text-white lg:flex">
        <Logo className="text-[rgb(229,243,255)] dark:text-white" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-lg space-y-6"
        >
          <h1 className="text-4xl font-semibold leading-tight">
            Your trusted partner for accessible medical intelligence.
          </h1>
          <p className="text-lg text-[rgba(229,243,255,0.82)] dark:text-white/80">
            Access evidence-based insights, personalized tools, and expert-written guides
            designed to support confident healthcare decisions.
          </p>
        </motion.div>
        <div className="space-y-3 text-sm text-[rgba(229,243,255,0.64)] dark:text-white/70">
          <span>
            © {new Date().getFullYear()} AnalyticsPill. Educational use only.
          </span>
          <div className="flex gap-4">
            <Link
              href="/legal/terms"
              className="hover:text-[rgb(229,243,255)] dark:hover:text-white"
            >
              Terms
            </Link>
            <Link
              href="/legal/privacy"
              className="hover:text-[rgb(229,243,255)] dark:hover:text-white"
            >
              Privacy
            </Link>
            <Link
              href="/legal/disclaimer"
              className="hover:text-[rgb(229,243,255)] dark:hover:text-white"
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </div>

      <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 py-12 dark:bg-secondary lg:w-[480px] lg:px-12">
        <div className="absolute top-6 left-6 lg:hidden">
          <Logo compact />
        </div>
        {children}
      </div>
    </div>
  );
}
