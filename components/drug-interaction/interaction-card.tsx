"use client";

import { useTranslation } from "@/components/i18n/translation-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DrugInteraction, SeverityLevel } from "@/features/drug-interactions";
import { normalizeSeverity } from "@/features/drug-interactions";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
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
  context?: {
    label: string;
    description?: string;
  };
};

export function InteractionCard({ interaction, context }: InteractionCardProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  
  const severity = normalizeSeverity(interaction.mucDoNghiemTrong);
  const names = `${interaction.hoatChat1Name} + ${interaction.hoatChat2Name}`;
  const severityLabel = severityLabelMap[severity];

  return (
    <Card className="h-full border-none bg-white/95 shadow-card ring-1 ring-border/20 backdrop-blur-sm transition hover:-translate-y-0.5 hover:ring-primary/30 dark:bg-secondary/70">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1",
              severityStyles[severity]
            )}
          >
            {severityLabel}
          </span>
          {interaction.mucDoNghiemTrong && interaction.mucDoNghiemTrong !== severityLabel && (
            <span className="rounded-full bg-[var(--muted)]/60 px-3 py-1 text-[11px] font-semibold text-secondary dark:bg-white/10 dark:text-white/80">
              {interaction.mucDoNghiemTrong}
            </span>
          )}
          {context ? (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
              {context.label}
              {context.description ? ` · ${context.description}` : null}
            </span>
          ) : null}
        </div>
        <CardTitle className="text-lg text-secondary dark:text-white">{names}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-secondary/80 dark:text-muted-foreground">
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
