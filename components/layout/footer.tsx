import Link from "next/link";
import { Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const FOOTER_LINKS = [
  {
    title: "Quick Links",
    links: [
      { label: "Drug Information", href: "/drugs" },
      { label: "Health Conditions", href: "/supplements" },
      { label: "Medical News", href: "/news" },
      { label: "Health Tools", href: "/tools" },
      { label: "Drug Interactions", href: "/interactions" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Use", href: "/legal/terms" },
      { label: "About Us", href: "/guides/about" },
      { label: "Contact", href: "/support/contact" },
      { label: "Disclaimer", href: "/legal/disclaimer" },
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
  return (
    <footer
      className={cn(
        "mt-24 border-t border-border/40 bg-secondary/95 text-[rgb(229,243,255)] backdrop-blur-sm dark:text-white",
        className
      )}
    >
      <div className="container grid gap-10 py-16 md:grid-cols-[1.3fr_auto_auto] md:gap-12">
        <div className="space-y-6">
          <Logo className="text-[rgb(229,243,255)] dark:text-white" />
          <p className="max-w-md text-sm text-[rgba(229,243,255,0.75)] dark:text-white/70">
            Your trusted source for accurate, up-to-date medical and pharmaceutical
            information. Always consult healthcare professionals for medical advice.
          </p>
          <div className="grid gap-3 text-sm text-[rgba(229,243,255,0.75)] dark:text-white/70">
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" aria-hidden />
              support@analyticspill.com
            </span>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent" aria-hidden />
              +1 (800) 555-1024
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" aria-hidden />
              221B Health Avenue, Suite 12, Boston, MA
            </span>
          </div>
        </div>

        {FOOTER_LINKS.map((section) => (
          <div key={section.title} className="space-y-5">
            <h3 className="text-base font-semibold text-[rgb(229,243,255)] dark:text-white">
              {section.title}
            </h3>
            <ul className="space-y-3 text-sm text-[rgba(229,243,255,0.75)] dark:text-white/70">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-4 py-6 text-sm text-[rgba(229,243,255,0.68)] dark:text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} AnalyticsPill. All rights reserved.</p>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[rgb(229,243,255)] transition hover:border-accent/80 hover:bg-accent/20 dark:text-white"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
