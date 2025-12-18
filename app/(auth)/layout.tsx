"use client";

import { Logo } from "@/components/logo";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";



// Animated blob component
function AnimatedBlob({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: [0.4, 0.6, 0.4],
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
      }}
      transition={{ 
        duration: 20,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
      className={className}
    />
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#031123] via-[#08203A] to-[#0A2746]">
      {/* Animated gradient background */}
      <div className="absolute inset-0" aria-hidden>
        {/* Primary gradient mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(2,135,190,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,194,255,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(2,135,190,0.1),transparent_70%)]" />
        
        {/* Animated blobs */}
        <AnimatedBlob 
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-3xl"
          delay={0}
        />
        <AnimatedBlob 
          className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-accent/25 to-primary/15 blur-3xl"
          delay={5}
        />
        <AnimatedBlob 
          className="absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/20 to-accent/10 blur-3xl"
          delay={10}
        />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>



      {/* Main content container */}
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-10 text-white sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-12">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex w-full max-w-xl flex-col items-center gap-8 text-center lg:w-1/2 lg:items-start lg:text-left"
        >
          {/* Logo with glow effect */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl" />
            <Logo className="relative text-white" />
          </div>

          {/* Tagline section */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 backdrop-blur-sm">
                Trusted by Healthcare Professionals
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem]"
            >
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Clinical intel for
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                every workflow.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-base text-white/70 sm:text-lg"
            >
              Search meds, run interaction checks, and keep patient tools in one streamlined workspace.
            </motion.p>
          </div>

          {/* Feature pills */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            {["Drug Monographs", "Interaction Alerts", "Clinical Tools"].map((feature, index) => (
              <motion.span
                key={feature}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm"
              >
                {feature}
              </motion.span>
            ))}
          </motion.div>

          {/* Footer links */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4 text-sm text-white/50 lg:justify-start"
          >
            <Link href="/legal/terms" className="transition hover:text-white/80">
              Terms
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/legal/privacy" className="transition hover:text-white/80">
              Privacy
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/legal/disclaimer" className="transition hover:text-white/80">
              Disclaimer
            </Link>
            <span className="hidden text-xs uppercase tracking-[0.2em] text-white/40 lg:block">
              © {new Date().getFullYear()} AnalyticsPill
            </span>
          </motion.div>
        </motion.div>

        {/* Right side - Form container */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex w-full max-w-md items-center justify-center lg:max-w-lg"
        >
          {children}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#031123] to-transparent" />
    </div>
  );
}
