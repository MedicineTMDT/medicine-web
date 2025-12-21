"use client";

import { useTranslation } from "@/components/i18n/translation-provider";
import { useAnimeStaggerOnScroll } from "@/lib/hooks/use-anime";
import {
    BookOpen,
    Calculator,
    Database,
    FileText,
    Pill,
    ShieldCheck,
} from "lucide-react";
import React from "react";

const features = [
  {
    icon: Database,
    titleKey: "landing.features.drugDatabase.title",
    descKey: "landing.features.drugDatabase.description",
  },
  {
    icon: ShieldCheck,
    titleKey: "landing.features.interactionChecker.title",
    descKey: "landing.features.interactionChecker.description",
  },
  {
    icon: FileText,
    titleKey: "landing.features.prescriptions.title",
    descKey: "landing.features.prescriptions.description",
  },
  {
    icon: Pill,
    titleKey: "landing.features.pillIdentifier.title",
    descKey: "landing.features.pillIdentifier.description",
  },
  {
    icon: BookOpen,
    titleKey: "landing.features.healthInfo.title",
    descKey: "landing.features.healthInfo.description",
  },
  {
    icon: Calculator,
    titleKey: "landing.features.clinicalTools.title",
    descKey: "landing.features.clinicalTools.description",
  },
];

export function FeaturesSection() {
  const { t } = useTranslation();

  const animatedRef = useAnimeStaggerOnScroll<HTMLDivElement>(
    ".feature-card",
    {
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 600,
      easing: "easeOutCubic",
    },
    100,
    { threshold: 0.1 }
  );

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient - works in both modes */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent dark:via-primary/10" />
      </div>

      <div className="container">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="inline-block mb-4 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.3em] bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
            {t("landing.features.tagline")}
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary dark:text-white mb-4">
            {t("landing.features.title")}
          </h2>
          <p className="text-lg text-secondary/70 dark:text-white/70">
            {t("landing.features.description")}
          </p>
        </div>

        {/* Features grid */}
        <div
          ref={(node) => {
            (animatedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="feature-card group relative p-8 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 dark:border-white/10 dark:bg-white/5 dark:hover:border-primary/50"
              >
                {/* Icon container */}
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary transition-transform group-hover:scale-110 dark:from-primary/30 dark:to-primary/10">
                  <Icon className="h-7 w-7" aria-hidden />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-secondary dark:text-white mb-3">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-secondary/70 dark:text-white/60 leading-relaxed">
                  {t(feature.descKey)}
                </p>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-8 right-8 h-1 rounded-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
