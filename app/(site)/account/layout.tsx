"use client";

import { useTranslation } from "@/components/i18n/translation-provider";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    ChevronRight,
    Image,
    MessageSquareText,
    Settings,
    Shield,
    User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  const accountNavItems = [
    {
      label: t("account.nav.overview"),
      href: "/account",
      icon: User,
      description: t("account.nav.overview.description"),
    },
    {
      label: t("account.nav.editProfile"),
      href: "/account/profile",
      icon: Settings,
      description: t("account.nav.editProfile.description"),
    },
    {
      label: t("account.nav.security"),
      href: "/account/security",
      icon: Shield,
      description: t("account.nav.security.description"),
    },
    {
      label: t("account.nav.avatar"),
      href: "/account/avatar",
      icon: Image,
      description: t("account.nav.avatar.description"),
    },
    {
      label: "Yêu cầu của tôi",
      href: "/account/requests",
      icon: MessageSquareText,
      description: "Xem và theo dõi yêu cầu chỉnh sửa dữ liệu",
      requiredRoles: ["MED", "ADMIN"],
    },
  ];

  const { user } = useAuth();
  const filteredNavItems = accountNavItems.filter((item) => {
    if (!item.requiredRoles) return true;
    return user?.role && item.requiredRoles.includes(user.role);
  });

  // Wait for client-side mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, isMounted, router]);

  // Always render the same structure on server and client initially
  if (!isMounted || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Navigation */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <h2 className="mb-4 px-3 text-lg font-semibold text-secondary dark:text-white">
            {t("account.settings")}
          </h2>
          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-secondary dark:hover:bg-white/10 dark:hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}

