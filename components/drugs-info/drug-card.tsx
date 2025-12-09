"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DrugInfo } from "@/lib/mockData";
import { useTranslation } from "@/components/i18n/translation-provider";

type DrugCardProps = {
  drug: DrugInfo;
  href: string;
  index?: number;
};

export function DrugInfoCard({ drug, href, index = 0 }: DrugCardProps) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80";
  const imageSrc = drug.image ?? fallbackImage;
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
          <Image
            src={imageSrc}
            alt={drug.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 via-secondary/30 to-transparent" />
        </div>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {t(drug.category, { fallback: drug.category })}
            </span>
            {drug.fdaApproved ? (
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-200">
                {t("drugsInfo.fdaApproved")}
              </span>
            ) : null}
          </div>
          <CardTitle className="text-xl text-secondary dark:text-white">{drug.name}</CardTitle>
          <CardDescription className="line-clamp-2 text-secondary/80 dark:text-muted-foreground">
            {t(drug.description, { fallback: drug.description })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 text-xs text-secondary/70 dark:text-white/70">
            {drug.compounds.slice(0, 3).map((compound) => (
              <span
                key={compound}
                className="rounded-full bg-[var(--muted)]/60 px-3 py-1 font-semibold dark:bg-white/10"
              >
                {t(compound, { fallback: compound })}
              </span>
            ))}
          </div>
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
