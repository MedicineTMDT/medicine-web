"use client";

import { useTranslation } from "@/components/i18n/translation-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DrugSimpleResponse } from "@/features/drugs";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type DrugSearchCardProps = {
  drug: DrugSimpleResponse;
  href: string;
  index?: number;
};

export function DrugSearchCard({ drug, href, index = 0 }: DrugSearchCardProps) {
  const imageSrc =
    typeof drug.imageLink === "string" && drug.imageLink.trim().length > 0
      ? drug.imageLink
      : "";
  const { t } = useTranslation();

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="h-full"
    >
      <Card className="group h-full border-none bg-white/95 shadow-card ring-1 ring-border/25 backdrop-blur-sm transition hover:-translate-y-1 hover:ring-primary/40 dark:bg-secondary/70">
        <div className="relative h-40 overflow-hidden rounded-t-3xl">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={drug.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <span className="block h-full w-full bg-muted/70" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 via-secondary/30 to-transparent" />
        </div>
        <CardHeader className="space-y-3">
          <CardTitle className="text-xl text-secondary dark:text-white">
            {drug.name}
          </CardTitle>
          <p className="text-sm text-secondary/60 dark:text-muted-foreground">
            {drug.slug}
          </p>
        </CardHeader>
        <CardContent>
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
          >
            {t("actions.viewDetails")}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
          </Link>
        </CardContent>
      </Card>
    </motion.article>
  );
}
