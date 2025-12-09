"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { DrugInfoSearchBar, type DrugInfoSuggestion } from "@/components/drugs-info/search-bar";
import { useTranslation } from "@/components/i18n/translation-provider";

type MultiDrugSearchProps = {
  suggestions: DrugInfoSuggestion[];
  loading?: boolean;
  onQueryChange: (query: string) => void;
  onAdd: (suggestion: DrugInfoSuggestion) => void;
  onRemove: (id: string) => void;
  selected: DrugInfoSuggestion[];
  max?: number;
};

export function MultiDrugSearch({
  suggestions,
  loading = false,
  onQueryChange,
  onAdd,
  onRemove,
  selected,
  max = 10,
}: MultiDrugSearchProps) {
  const [query, setQuery] = useState("");
  const atLimit = useMemo(() => selected.length >= max, [selected.length, max]);
  const warning = selected.length > 10;
  const { t } = useTranslation();

  useEffect(() => {
    if (query) onQueryChange(query);
  }, [query, onQueryChange]);

  return (
    <div className="space-y-3">
      <DrugInfoSearchBar
        value={query}
        onValueChange={(val) => {
          setQuery(val);
        }}
        suggestions={atLimit ? [] : suggestions}
        onSelect={(s) => {
          if (!atLimit) onAdd(s);
          setQuery("");
        }}
        loading={loading}
        placeholder={atLimit ? t("drugsInfo.limitReached") : t("drugsInfo.addDrugPrompt")}
      />

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {selected.map((item) => (
            <motion.span
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-white/80 px-3 py-1 text-sm font-semibold text-secondary shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white/80"
              >
                {item.label}
                <button
                  type="button"
                  aria-label={t("drugsInfo.removeItem", { values: { item: item.label } })}
                  onClick={() => onRemove(item.id)}
                  className="rounded-full p-1 text-muted-foreground transition hover:bg-primary/10"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{t("drugsInfo.selectedCount", { values: { selected: selected.length, max } })}</span>
        {warning ? (
          <span className="rounded-full bg-amber-500/15 px-3 py-1 font-semibold text-amber-700 dark:text-amber-200">
            {t("drugsInfo.limitExceeded")}
          </span>
        ) : null}
      </div>
    </div>
  );
}
