"use client";

import { useTranslation } from "@/components/i18n/translation-provider";
import { useIngredientSuggestions, type MergedIngredientResponse } from "@/features/drug-interactions";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

type IngredientSearchProps = {
  onSelect: (ingredient: MergedIngredientResponse) => void;
  onRemove: (id: number) => void;
  selected: MergedIngredientResponse[];
  max?: number;
  disabled?: boolean;
};

export function IngredientSearch({
  onSelect,
  onRemove,
  selected,
  max = 10,
  disabled = false,
}: IngredientSearchProps) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { t } = useTranslation();
  
  const { data: suggestions, isLoading } = useIngredientSuggestions(query);
  
  const atLimit = useMemo(() => selected.length >= max, [selected.length, max]);
  const warning = selected.length > 10;

  // Filter out already selected ingredients
  // Handle both array format and object with array property
  const filteredSuggestions = useMemo(() => {
    if (!suggestions) return [];
    
    // Handle case where suggestions might be wrapped in an object
    const suggestionList = Array.isArray(suggestions) 
      ? suggestions 
      : (suggestions as unknown as { result?: MergedIngredientResponse[] })?.result ?? [];
    
    return suggestionList.filter(
      (s) => !selected.some((sel) => sel.id === s.id)
    );
  }, [suggestions, selected]);

  const handleSelect = (ingredient: MergedIngredientResponse) => {
    if (!atLimit) {
      onSelect(ingredient);
      setQuery("");
      setShowDropdown(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            disabled={disabled || atLimit}
            placeholder={atLimit ? "Đã đạt giới hạn" : "Nhập tên hoạt chất..."}
            className={cn(
              "w-full rounded-2xl border border-border/40 bg-white/80 py-3 pl-12 pr-4 text-base text-secondary shadow-sm outline-none transition",
              "placeholder:text-muted-foreground/70",
              "focus:border-primary/40 focus:ring-2 focus:ring-primary/20",
              "dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50",
              disabled && "cursor-not-allowed opacity-50"
            )}
          />
          {isLoading && (
            <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" aria-hidden />
          )}
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {showDropdown && filteredSuggestions.length > 0 && query.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-auto rounded-xl border border-border/40 bg-white shadow-lg dark:border-white/20 dark:bg-secondary"
            >
              {filteredSuggestions.map((ingredient) => (
                <button
                  key={ingredient.id}
                  type="button"
                  onClick={() => handleSelect(ingredient)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-primary/5 dark:hover:bg-white/5"
                >
                  <span className="font-medium text-secondary dark:text-white">
                    {ingredient.name}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected ingredients */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {selected.map((item) => (
            <motion.span
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-primary/10 px-3 py-1 text-sm font-semibold text-primary shadow-sm backdrop-blur dark:border-primary/30"
            >
              {item.name}
              <button
                type="button"
                aria-label={`Xóa ${item.name}`}
                onClick={() => onRemove(item.id)}
                className="rounded-full p-1 text-primary/70 transition hover:bg-primary/20"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Đã chọn {selected.length}/{max} hoạt chất</span>
        {warning ? (
          <span className="rounded-full bg-amber-500/15 px-3 py-1 font-semibold text-amber-700 dark:text-amber-200">
            Vượt quá giới hạn
          </span>
        ) : null}
      </div>
    </div>
  );
}
