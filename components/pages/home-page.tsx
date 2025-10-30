"use client";

import { CategoryCard } from "@/components/cards/category-card";
import { NewsCard } from "@/components/cards/news-card";
import { ToolCard } from "@/components/cards/tool-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { categories, featureHighlights, news, tools } from "@/lib/mockData";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenCheck,
  HeartPulse,
  Microscope,
  Pill,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const heroActions = [
  { icon: Pill, label: "Drug Info", href: "/drugs" },
  { icon: Microscope, label: "Interactions", href: "/interactions" },
  { icon: HeartPulse, label: "Pill ID", href: "/pill-identifier" },
  { icon: BookOpenCheck, label: "Health Tools", href: "/tools" },
];

export function HomePageScreen() {
  return (
    <div className="relative pb-24">
      {/* ========== HERO SECTION ========== */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-b-[3rem] bg-secondary/90">
          <Image
            src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1920&q=80"
            alt="Medical background"
            fill
            className="object-cover opacity-40 dark:opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#051A2C]/60 via-[#0B2746]/80 to-[#0B2746]" />
        </div>

        <div className="container relative grid gap-16 py-28 text-foreground dark:text-white lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* LEFT SIDE */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-1 text-sm font-semibold tracking-wide backdrop-blur">
              Trusted • Accurate • Up-to-date
            </span>

            <h1 className="max-w-2xl font-heading text-4xl font-semibold leading-tight md:text-5xl">
              Your Trusted Medical Information Source
            </h1>

            <p className="max-w-2xl text-lg text-muted-foreground dark:text-white/90">
              Search medications, check interactions, identify pills, and access
              reliable health information for confident decision-making.
            </p>

            {/* Search card */}
            <div className="rounded-[calc(var(--radius)_+_0.75rem)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-glass backdrop-blur-lg transition-colors hover:bg-[var(--glass-hover)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
              <form className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Input
                  placeholder="Search for medications, conditions, or symptoms..."
                  className="h-14 rounded-[calc(var(--radius)_-_0.25rem)] border-[var(--input)] text-base text-secondary placeholder:text-secondary/70 dark:border-white/20"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="h-14 rounded-[calc(var(--radius)_-_0.25rem)] bg-accent text-secondary hover:bg-accent/90"
                >
                  <Search className="mr-2 h-5 w-5" aria-hidden />
                  Search
                </Button>
              </form>

              <Separator className="my-6 border-[var(--glass-border)] bg-[var(--glass-border)] dark:border-white/10 dark:bg-white/10" />

              <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                {heroActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="group flex items-center gap-3 rounded-2xl border border-[var(--glass-border)] ] px-4 py-3 transition hover:border-[var(--ring)] hover:bg-[var(--glass-hover)] dark:border-white/10 dark:bg-white/5 dark:hover:border-white/40 dark:hover:bg-white/10"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--muted)]/40 text-secondary dark:bg-white/10 dark:text-white">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="font-semibold text-foreground dark:text-white">
                        {action.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            className="hidden rounded-[calc(var(--radius)_+_1rem)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 shadow-glass backdrop-blur-xl lg:flex lg:flex-col lg:gap-6 dark:border-white/10 dark:bg-white/10"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
          >
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground dark:text-white/60">
                Why Analytics Pill
              </p>
              <h2 className="text-3xl font-semibold leading-tight text-foreground dark:text-white">
                Clinical-grade insights for everyone
              </h2>
            </div>

            <div className="space-y-6">
              {featureHighlights.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.1 * index }}
                    className="flex items-start gap-4 rounded-2xl border border-[var(--glass-border)]  p-4 transition-colors hover:bg-[var(--glass-hover)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    <span className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--muted)]/40 text-secondary dark:bg-white/10 dark:text-white">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground dark:text-white/75">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Button
              variant="ghost"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--glass-border)] ] px-6 py-3 text-secondary hover:border-[var(--ring)] hover:bg-[var(--glass-hover)] dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/20"
              asChild
            >
              <Link href="/guides">
                Explore our resources
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ========== CATEGORIES SECTION ========== */}
      <section className="container mt-24 space-y-16">
        <motion.div
          className="space-y-4 text-center lg:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-heading font-semibold text-secondary dark:text-white">
            Popular Categories
          </h2>
          <p className="text-secondary/80 dark:text-muted-foreground">
            Quick access to the most searched medical information curated by our
            clinical experts.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.title}
              delay={index * 0.05}
              {...category}
            />
          ))}
        </div>
      </section>

      {/* ========== NEWS SECTION ========== */}
      <section className="container mt-24 space-y-10">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-3">
            <h2 className="text-3xl font-heading font-semibold text-secondary dark:text-white">
              Latest Medical News
            </h2>
            <p className="text-secondary/80 dark:text-muted-foreground">
              Stay updated with the latest healthcare developments and
              regulatory alerts.
            </p>
          </div>
          <Button variant="ghost" asChild className="text-primary">
            <Link href="/news">View All →</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {news.map((article, index) => (
            <NewsCard key={article.title} index={index} {...article} />
          ))}
        </div>
      </section>

      {/* ========== TOOLS SECTION ========== */}
      <section className="container mt-24 space-y-6">
        <div className="space-y-3 text-center md:text-left">
          <h2 className="text-3xl font-heading font-semibold text-secondary dark:text-white">
            Medical Tools & Resources
          </h2>
          <p className="text-secondary/80 dark:text-muted-foreground">
            Essential tools for medication management, dosage calculations, and
            interaction checks.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool, index) => (
            <ToolCard key={tool.title} delay={index * 0.05} {...tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
