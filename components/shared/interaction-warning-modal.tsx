"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { DrugInteractionRule, DrugInfo } from "@/lib/mockData";

type InteractionWarningModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  alerts: DrugInteractionRule[];
  drugLookup: Record<string, DrugInfo>;
};

export function InteractionWarningModal({
  open,
  onCancel,
  onConfirm,
  alerts,
  drugLookup,
}: InteractionWarningModalProps) {
  const firstButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) firstButtonRef.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="w-full max-w-3xl rounded-2xl border border-[var(--glass-border)] bg-white/95 p-6 shadow-2xl dark:border-white/10 dark:bg-secondary/90"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-6 w-6 text-amber-500" aria-hidden />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-secondary dark:text-white">
                  Interaction warnings detected
                </h2>
                <p className="text-sm text-secondary/80 dark:text-muted-foreground">
                  Review these interactions before finalizing the prescription.
                </p>
              </div>
            </div>
            <Separator className="my-4 border-[var(--glass-border)] bg-[var(--glass-border)] dark:border-white/10 dark:bg-white/10" />
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {alerts.map((alert) => {
                const names = alert.drugs.map((id) => drugLookup[id]?.name ?? id).join(" + ");
                return (
                  <div
                    key={alert.drugs.join("-")}
                    className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-secondary dark:text-white"
                  >
                    <p className="font-semibold">{names}</p>
                    <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">
                      {alert.severity}
                    </p>
                    <p className="mt-1 text-sm text-secondary/85 dark:text-white/80">
                      {alert.recommendation}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button ref={firstButtonRef} variant="outline" className="rounded-full" onClick={onCancel}>
                Cancel
              </Button>
              <Button className="rounded-full" onClick={onConfirm}>
                Continue Anyway
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
