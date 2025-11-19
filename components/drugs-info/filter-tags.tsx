"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FilterTagsProps = {
  tags: string[];
  active: string[];
  onToggle: (tag: string) => void;
  onClear?: () => void;
};

export function FilterTags({ tags, active, onToggle, onClear }: FilterTagsProps) {
  const hasActive = active.length > 0;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => {
        const selected = active.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggle(tag)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition",
              selected
                ? "bg-primary/15 text-primary border-primary/40 dark:bg-accent/30 dark:text-white"
                : "border-[var(--glass-border)] bg-white/70 text-secondary hover:border-[var(--ring)] dark:border-white/10 dark:bg-white/10 dark:text-white/80"
            )}
            aria-pressed={selected}
          >
            {tag}
          </button>
        );
      })}
      {hasActive ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-full text-xs font-semibold"
          onClick={onClear}
        >
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
