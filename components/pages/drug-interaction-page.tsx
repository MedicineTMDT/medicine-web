"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { InteractionCard } from "@/components/drug-interaction/interaction-card";
import { MultiDrugSearch } from "@/components/drug-interaction/multi-drug-search";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { drugInfoList, drugInteractionRules, type DrugInteractionRule, type DrugInfo } from "@/lib/mockData";
import { useTranslation } from "@/components/i18n/translation-provider";

type Summary = {
  total: number;
  mild: number;
  moderate: number;
  severe: number;
};

type CompoundInsight = {
  compound: string;
  sourceDrugId: string;
  rule: DrugInteractionRule;
};

export function DrugInteractionPageScreen() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<{ id: string; label: string; meta?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DrugInteractionRule[]>([]);
  const [compoundResults, setCompoundResults] = useState<CompoundInsight[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { t } = useTranslation();

  const drugLookup: Record<string, DrugInfo> = useMemo(
    () => Object.fromEntries(drugInfoList.map((d) => [d.id, d])),
    []
  );
  const compoundIndex = useMemo(() => {
    const map = new Map<string, Set<string>>();
    drugInfoList.forEach((drug) => {
      drug.compounds.forEach((compound) => {
        const key = compound.trim().toLowerCase();
        if (!key) return;
        if (!map.has(key)) {
          map.set(key, new Set());
        }
        map.get(key)!.add(drug.id);
      });
    });
    return map;
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return drugInfoList
      .filter(
        (drug) =>
          !selected.some((s) => s.id === drug.id) &&
          (drug.name.toLowerCase().includes(q) ||
            drug.genericName?.toLowerCase().includes(q) ||
            drug.category.toLowerCase().includes(q))
      )
      .slice(0, 8)
      .map((drug) => ({ id: drug.id, label: drug.name, meta: drug.category }));
  }, [query, selected]);

  const summary: Summary = useMemo(() => {
    const base = { total: results.length, mild: 0, moderate: 0, severe: 0 };
    results.forEach((r) => {
      if (r.severity === "mild") base.mild += 1;
      if (r.severity === "moderate") base.moderate += 1;
      if (r.severity === "severe") base.severe += 1;
    });
    return base;
  }, [results]);

  const handleAdd = (item: { id: string; label: string; meta?: string }) => {
    if (selected.length >= 10) return;
    setSelected((prev) => [...prev, item]);
  };

  const handleRemove = (id: string) => {
    setSelected((prev) => prev.filter((item) => item.id !== id));
  };

  const runCheck = () => {
    setHasSearched(true);
    setLoading(true);
    setTimeout(() => {
      const ids = selected.map((s) => s.id);
      const matches =
        ids.length <= 1
          ? drugInteractionRules.filter((rule) => ids.some((id) => rule.drugs.includes(id)))
          : drugInteractionRules.filter((rule) => rule.drugs.every((drugId) => ids.includes(drugId)));

      const ingredientInsights: CompoundInsight[] = [];
      const seen = new Set<string>();
      ids.forEach((id) => {
        const drug = drugLookup[id];
        if (!drug) return;
        drug.compounds.forEach((compound) => {
          const owners = compoundIndex.get(compound.trim().toLowerCase());
          owners?.forEach((ownerId) => {
            if (ownerId === id) return;
            drugInteractionRules.forEach((rule) => {
              if (!rule.drugs.includes(ownerId)) return;
              const key = `${compound}|${ownerId}|${rule.drugs.join("-")}`;
              if (seen.has(key)) return;
              seen.add(key);
              ingredientInsights.push({
                compound,
                sourceDrugId: ownerId,
                rule,
              });
            });
          });
        });
      });

      setResults(matches);
      setCompoundResults(ingredientInsights);
      setLoading(false);
    }, 500);
  };

  const interactionCards = results.map((rule) => (
    <InteractionCard key={rule.drugs.join("-")} rule={rule} drugLookup={drugLookup} />
  ));

  return (
    <div className="relative pb-24">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#020e19]/85 via-[#071f34]/90 to-[#05182a]" />
        <div className="container relative flex flex-col items-center py-14 text-center text-foreground dark:text-white">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-2xl space-y-4"
          >
            <span className="inline-flex items-center justify-center rounded-full border border-[var(--glass-border)] bg-white/80 px-5 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-secondary dark:border-white/30 dark:bg-white/10 dark:text-white">
              {t("drugInteraction.badge")}
            </span>
            <h1 className="text-3xl font-heading font-semibold leading-tight text-secondary dark:text-white md:text-4xl">
              {t("drugInteraction.title")}
            </h1>
            <p className="text-sm text-secondary/80 dark:text-white/80 md:text-base">
              {t("drugInteraction.description")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mx-auto mt-10 w-full max-w-4xl space-y-4"
          >
            <div className="rounded-[2.25rem] border border-white/15 bg-white/60 p-6 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/5">
              <MultiDrugSearch
                suggestions={suggestions}
                loading={loading && !hasSearched}
                onQueryChange={setQuery}
                onAdd={handleAdd}
                onRemove={handleRemove}
                selected={selected}
              />
            </div>
            <div className="flex flex-col items-center gap-3 text-center text-sm text-secondary/80 sm:flex-row sm:justify-between sm:text-left dark:text-white/80">
              <p>{t("drugInteraction.selectPrompt", { values: { count: selected.length } })}</p>
              <Button
                size="lg"
                className="w-full rounded-full sm:w-auto"
                disabled={selected.length < 1 || selected.length > 10 || loading}
                onClick={runCheck}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : null}
                {t("drugInteraction.checkButton")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mt-12 space-y-6">
        <div className="flex items-center gap-3">
          <Separator className="flex-1 border-[var(--glass-border)] bg-[var(--glass-border)] dark:border-white/10 dark:bg-white/10" />
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary/70 dark:text-white/60">
            {t("drugInteraction.results")}
          </span>
          <Separator className="flex-1 border-[var(--glass-border)] bg-[var(--glass-border)] dark:border-white/10 dark:bg-white/10" />
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-secondary/80 dark:text-white/70">
            <SeverityBadge label={t("drugInteraction.severity.severe")} count={summary.severe} tone="severe" />
            <SeverityBadge label={t("drugInteraction.severity.moderate")} count={summary.moderate} tone="moderate" />
            <SeverityBadge label={t("drugInteraction.severity.mild")} count={summary.mild} tone="mild" />
          </div>
          {hasSearched ? (
            <div className="sticky top-4 flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-2 text-sm font-semibold text-secondary shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white">
              <ShieldAlert className="h-4 w-4 text-primary" aria-hidden />
              {t("drugInteraction.interactionsFound", { values: { count: summary.total } })}
            </div>
          ) : null}
        </div>

        {!hasSearched ? (
          <div className="rounded-2xl border border-dashed border-[var(--glass-border)] bg-[var(--glass-bg)] p-10 text-center text-muted-foreground dark:border-white/10 dark:bg-white/5">
            {t("drugInteraction.addDrugs")}
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-10 text-center dark:border-white/10 dark:bg-white/5">
            <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
            <p className="text-sm text-muted-foreground">{t("drugInteraction.checking")}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-10 text-center text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-emerald-200">
            <CheckCircle2 className="mx-auto mb-2 h-6 w-6" aria-hidden />
            {t("drugInteraction.noInteractions")}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{interactionCards}</div>
        )}

        {compoundResults.length ? (
          <div className="space-y-4 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-secondary/70 dark:text-white/70">
                  {t("drugInteraction.ingredientInteractions")}
                </p>
                <p className="text-sm text-muted-foreground">{t("drugInteraction.ingredientDescription")}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {compoundResults.map((item, index) => (
                <InteractionCard
                  key={`${item.compound}-${item.sourceDrugId}-${item.rule.drugs.join("-")}-${index}`}
                  rule={item.rule}
                  drugLookup={drugLookup}
                  context={{
                    label: t("drugInteraction.ingredientLabel", { values: { compound: item.compound } }),
                    description: drugLookup[item.sourceDrugId]?.name ?? item.sourceDrugId,
                  }}
                />
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function SeverityBadge({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "mild" | "moderate" | "severe";
}) {
  const styles =
    tone === "severe"
      ? "bg-red-500/10 text-red-800 ring-red-500/30 dark:text-red-200"
      : tone === "moderate"
        ? "bg-yellow-500/10 text-yellow-800 ring-yellow-500/30 dark:text-yellow-200"
        : "bg-blue-500/10 text-blue-800 ring-blue-500/30 dark:text-blue-200";

  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 ring-1", styles)}>
      {label}: {count}
    </span>
  );
}
