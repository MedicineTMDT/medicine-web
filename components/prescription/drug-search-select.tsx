"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDrugSuggestions } from "@/features/drugs";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2, Pill, Search } from "lucide-react";
import { useState } from "react";

interface DrugSearchSelectProps {
  value: {
    drugId: string;
    drugName: string;
  };
  onSelect: (drug: { drugId: string; drugName: string }) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DrugSearchSelect({
  value,
  onSelect,
  placeholder = "Tìm kiếm thuốc...",
  disabled = false,
}: DrugSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: suggestions, isLoading } = useDrugSuggestions(searchQuery);

  const drugs = suggestions?.result || [];

  const handleSelect = (drug: { id: number; name: string }) => {
    onSelect({
      drugId: drug.id.toString(),
      drugName: drug.name,
    });
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value.drugId && "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {value.drugId ? (
              <>
                <Pill className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{value.drugName}</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4 shrink-0" />
                <span>{placeholder}</span>
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Nhập tên thuốc để tìm..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}
            {!isLoading && searchQuery.length < 2 && (
              <CommandEmpty>Nhập ít nhất 2 ký tự để tìm kiếm...</CommandEmpty>
            )}
            {!isLoading && searchQuery.length >= 2 && drugs.length === 0 && (
              <CommandEmpty>Không tìm thấy thuốc nào.</CommandEmpty>
            )}
            {drugs.length > 0 && (
              <CommandGroup heading="Kết quả tìm kiếm">
                {drugs.map((drug) => (
                  <CommandItem
                    key={drug.id}
                    value={drug.id.toString()}
                    onSelect={() => handleSelect(drug)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.drugId === drug.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{drug.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ID: {drug.id}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
