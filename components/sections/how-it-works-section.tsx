"use client";

import { useTranslation } from "@/components/i18n/translation-provider";
import { useAnimeStaggerOnScroll } from "@/lib/hooks/use-anime";
import { Clipboard, Search, ShieldCheck } from "lucide-react";
import React from "react";

const steps = [
  {
    number: "01",
    icon: Search,
    titleKey: "landing.howItWorks.step1.title",
    descKey: "landing.howItWorks.step1.description",
  },
  {
    number: "02",
    icon: ShieldCheck,
    titleKey: "landing.howItWorks.step2.title",
    descKey: "landing.howItWorks.step2.description",
  },
  {
    number: "03",
    icon: Clipboard,
    titleKey: "landing.howItWorks.step3.title",
    descKey: "landing.howItWorks.step3.description",
  },
];

export function HowItWorksSection() {
  const { t } = useTranslation();

  const animatedRef = useAnimeStaggerOnScroll<HTMLDivElement>(
    ".step-card",
    {
      opacity: [0, 1],
      translateX: [-30, 0],
      duration: 700,
      easing: "easeOutCubic",
    },
    200,
    { threshold: 0.2 }
  );

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/5" />
      </div>

      <div className="container">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="inline-block mb-4 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.3em] bg-primary/10 text-primary dark:bg-primary/20">
            {t("landing.howItWorks.tagline")}
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary dark:text-white mb-4">
            {t("landing.howItWorks.title")}
          </h2>
          <p className="text-lg text-secondary/70 dark:text-white/70">
            {t("landing.howItWorks.description")}
          </p>
        </div>

        {/* Steps */}
        <div 
          ref={(node) => {
            (animatedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Connecting line - visible on desktop */}
          <div className="hidden lg:block absolute left-1/2 top-24 bottom-24 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-primary/50" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 1;

              return (
                <div
                  key={index}
                  className={`step-card lg:flex lg:items-center lg:gap-16 ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`flex-1 mb-8 lg:mb-0 ${
                      isEven ? "lg:text-left" : "lg:text-right"
                    }`}
                  >
                    <div
                      className={`inline-block ${
                        isEven ? "lg:text-left" : "lg:ml-auto lg:text-right"
                      }`}
                    >
                      <span className="text-6xl font-bold text-primary/20 dark:text-primary/10 font-heading mb-2 block">
                        {step.number}
                      </span>
                      <h3 className="text-2xl font-semibold text-secondary dark:text-white mb-3 -mt-4">
                        {t(step.titleKey)}
                      </h3>
                      <p className="text-secondary/70 dark:text-white/60 max-w-md">
                        {t(step.descKey)}
                      </p>
                    </div>
                  </div>

                  {/* Icon circle - center on desktop */}
                  <div className="flex-shrink-0 flex justify-center lg:relative lg:z-10">
                    <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                      <Icon className="h-10 w-10 text-white" aria-hidden />
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden lg:block flex-1" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
