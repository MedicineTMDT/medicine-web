"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search } from "lucide-react";
import { DrugInfoSearchBar, type DrugInfoSuggestion } from "@/components/drugs-info/search-bar";
import { FilterTags } from "@/components/drugs-info/filter-tags";
import { DrugInfoCard } from "@/components/drugs-info/drug-card";
import { Separator } from "@/components/ui/separator";
import { drugInfoList, drugInfoTags, type DrugInfo } from "@/lib/mockData";

export function DrugsInfoPageScreen() {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const suggestions: DrugInfoSuggestion[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return drugInfoList
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.genericName?.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.compounds.some((c) => c.toLowerCase().includes(q))
      )
      .slice(0, 8)
      .map((item) => ({
        id: item.id,
        label: item.name,
        meta: item.category,
      }));
  }, [query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return drugInfoList.filter((drug) => {
      const matchesQuery =
        !q ||
        [drug.name, drug.genericName ?? "", drug.category, drug.description, drug.compounds.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesTags = activeTags.length === 0 || activeTags.every((tag) => drug.tags.includes(tag));
      return matchesQuery && matchesTags;
    });
  }, [query, activeTags]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  return (
    <div className="relative pb-24">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#041629]/90 via-[#0B2746]/90 to-[#071F34]" />
        <div className="container relative flex flex-col items-center py-14 text-center text-foreground dark:text-white">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-2xl space-y-4"
          >
            <span className="inline-flex items-center justify-center rounded-full border border-[var(--glass-border)] bg-white/80 px-5 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-secondary dark:border-white/30 dark:bg-white/10 dark:text-white">
              Drug Info
            </span>
            <h1 className="text-3xl font-heading font-semibold leading-tight text-secondary dark:text-white md:text-4xl">
              Explore medications with confidence
            </h1>
            <p className="text-sm text-secondary/80 dark:text-white/80 md:text-base">
              Find medications fast with live suggestions and lightweight filters for dosing or safety notes.
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
              onValueChange={setQuery}
              suggestions={suggestions}
              onSelect={(s) => setQuery(s.label)}
            />
            <div className="rounded-3xl border border-[var(--glass-border)] bg-white/60 p-4 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5">
              <FilterTags tags={drugInfoTags} active={activeTags} onToggle={toggleTag} onClear={() => setActiveTags([])} />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mt-16 space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-heading font-semibold text-secondary dark:text-white">Results</h2>
            <p className="text-secondary/80 dark:text-muted-foreground">
              {filtered.length} match{filtered.length === 1 ? "" : "es"} found
            </p>
          </div>
        </div>

        {filtered.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((drug, index) => (
              <DrugInfoCard key={drug.id} drug={drug} href={`/drugs-info/${drug.id}`} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[var(--glass-border)] bg-[var(--glass-bg)] p-12 text-center text-muted-foreground dark:border-white/10 dark:bg-white/5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BookOpen className="h-10 w-10" aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-secondary dark:text-white">No matches found</p>
              <p className="text-sm text-muted-foreground">Try a different keyword or clear filters.</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-secondary shadow-sm"
              onClick={() => {
                setQuery("");
                setActiveTags([]);
              }}
            >
              <Search className="h-4 w-4" aria-hidden />
              Reset search
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
