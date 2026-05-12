"use client";

import { useTranslation } from "@/components/i18n/translation-provider";
import { Badge } from "@/components/ui/badge";
import { useAnimeStaggerOnScroll } from "@/lib/hooks/use-anime";
import {
    AlertTriangle, ArrowRight, BookOpen, FileText, Pill, Search,
    Stethoscope
} from "lucide-react";
import Link from "next/link";
import React from "react";

const services = [
  {
    icon: Pill,
    titleKey: "landing.services.drugSearch.title",
    descKey: "landing.services.drugSearch.description",
    href: "/drugs-info",
  },
  {
    icon: AlertTriangle,
    titleKey: "landing.services.interactions.title",
    descKey: "landing.services.interactions.description",
    href: "/drug-interaction",
  },
  {
    icon: FileText,
    titleKey: "landing.services.prescriptions.title",
    descKey: "landing.services.prescriptions.description",
    href: "/prescription",
  },
  {
    icon: Search,
    titleKey: "landing.services.pillId.title",
    descKey: "landing.services.pillId.description",
    href: "/pill-identifier",
    isComingSoon: true,
  },
  {
    icon: Stethoscope,
    titleKey: "landing.services.tools.title",
    descKey: "landing.services.tools.description",
    href: "/tools",
    isComingSoon: true,
  },
  {
    icon: BookOpen,
    titleKey: "landing.services.guides.title",
    descKey: "landing.services.guides.description",
    href: "/guides",
    isComingSoon: true,
  },
];

export function ServicesSection() {
  const { t } = useTranslation();

  const animatedRef = useAnimeStaggerOnScroll<HTMLDivElement>(
    ".service-card",
    {
      opacity: [0, 1],
      translateY: [50, 0],
      scale: [0.95, 1],
      duration: 700,
      easing: "easeOutCubic",
    },
    80,
    { threshold: 0.1 }
  );

  return (
    <section className="py-24 relative">
      <div className="container">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="inline-block mb-4 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.3em] bg-primary/10 text-primary dark:bg-primary/20">
            {t("landing.services.tagline")}
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary dark:text-white mb-4">
            {t("landing.services.title")}
          </h2>
          <p className="text-lg text-secondary/70 dark:text-white/70">
            {t("landing.services.description")}
          </p>
        </div>

        {/* Services grid */}
        <div
          ref={(node) => {
            (animatedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                href={service.isComingSoon ? "#" : service.href}
                className={`service-card group block ${service.isComingSoon ? "cursor-not-allowed pointer-events-none" : ""}`}
                onClick={(e) => service.isComingSoon && e.preventDefault()}
              >
                <div className={`relative h-full p-8 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm overflow-hidden transition-all duration-300 ${service.isComingSoon ? "opacity-75 grayscale-[0.3]" : "hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"} dark:border-white/10 dark:bg-white/5 dark:hover:border-primary/50`}>
                  {/* Background on hover */}
                  {!service.isComingSoon && (
                    <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  )}

                  {/* Coming Soon Badge */}
                  {service.isComingSoon && (
                    <div className="absolute top-6 right-6 z-10">
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-[10px] py-0.5 px-2.5 font-bold uppercase tracking-wider backdrop-blur-md">
                        {t("landing.status.comingSoon")}
                      </Badge>
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative">
                    {/* Icon */}
                    <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform ${!service.isComingSoon && "group-hover:scale-110"} dark:bg-primary/20`}>
                      <Icon className="h-8 w-8" aria-hidden />
                    </div>

                    {/* Text */}
                    <h3 className="text-xl font-semibold text-secondary dark:text-white mb-3">
                      {t(service.titleKey)}
                    </h3>
                    <p className="text-secondary/70 dark:text-white/60 leading-relaxed mb-6">
                      {t(service.descKey)}
                    </p>

                    {/* Arrow link */}
                    {!service.isComingSoon && (
                      <div className="flex items-center text-primary font-medium">
                        <span className="mr-2">{t("landing.services.explore")}</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
