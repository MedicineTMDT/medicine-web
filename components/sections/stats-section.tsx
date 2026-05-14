"use client";

import { useTranslation } from "@/components/i18n/translation-provider";
import { useAnimeCounter, useAnimeStaggerOnScroll } from "@/lib/hooks/use-anime";
import { FileText, Pill, ShieldCheck } from "lucide-react";

function StatItem({
  value,
  labelKey,
  icon: Icon,
}: {
  value: number;
  labelKey: string;
  icon: React.ElementType;
}) {
  const { t } = useTranslation();
  const { ref, value: displayValue } = useAnimeCounter(value, {
    duration: 2500,
    suffix: "+",
    threshold: 0.3,
  });

  return (
    <div className="stat-item text-center p-8">
      {/* Icon */}
      <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
        <Icon className="h-8 w-8" aria-hidden />
      </div>

      {/* Counter value */}
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="text-4xl md:text-5xl font-bold text-secondary dark:text-white mb-2 font-heading"
      >
        {displayValue}
      </div>

      {/* Label */}
      <p className="text-secondary/70 dark:text-white/60 font-medium">
        {t(labelKey)}
      </p>
    </div>
  );
}

const stats = [
  {
    value: 11000,
    labelKey: "landing.stats.drugs",
    icon: Pill,
  },
  {
    value: 1000,
    labelKey: "landing.stats.interactions",
    icon: ShieldCheck,
  },
  {
    value: 110,
    labelKey: "landing.stats.healthMinistryDocs",
    icon: FileText,
  },
];

export function StatsSection() {
  const { t } = useTranslation();

  const animatedRef = useAnimeStaggerOnScroll<HTMLDivElement>(
    ".stat-item",
    {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      easing: "easeOutCubic",
    },
    150,
    { threshold: 0.2 }
  );

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:to-accent/10" />
      </div>

      <div className="container">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary dark:text-white mb-4">
            {t("landing.stats.title")}
          </h2>
          <p className="text-lg text-secondary/70 dark:text-white/70">
            {t("landing.stats.description")}
          </p>
        </div>

        {/* Stats grid */}
        <div
          ref={(node) => {
            (animatedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-3xl border border-[var(--glass-border)] bg-white/50 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
            >
              <StatItem
                value={stat.value}
                labelKey={stat.labelKey}
                icon={stat.icon}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
