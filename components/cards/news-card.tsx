"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/components/i18n/translation-provider";

const FALLBACK_NEWS_IMAGE =
  "https://images.unsplash.com/photo-1582719478173-c9fdd6fd1c8d?auto=format&fit=crop&w=1200&q=80";

export type NewsCardProps = {
  title: string;
  description: string;
  href: string;
  tag: string;
  timestamp: string;
  image?: string;
  index?: number;
  translationKey?: string;
};

export function NewsCard({
  title,
  description,
  href,
  tag,
  timestamp,
  image,
  index = 0,
  translationKey,
}: NewsCardProps) {
  const imageSrc = image ?? FALLBACK_NEWS_IMAGE;
  const { t } = useTranslation();
  const baseKey = translationKey ?? "";
  const titleText = baseKey ? t(`${baseKey}.title`, { fallback: title }) : t(title, { fallback: title });
  const descriptionText = baseKey
    ? t(`${baseKey}.description`, { fallback: description })
    : t(description, { fallback: description });
  const tagText = baseKey ? t(`${baseKey}.tag`, { fallback: tag }) : t(tag, { fallback: tag });
  const timestampText = baseKey ? t(`${baseKey}.time`, { fallback: timestamp }) : t(timestamp, { fallback: timestamp });

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
    >
      <Card className="group h-full overflow-hidden border-none bg-white/95 shadow-card ring-1 ring-border/30 transition hover:-translate-y-1 hover:ring-primary/40 dark:bg-secondary/70">
        <div className="relative h-44 overflow-hidden">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[rgb(229,243,255)] dark:text-white backdrop-blur">
              {tagText}
            </span>
            <time className="text-xs font-medium text-[rgba(229,243,255,0.8)] dark:text-white/80">
              {timestampText}
            </time>
          </div>
        </div>
        <CardHeader className="space-y-3">
          <CardTitle className="text-lg leading-tight text-secondary dark:text-white">
            {titleText}
          </CardTitle>
          <p className="text-sm text-secondary/80 dark:text-muted-foreground">
            {descriptionText}
          </p>
        </CardHeader>
        <CardContent>
          <Link
            href={href}
            className={cn(
              "inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
            )}
          >
            {t("actions.readMore")}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </CardContent>
      </Card>
    </motion.article>
  );
}
