"use client";

import { useTranslation } from "@/components/i18n/translation-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategorySimpleResponse } from "@/features/drugs";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

type CategorySearchCardProps = {
  category: CategorySimpleResponse;
  href: string;
  index?: number;
};

export function CategorySearchCard({ category, href, index = 0 }: CategorySearchCardProps) {
  const { t } = useTranslation();

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="h-full"
    >
      <Card className="group h-full border-none bg-white/95 shadow-card ring-1 ring-border/25 backdrop-blur-sm transition hover:-translate-y-1 hover:ring-primary/40 dark:bg-secondary/70">
        {/* Icon Header */}
        <div className="relative h-32 overflow-hidden rounded-t-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:scale-110 dark:bg-primary/20">
              <BookOpen className="h-8 w-8" />
            </div>
          </div>
        </div>
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl text-secondary dark:text-white line-clamp-2">
            {category.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
          >
            {t("actions.explore", { fallback: "Khám phá" })}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
          </Link>
        </CardContent>
      </Card>
    </motion.article>
  );
}
