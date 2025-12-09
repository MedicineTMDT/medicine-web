"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DrugInteractionRule, DrugInfo } from "@/lib/mockData";
import { useTranslation } from "@/components/i18n/translation-provider";

const severityStyles: Record<DrugInteractionRule["severity"], string> = {
  severe: "ring-red-500/40 bg-red-500/10 text-red-800 dark:text-red-200",
  moderate: "ring-yellow-500/40 bg-yellow-500/10 text-yellow-800 dark:text-yellow-200",
  mild: "ring-blue-500/40 bg-blue-500/10 text-blue-800 dark:text-blue-200",
};

type InteractionCardProps = {
  rule: DrugInteractionRule;
  drugLookup: Record<string, DrugInfo>;
  context?: {
    label: string;
    description?: string;
  };
};

export function InteractionCard({ rule, drugLookup, context }: InteractionCardProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const names = rule.drugs.map((id) => drugLookup[id]?.name ?? id).join(" + ");
  const severityLabel = t(`drugInteraction.severity.${rule.severity}`, { fallback: rule.severity });

  return (
    <Card className="h-full border-none bg-white/95 shadow-card ring-1 ring-border/20 backdrop-blur-sm transition hover:-translate-y-0.5 hover:ring-primary/30 dark:bg-secondary/70">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1",
              severityStyles[rule.severity]
            )}
          >
            {severityLabel}
          </span>
          <span className="rounded-full bg-[var(--muted)]/60 px-3 py-1 text-[11px] font-semibold text-secondary dark:bg-white/10 dark:text-white/80">
            {t(rule.effect, { fallback: rule.effect })}
          </span>
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
        <p className="leading-relaxed">{rule.recommendation}</p>
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-2 rounded-xl bg-[var(--muted)]/50 p-3 dark:bg-white/10"
            >
              {rule.mechanism ? <p className="text-xs">{rule.mechanism}</p> : null}
              {rule.notes ? <p className="text-xs">{rule.notes}</p> : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
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
      </CardContent>
    </Card>
  );
}
