"use client";

import { useTranslation } from "@/components/i18n/translation-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DrugInteraction, SeverityLevel } from "@/features/drug-interactions";
import { normalizeSeverity } from "@/features/drug-interactions";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const severityStyles: Record<SeverityLevel, string> = {
  contraindicated: "ring-purple-500/40 bg-purple-500/10 text-purple-800 dark:text-purple-200",
  conditional: "ring-orange-500/40 bg-orange-500/10 text-orange-800 dark:text-orange-200",
};

const severityLabelMap: Record<SeverityLevel, string> = {
  contraindicated: "Chống chỉ định",
  conditional: "Chống chỉ định có điều kiện",
};

type InteractionCardProps = {
  interaction: DrugInteraction;
  ingredient1SourceDrugs?: { id: string; label: string; imageUrl?: string }[];
  ingredient2SourceDrugs?: { id: string; label: string; imageUrl?: string }[];
  context?: {
    label: string;
    description?: string;
  };
};

export function InteractionCard({
  interaction,
  ingredient1SourceDrugs,
  ingredient2SourceDrugs,
  context,
}: InteractionCardProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const severity = normalizeSeverity(interaction.mucDoNghiemTrong);
  const severityLabel = severityLabelMap[severity];

  return (
    <Card className="h-full border-none bg-white/95 shadow-card ring-1 ring-border/20 backdrop-blur-sm transition hover:-translate-y-0.5 hover:ring-primary/30 dark:bg-secondary/70">
      <CardHeader className="space-y-2 p-4 sm:space-y-3 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ring-1 sm:px-3 sm:text-xs",
              severityStyles[severity]
            )}
          >
            {severityLabel}
          </span>
          {interaction.mucDoNghiemTrong && interaction.mucDoNghiemTrong !== severityLabel && (
            <span className="rounded-full bg-[var(--muted)]/60 px-2.5 py-1 text-[10px] font-semibold text-secondary dark:bg-white/10 dark:text-white/80 sm:px-3 sm:text-[11px]">
              {interaction.mucDoNghiemTrong}
            </span>
          )}
          {context ? (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary sm:px-3">
              {context.label}
              {context.description ? ` · ${context.description}` : null}
            </span>
          ) : null}
        </div>
        <CardTitle className="text-base leading-snug text-secondary dark:text-white sm:text-lg">
          <span>{interaction.hoatChat1Name}</span>
          {ingredient1SourceDrugs?.length ? (
            <span className="ml-1 text-xs font-normal text-muted-foreground dark:text-white/65">
              (trong: {ingredient1SourceDrugs.map((drug) => drug.label).join(", ")})
            </span>
          ) : null}
          <span> + </span>
          <span>{interaction.hoatChat2Name}</span>
          {ingredient2SourceDrugs?.length ? (
            <span className="ml-1 text-xs font-normal text-muted-foreground dark:text-white/65">
              (trong: {ingredient2SourceDrugs.map((drug) => drug.label).join(", ")})
            </span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0 text-[13px] text-secondary/80 dark:text-muted-foreground sm:p-6 sm:pt-0 sm:text-sm">
        {interaction.hauQuaCuaTuongTac && (
          <div>
            <p className="font-medium text-secondary dark:text-white/90">Hậu quả:</p>
            <p className="leading-relaxed">{interaction.hauQuaCuaTuongTac}</p>
          </div>
        )}

        {interaction.xuTriTuongTac && (
          <div>
            <p className="font-medium text-secondary dark:text-white/90">Xử trí:</p>
            <p className="leading-relaxed">{interaction.xuTriTuongTac}</p>
          </div>
        )}

        {(ingredient1SourceDrugs?.some((drug) => !!drug.imageUrl) ||
          ingredient2SourceDrugs?.some((drug) => !!drug.imageUrl)) ? (
          <div>
            <p className="font-medium text-secondary dark:text-white/90">Nguồn thuốc:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[...(ingredient1SourceDrugs ?? []), ...(ingredient2SourceDrugs ?? [])]
                .filter((drug, index, list) => list.findIndex((d) => d.id === drug.id) === index)
                .map((drug) => (
                  <Link
                    key={`${interaction.id}-source-${drug.id}`}
                    href={`/drugs-info/${drug.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-2 py-1 dark:border-white/10 dark:bg-white/5 sm:gap-2"
                  >
                    {drug.imageUrl ? (
                      <img
                        src={drug.imageUrl}
                        alt={drug.label}
                        className="h-7 w-7 rounded-md object-cover sm:h-8 sm:w-8"
                        loading="lazy"
                      />
                    ) : (
                      <span className="h-7 w-7 rounded-md bg-muted/70 sm:h-8 sm:w-8" />
                    )}
                    <span className="text-xs font-medium text-secondary dark:text-white/90">{drug.label}</span>
                  </Link>
                ))}
            </div>
          </div>
        ) : null}

        <AnimatePresence initial={false}>
          {open && interaction.coCheTuongTac ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-2 rounded-xl bg-[var(--muted)]/50 p-3 dark:bg-white/10"
            >
              <p className="font-medium text-secondary dark:text-white/90">Cơ chế tương tác:</p>
              <p className="text-xs">{interaction.coCheTuongTac}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {interaction.coCheTuongTac && (
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
            aria-expanded={open}
          >
            {open ? (
              <>
                {t("drugInteraction.hideDetails")} <ChevronUp className="h-4 w-4" aria-hidden />
              </>
            ) : (
              <>
                {t("drugInteraction.moreDetails")} <ChevronDown className="h-4 w-4" aria-hidden />
              </>
            )}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
