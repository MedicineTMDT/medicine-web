"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type TabContent = {
  overview: string;
  dosage: string;
  sideEffects: string[];
  interactions: string[];
  warnings: string[];
};

type DrugDetailTabsProps = {
  content: TabContent;
};

const TABS = ["Overview", "Dosage", "Side Effects", "Interactions", "Warnings"] as const;

export function DrugDetailTabs({ content }: DrugDetailTabsProps) {
  const [active, setActive] = useState<(typeof TABS)[number]>("Overview");

  const renderContent = () => {
    switch (active) {
      case "Overview":
        return <p className="leading-relaxed text-secondary/80 dark:text-muted-foreground">{content.overview}</p>;
      case "Dosage":
        return <p className="leading-relaxed text-secondary/80 dark:text-muted-foreground">{content.dosage}</p>;
      case "Side Effects":
        return (
          <ul className="space-y-2 text-secondary/80 dark:text-muted-foreground">
            {content.sideEffects.map((item) => (
              <li key={item} className="rounded-xl bg-[var(--muted)]/50 px-3 py-2 dark:bg-white/10">
                {item}
              </li>
            ))}
          </ul>
        );
      case "Interactions":
        return (
          <ul className="space-y-2 text-secondary/80 dark:text-muted-foreground">
            {content.interactions.map((item) => (
              <li key={item} className="rounded-xl bg-[var(--muted)]/50 px-3 py-2 dark:bg-white/10">
                {item}
              </li>
            ))}
          </ul>
        );
      case "Warnings":
        return (
          <ul className="space-y-2 text-secondary/80 dark:text-muted-foreground">
            {content.warnings.map((item) => (
              <li key={item} className="rounded-xl bg-amber-500/10 px-3 py-2 text-amber-800 dark:bg-amber-500/20 dark:text-amber-100">
                {item}
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              active === tab
                ? "bg-primary text-secondary shadow-sm"
                : "bg-[var(--muted)]/50 text-secondary hover:bg-[var(--muted)] dark:bg-white/10 dark:text-white"
            )}
            aria-pressed={active === tab}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-4 shadow-glass backdrop-blur-lg dark:border-white/10 dark:bg-white/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 text-sm"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
