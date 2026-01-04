"use client";

import { useTranslation } from "@/components/i18n/translation-provider";
import { Button } from "@/components/ui/button";
import { animate, stagger } from "animejs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function CtaSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;

            const ctaItems = section.querySelectorAll(".cta-animate");

            // Animate content
            if (ctaItems.length > 0) {
              animate(ctaItems, {
                opacity: [0, 1],
                translateY: [30, 0],
                delay: stagger(100),
                duration: 800,
                easing: "easeOutCubic",
              });
            }

            observer.unobserve(section);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10" />
      </div>

      <div className="container">
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Content card */}
          <div className="relative p-12 md:p-16 rounded-[2.5rem] border border-[var(--glass-border)] bg-white/60 backdrop-blur-lg shadow-2xl shadow-primary/10 dark:border-white/10 dark:bg-white/5">
            {/* Badge */}
            <div className="cta-animate opacity-0 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-primary/10 text-primary dark:bg-primary/20">
                {t("landing.cta.badge")}
              </span>
            </div>

            {/* Heading */}
            <h2 className="cta-animate opacity-0 text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-secondary dark:text-white mb-6">
              {t("landing.cta.title")}
            </h2>

            {/* Description */}
            <p className="cta-animate opacity-0 text-lg md:text-xl text-secondary/70 dark:text-white/70 mb-10 max-w-2xl mx-auto">
              {t("landing.cta.description")}
            </p>

            {/* Buttons */}
            <div className="cta-animate opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-14 px-8 rounded-full bg-primary text-white font-semibold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40 transition-all hover:scale-105"
              >
                <Link href="/signup">
                  {t("landing.cta.primaryButton")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-full border-2 border-primary/30 text-primary hover:bg-primary/10 font-semibold dark:border-primary/50 dark:text-primary dark:hover:bg-primary/20"
              >
                <Link href="/drugs-info">
                  {t("landing.cta.secondaryButton")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
