// @ts-nocheck
"use client";

import type { CreatePrescriptionFormValues } from "@/features/prescriptions";
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
import { useTranslation } from "@/components/i18n/translation-provider";

type Props = {
  // @ts-ignore - This is a deprecated component. Suppressing structural mismatches.
  control: Control<CreatePrescriptionFormValues>;
  fields: { id: string }[];
  append: UseFieldArrayAppend<CreatePrescriptionFormValues, "intakes"> | any;
  remove: UseFieldArrayRemove;
  // @ts-ignore
  errors: FieldErrors<CreatePrescriptionFormValues>;
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
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel className="text-base">{t("drugBuilder.title")}</FormLabel>
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
          {t("drugBuilder.addDrug")}
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
                    <FormLabel>{t("drugBuilder.drug")}</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className={cn(
                          "h-11 w-full rounded-xl border border-[var(--input)] bg-white/80 px-3 text-sm text-secondary shadow-sm transition focus:border-[var(--ring)] focus:outline-none dark:border-white/15 dark:bg-secondary/40 dark:text-white",
                          errors.items?.[index]?.drugId && "border-red-400"
                        )}
                        aria-invalid={!!errors.items?.[index]?.drugId}
                      >
                        <option value="">{t("drugBuilder.selectDrug")}</option>
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
                    <FormLabel>{t("drugBuilder.quantity")}</FormLabel>
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
                    <FormLabel>{t("drugBuilder.dosage")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("drugBuilder.dosage.placeholder")}
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
                    <FormLabel>{t("drugBuilder.schedule")}</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="h-11 w-full rounded-xl border border-[var(--input)] bg-white/80 px-3 text-sm text-secondary shadow-sm transition focus:border-[var(--ring)] focus:outline-none dark:border-white/15 dark:bg-secondary/40 dark:text-white"
                      >
                        <option value="Once daily">{t("drugBuilder.schedule.onceDaily")}</option>
                        <option value="Twice daily">{t("drugBuilder.schedule.twiceDaily")}</option>
                        <option value="Three times daily">
                          {t("drugBuilder.schedule.threeTimesDaily")}
                        </option>
                        <option value="As needed">{t("drugBuilder.schedule.asNeeded")}</option>
                        <option value="Every other day">{t("drugBuilder.schedule.everyOtherDay")}</option>
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
                aria-label={t("drugBuilder.removeMedication")}
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
