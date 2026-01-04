"use client";

import { CategoryFilter } from "@/components/drugs-info/category-filter";
import { DrugSearchCard } from "@/components/drugs-info/drug-search-card";
import { DrugInfoSearchBar, type DrugInfoSuggestion } from "@/components/drugs-info/search-bar";
import { useTranslation } from "@/components/i18n/translation-provider";
import { Button } from "@/components/ui/button";
import {
    useCategories,
    useDrugs,
    useDrugsByCategory,
    useDrugSearch,
    useDrugSuggestions,
    type Pageable
} from "@/features/drugs";
import { motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { useMemo, useState } from "react";

const DEFAULT_PAGE_SIZE = 12;

export function DrugsInfoPageScreen() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(0);
  const { t } = useTranslation();

  const pageable: Pageable = useMemo(
    () => ({ page, size: DEFAULT_PAGE_SIZE }),
    [page]
  );

  // Fetch categories for filter (fetch all categories for dropdown)
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories({
    page: 0,
    size: 1000, // Fetch all categories for filter dropdown
  });

  // Fetch suggestions for autocomplete (top 10)
  const { data: suggestionsData, isLoading: suggestionsLoading } = useDrugSuggestions(debouncedQuery);

  // Determine the mode: search, category filter, or all drugs
  const isSearching = debouncedQuery.trim().length > 0;
  const isFilteringByCategory = selectedCategoryId !== undefined && !isSearching;

  // Fetch search results (enabled when searching)
  const {
    data: searchData,
    isLoading: searchLoading,
    isFetching: searchFetching,
  } = useDrugSearch(debouncedQuery, pageable);

  // Fetch drugs by category (enabled when filtering by category)
  const {
    data: categoryDrugsData,
    isLoading: categoryDrugsLoading,
    isFetching: categoryDrugsFetching,
  } = useDrugsByCategory(selectedCategoryId, pageable);

  // Fetch all drugs (enabled when not searching and not filtering)
  const {
    data: allDrugsData,
    isLoading: allDrugsLoading,
    isFetching: allDrugsFetching,
  } = useDrugs(pageable);

  // Determine which data to use based on mode
  const drugsData = isSearching 
    ? searchData 
    : isFilteringByCategory 
      ? categoryDrugsData 
      : allDrugsData;
  const drugsLoading = isSearching 
    ? searchLoading 
    : isFilteringByCategory 
      ? categoryDrugsLoading 
      : allDrugsLoading;
  const drugsFetching = isSearching 
    ? searchFetching 
    : isFilteringByCategory 
      ? categoryDrugsFetching 
      : allDrugsFetching;

  // Map suggestions for the search bar
  const suggestions: DrugInfoSuggestion[] = useMemo(() => {
    if (!suggestionsData?.result) return [];
    return suggestionsData.result.map((drug) => ({
      id: drug.id.toString(),
      label: drug.name,
      meta: drug.slug,
    }));
  }, [suggestionsData]);

  // Get drugs list and pagination info
  const drugs = drugsData?.result?.content ?? [];
  const totalPages = drugsData?.result?.totalPages ?? 0;
  const totalElements = drugsData?.result?.totalElements ?? 0;
  const isFirstPage = drugsData?.result?.first ?? true;
  const isLastPage = drugsData?.result?.last ?? true;

  // Get categories for filter
  const categories = categoriesData?.result?.content ?? [];

  const handleQueryChange = (value: string) => {
    setQuery(value);
    // Reset to first page when query changes
    if (value !== debouncedQuery) {
      setPage(0);
    }
    setDebouncedQuery(value);
  };

  const handleSelectSuggestion = (suggestion: DrugInfoSuggestion) => {
    setQuery(suggestion.label);
    setDebouncedQuery(suggestion.label);
    setPage(0);
  };

  const handleCategorySelect = (categoryId: number | undefined) => {
    setSelectedCategoryId(categoryId);
    setPage(0);
    // Clear search when selecting category
    if (categoryId !== undefined) {
      setQuery("");
      setDebouncedQuery("");
    }
  };

  const handleClearFilters = () => {
    setQuery("");
    setDebouncedQuery("");
    setSelectedCategoryId(undefined);
    setPage(0);
  };

  const isLoading = drugsLoading || drugsFetching;

  return (
    <div className="relative pb-24">
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#041629]/90 via-[#0B2746]/90 to-[#071F34]" />
        <div className="container relative flex flex-col items-center py-14 text-center text-foreground dark:text-white">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-2xl space-y-4"
          >
            <span className="inline-flex items-center justify-center rounded-full border border-[var(--glass-border)] bg-white/80 px-5 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-secondary dark:border-white/30 dark:bg-white/10 dark:text-white">
              {t("drugsInfo.badge")}
            </span>
            <h1 className="text-3xl font-heading font-semibold leading-tight text-secondary dark:text-white md:text-4xl">
              {t("drugsInfo.title")}
            </h1>
            <p className="text-sm text-secondary/80 dark:text-white/80 md:text-base">
              {t("drugsInfo.description")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mx-auto mt-10 w-full max-w-3xl space-y-4"
          >
            <DrugInfoSearchBar
              value={query}
              onValueChange={handleQueryChange}
              suggestions={suggestions}
              onSelect={handleSelectSuggestion}
              loading={suggestionsLoading}
            />
            <div className="relative z-50 rounded-3xl border border-[var(--glass-border)] bg-white/60 p-4 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5">
              <CategoryFilter
                categories={categories}
                selectedId={selectedCategoryId}
                onSelect={handleCategorySelect}
                onClear={() => setSelectedCategoryId(undefined)}
                loading={categoriesLoading}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mt-16 space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-heading font-semibold text-secondary dark:text-white">
              {t("drugsInfo.results")}
            </h2>
            <p className="text-secondary/80 dark:text-muted-foreground">
              {isLoading
                ? t("drugsInfo.loading")
                : t("drugsInfo.matchesFound", {
                    values: { count: totalElements, suffix: totalElements === 1 ? "" : "es" },
                  })}
            </p>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={isFirstPage || isLoading}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-secondary/80 dark:text-white/80">
                {t("drugsInfo.pagination", {
                  values: { current: page + 1, total: totalPages },
                })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={isLastPage || isLoading}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-12 text-center dark:border-white/10 dark:bg-white/5">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">{t("drugsInfo.loading")}</p>
          </div>
        ) : drugs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {drugs.map((drug, index) => (
              <DrugSearchCard
                key={drug.id}
                drug={drug}
                href={`/drugs-info/${drug.id}`}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[var(--glass-border)] bg-[var(--glass-bg)] p-12 text-center text-muted-foreground dark:border-white/10 dark:bg-white/5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BookOpen className="h-10 w-10" aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-secondary dark:text-white">
                {t("drugsInfo.noMatchesTitle")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("drugsInfo.noMatchesDescription")}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-secondary shadow-sm"
              onClick={handleClearFilters}
            >
              <Search className="h-4 w-4" aria-hidden />
              {t("actions.clearSearch")}
            </button>
          </div>
        )}

        {/* Bottom pagination for long lists */}
        {totalPages > 1 && drugs.length > 0 && (
          <div className="flex justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={isFirstPage || isLoading}
              className="rounded-full"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              {t("actions.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={isLastPage || isLoading}
              className="rounded-full"
            >
              {t("actions.next")}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
