"use client";

import { Input } from "@/components/ui/input";
import { getDrugById, useDrugSuggestions, type Drug } from "@/features/drugs";
import { cn } from "@/lib/utils";
import { Check, Loader2, Pill, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DrugSearchSelectProps {
  value: {
    drugId: string;
    drugName: string;
  };
  onSelect: (drug: { drugId: string; drugName: string }) => void;
  onDrugDetailsLoaded?: (drugDetails: Drug) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DrugSearchSelect({
  value,
  onSelect,
  onDrugDetailsLoaded,
  placeholder = "Tìm kiếm thuốc...",
  disabled = false,
}: DrugSearchSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: suggestions, isLoading } = useDrugSuggestions(searchQuery);

  const drugs = suggestions?.result || [];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = async (drug: { id: number; name: string }) => {
    onSelect({
      drugId: drug.id.toString(),
      drugName: drug.name,
    });
    setShowDropdown(false);
    setSearchQuery("");

    // Fetch drug details for auto-fill
    if (onDrugDetailsLoaded) {
      setIsFetchingDetails(true);
      try {
        const response = await getDrugById(drug.id);
        if (response.result) {
          onDrugDetailsLoaded(response.result);
        }
      } catch (error) {
        console.error("Failed to fetch drug details:", error);
      } finally {
        setIsFetchingDetails(false);
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect({ drugId: "", drugName: "" });
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        {isFetchingDetails ? (
          <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary z-10 animate-spin" />
        ) : value.drugId ? (
          <Pill className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary z-10" />
        ) : (
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
        )}
        <Input
          ref={inputRef}
          type="text"
          value={value.drugId ? value.drugName : searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
            // Clear selection when user starts typing
            if (value.drugId) {
              onSelect({ drugId: "", drugName: "" });
            }
          }}
          onFocus={() => {
            setShowDropdown(true);
            // Clear search query on focus to allow fresh search
            if (!value.drugId) {
              setSearchQuery(searchQuery);
            }
          }}
          placeholder={placeholder}
          disabled={disabled || isFetchingDetails}
          className={cn(
            "pl-8 pr-8",
            value.drugId && "text-foreground font-medium"
          )}
        />
        {(value.drugId || searchQuery) && !isFetchingDetails && (
          <button
            type="button"
            onMouseDown={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors z-10"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-lg">
          <div className="max-h-[300px] overflow-y-auto p-1">
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}
            {!isLoading && searchQuery.length < 2 && !value.drugId && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Nhập ít nhất 2 ký tự để tìm kiếm...
              </div>
            )}
            {!isLoading && searchQuery.length >= 2 && drugs.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Không tìm thấy thuốc nào.
              </div>
            )}
            {drugs.length > 0 && (
              <div className="space-y-0.5">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Kết quả tìm kiếm
                </div>
                {drugs.map((drug) => (
                  <button
                    key={drug.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(drug);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent cursor-pointer",
                      value.drugId === drug.id.toString() && "bg-accent"
                    )}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        value.drugId === drug.id.toString() ? "opacity-100 text-primary" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium truncate">{drug.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ID: {drug.id}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
