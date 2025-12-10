"use client";

import { CategoryCard } from "@/components/cards/category-card";
import { NewsCard } from "@/components/cards/news-card";
import { ToolCard } from "@/components/cards/tool-card";
import { useTranslation } from "@/components/i18n/translation-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { FormEvent } from "react";

const heroActions = [
  { icon: Pill, labelKey: "home.actions.drugInfo", href: "/drugs" },
  { icon: Microscope, labelKey: "home.actions.interactions", href: "/interactions" },
  { icon: HeartPulse, labelKey: "home.actions.pillId", href: "/pill-identifier" },
  { icon: BookOpenCheck, labelKey: "home.actions.healthTools", href: "/tools" },
];

export function HomePageScreen() {
  const { t } = useTranslation();
  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="relative pb-24 space-y-24">
      <section className="relative overflow-hidden rounded-b-[3rem]">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1920&q=80"
            alt="Medical background"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#031123]/70 via-[#08203A]/90 to-[#0A2746]" />
        </div>

        <div className="container relative flex flex-col items-center gap-10 py-24 text-center text-secondary dark:text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl space-y-6"
          >
            <span className="inline-flex items-center justify-center rounded-full border border-[var(--glass-border)] bg-white/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-secondary dark:border-white/20 dark:bg-white/5 dark:text-white">
              {t("home.trustTagline")}
            </span>
            <h1 className="font-heading text-4xl font-semibold leading-tight text-secondary dark:text-white md:text-5xl">
              {t("home.heroTitle")}
            </h1>
            <p className="text-lg text-secondary/85 dark:text-white/85">
              {t("home.heroSubtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold text-secondary/70 dark:text-white/70">
              <span className="rounded-full bg-white/10 px-4 py-1">{t("home.heroChip.monographs")}</span>
              <span className="rounded-full bg-white/10 px-4 py-1">{t("home.heroChip.interactionAlerts")}</span>
              <span className="rounded-full bg-white/10 px-4 py-1">{t("home.heroChip.clinicalTools")}</span>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="w-full max-w-3xl rounded-[2.5rem] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                placeholder={t("home.searchPlaceholder")}
                wrapperClassName="h-14 flex-1 rounded-[calc(var(--radius)_-_0.35rem)] border-[var(--input)] bg-white/85 px-0 shadow-lg dark:border-white/20 dark:bg-white/90"
                className="rounded-[calc(var(--radius)_-_0.35rem)] border-none bg-transparent px-4 text-base text-secondary placeholder:text-secondary/60 focus-visible:ring-0 dark:text-secondary dark:placeholder:text-secondary/60"
              />
              <Button
                type="submit"
                size="lg"
                className="h-14 rounded-full bg-primary px-8 text-secondary hover:bg-primary/90"
              >
                <Search className="mr-2 h-5 w-5" aria-hidden />
                {t("actions.search")}
              </Button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {heroActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.labelKey}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.05 * index }}
                  className="rounded-3xl border border-white/10 bg-white/10 p-4 text-left"
                >
                  <Link
                    href={action.href}
                    className="flex items-center gap-4 text-secondary dark:text-white/90"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="text-base font-semibold">{t(action.labelKey)}</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="container space-y-10">
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {t("home.whyTagline")}
          </p>
          <h2 className="text-3xl font-heading font-semibold text-secondary dark:text-white">
            {t("home.whyTitle")}
          </h2>
          <p className="text-secondary/80 dark:text-muted-foreground">
            {t("home.whyDescription")}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featureHighlights.map((feature, index) => {
            const Icon = feature.icon;
            const baseKey = feature.translationKey;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
                className="rounded-[1.75rem] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 text-left shadow-glass backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--muted)]/50 text-secondary dark:bg-white/10 dark:text-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="text-xl font-semibold text-secondary dark:text-white">
                  {baseKey ? t(`${baseKey}.title`, { fallback: feature.title }) : t(feature.title, { fallback: feature.title })}
                </h3>
                <p className="mt-2 text-sm text-secondary/80 dark:text-muted-foreground">
                  {baseKey
                    ? t(`${baseKey}.description`, { fallback: feature.description })
                    : t(feature.description, { fallback: feature.description })}
                </p>
              </motion.div>
            );
          })}
        </div>
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] px-6 py-3 text-secondary hover:border-[var(--ring)] hover:bg-[var(--glass-hover)] dark:border-white/20 dark:bg-white/5 dark:text-white"
            asChild
          >
            <Link href="/guides">
              {t("home.ctaResources")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </section>

      <section className="container space-y-6">
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <h2 className="text-3xl font-heading font-semibold text-secondary dark:text-white">
            {t("home.categoriesTitle")}
          </h2>
          <p className="text-secondary/80 dark:text-muted-foreground">{t("home.categoriesDescription")}</p>
        </div>
        <div className="rounded-[2.5rem] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 shadow-glass backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category, index) => (
              <CategoryCard key={category.title} delay={index * 0.05} {...category} />
            ))}
          </div>
        </div>
      </section>

      <section className="container space-y-8">
        <div className="flex flex-col items-center gap-3 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div className="space-y-2">
            <h2 className="text-3xl font-heading font-semibold text-secondary dark:text-white">
              {t("home.newsTitle")}
            </h2>
            <p className="text-secondary/80 dark:text-muted-foreground">{t("home.newsDescription")}</p>
          </div>
          <Button variant="ghost" asChild className="text-primary">
            <Link href="/news">{t("home.newsViewAll")}</Link>
          </Button>
        </div>
        <div className="rounded-[2.5rem] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 shadow-glass backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {news.map((article, index) => (
              <NewsCard key={article.title} index={index} {...article} />
            ))}
          </div>
        </div>
      </section>

      <section className="container space-y-6">
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <h2 className="text-3xl font-heading font-semibold text-secondary dark:text-white">
            {t("home.toolsTitle")}
          </h2>
          <p className="text-secondary/80 dark:text-muted-foreground">{t("home.toolsDescription")}</p>
        </div>
        <div className="rounded-[2.5rem] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 shadow-glass backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool, index) => (
              <ToolCard key={tool.title} delay={index * 0.05} {...tool} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
