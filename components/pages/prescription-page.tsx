"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { MultiDrugSearch } from "@/components/drug-interaction/multi-drug-search";
import { DrugBuilderForm } from "@/components/prescription/drug-builder-form";
import { PrescriptionCard } from "@/components/prescription/prescription-card";
import { PrescriptionRoleToggle, type PrescriptionRole } from "@/components/prescription/role-toggle";
import { InteractionWarningModal } from "@/components/shared/interaction-warning-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  drugInfoList,
  drugInteractionRules,
  prescriptionRecords,
  type DrugInfo,
  type DrugInteractionRule,
  type PrescriptionRecord,
} from "@/lib/mockData";

const builderSchema = z.object({
  patientName: z.string().min(2, "Enter patient name"),
  dob: z.string().optional(),
  patientId: z.string().optional(),
  items: z
    .array(
      z.object({
        drugId: z.string().min(1, "Select a drug"),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
        dosage: z.string().min(2, "Enter dosage"),
        schedule: z.string().min(2, "Enter schedule"),
      })
    )
    .min(1, "Add at least one drug"),
});

export type FormValues = z.infer<typeof builderSchema>;

export function PrescriptionPageScreen() {
  const [role, setRole] = useState<PrescriptionRole>("patient");
  const [alerts, setAlerts] = useState<DrugInteractionRule[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedRx, setSelectedRx] = useState<PrescriptionRecord | null>(null);
  const [builderQuery, setBuilderQuery] = useState("");
  const [loadingCheck, setLoadingCheck] = useState(false);

  const drugLookup: Record<string, DrugInfo> = useMemo(
    () => Object.fromEntries(drugInfoList.map((d) => [d.id, d])),
    []
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(builderSchema),
    defaultValues: {
      patientName: "",
      dob: "",
      patientId: "",
      items: [{ drugId: "", quantity: 30, dosage: "500 mg", schedule: "Once daily" }],
    },
  });

  const { control, handleSubmit, reset, watch } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const formItems = watch("items");

  const suggestions = useMemo(() => {
    const q = builderQuery.trim().toLowerCase();
    if (!q) return [];
    return drugInfoList
      .filter(
        (drug) =>
          drug.name.toLowerCase().includes(q) ||
          drug.genericName?.toLowerCase().includes(q) ||
          drug.category.toLowerCase().includes(q)
      )
      .slice(0, 6)
      .map((drug) => ({ id: drug.id, label: drug.name, meta: drug.category }));
  }, [builderQuery]);

  const checkInteractions = (ids: string[]) =>
    drugInteractionRules.filter((rule) => rule.drugs.every((drugId) => ids.includes(drugId)));

  const onSubmit = (values: FormValues) => {
    setSuccessMessage("");
    setLoadingCheck(true);
    setTimeout(() => {
      const matches = checkInteractions(values.items.map((i) => i.drugId));
      setAlerts(matches);
      setShowModal(matches.length > 0);
      if (matches.length === 0) {
        finalize();
      }
      setLoadingCheck(false);
    }, 400);
  };

  const finalize = () => {
    setSuccessMessage("Prescription created (mock). No data was persisted.");
    reset();
  };

  const patientPrescriptions = prescriptionRecords;

  return (
    <div className="relative pb-24">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#04121f]/85 via-[#0a2542]/90 to-[#071b2f]" />
        <div className="container relative flex flex-col items-center gap-6 py-12 text-center text-secondary dark:text-white">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-2xl space-y-4"
          >
            <p className="inline-flex items-center justify-center rounded-full border border-[var(--glass-border)] bg-white/80 px-5 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-secondary dark:border-white/20 dark:bg-white/10 dark:text-white">
              Prescription Workspace
            </p>
            <h1 className="text-3xl font-heading font-semibold leading-tight text-secondary dark:text-white md:text-4xl">
              Role-based prescription view
            </h1>
            <p className="text-sm text-secondary/80 dark:text-white/80 md:text-base">
              Switch between patient and pharmacist modes with inline interaction checks before anything is signed off.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="flex flex-col items-center gap-2"
          >
            <PrescriptionRoleToggle value={role} onChange={setRole} />
            <p className="text-xs text-secondary/70 dark:text-white/70">Switch perspectives to preview each workflow mode.</p>
          </motion.div>
        </div>
      </section>

      {role === "patient" ? (
        <section className="container mt-12">
          <div className="grid gap-6 md:grid-cols-2">
            {patientPrescriptions.map((rx, index) => (
              <PrescriptionCard
                key={rx.id}
                rx={rx}
                drugLookup={drugLookup}
                href={undefined}
                index={index}
                onClick={() => setSelectedRx(rx)}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="container mt-12 space-y-8">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary dark:text-white">Create prescription</CardTitle>
                <CardDescription className="text-secondary/75 dark:text-muted-foreground">
                  Add patient details and build a drug list. Interaction checks run before creation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={control}
                        name="patientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Patient name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Jordan Smith" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="dob"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of birth</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="patientId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Patient ID</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Optional ID" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-5 rounded-[2rem] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5 text-center shadow-glass backdrop-blur dark:border-white/10 dark:bg-white/5">
                      <p className="text-sm font-semibold text-secondary dark:text-white">Quick add</p>
                      <div className="mx-auto max-w-3xl">
                        <MultiDrugSearch
                          suggestions={suggestions}
                          loading={false}
                          onQueryChange={setBuilderQuery}
                          onAdd={(item) =>
                            append({
                              drugId: item.id,
                              quantity: 30,
                              dosage: drugLookup[item.id]?.dosage.split(";")[0] ?? "500 mg",
                              schedule: "Once daily",
                            })
                          }
                          onRemove={(id) => {
                            const idx = formItems.findIndex((itm) => itm.drugId === id);
                            if (idx >= 0) remove(idx);
                          }}
                          selected={formItems
                            .filter((itm) => itm.drugId)
                            .map((itm) => ({
                              id: itm.drugId,
                              label: drugLookup[itm.drugId]?.name ?? itm.drugId,
                            }))}
                          max={10}
                        />
                      </div>
                    </div>

                    <DrugBuilderForm
                      control={control}
                      fields={fields}
                      append={append}
                      remove={remove}
                      errors={form.formState.errors}
                      drugs={drugInfoList}
                    />

                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-4 text-sm text-muted-foreground dark:border-white/10 dark:bg-white/5">
                      <div>
                        <p className="font-semibold text-secondary dark:text-white">Interaction preview</p>
                        <p>
                          {alerts.length
                            ? "Potential alerts detected."
                            : "No alerts yet. A full check runs on submission."}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          alerts.length
                            ? "bg-amber-500/20 text-amber-700 dark:text-amber-200"
                            : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-200"
                        )}
                      >
                        {alerts.length} alert{alerts.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <Button type="submit" size="lg" className="rounded-full px-8" disabled={loadingCheck}>
                        {loadingCheck ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : null}
                        Create Prescription
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="border-none bg-white/90 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/60">
              <CardHeader>
                <CardTitle className="text-xl text-secondary dark:text-white">Mock interaction logic</CardTitle>
                <CardDescription className="text-secondary/75 dark:text-muted-foreground">
                  Example pairs that will raise warnings during creation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-secondary/80 dark:text-muted-foreground">
                <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {drugInteractionRules.slice(0, 12).map((interaction) => {
                    const names = interaction.drugs.map((id) => drugLookup[id]?.name ?? id).join(" + ");
                    return (
                      <li
                        key={interaction.drugs.join("-")}
                        className={cn(
                          "rounded-2xl border px-4 py-3 backdrop-blur",
                          interaction.severity === "severe"
                            ? "bg-red-500/10 border-red-500/30"
                            : interaction.severity === "moderate"
                              ? "bg-amber-500/10 border-amber-500/30"
                              : "bg-blue-500/10 border-blue-500/25"
                        )}
                      >
                        <p className="font-semibold text-secondary dark:text-white">{names}</p>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {interaction.severity}
                        </p>
                        <p className="mt-2 text-sm">{interaction.recommendation}</p>
                      </li>
                    );
                  })}
                </ul>
                {successMessage ? (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                    {successMessage}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <InteractionWarningModal
        open={showModal}
        alerts={alerts}
        drugLookup={drugLookup}
        onCancel={() => {
          setShowModal(false);
          setAlerts([]);
        }}
        onConfirm={() => {
          setShowModal(false);
          setAlerts([]);
          finalize();
        }}
      />

      <AnimatePresence>
        {selectedRx ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="w-full max-w-2xl rounded-2xl border border-[var(--glass-border)] bg-white/95 p-6 shadow-2xl dark:border-white/10 dark:bg-secondary/90"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-secondary dark:text-white">Prescription {selectedRx.id}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedRx.pharmacistName} • {selectedRx.createdAt}
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedRx(null)}>
                  Close
                </Button>
              </div>
              <Separator className="my-4 border-[var(--glass-border)] bg-[var(--glass-border)] dark:border-white/10 dark:bg-white/10" />
              <div className="space-y-3">
                {selectedRx.drugs.map((item) => (
                  <div
                    key={`${selectedRx.id}-${item.drugId}`}
                    className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-4 dark:border-white/10 dark:bg-white/5"
                  >
                    <p className="font-semibold text-secondary dark:text-white">
                      {drugLookup[item.drugId]?.name ?? item.drugId}
                    </p>
                    <p className="text-sm text-secondary/80 dark:text-muted-foreground">
                      {item.dosage} — {item.schedule}
                    </p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-[var(--muted)]/40 px-4 py-3 text-sm text-secondary/80 dark:bg-white/10 dark:text-white/80">
                Refill info and pharmacy contact are mock placeholders in this demo.
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
