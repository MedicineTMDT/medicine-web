"use client";

import { useTranslation } from "@/components/i18n/translation-provider";
import { useAuth } from "@/features/auth";
import { motion } from "framer-motion";
import {
    ChevronRight,
    Image,
    Mail,
    Settings,
    Shield,
    User,
} from "lucide-react";
import Link from "next/link";

export function AccountOverview() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const quickActions = [
    {
      label: t("account.overview.editProfile"),
      description: t("account.overview.editProfile.description"),
      href: "/account/profile",
      icon: Settings,
    },
    {
      label: t("account.overview.changePassword"),
      description: t("account.overview.changePassword.description"),
      href: "/account/security",
      icon: Shield,
    },
    {
      label: t("account.overview.updateAvatar"),
      description: t("account.overview.updateAvatar.description"),
      href: "/account/avatar",
      icon: Image,
    },
  ];

  if (!user) return null;

  const roleColors = {
    ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    USER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    MED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-secondary dark:text-white">
          {t("account.overview.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("account.overview.description")}
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        className="rounded-xl border border-border/20 bg-white p-6 shadow-sm dark:bg-secondary/80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
              {user.avatarImg ? (
                <img
                  src={user.avatarImg}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-primary">
                  {user.firstName?.[0]?.toUpperCase() ||
                    user.username?.[0]?.toUpperCase() ||
                    "U"}
                </span>
              )}
            </div>
            <span
              className={`absolute -bottom-1 -right-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                roleColors[user.role] || roleColors.USER
              }`}
            >
              {user.role}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-secondary dark:text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-secondary dark:text-white">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">ID: {user.id}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h3 className="mb-4 text-lg font-semibold text-secondary dark:text-white">
          {t("account.overview.quickActions")}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-4 rounded-xl border border-border/20 bg-white p-4 shadow-sm transition hover:border-primary/30 hover:shadow-md dark:bg-secondary/80"
              >
                <div className="rounded-lg bg-primary/10 p-3 transition group-hover:bg-primary/20">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-secondary dark:text-white">
                    {action.label}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition group-hover:text-primary" />
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Account Info */}
      <motion.div
        className="rounded-xl border border-border/20 bg-white p-6 shadow-sm dark:bg-secondary/80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h3 className="mb-4 text-lg font-semibold text-secondary dark:text-white">
          {t("account.overview.accountDetails")}
        </h3>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">{t("account.overview.username")}</dt>
            <dd className="font-medium text-secondary dark:text-white">
              @{user.username}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">{t("account.overview.email")}</dt>
            <dd className="font-medium text-secondary dark:text-white">
              {user.email}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">{t("account.overview.firstName")}</dt>
            <dd className="font-medium text-secondary dark:text-white">
              {user.firstName}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">{t("account.overview.lastName")}</dt>
            <dd className="font-medium text-secondary dark:text-white">
              {user.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">{t("account.overview.role")}</dt>
            <dd>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  roleColors[user.role] || roleColors.USER
                }`}
              >
                {user.role}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">{t("account.overview.accountId")}</dt>
            <dd className="font-mono text-sm text-secondary dark:text-white">
              {user.id}
            </dd>
          </div>
        </dl>
      </motion.div>
    </div>
  );
}


