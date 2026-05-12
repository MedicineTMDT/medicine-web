"use client";

import { useTranslation } from "@/components/i18n/translation-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { animate, stagger } from "animejs";
import {
    ArrowRight,
    FileText,
    Pill,
    ShieldCheck,
    Stethoscope,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const quickActions = [
  {
    icon: Pill,
    labelKey: "landing.hero.actions.drugSearch",
    href: "/drugs-info",
  },
  {
    icon: ShieldCheck,
    labelKey: "landing.hero.actions.interactions",
    href: "/drug-interaction",
  },
  {
    icon: FileText,
    labelKey: "landing.hero.actions.prescriptions",
    href: "/prescription",
  },
  {
    icon: Stethoscope,
    labelKey: "landing.hero.actions.tools",
    href: "/tools",
    isComingSoon: true,
  },
];

export function HeroSection() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || hasAnimated.current) return;
    hasAnimated.current = true;

    const tagline = hero.querySelector(".hero-tagline");
    const title = hero.querySelector(".hero-title");
    const subtitle = hero.querySelector(".hero-subtitle");
    const chips = hero.querySelectorAll(".hero-chip");
    const actions = hero.querySelectorAll(".hero-action");

    // Animate tagline
    if (tagline) {
      animate(tagline, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: "easeOutCubic",
      });
    }

    // Animate title
    if (title) {
      animate(title, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: 100,
        easing: "easeOutCubic",
      });
    }

    // Animate subtitle
    if (subtitle) {
      animate(subtitle, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        delay: 200,
        easing: "easeOutCubic",
      });
    }

    // Animate chips
    if (chips.length > 0) {
      animate(chips, {
        opacity: [0, 1],
        translateY: [15, 0],
        delay: stagger(50, { start: 300 }),
        duration: 500,
        easing: "easeOutCubic",
      });
    }

    // Animate quick actions with stagger
    if (actions.length > 0) {
      animate(actions, {
        opacity: [0, 1],
        translateY: [20, 0],
        delay: stagger(80, { start: 400 }),
        duration: 500,
        easing: "easeOutCubic",
      });
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden rounded-b-[3rem] min-h-[85vh] flex items-center"
    >
      {/* Background Image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80"
          alt="Medical background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Gradient overlay - different for light/dark */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/85 via-white/90 to-background dark:from-[#031123]/80 dark:via-[#061222]/95 dark:to-[#061222]" />

      {/* Content */}
      <div className="container relative py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust tagline */}
          <div className="hero-tagline opacity-0 mb-6">
            <span className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.4em] border border-primary/30 bg-white/80 text-primary shadow-lg dark:border-primary/20 dark:bg-white/10 dark:text-primary">
              {t("landing.hero.tagline")}
            </span>
          </div>

          {/* Main title */}
          <h1 className="hero-title opacity-0 text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 text-secondary dark:text-white">
            {t("landing.hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle opacity-0 text-lg sm:text-xl text-secondary/80 dark:text-white/80 max-w-2xl mx-auto mb-8">
            {t("landing.hero.subtitle")}
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <span className="hero-chip opacity-0 rounded-full px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary dark:bg-white/10 dark:text-white/90">
              {t("landing.hero.chip.drugs")}
            </span>
            <span className="hero-chip opacity-0 rounded-full px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary dark:bg-white/10 dark:text-white/90">
              {t("landing.hero.chip.interactions")}
            </span>
            <span className="hero-chip opacity-0 rounded-full px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary dark:bg-white/10 dark:text-white/90">
              {t("landing.hero.chip.tools")}
            </span>
          </div>

          {/* Quick action cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch max-w-4xl mx-auto">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.labelKey}
                  href={action.isComingSoon ? "#" : action.href}
                  className={`hero-action opacity-0 group h-full ${action.isComingSoon ? "cursor-not-allowed pointer-events-none" : ""}`}
                  onClick={(e) => action.isComingSoon && e.preventDefault()}
                >
                  <div className={`relative flex items-center gap-4 p-5 h-full min-h-[88px] rounded-2xl border border-[var(--glass-border)] bg-white/70 backdrop-blur-sm transition-all duration-300 ${action.isComingSoon ? "opacity-75 grayscale-[0.5]" : "hover:border-primary/40 hover:bg-white hover:shadow-lg hover:-translate-y-1"} dark:border-white/10 dark:bg-white/5 dark:hover:border-primary/50 dark:hover:bg-white/10`}>
                    {action.isComingSoon && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-[10px] py-0 px-2 font-bold uppercase tracking-wider backdrop-blur-md">
                          {t("landing.status.comingSoon")}
                        </Badge>
                      </div>
                    )}
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white dark:bg-primary/20">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <span className="flex-1 text-left font-semibold text-secondary dark:text-white">
                      {t(action.labelKey)}
                    </span>
                    {!action.isComingSoon && (
                      <ArrowRight className="h-5 w-5 text-secondary/30 transition-all group-hover:text-primary group-hover:translate-x-1 dark:text-white/30" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="h-14 px-10 rounded-full bg-primary text-white font-semibold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40 transition-all"
            >
              <Link href="/drugs-info">
                {t("landing.cta.secondaryButton")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
