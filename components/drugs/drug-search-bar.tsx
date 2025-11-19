"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DrugSuggestion = {
  label: string;
  slug: string;
  meta?: string;
};

type DrugSearchBarProps = {
  value?: string;
  suggestions?: DrugSuggestion[];
  placeholder?: string;
  ctaLabel?: string;
  tags?: string[];
  selectedTags?: string[];
  onQueryChange?: (value: string) => void;
  onSuggestionSelect?: (suggestion: DrugSuggestion) => void;
  onToggleTag?: (tag: string) => void;
  onSubmit?: () => void;
};

export function DrugSearchBar({
  value = "",
  suggestions = [],
  placeholder = "Search for a medication...",
  ctaLabel = "Search",
  tags = [],
  selectedTags = [],
  onQueryChange,
  onSuggestionSelect,
  onToggleTag,
  onSubmit,
}: DrugSearchBarProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => setInputValue(value), [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onQueryChange?.(inputValue.trim());
    }, 200);
    return () => clearTimeout(timer);
  }, [inputValue, onQueryChange]);

  const hasSuggestions = useMemo(
    () => suggestions.length > 0 && inputValue.length > 0,
    [suggestions.length, inputValue.length]
  );

  return (
    <div className="relative space-y-4 rounded-[calc(var(--radius)_+_0.75rem)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-glass backdrop-blur-lg dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder={placeholder}
            className="h-14 rounded-[calc(var(--radius)_-_0.35rem)] border-[var(--input)] bg-white/80 pr-12 text-base text-secondary placeholder:text-secondary/60 dark:border-white/15 dark:bg-white/10 dark:text-white"
          />
          <Search
            className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />

          <AnimatePresence>
            {hasSuggestions ? (
              <motion.ul
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 z-10 mt-2 max-h-56 overflow-y-auto rounded-2xl border border-[var(--glass-border)] bg-white/95 shadow-lg ring-1 ring-border/40 dark:border-white/10 dark:bg-secondary/90"
              >
                {suggestions.map((suggestion) => (
                  <li key={suggestion.slug}>
                    <button
                      type="button"
                      onClick={() => onSuggestionSelect?.(suggestion)}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm text-secondary transition hover:bg-primary/5 dark:text-white dark:hover:bg-white/10"
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

        <Button
          size="lg"
          className="h-14 rounded-[calc(var(--radius)_-_0.35rem)] bg-accent text-secondary hover:bg-accent/90"
          type="button"
          onClick={onSubmit}
        >
          {ctaLabel}
        </Button>
      </div>

      {tags.length ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const selected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleTag?.(tag)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition",
                  selected
                    ? "bg-primary/15 text-primary border-primary/40 dark:bg-accent/30 dark:text-white"
                    : "border-[var(--glass-border)] bg-white/70 text-secondary hover:border-[var(--ring)] dark:border-white/10 dark:bg-white/10 dark:text-white/80"
                )}
              >
                <Tag className="h-3.5 w-3.5" aria-hidden />
                {tag}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
