"use client";

import type { FormValues } from "@/components/pages/prescription-page";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { DrugInfo } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import {
  Control,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";

type Props = {
  control: Control<FormValues>;
  fields: { id: string }[];
  append: UseFieldArrayAppend<FormValues, "items">;
  remove: UseFieldArrayRemove;
  errors: FieldErrors<FormValues>;
  drugs: DrugInfo[];
};

export function DrugBuilderForm({
  control,
  fields,
  append,
  remove,
  errors,
  drugs,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel className="text-base">Medications</FormLabel>
        <Button
          type="button"
          variant="ghost"
          className="gap-2 rounded-full"
          onClick={() =>
            append({
              drugId: "",
              quantity: 30,
              dosage: "500 mg",
              schedule: "Once daily",
            })
          }
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add drug
        </Button>
      </div>

      {fields.map((field, index) => (
        <motion.div
          key={field.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-4 dark:border-white/10 dark:bg-white/5"
        >
          <div className="flex items-start gap-3">
            <div className="grid flex-1 gap-3 md:grid-cols-4">
              <FormField
                control={control}
                name={`items.${index}.drugId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drug</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className={cn(
                          "h-11 w-full rounded-xl border border-[var(--input)] bg-white/80 px-3 text-sm text-secondary shadow-sm transition focus:border-[var(--ring)] focus:outline-none dark:border-white/15 dark:bg-secondary/40 dark:text-white",
                          errors.items?.[index]?.drugId && "border-red-400"
                        )}
                        aria-invalid={!!errors.items?.[index]?.drugId}
                      >
                        <option value="">Select a drug</option>
                        {drugs.map((drug) => (
                          <option key={drug.id} value={drug.id}>
                            {drug.name} — {drug.category}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        aria-invalid={!!errors.items?.[index]?.quantity}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`items.${index}.dosage`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dosage</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., 500mg"
                        aria-invalid={!!errors.items?.[index]?.dosage}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`items.${index}.schedule`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="h-11 w-full rounded-xl border border-[var(--input)] bg-white/80 px-3 text-sm text-secondary shadow-sm transition focus:border-[var(--ring)] focus:outline-none dark:border-white/15 dark:bg-secondary/40 dark:text-white"
                      >
                        <option value="Once daily">Once daily</option>
                        <option value="Twice daily">Twice daily</option>
                        <option value="Three times daily">
                          Three times daily
                        </option>
                        <option value="As needed">As needed</option>
                        <option value="Every other day">Every other day</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {fields.length > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8"
                onClick={() => remove(index)}
                aria-label="Remove medication"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </Button>
            ) : null}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
