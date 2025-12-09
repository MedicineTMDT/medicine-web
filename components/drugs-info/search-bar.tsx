"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "@/components/i18n/translation-provider";

export type DrugInfoSuggestion = {
  id: string;
  label: string;
  meta?: string;
};

type SearchBarProps = {
  value: string;
  onValueChange: (value: string) => void;
  suggestions: DrugInfoSuggestion[];
  onSelect: (suggestion: DrugInfoSuggestion) => void;
  placeholder?: string;
  debounceMs?: number;
  loading?: boolean;
  ariaLabel?: string;
};

export function DrugInfoSearchBar({
  value,
  onValueChange,
  suggestions,
  onSelect,
  placeholder,
  debounceMs = 300,
  loading = false,
  ariaLabel,
}: SearchBarProps) {
  const [internal, setInternal] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<number>(-1);
  const listRef = useRef<HTMLUListElement | null>(null);
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder ?? t("drugsInfo.searchPlaceholder");
  const resolvedAriaLabel = ariaLabel ?? t("drugsInfo.searchAria");

  useEffect(() => setInternal(value), [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onValueChange(internal.trimStart());
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [internal, debounceMs, onValueChange]);

  const hasSuggestions = useMemo(
    () => open && suggestions.length > 0 && internal.trim().length > 0,
    [open, suggestions.length, internal]
  );

  const handleSelect = (index: number) => {
    const suggestion = suggestions[index];
    if (!suggestion) return;
    onSelect(suggestion);
    setOpen(false);
    setHighlight(-1);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (!suggestions.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setHighlight((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setHighlight(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length
      );
    } else if (event.key === "Enter" && highlight >= 0) {
      event.preventDefault();
      handleSelect(highlight);
    } else if (event.key === "Escape") {
      setOpen(false);
      setHighlight(-1);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          value={internal}
          aria-label={resolvedAriaLabel}
          aria-autocomplete="list"
          aria-expanded={hasSuggestions}
          onChange={(e) => {
            setInternal(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={resolvedPlaceholder}
          wrapperClassName="rounded-[calc(var(--radius)_-_0.35rem)] border-[var(--input)] bg-white/85 px-0 shadow-lg dark:border-white/20 dark:bg-white/90"
          className="h-14 rounded-[calc(var(--radius)_-_0.35rem)] border-none bg-transparent px-4 pr-24 text-base text-secondary placeholder:text-secondary/60 focus-visible:ring-0 dark:text-secondary dark:placeholder:text-secondary/60"
        />
        <div className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-muted-foreground">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Search className="h-5 w-5" aria-hidden />
          )}
        </div>
        {internal ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => {
              setInternal("");
              onValueChange("");
              setOpen(false);
            }}
            className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full"
            aria-label={t("actions.clearSearch")}
          >
            <X className="h-4 w-4" aria-hidden />
          </Button>
        ) : null}
      </div>

      <AnimatePresence>
        {hasSuggestions ? (
          <motion.ul
            ref={listRef}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-[var(--glass-border)] bg-white/95 shadow-lg ring-1 ring-border/30 dark:border-white/10 dark:bg-secondary/90"
          >
            {suggestions.map((suggestion, index) => (
              <li key={suggestion.id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(index)}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left text-sm text-secondary transition hover:bg-primary/5 dark:text-white dark:hover:bg-white/10",
                    highlight === index && "bg-primary/10 dark:bg-white/15"
                  )}
                >
                  <span className="font-semibold">{suggestion.label}</span>
                  {suggestion.meta ? (
                    <span className="text-xs text-muted-foreground">
                      {suggestion.meta}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
