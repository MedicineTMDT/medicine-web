"use client";

import Link from "next/link";
import { Mail, Phone, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/i18n/translation-provider";

const FOOTER_LINKS = [
  {
    titleKey: "footer.quickLinks",
    links: [
      { labelKey: "footer.drugInformation", href: "/drugs-info" },
      { labelKey: "footer.healthConditions", href: "/category/health-conditions" },
      { labelKey: "footer.drugInteractions", href: "/drug-interaction" },
    ],
  },
  {
    titleKey: "footer.legal",
    links: [
      { labelKey: "footer.privacyPolicy", href: "/privacy-policy" },
      { labelKey: "footer.termsOfUse", href: "/terms-of-service" },
      { labelKey: "footer.disclaimer", href: "/disclaimer" },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export function Footer({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <footer
      className={cn(
        "mt-32 border-t border-border/40 bg-secondary/95 text-[rgb(229,243,255)] backdrop-blur-sm dark:text-white",
        className
      )}
    >
      <div className="container px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-24">
          {/* Brand and Contact */}
          <div className="space-y-8">
            <div className="space-y-6">
              <Logo className="text-[rgb(229,243,255)] dark:text-white" />
              <p className="max-w-md text-base leading-relaxed text-[rgba(229,243,255,0.75)] dark:text-white/70">
                {t("footer.description")}
              </p>
            </div>
            
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-bold uppercase tracking-widest text-accent/90">Contact Us</h4>
              <div className="grid gap-4 text-sm text-[rgba(229,243,255,0.75)] dark:text-white/70">
                <a href={`mailto:${t("footer.email")}`} className="flex items-center gap-3 transition hover:text-accent">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-accent/50">
                    <Mail className="h-4 w-4 text-accent" aria-hidden />
                  </div>
                  {t("footer.email")}
                </a>
                <a href={`tel:${t("footer.phone")}`} className="flex items-center gap-3 transition hover:text-accent">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                    <Phone className="h-4 w-4 text-accent" aria-hidden />
                  </div>
                  {t("footer.phone")}
                </a>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="grid gap-10 sm:grid-cols-2 lg:contents">
            {FOOTER_LINKS.map((section) => (
              <div key={section.titleKey} className="space-y-7">
                <h3 className="text-lg font-bold text-[rgb(229,243,255)] dark:text-white">
                  {t(section.titleKey)}
                </h3>
                <ul className="space-y-4 text-sm text-[rgba(229,243,255,0.75)] dark:text-white/70">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="flex items-center gap-2 transition hover:text-accent group">
                        <span className="h-1 w-1 rounded-full bg-accent/30 transition-all group-hover:w-2 group-hover:bg-accent" />
                        {t(link.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 flex flex-col gap-8 border-t border-white/10 pt-10 text-sm text-[rgba(229,243,255,0.68)] dark:text-white/60 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p>
              © {new Date().getFullYear()} AnalyticsPill. {t("footer.allRights")}
            </p>
            <p className="text-xs opacity-60">
              Disclaimer: Information provided is for educational purposes only.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest opacity-50">Follow Us</span>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[rgb(229,243,255)] transition-all hover:scale-110 hover:border-accent/80 hover:bg-accent/20 hover:text-accent dark:text-white"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
