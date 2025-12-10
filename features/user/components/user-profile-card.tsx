"use client";

import { motion } from "framer-motion";
import { Mail, User, Shield, Calendar } from "lucide-react";
import { useAuth } from "@/features/auth";

export function UserProfileCard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const roleColors = {
    ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    USER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    MED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <motion.div
      className="rounded-xl border border-border/20 bg-white p-6 shadow-sm dark:bg-secondary/80"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {user.firstName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div
            className={`absolute -bottom-1 -right-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              roleColors[user.role] || roleColors.USER
            }`}
          >
            {user.role}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-secondary dark:text-white">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-sm text-muted-foreground">@{user.username}</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>ID: {user.id}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Role: {user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

