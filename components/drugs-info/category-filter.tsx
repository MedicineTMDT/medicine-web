"use client";

import { useTranslation } from "@/components/i18n/translation-provider";
import type { CategoryResponse } from "@/features/drugs";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CategoryFilterProps = {
  categories: CategoryResponse[];
  selectedId?: number;
  onSelect: (categoryId: number | undefined) => void;
  onClear: () => void;
  loading?: boolean;
};

export function CategoryFilter({
  categories,
  selectedId,
  onSelect,
  onClear,
  loading = false,
}: CategoryFilterProps) {
  const { t } = useTranslation();
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

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Filter categories by search query
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected category name
  const selectedCategory = categories.find((cat) => cat.id === selectedId);

  const handleSelect = (categoryId: number) => {
    onSelect(categoryId);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = () => {
    onClear();
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border/30 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Đang tải danh mục...</span>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition",
          "bg-white/80 shadow-sm hover:bg-white dark:bg-white/5 dark:hover:bg-white/10",
          isOpen
            ? "border-primary ring-2 ring-primary/20"
            : "border-border/30 dark:border-white/10",
          selectedCategory && "border-primary/50"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-secondary/60 dark:text-white/60">
            {t("drugsInfo.filterByCategory")}:
          </span>
          {selectedCategory ? (
            <span className="flex items-center gap-2">
              <span className="font-semibold text-secondary dark:text-white">
                {selectedCategory.name}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {selectedCategory.amount}
              </span>
            </span>
          ) : (
            <span className="text-secondary/50 dark:text-white/50">
              Tất cả danh mục
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedCategory && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="rounded-full p-1 text-muted-foreground hover:bg-secondary/10 hover:text-secondary dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-[100] mt-2 overflow-hidden rounded-xl border border-white/20 bg-white shadow-xl dark:bg-slate-800">
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
                onMouseDown={(e) => e.stopPropagation()}
                placeholder="Tìm kiếm danh mục..."
                className="w-full rounded-lg border border-border/30 bg-gray-50 py-2 pl-10 pr-4 text-sm text-secondary placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
          </div>

          {/* Category List */}
          <div className="max-h-[300px] overflow-y-auto p-2">
            {/* All Categories Option */}
            <button
              type="button"
              onClick={() => {
                onSelect(undefined);
                setIsOpen(false);
                setSearchQuery("");
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition",
                selectedId === undefined
                  ? "bg-primary/10 text-primary"
                  : "text-slate-700 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
              )}
            >
              <span className="font-medium">Tất cả danh mục</span>
              {selectedId === undefined && <Check className="h-4 w-4" />}
            </button>

            {/* Divider */}
            <div className="my-2 border-t border-border/20 dark:border-white/10" />

            {/* Filtered Categories */}
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleSelect(category.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition",
                    selectedId === category.id
                      ? "bg-primary/10 text-primary"
                      : "text-slate-700 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
                  )}
                >
                  <span className="font-medium">{category.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {category.amount} thuốc
                    </span>
                    {selectedId === category.id && <Check className="h-4 w-4" />}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                Không tìm thấy danh mục "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
