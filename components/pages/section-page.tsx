"use client";

import { NewsCard } from "@/components/cards/news-card";
import { ToolCard } from "@/components/cards/tool-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  news as allNews,
  tools as allTools,
  sectionContent,
} from "@/lib/mockData";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SectionPageScreenProps = {
  slug: string;
  showNews?: boolean;
  showTools?: boolean;
};

export function SectionPageScreen({
  slug,
  showNews = false,
  showTools = false,
}: SectionPageScreenProps) {
  const content = sectionContent[slug];

  if (!content) {
    throw new Error(`Section content for "${slug}" not found.`);
  }

  const articles = showNews ? allNews : [];
  const tools = showTools ? allTools : [];

  return (
    <div className="relative pb-24">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src={content.heroImage}
            alt=""
            fill
            className="object-cover opacity-40 dark:opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#04121F]/90 via-[#0B2746]/90 to-[#051A2C]/92" />
        </div>

        <div className="container relative grid gap-12 py-28 text-foreground dark:text-white lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <span className="inline-flex items-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-1 text-sm font-semibold uppercase tracking-[0.28em] dark:border-white/30 dark:bg-white/10">
              {content.slug.replace("-", " ")}
            </span>

            <h1 className="text-4xl font-heading font-semibold leading-tight text-secondary dark:text-white md:text-5xl">
              {content.title}
            </h1>

            <p className="text-lg text-foreground/80 dark:text-white/90">
              {content.description}
            </p>

            <div className="flex flex-wrap gap-3">
              {content.actions.map((action) => (
                <Button
                  key={action.href}
                  className="rounded-full px-6 text-sm font-semibold"
                  asChild
                >
                  <Link href={action.href}>
                    {action.label}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[calc(var(--radius)_+_0.75rem)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 shadow-glass backdrop-blur-lg dark:border-white/15 dark:bg-white/10"
          >
            <h2 className="text-2xl font-semibold text-foreground dark:text-white">
              What&apos;s inside
            </h2>
            <p className="mt-3 text-sm text-foreground/80 dark:text-white/80">
              Evidence-backed insights curated by pharmacists, physicians, and
              clinical researchers.
            </p>

            <div className="mt-6 space-y-4">
              {content.highlights.slice(0, 3).map((highlight) => {
                const Icon = highlight.icon;
                return (
                  <div
                    key={highlight.title}
                    className="flex items-start gap-4 rounded-2xl border border-[var(--glass-border)] ] p-4 transition-colors hover:bg-[var(--glass-hover)] dark:border-white/10 dark:bg-white/10"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--muted)]/40 text-secondary dark:bg-white/15 dark:text-white">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground dark:text-white">
                        {highlight.title}
                      </p>
                      <p className="text-sm text-foreground/70 dark:text-white/70">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ESSENTIAL HIGHLIGHTS */}
      <section className="container mt-20 space-y-12">
        <div className="space-y-3">
          <h2 className="text-3xl font-heading font-semibold text-secondary dark:text-white">
            Essential Highlights
          </h2>
          <p className="text-secondary/80 dark:text-muted-foreground">
            Explore the core capabilities and resources available within this
            section.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {content.highlights.map((highlight) => {
            const Icon = highlight.icon;
            return (
              <Card
                key={highlight.title}
                className="h-full border-none bg-white/95 shadow-card ring-1 ring-border/20 backdrop-blur-sm transition hover:-translate-y-1 hover:ring-primary/50 dark:bg-secondary/70"
              >
                <CardHeader className="space-y-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <CardTitle className="text-xl text-secondary dark:text-white">
                    {highlight.title}
                  </CardTitle>
                  <CardDescription className="text-secondary/80 dark:text-muted-foreground">
                    {highlight.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CONDITIONAL SECTIONS */}
      <section className="container mt-20 space-y-8">
        {showNews ? (
          <>
            <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-heading font-semibold text-secondary dark:text-white">
                  Latest Coverage
                </h2>
                <p className="text-secondary/80 dark:text-muted-foreground">
                  Breaking news and deep dives sourced from medical journals and
                  agencies.
                </p>
              </div>
              <Button variant="ghost" asChild className="text-primary">
                <Link href="/news/archive">View Archive</Link>
              </Button>
            </header>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article, index) => (
                <NewsCard key={article.title} index={index} {...article} />
              ))}
            </div>
          </>
        ) : showTools ? (
          <>
            <header className="space-y-3">
              <h2 className="text-3xl font-heading font-semibold text-secondary dark:text-white">
                Featured Tools
              </h2>
              <p className="text-secondary/80 dark:text-muted-foreground">
                Launch interactive calculators, identifiers, and clinical
                workflow aids.
              </p>
            </header>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {tools.map((tool, index) => (
                <ToolCard key={tool.title} delay={index * 0.05} {...tool} />
              ))}
            </div>
          </>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
              <CardHeader className="space-y-3">
                <CardTitle className="text-2xl text-secondary dark:text-white">
                  In-depth Resources
                </CardTitle>
                <CardDescription className="text-secondary/80 dark:text-muted-foreground">
                  Dive into curated resources designed to support clinicians,
                  researchers, and informed patients.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-secondary/80 dark:text-muted-foreground">
                <p>
                  Each entry is peer-reviewed and cross-referenced with
                  authoritative sources including the FDA, EMA, WHO, and AHFS.
                  Bookmark key references and receive notifications when new
                  evidence emerges.
                </p>
                <p>
                  Customize your feed, export citations, and collaborate with
                  colleagues to build a tailored knowledge base for your care
                  teams.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-muted/60 p-6 shadow-sm ring-1 ring-border/10 dark:bg-secondary/50">
              <h3 className="text-lg font-semibold text-secondary dark:text-white">
                Ready to explore deeper?
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-secondary/80 dark:text-muted-foreground">
                {content.actions.map((action) => (
                  <li key={action.href}>
                    <Link
                      href={action.href}
                      className="flex items-center justify-between rounded-2xl bg-white/60 px-4 py-3 font-semibold text-secondary transition hover:bg-white"
                    >
                      {action.label}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}
      </section>
    </div>
  );
}
