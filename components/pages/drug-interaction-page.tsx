"use client";

import { IngredientSearch } from "@/components/drug-interaction/ingredient-search";
import { InteractionCard } from "@/components/drug-interaction/interaction-card";
import { MultiDrugSearch } from "@/components/drug-interaction/multi-drug-search";
import { useTranslation } from "@/components/i18n/translation-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  normalizeSeverity,
  useDrugInteractionsList,
  useSearchInteractions,
  type DrugInteraction,
  type MergedIngredientResponse,
} from "@/features/drug-interactions";
import { getDrugIngredients, useDrugSuggestions } from "@/features/drugs";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, FlaskConical, Loader2, Pill } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type SearchMode = "drug" | "ingredient" | "all";

type Summary = {
  total: number;
  contraindicated: number;
  conditional: number;
};

type SourceDrug = { id: string; label: string; imageUrl?: string };

type InteractionResultViewModel = {
  interaction: DrugInteraction;
  ingredient1SourceDrugs?: SourceDrug[];
  ingredient2SourceDrugs?: SourceDrug[];
};

function normalizeIngredientName(name: string): string {
  return name.trim().toLowerCase();
}

export function DrugInteractionPageScreen() {
  const [searchMode, setSearchMode] = useState<SearchMode>("drug");
  const [listPage, setListPage] = useState(0);
  const listPageSize = 12;

  const [drugQuery, setDrugQuery] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState<{ id: string; label: string; meta?: string; imageUrl?: string }[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<MergedIngredientResponse[]>([]);

  const [results, setResults] = useState<InteractionResultViewModel[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const resultsRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  const { data: drugSuggestions, isLoading: isDrugLoading } = useDrugSuggestions(drugQuery);
  const searchMutation = useSearchInteractions();
  const {
    data: allInteractionsData,
    isLoading: isAllInteractionsLoading,
    isFetching: isAllInteractionsFetching,
  } = useDrugInteractionsList(listPage, listPageSize, searchMode === "all");

  const formattedDrugSuggestions = useMemo(() => {
    if (!drugSuggestions?.result) return [];
    return drugSuggestions.result
      .filter((drug) => !selectedDrugs.some((s) => s.id === String(drug.id)))
      .map((drug) => ({
        id: String(drug.id),
        label: drug.name,
        meta: drug.slug,
        imageUrl: drug.imageLink || undefined,
      }));
  }, [drugSuggestions, selectedDrugs]);

  const summary: Summary = useMemo(() => {
    if (searchMode === "all") {
      const list = allInteractionsData?.result?.content || [];
      const base = { total: list.length, contraindicated: 0, conditional: 0 };
      list.forEach((item) => {
        const severity = normalizeSeverity(item.mucDoNghiemTrong);
        if (severity === "contraindicated") base.contraindicated += 1;
        else if (severity === "conditional") base.conditional += 1;
      });
      return base;
    }

    const base = { total: results.length, contraindicated: 0, conditional: 0 };
    results.forEach((r) => {
      const severity = normalizeSeverity(r.interaction.mucDoNghiemTrong);
      if (severity === "contraindicated") base.contraindicated += 1;
      else if (severity === "conditional") base.conditional += 1;
    });
    return base;
  }, [results, searchMode, allInteractionsData]);

  const handleAddDrug = (item: { id: string; label: string; meta?: string; imageUrl?: string }) => {
    if (selectedDrugs.length >= 10) return;
    setSelectedDrugs((prev) => [...prev, item]);
  };

  const handleRemoveDrug = (id: string) => {
    setSelectedDrugs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddIngredient = (ingredient: MergedIngredientResponse) => {
    if (selectedIngredients.length >= 10) return;
    setSelectedIngredients((prev) => [...prev, ingredient]);
  };

  const handleRemoveIngredient = (id: number) => {
    setSelectedIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const runCheck = useCallback(async () => {
    setHasSearched(true);

    let ingredientNames: string[] = [];
    let ingredientToDrugsMap = new Map<string, Map<string, SourceDrug>>();

    if (searchMode === "drug") {
      setIsExtracting(true);
      try {
        const ingredientPromises = selectedDrugs.map((drug) => getDrugIngredients(Number(drug.id)));
        const ingredientResults = await Promise.all(ingredientPromises);

        const allIngredients = new Map<string, string>();
        ingredientResults.forEach((result, idx) => {
          const sourceDrug = selectedDrugs[idx];
          if (!result.result) return;

          result.result.forEach((ing) => {
            const normalized = normalizeIngredientName(ing);
            if (!normalized) return;

            if (!allIngredients.has(normalized)) {
              allIngredients.set(normalized, ing.trim());
            }

            if (!ingredientToDrugsMap.has(normalized)) {
              ingredientToDrugsMap.set(normalized, new Map<string, SourceDrug>());
            }

            if (sourceDrug?.label) {
              ingredientToDrugsMap.get(normalized)?.set(sourceDrug.id, {
                id: sourceDrug.id,
                label: sourceDrug.label,
                imageUrl: sourceDrug.imageUrl,
              });
            }
          });
        });

        ingredientNames = Array.from(allIngredients.values());
      } catch (error) {
        console.error("Error extracting ingredients:", error);
      } finally {
        setIsExtracting(false);
      }
    } else if (searchMode === "ingredient") {
      ingredientNames = selectedIngredients.map((ing) => ing.name);
      ingredientToDrugsMap = new Map<string, Map<string, SourceDrug>>();
    }

    if (ingredientNames.length === 0) {
      setResults([]);
      return;
    }

    try {
      const response = await searchMutation.mutateAsync(ingredientNames);
      const interactions = response.result || [];
      const mappedResults: InteractionResultViewModel[] = interactions.map((interaction) => {
        const ingredient1SourceDrugs = Array.from(
          ingredientToDrugsMap.get(normalizeIngredientName(interaction.hoatChat1Name)) ?? []
        ).map(([, drug]) => drug);

        const ingredient2SourceDrugs = Array.from(
          ingredientToDrugsMap.get(normalizeIngredientName(interaction.hoatChat2Name)) ?? []
        ).map(([, drug]) => drug);

        return {
          interaction,
          ingredient1SourceDrugs: ingredient1SourceDrugs.length > 0 ? ingredient1SourceDrugs : undefined,
          ingredient2SourceDrugs: ingredient2SourceDrugs.length > 0 ? ingredient2SourceDrugs : undefined,
        };
      });

      setResults(mappedResults);
    } catch (error) {
      console.error("Error searching interactions:", error);
      setResults([]);
    }
  }, [searchMode, selectedDrugs, selectedIngredients, searchMutation]);

  const checkerLoading = searchMutation.isPending || isExtracting;
  const isLoading = searchMode === "all"
    ? isAllInteractionsLoading
    : checkerLoading;
  const isPageFetching = searchMode === "all" ? isAllInteractionsFetching : false;

  const canCheck = searchMode === "drug"
    ? selectedDrugs.length >= 1 && selectedDrugs.length <= 10
    : selectedIngredients.length >= 1 && selectedIngredients.length <= 10;

  useEffect(() => {
    if (searchMode !== "all" && hasSearched && !isLoading) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hasSearched, isLoading, searchMode]);

  useEffect(() => {
    setResults([]);
    setHasSearched(false);
    if (searchMode === "all") {
      setListPage(0);
      setHasSearched(true);
    }
  }, [searchMode]);

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
            <div className="grid w-full max-w-md grid-cols-3 gap-2 sm:flex sm:max-w-none sm:justify-center">
              <button
                type="button"
                onClick={() => {
                  setHasSearched(false);
                  setSearchMode("drug");
                }}
                className={cn(
                  "inline-flex min-h-[54px] items-center justify-center gap-1.5 rounded-2xl px-3 py-2 text-center text-xs font-semibold leading-tight transition border sm:min-h-0 sm:rounded-full sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm",
                  searchMode === "drug"
                    ? "bg-primary text-white shadow-lg border-primary"
                    : "bg-white/80 text-secondary/70 border-secondary/20 hover:bg-white hover:text-secondary dark:bg-white/10 dark:text-white/80 dark:border-white/20 dark:hover:bg-white/20"
                )}
              >
                <Pill className="h-4 w-4" aria-hidden />
                <span className="whitespace-normal">Tra theo thuốc</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setHasSearched(false);
                  setSearchMode("ingredient");
                }}
                className={cn(
                  "inline-flex min-h-[54px] items-center justify-center gap-1.5 rounded-2xl px-3 py-2 text-center text-xs font-semibold leading-tight transition border sm:min-h-0 sm:rounded-full sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm",
                  searchMode === "ingredient"
                    ? "bg-primary text-white shadow-lg border-primary"
                    : "bg-white/80 text-secondary/70 border-secondary/20 hover:bg-white hover:text-secondary dark:bg-white/10 dark:text-white/80 dark:border-white/20 dark:hover:bg-white/20"
                )}
              >
                <FlaskConical className="h-4 w-4" aria-hidden />
                <span className="whitespace-normal">Tra theo hoạt chất</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setHasSearched(false);
                  setSearchMode("all");
                }}
                className={cn(
                  "inline-flex min-h-[54px] items-center justify-center gap-1.5 rounded-2xl px-3 py-2 text-center text-xs font-semibold leading-tight transition border sm:min-h-0 sm:rounded-full sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm",
                  searchMode === "all"
                    ? "bg-primary text-white shadow-lg border-primary"
                    : "bg-white/80 text-secondary/70 border-secondary/20 hover:bg-white hover:text-secondary dark:bg-white/10 dark:text-white/80 dark:border-white/20 dark:hover:bg-white/20"
                )}
              >
                <span className="whitespace-normal">Danh sách tương tác</span>
              </button>
            </div>

            {searchMode === "all" ? null : (
              <>
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
              </>
            )}
          </motion.div>
        </div>
      </section>

      <section ref={resultsRef} className="container mt-12 space-y-6">
        {searchMode !== "all" ? (
          <div className="flex items-center gap-3">
            <Separator className="flex-1 border-[var(--glass-border)] bg-[var(--glass-border)] dark:border-white/10 dark:bg-white/10" />
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary/70 dark:text-white/60">
              {t("drugInteraction.results")}
            </span>
            <Separator className="flex-1 border-[var(--glass-border)] bg-[var(--glass-border)] dark:border-white/10 dark:bg-white/10" />
          </div>
        ) : null}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {searchMode === "all" && (allInteractionsData?.result?.totalPages ?? 0) > 1 ? (
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setListPage((p) => Math.max(0, p - 1))}
                disabled={!!allInteractionsData?.result?.first || isPageFetching}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-secondary/80 dark:text-white/80">
                Trang {listPage + 1}/{Math.max(1, allInteractionsData?.result?.totalPages ?? 1)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setListPage((p) => p + 1)}
                disabled={!!allInteractionsData?.result?.last || isPageFetching}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>

        {searchMode !== "all" && !hasSearched ? (
          <div className="rounded-2xl border border-dashed border-[var(--glass-border)] bg-[var(--glass-bg)] p-10 text-center text-muted-foreground dark:border-white/10 dark:bg-white/5">
            {searchMode === "drug"
              ? t("drugInteraction.addDrugs")
              : "Thêm hoạt chất và nhấn kiểm tra để xem tương tác"}
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-10 text-center dark:border-white/10 dark:bg-white/5">
            <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
            <p className="text-sm text-muted-foreground">
              {searchMode !== "all" && isExtracting
                ? "Đang trích xuất hoạt chất từ thuốc..."
                : t("drugInteraction.checking")}
            </p>
          </div>
        ) : searchMode === "all" ? (
          (allInteractionsData?.result?.content?.length ?? 0) === 0 ? (
            <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-10 text-center text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-emerald-200">
              <CheckCircle2 className="mx-auto mb-2 h-6 w-6" aria-hidden />
              Không có tương tác ở trang hiện tại.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                {allInteractionsData?.result?.content?.map((interaction) => (
                  <InteractionCard key={interaction.id} interaction={interaction} />
                ))}
              </div>
              <div className="flex items-center justify-center gap-2">
                {(allInteractionsData?.result?.totalPages ?? 0) > 1 ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      disabled={!!allInteractionsData?.result?.first || isPageFetching}
                      onClick={() => setListPage((prev) => Math.max(0, prev - 1))}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Trang trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      disabled={!!allInteractionsData?.result?.last || isPageFetching}
                      onClick={() => setListPage((prev) => prev + 1)}
                    >
                      Trang sau
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          )
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-10 text-center text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-emerald-200">
            <CheckCircle2 className="mx-auto mb-2 h-6 w-6" aria-hidden />
            {t("drugInteraction.noInteractions")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {results.map(({ interaction, ingredient1SourceDrugs, ingredient2SourceDrugs }) => (
              <InteractionCard
                key={interaction.id}
                interaction={interaction}
                ingredient1SourceDrugs={ingredient1SourceDrugs}
                ingredient2SourceDrugs={ingredient2SourceDrugs}
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

