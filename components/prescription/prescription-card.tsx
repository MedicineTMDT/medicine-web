"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock4, XCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PrescriptionRecord, DrugInfo } from "@/lib/mockData";

const statusStyles: Record<PrescriptionRecord["status"], string> = {
  active: "bg-emerald-500/10 text-emerald-800 ring-emerald-500/30 dark:text-emerald-200",
  completed: "bg-blue-500/10 text-blue-800 ring-blue-500/30 dark:text-blue-200",
  expired: "bg-amber-500/10 text-amber-800 ring-amber-500/30 dark:text-amber-200",
};

const statusIcon: Record<PrescriptionRecord["status"], typeof CheckCircle2> = {
  active: CheckCircle2,
  completed: Clock4,
  expired: XCircle,
};

type Props = {
  rx: PrescriptionRecord;
  drugLookup: Record<string, DrugInfo>;
  href?: string;
  index?: number;
  onClick?: () => void;
};

export function PrescriptionCard({ rx, drugLookup, href, index = 0, onClick }: Props) {
  const Icon = statusIcon[rx.status];
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
    >
      <Card
        className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm transition hover:-translate-y-1 hover:ring-primary/30 dark:bg-secondary/70"
        onClick={onClick}
      >
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-secondary dark:text-white">Rx {rx.id}</CardTitle>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1",
                statusStyles[rx.status]
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {rx.status}
            </span>
          </div>
          <CardDescription className="text-secondary/80 dark:text-muted-foreground">
            {rx.pharmacistName} • {rx.createdAt}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm text-secondary/80 dark:text-muted-foreground">
            {rx.drugs.map((item) => (
              <li key={`${rx.id}-${item.drugId}`} className="rounded-xl bg-[var(--muted)]/50 px-3 py-2 dark:bg-white/10">
                <span className="font-semibold text-secondary dark:text-white">
                  {drugLookup[item.drugId]?.name ?? item.drugId}
                </span>{" "}
                — {item.dosage} — {item.schedule} (Qty {item.quantity})
              </li>
            ))}
          </ul>
          {href ? (
            <Link
              href={href}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3"
            >
              View details
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onClick}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3"
            >
              View details
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          )}
        </CardContent>
      </Card>
    </motion.article>
  );
}
