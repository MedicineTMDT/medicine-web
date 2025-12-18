"use client";

import { CategorySearchCard } from "@/components/drugs-info/category-search-card";
import { DrugSearchCard } from "@/components/drugs-info/drug-search-card";
import { DrugInfoSearchBar, type DrugInfoSuggestion } from "@/components/drugs-info/search-bar";
import { useTranslation } from "@/components/i18n/translation-provider";
import { Button } from "@/components/ui/button";
import {
    useCategories,
    useCategoryDetails,
    useCategoryDetailSearch,
    useDrugs,
    useDrugsByCategory,
    useDrugSearch,
    useDrugSuggestions,
    type CategoryResponse,
    type Pageable
} from "@/features/drugs";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BookOpen, ChevronDown, ChevronLeft, ChevronRight, Filter, Loader2, Pill, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_PAGE_SIZE = 12;

type SearchMode = "drugs" | "categories";

export function DrugsInfoPageScreen() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("drugs");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(0);
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageable: Pageable = useMemo(
    () => ({ page, size: DEFAULT_PAGE_SIZE }),
    [page]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch categories for filter chips (in drugs mode)
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    page: 0,
    size: 50, // Fetch top categories for filter
  });
  const filterCategories = categoriesData?.result?.content ?? [];

  // Fetch suggestions for autocomplete (top 10) - only for drugs mode
  const { data: suggestionsData, isLoading: suggestionsLoading } = useDrugSuggestions(
    searchMode === "drugs" ? debouncedQuery : ""
  );

  // Determine if searching or filtering
  const isSearching = debouncedQuery.trim().length > 0;
  const isFilteringByCategory = selectedCategoryId !== undefined && !isSearching;

  // Fetch drug search results
  const {
    data: drugSearchData,
    isLoading: drugSearchLoading,
    isFetching: drugSearchFetching,
  } = useDrugSearch(searchMode === "drugs" ? debouncedQuery : "", pageable);

  // Fetch all drugs (when not searching and not filtering in drugs mode)
  const {
    data: allDrugsData,
    isLoading: allDrugsLoading,
    isFetching: allDrugsFetching,
  } = useDrugs(pageable);

  // Fetch drugs by category (when filtering by category)
  const {
    data: categoryDrugsData,
    isLoading: categoryDrugsLoading,
    isFetching: categoryDrugsFetching,
  } = useDrugsByCategory(selectedCategoryId, pageable);

  // Fetch category search results (when searching in categories mode)
  const {
    data: categorySearchData,
    isLoading: categorySearchLoading,
    isFetching: categorySearchFetching,
  } = useCategoryDetailSearch(searchMode === "categories" ? debouncedQuery : "", pageable);

  // Fetch all category details (when not searching in categories mode)
  const {
    data: allCategoryDetailsData,
    isLoading: allCategoryDetailsLoading,
    isFetching: allCategoryDetailsFetching,
  } = useCategoryDetails(pageable);

  // Determine which drug data to use based on mode
  const drugsData = isSearching 
    ? drugSearchData 
    : isFilteringByCategory 
      ? categoryDrugsData 
      : allDrugsData;
  const drugsLoading = isSearching 
    ? drugSearchLoading 
    : isFilteringByCategory 
      ? categoryDrugsLoading 
      : allDrugsLoading;
  const drugsFetching = isSearching 
    ? drugSearchFetching 
    : isFilteringByCategory 
      ? categoryDrugsFetching 
      : allDrugsFetching;

  // Category data - use search results when searching, otherwise all category details
  const categoryData = isSearching ? categorySearchData : allCategoryDetailsData;
  const categoriesLoading2 = isSearching ? categorySearchLoading : allCategoryDetailsLoading;
  const categoriesFetching = isSearching ? categorySearchFetching : allCategoryDetailsFetching;

  // Map suggestions for the search bar
  const suggestions: DrugInfoSuggestion[] = useMemo(() => {
    if (!suggestionsData?.result || searchMode !== "drugs") return [];
    return suggestionsData.result.map((drug) => ({
      id: drug.id.toString(),
      label: drug.name,
      meta: drug.slug,
    }));
  }, [suggestionsData, searchMode]);

  // Get data based on mode
  const drugs = drugsData?.result?.content ?? [];
  const categories = categoryData?.result?.content ?? [];
  
  const isLoading = searchMode === "drugs" 
    ? (drugsLoading || drugsFetching)
    : (categoriesLoading2 || categoriesFetching);

  const totalPages = searchMode === "drugs"
    ? drugsData?.result?.totalPages ?? 0
    : categoryData?.result?.totalPages ?? 0;
  const totalElements = searchMode === "drugs"
    ? drugsData?.result?.totalElements ?? 0
    : categoryData?.result?.totalElements ?? 0;
  const isFirstPage = searchMode === "drugs"
    ? drugsData?.result?.first ?? true
    : categoryData?.result?.first ?? true;
  const isLastPage = searchMode === "drugs"
    ? drugsData?.result?.last ?? true
    : categoryData?.result?.last ?? true;

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (value !== debouncedQuery) {
      setPage(0);
    }
    setDebouncedQuery(value);
    // Clear category filter when searching
    if (value.trim().length > 0) {
      setSelectedCategoryId(undefined);
    }
  };

  const handleSelectSuggestion = (suggestion: DrugInfoSuggestion) => {
    setQuery(suggestion.label);
    setDebouncedQuery(suggestion.label);
    setPage(0);
    setSelectedCategoryId(undefined);
  };

  const handleModeChange = (mode: SearchMode) => {
    setSearchMode(mode);
    setIsDropdownOpen(false);
    setQuery("");
    setDebouncedQuery("");
    setSelectedCategoryId(undefined);
    setPage(0);
  };

  const handleCategoryFilter = (categoryId: number | undefined) => {
    setSelectedCategoryId(categoryId);
    setQuery("");
    setDebouncedQuery("");
    setPage(0);
  };

  const handleClearFilters = () => {
    setQuery("");
    setDebouncedQuery("");
    setSelectedCategoryId(undefined);
    setPage(0);
  };

  // Get selected category name for display
  const selectedCategory = filterCategories.find(c => c.id === selectedCategoryId);

  const modeConfig = {
    drugs: {
      label: t("drugsInfo.modeDrugs", { fallback: "Thuốc" }),
      icon: Pill,
      placeholder: t("drugsInfo.searchDrugsPlaceholder", { fallback: "Tìm kiếm thuốc..." }),
    },
    categories: {
      label: t("drugsInfo.modeCategories", { fallback: "Danh mục" }),
      icon: BookOpen,
      placeholder: t("drugsInfo.searchCategoriesPlaceholder", { fallback: "Tìm kiếm danh mục..." }),
    },
  };

  const currentMode = modeConfig[searchMode];
  const ModeIcon = currentMode.icon;

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
            className="mx-auto mt-10 w-full max-w-3xl"
          >
            {/* Search bar with mode dropdown and category filter */}
            <div className="flex gap-2 rounded-3xl border border-[var(--glass-border)] bg-white/60 p-2 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5">
              {/* Mode Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={cn(
                    "flex h-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    "bg-transparent hover:bg-white/50 dark:hover:bg-white/10",
                    "text-secondary dark:text-white",
                    "border border-border/30 dark:border-white/20",
                    isDropdownOpen && "ring-2 ring-primary/20 border-primary"
                  )}
                >
                  <ModeIcon className="h-4 w-4 text-primary" />
                  <span className="hidden sm:inline">{currentMode.label}</span>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-muted-foreground transition",
                    isDropdownOpen && "rotate-180"
                  )} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-white/20 bg-white shadow-xl dark:bg-slate-800">
                    {(Object.keys(modeConfig) as SearchMode[]).map((mode) => {
                      const config = modeConfig[mode];
                      const Icon = config.icon;
                      return (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => handleModeChange(mode)}
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition",
                            searchMode === mode
                              ? "bg-primary/10 text-primary"
                              : "text-secondary hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Search Input */}
              <div className="flex-1">
                <DrugInfoSearchBar
                  value={query}
                  onValueChange={handleQueryChange}
                  suggestions={searchMode === "drugs" ? suggestions : []}
                  onSelect={handleSelectSuggestion}
                  loading={suggestionsLoading && searchMode === "drugs"}
                  placeholder={currentMode.placeholder}
                />
              </div>

              {/* Category Filter Dropdown - Only in drugs mode */}
              {/* Temporarily commented out
              {searchMode === "drugs" && (
                <CategoryFilterDropdown
                  categories={filterCategories}
                  selectedCategoryId={selectedCategoryId}
                  selectedCategory={selectedCategory}
                  onSelect={handleCategoryFilter}
                  loading={categoriesLoading}
                />
              )}
              */}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mt-10 space-y-6">
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
        ) : searchMode === "drugs" ? (
          // Drug cards grid
          drugs.length > 0 ? (
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
            <EmptyState onClear={handleClearFilters} t={t} />
          )
        ) : (
          // Category cards grid
          categories.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {categories.map((category, index) => (
                <CategorySearchCard
                  key={category.id}
                  category={category}
                  href={`/category/${category.id}`}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <EmptyState onClear={handleClearFilters} t={t} isCategory />
          )
        )}

        {/* Bottom pagination for long lists */}
        {totalPages > 1 && ((searchMode === "drugs" && drugs.length > 0) || (searchMode === "categories" && categories.length > 0)) && (
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

// Empty state component
function EmptyState({ 
  onClear, 
  t, 
  isCategory = false 
}: { 
  onClear: () => void; 
  t: (key: string, options?: object) => string;
  isCategory?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[var(--glass-border)] bg-[var(--glass-bg)] p-12 text-center text-muted-foreground dark:border-white/10 dark:bg-white/5">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        {isCategory ? (
          <BookOpen className="h-10 w-10" aria-hidden />
        ) : (
          <Pill className="h-10 w-10" aria-hidden />
        )}
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
        onClick={onClear}
      >
        <Search className="h-4 w-4" aria-hidden />
        {t("actions.clearSearch")}
      </button>
    </div>
  );
}

// Category Filter Dropdown component

function CategoryFilterDropdown({
  categories,
  selectedCategoryId,
  selectedCategory,
  onSelect,
  loading,
}: {
  categories: CategoryResponse[];
  selectedCategoryId: number | undefined;
  selectedCategory: CategoryResponse | undefined;
  onSelect: (id: number | undefined) => void;
  loading: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Filter categories by search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (id: number | undefined) => {
    onSelect(id);
    setIsOpen(false);
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-border/30 bg-white/80 px-4 py-3 dark:border-white/20 dark:bg-white/10">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition",
          "bg-transparent hover:bg-white/50 dark:hover:bg-white/10",
          "text-secondary dark:text-white",
          "border border-border/30 dark:border-white/20",
          isOpen && "ring-2 ring-primary/20 border-primary",
          selectedCategoryId !== undefined && "border-primary/50 bg-primary/20"
        )}
      >
        <Filter className="h-4 w-4 text-primary" />
        <span className="hidden sm:inline max-w-[120px] truncate">
          {selectedCategory ? selectedCategory.name : "Danh mục"}
        </span>
        {selectedCategoryId !== undefined && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(undefined);
            }}
            className="rounded-full p-0.5 hover:bg-primary/20"
          >
            <X className="h-3 w-3" />
          </button>
        )}
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/20 bg-white shadow-xl dark:bg-slate-800">
          {/* Search Input */}
          <div className="border-b border-border/20 p-3 dark:border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Tìm danh mục..."
                className="w-full rounded-lg border border-border/30 bg-gray-50 py-2 pl-10 pr-4 text-sm text-secondary placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
          </div>

          {/* Category List */}
          <div className="max-h-[250px] overflow-y-auto p-2">
            {/* All option */}
            <button
              type="button"
              onClick={() => handleSelect(undefined)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition",
                selectedCategoryId === undefined
                  ? "bg-primary/10 text-primary"
                  : "text-secondary hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
              )}
            >
              <span className="font-medium">Tất cả danh mục</span>
            </button>

            <div className="my-2 border-t border-border/20 dark:border-white/10" />

            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleSelect(category.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition",
                    selectedCategoryId === category.id
                      ? "bg-primary/10 text-primary"
                      : "text-secondary hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
                  )}
                >
                  <span className="font-medium truncate">{category.name}</span>
                  {category.amount > 0 && (
                    <span className="text-xs text-muted-foreground">{category.amount}</span>
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                Không tìm thấy "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
