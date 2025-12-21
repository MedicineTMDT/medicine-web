"use client";

import { IngredientSearch } from "@/components/drug-interaction/ingredient-search";
import { InteractionCard } from "@/components/drug-interaction/interaction-card";
import { MultiDrugSearch } from "@/components/drug-interaction/multi-drug-search";
import { useTranslation } from "@/components/i18n/translation-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    normalizeSeverity,
    useSearchInteractions,
    type DrugInteraction,
    type MergedIngredientResponse
} from "@/features/drug-interactions";
import { getDrugIngredients, useDrugSuggestions } from "@/features/drugs";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle2, FlaskConical, Loader2, Pill, ShieldAlert } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

type SearchMode = "drug" | "ingredient";

type Summary = {
  total: number;
  contraindicated: number;
  conditional: number;
};

export function DrugInteractionPageScreen() {
  // Search mode state
  const [searchMode, setSearchMode] = useState<SearchMode>("drug");
  
  // Drug mode state
  const [drugQuery, setDrugQuery] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState<{ id: string; label: string; meta?: string }[]>([]);
  
  // Ingredient mode state
  const [selectedIngredients, setSelectedIngredients] = useState<MergedIngredientResponse[]>([]);
  
  // Results state
  const [results, setResults] = useState<DrugInteraction[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  
  const { t } = useTranslation();
  
  // Drug suggestions query
  const { data: drugSuggestions, isLoading: isDrugLoading } = useDrugSuggestions(drugQuery);
  
  // Search interactions mutation
  const searchMutation = useSearchInteractions();
  
  // Format drug suggestions for MultiDrugSearch
  const formattedDrugSuggestions = useMemo(() => {
    if (!drugSuggestions?.result) return [];
    return drugSuggestions.result
      .filter((drug) => !selectedDrugs.some((s) => s.id === String(drug.id)))
      .map((drug) => ({
        id: String(drug.id),
        label: drug.name,
        meta: drug.slug,
      }));
  }, [drugSuggestions, selectedDrugs]);

  // Calculate summary
  const summary: Summary = useMemo(() => {
    const base = { total: results.length, contraindicated: 0, conditional: 0 };
    results.forEach((r) => {
      const severity = normalizeSeverity(r.mucDoNghiemTrong);
      if (severity === "contraindicated") base.contraindicated += 1;
      else if (severity === "conditional") base.conditional += 1;
    });
    return base;
  }, [results]);

  // Drug mode handlers
  const handleAddDrug = (item: { id: string; label: string; meta?: string }) => {
    if (selectedDrugs.length >= 10) return;
    setSelectedDrugs((prev) => [...prev, item]);
  };

  const handleRemoveDrug = (id: string) => {
    setSelectedDrugs((prev) => prev.filter((item) => item.id !== id));
  };

  // Ingredient mode handlers
  const handleAddIngredient = (ingredient: MergedIngredientResponse) => {
    if (selectedIngredients.length >= 10) return;
    setSelectedIngredients((prev) => [...prev, ingredient]);
  };

  const handleRemoveIngredient = (id: number) => {
    setSelectedIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  // Run interaction check
  const runCheck = useCallback(async () => {
    setHasSearched(true);
    
    let ingredientNames: string[] = [];
    
    if (searchMode === "drug") {
      // Extract ingredients from selected drugs
      setIsExtracting(true);
      try {
        const ingredientPromises = selectedDrugs.map((drug) =>
          getDrugIngredients(Number(drug.id))
        );
        const ingredientResults = await Promise.all(ingredientPromises);
        
        // Collect all unique ingredient names
        const allIngredients = new Set<string>();
        ingredientResults.forEach((result) => {
          if (result.result) {
            result.result.forEach((ing) => allIngredients.add(ing));
          }
        });
        ingredientNames = Array.from(allIngredients);
      } catch (error) {
        console.error("Error extracting ingredients:", error);
      } finally {
        setIsExtracting(false);
      }
    } else {
      // Use selected ingredients directly
      ingredientNames = selectedIngredients.map((ing) => ing.name);
    }
    
    if (ingredientNames.length === 0) {
      setResults([]);
      return;
    }
    
    // Search for interactions
    try {
      const response = await searchMutation.mutateAsync(ingredientNames);
      setResults(response.result || []);
    } catch (error) {
      console.error("Error searching interactions:", error);
      setResults([]);
    }
  }, [searchMode, selectedDrugs, selectedIngredients, searchMutation]);

  const isLoading = searchMutation.isPending || isExtracting;
  const canCheck = searchMode === "drug" 
    ? selectedDrugs.length >= 1 && selectedDrugs.length <= 10
    : selectedIngredients.length >= 1 && selectedIngredients.length <= 10;

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
            {/* Search Mode Tabs */}
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setSearchMode("drug")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
                  searchMode === "drug"
                    ? "bg-primary text-white shadow-lg"
                    : "border border-secondary/20 bg-secondary/10 text-secondary/80 hover:bg-secondary/20 dark:border-white/20 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/20"
                )}
              >
                <Pill className="h-4 w-4" aria-hidden />
                Tra theo thuốc
              </button>
              <button
                type="button"
                onClick={() => setSearchMode("ingredient")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
                  searchMode === "ingredient"
                    ? "bg-primary text-white shadow-lg"
                    : "border border-secondary/20 bg-secondary/10 text-secondary/80 hover:bg-secondary/20 dark:border-white/20 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/20"
                )}
              >
                <FlaskConical className="h-4 w-4" aria-hidden />
                Tra theo hoạt chất
              </button>
            </div>

            {/* Search Container */}
            <div className="rounded-[2.25rem] border border-white/15 bg-white/60 p-6 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/5">
              {searchMode === "drug" ? (
                <MultiDrugSearch
                  suggestions={formattedDrugSuggestions}
                  loading={isDrugLoading}
                  onQueryChange={setDrugQuery}
                  onAdd={handleAddDrug}
                  onRemove={handleRemoveDrug}
                  selected={selectedDrugs}
                />
              ) : (
                <IngredientSearch
                  onSelect={handleAddIngredient}
                  onRemove={handleRemoveIngredient}
                  selected={selectedIngredients}
                  disabled={isLoading}
                />
              )}
            </div>
            
            <div className="flex flex-col items-center gap-3 text-center text-sm text-secondary/80 sm:flex-row sm:justify-between sm:text-left dark:text-white/80">
              <p>
                {searchMode === "drug"
                  ? t("drugInteraction.selectPrompt", { values: { count: selectedDrugs.length } })
                  : `Đã chọn ${selectedIngredients.length} hoạt chất`}
              </p>
              <Button
                size="lg"
                className="w-full rounded-full sm:w-auto"
                disabled={!canCheck || isLoading}
                onClick={runCheck}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : null}
                {isExtracting ? "Đang trích xuất hoạt chất..." : t("drugInteraction.checkButton")}
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
            <SeverityBadge label="Chống chỉ định" count={summary.contraindicated} tone="contraindicated" />
            <SeverityBadge label="CCĐ có điều kiện" count={summary.conditional} tone="conditional" />
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
            {searchMode === "drug" 
              ? t("drugInteraction.addDrugs")
              : "Thêm hoạt chất và nhấn kiểm tra để xem tương tác"}
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-10 text-center dark:border-white/10 dark:bg-white/5">
            <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
            <p className="text-sm text-muted-foreground">
              {isExtracting ? "Đang trích xuất hoạt chất từ thuốc..." : t("drugInteraction.checking")}
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-10 text-center text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-emerald-200">
            <CheckCircle2 className="mx-auto mb-2 h-6 w-6" aria-hidden />
            {t("drugInteraction.noInteractions")}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((interaction) => (
              <InteractionCard
                key={interaction.id}
                interaction={interaction}
              />
            ))}
          </div>
        )}
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
  tone: "contraindicated" | "conditional";
}) {
  const styleMap: Record<typeof tone, string> = {
    contraindicated: "bg-purple-500/10 text-purple-800 ring-purple-500/30 dark:text-purple-200",
    conditional: "bg-orange-500/10 text-orange-800 ring-orange-500/30 dark:text-orange-200",
  };

  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 ring-1", styleMap[tone])}>
      {label}: {count}
    </span>
  );
}
