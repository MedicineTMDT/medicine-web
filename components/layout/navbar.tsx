"use client";

import { useTranslation } from "@/components/i18n/translation-provider";
import { LanguageToggle } from "@/components/language-toggle";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

const NAV_LINKS = [
  { nameKey: "nav.home", href: "/" },
  { nameKey: "nav.drugInfo", href: "/drugs-info" },
  { nameKey: "nav.drugInteraction", href: "/drug-interaction" },
  { nameKey: "nav.prescription", href: "/prescription" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { t, language } = useTranslation();
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-4 z-50 mx-auto w-full px-4",
        language === "vi" ? "max-w-7xl" : "max-w-6xl"
      )}
    >
      <div className="relative rounded-[calc(var(--radius)_+_0.5rem)] border border-border bg-white/90 shadow-[0_24px_80px_-40px_rgba(12,39,60,0.55)] backdrop-blur-md transition-colors dark:border-white/10 dark:bg-secondary/80">
        <nav className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <Logo />

          <div className="hidden items-center gap-8 md:flex">
            <div className="flex items-center gap-6">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.nameKey}
                    href={link.href}
                    className={cn(
                      "relative text-sm font-semibold text-secondary transition hover:text-primary dark:text-white/75",
                      isActive && "text-primary dark:text-accent"
                    )}
                  >
                    {t(link.nameKey)}
                    {isActive ? (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-primary/70"
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      />
                    ) : null}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
              {isAuthenticated ? (
                <>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 transition hover:bg-primary/10"
                  >
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-secondary dark:text-white">
                      {user?.firstName || user?.username}
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-semibold"
                    onClick={() => logout()}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="mr-1 h-4 w-4" />
                    {t("nav.signOut")}
                  </Button>
                </>
              ) : (
                <>
              <Button variant="ghost" asChild className="text-sm font-semibold">
                <Link href="/signin">{t("nav.signIn")}</Link>
              </Button>
              <Button size="sm" className="rounded-full px-5 text-sm">
                <Link href="/signup">{t("nav.register")}</Link>
              </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle navigation"
              onClick={() => setOpen((prev) => !prev)}
              className="rounded-full border border-primary/20 bg-white/50 text-secondary hover:bg-primary/10 dark:bg-secondary dark:text-white"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden"
            >
              <div className="space-y-4 px-4 pb-4">
                <div className="flex flex-col gap-3">
                  {NAV_LINKS.map((link) => {
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname?.startsWith(link.href);
                    return (
                      <Link
                        key={link.nameKey}
                        href={link.href}
                        className={cn(
                          "rounded-2xl border border-transparent px-4 py-3 text-sm font-semibold text-secondary dark:text-white transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
                          isActive &&
                            "border-primary/30 bg-primary/10 text-primary"
                        )}
                      >
                        {t(link.nameKey)}
                      </Link>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between px-2 py-4">
                  <span className="text-sm font-medium text-muted-foreground">{t("language.label")}</span>
                  <LanguageToggle />
                </div>
                <div className="flex gap-3">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/account"
                        className="flex flex-1 items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-2 transition hover:bg-primary/10"
                      >
                        <User className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-secondary dark:text-white">
                          {user?.firstName || user?.username}
                        </span>
                      </Link>
                      <Button
                        variant="outline"
                        className="flex-1 rounded-full"
                        onClick={() => logout()}
                        disabled={isLoggingOut}
                      >
                        <LogOut className="mr-1 h-4 w-4" />
                        {t("nav.signOut")}
                      </Button>
                    </>
                  ) : (
                    <>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full"
                    asChild
                  >
                    <Link href="/signin">{t("nav.signIn")}</Link>
                  </Button>
                  <Button className="flex-1 rounded-full" asChild>
                    <Link href="/signup">{t("nav.register")}</Link>
                  </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
