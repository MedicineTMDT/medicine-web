"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PrescriptionProjection } from "@/features/prescriptions";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { PrescriptionQRCode } from "./prescription-qr-code";

type Props = {
  prescription: PrescriptionProjection;
  index?: number;
};

export function PrescriptionListCard({ prescription, index = 0 }: Props) {
  const isActive = prescription.endDate 
    ? new Date(prescription.endDate) >= new Date() 
    : true;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
    >
      <Card
        className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm transition hover:-translate-y-1 hover:ring-primary/30 dark:bg-secondary/70"
      >
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl text-secondary dark:text-white break-words">
              <FileText className="h-5 w-5 shrink-0" />
              <span className="break-all line-clamp-2">{prescription.name}</span>
            </CardTitle>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1",
                isActive
                  ? "bg-emerald-500/10 text-emerald-800 ring-emerald-500/30 dark:text-emerald-200"
                  : "bg-amber-500/10 text-amber-800 ring-amber-500/30 dark:text-amber-200"
              )}
            >
              {isActive ? "Đang hoạt động" : "Đã kết thúc"}
            </span>
          </div>
          {prescription.description && (
            <CardDescription className="text-secondary/80 dark:text-muted-foreground">
              {prescription.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 text-sm text-secondary/80 dark:text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(prescription.startDate).toLocaleDateString("vi-VN")}
                {prescription.endDate && (
                  <> - {new Date(prescription.endDate).toLocaleDateString("vi-VN")}</>
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Link
              href={`/prescription/${prescription.id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
            >
              Xem chi tiết
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <PrescriptionQRCode 
              prescriptionId={prescription.id} 
              prescriptionName={prescription.name}
            />
          </div>
        </CardContent>
      </Card>
    </motion.article>
  );
}
