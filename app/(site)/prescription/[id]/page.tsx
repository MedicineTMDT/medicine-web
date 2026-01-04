"use client";

import { DrugInfoCard } from "@/components/prescription/drug-info-card";
import {
  PrescriptionQRCode,
  PrescriptionQRCodeInline,
} from "@/components/prescription/prescription-qr-code";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePrescriptionById } from "@/features/prescriptions";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Loader2,
  MessageSquare,
  Pill,
  Stethoscope
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PrescriptionDetailPage() {
  const params = useParams();
  const prescriptionId = params.id as string;

  const { data, isLoading, error } = usePrescriptionById(prescriptionId);
  
  // Handle both wrapped { result: {...} } and direct Prescription response
  const rawData = data as any;
  const prescription = rawData?.result || rawData;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="container py-12">
        <Card className="mx-auto max-w-lg border-destructive/50 bg-destructive/5">
          <CardContent className="py-8 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold text-destructive">
              Không tìm thấy đơn thuốc
            </h2>
            <p className="mt-2 text-muted-foreground">
              Đơn thuốc không tồn tại hoặc bạn không có quyền truy cập.
            </p>
            <Button asChild className="mt-6 rounded-full" variant="outline">
              <Link href="/prescription">Quay lại danh sách</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group intakes by date
  const intakesByDate = (prescription.intakes || []).reduce(
    (acc: Record<string, any[]>, intake: any) => {
      const date = new Date(intake.time).toLocaleDateString("vi-VN");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(intake);
      return acc;
    },
    {} as Record<string, any[]>
  );

  return (
    <div className="relative pb-24">
      {/* Hero Section */}
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
              Chi tiết đơn thuốc
            </p>
            <h1 className="text-3xl font-heading font-semibold leading-tight text-secondary dark:text-white md:text-4xl">
              {prescription.name}
            </h1>
            {prescription.description && (
              <p className="text-sm text-secondary/80 dark:text-white/80 md:text-base">
                {prescription.description}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="container mt-8 space-y-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Prescription Info Card */}
            <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-secondary dark:text-white">
                  <FileText className="h-5 w-5" />
                  Thông tin đơn thuốc
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3 dark:border-white/10 dark:bg-white/5">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Ngày bắt đầu
                      </p>
                      <p className="font-medium text-secondary dark:text-white">
                        {new Date(prescription.startDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3 dark:border-white/10 dark:bg-white/5">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Ngày kết thúc
                      </p>
                      <p className="font-medium text-secondary dark:text-white">
                        {prescription.endDate
                          ? new Date(prescription.endDate).toLocaleDateString(
                              "vi-VN"
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {prescription.diagnosisNote && (
                  <>
                    <Separator className="bg-border/30" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-secondary dark:text-white">
                        <Stethoscope className="h-4 w-4" />
                        Chẩn đoán
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {prescription.diagnosisNote}
                      </p>
                    </div>
                  </>
                )}

                {prescription.message && (
                  <>
                    <Separator className="bg-border/30" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-secondary dark:text-white">
                        <MessageSquare className="h-4 w-4" />
                        Lời dặn của bác sĩ
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {prescription.message}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Intake Schedule */}
            <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-secondary dark:text-white">
                  <Clock className="h-5 w-5" />
                  Lịch uống thuốc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(Object.entries(intakesByDate) as [string, any[]][]).map(([date, intakes]) => (
                    <div key={date} className="space-y-3">
                      <h3 className="text-sm font-semibold text-secondary dark:text-white">
                        {date}
                      </h3>
                      <div className="space-y-3">
                        {intakes
                          .sort(
                            (a: any, b: any) =>
                              new Date(a.time).getTime() -
                              new Date(b.time).getTime()
                          )
                          .map((intake: any) => (
                            <div
                              key={intake.id}
                              className={cn(
                                "rounded-xl border p-4 transition-colors",
                                intake.status
                                  ? "border-emerald-500/30 bg-emerald-500/5"
                                  : "border-[var(--glass-border)] bg-[var(--glass-bg)] dark:border-white/10 dark:bg-white/5"
                              )}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  {intake.status ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground" />
                                  )}
                                  <p className="font-semibold text-secondary dark:text-white">
                                    {new Date(intake.time).toLocaleTimeString(
                                      "vi-VN",
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </p>
                                </div>
                                {intake.status && (
                                  <Badge
                                    variant="outline"
                                    className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                                  >
                                    Đã uống
                                  </Badge>
                                )}
                              </div>
                              
                              {/* Detailed drug list */}
                              <div className="space-y-2 ml-8">
                                {intake.info.map((drug: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="rounded-lg border border-border/50 bg-white/50 p-3 dark:bg-white/5"
                                  >
                                    <div className="flex items-start gap-3">
                                      <Pill className="h-5 w-5 text-primary mt-0.5" />
                                      <div className="flex-1 space-y-1">
                                        <p className="font-medium text-secondary dark:text-white">
                                          {drug.drugName || `Thuốc ${idx + 1}`}
                                        </p>
                                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                          {drug.medicineForm && (
                                            <span className="flex items-center gap-1">
                                              <span className="font-medium">Dạng:</span>
                                              {drug.medicineForm === 'TABLET' && 'Viên'}
                                              {drug.medicineForm === 'POWDER' && 'Gói'}
                                              {drug.medicineForm === 'VIAL' && 'Ống'}
                                              {drug.medicineForm === 'SYRUP' && 'Lọ'}
                                              {drug.medicineForm === 'TUBE' && 'Tuýp'}
                                              {drug.medicineForm === 'BOTTLE' && 'Chai'}
                                            </span>
                                          )}
                                          {drug.usage && (
                                            <span className="flex items-center gap-1">
                                              <span className="font-medium">Cách dùng:</span>
                                              {drug.usage === 'ORAL' && 'Uống'}
                                              {drug.usage === 'SUBLINGUAL' && 'Ngậm'}
                                              {drug.usage === 'CHEW' && 'Nhai'}
                                              {drug.usage === 'TOPICAL' && 'Bôi'}
                                              {drug.usage === 'EYE_DROPS' && 'Nhỏ mắt'}
                                              {drug.usage === 'EAR_DROPS' && 'Nhỏ tai'}
                                              {drug.usage === 'NASAL_DROPS' && 'Nhỏ mũi'}
                                              {drug.usage === 'IM' && 'Tiêm bắp'}
                                              {drug.usage === 'IV' && 'Tiêm tĩnh mạch'}
                                              {drug.usage === 'SC' && 'Tiêm dưới da'}
                                              {drug.usage === 'RECTAL' && 'Đặt hậu môn'}
                                              {drug.usage === 'VAGINAL' && 'Đặt âm đạo'}
                                            </span>
                                          )}
                                          {drug.quantitative && drug.unit && (
                                            <span className="flex items-center gap-1">
                                              <span className="font-medium">Liều:</span>
                                              {drug.quantitative} {drug.unit}
                                            </span>
                                          )}
                                        </div>
                                        {drug.noteList && drug.noteList.length > 0 && (
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {drug.noteList.map((note: string, nIdx: number) => (
                                              <Badge
                                                key={nIdx}
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {note === 'BEFORE_MEAL' && 'Trước ăn'}
                                                {note === 'AFTER_MEAL' && 'Sau ăn'}
                                                {note === 'WITH_MEAL' && 'Trong bữa ăn'}
                                                {note === 'EMPTY_STOMACH' && 'Lúc đói'}
                                                {note === 'PRN' && 'Khi cần'}
                                              </Badge>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Drug Information Cards */}
            <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-secondary dark:text-white">
                  <Pill className="h-5 w-5" />
                  Thông tin thuốc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Get unique drugs from all intakes */}
                  {(() => {
                    const uniqueDrugs = new Map<string, { drugId: string; drugName: string }>();
                    prescription.intakes?.forEach((intake: any) => {
                      intake.info?.forEach((drug: any) => {
                        if (drug.drugId && !uniqueDrugs.has(drug.drugId)) {
                          uniqueDrugs.set(drug.drugId, {
                            drugId: drug.drugId,
                            drugName: drug.drugName || 'Thuốc',
                          });
                        }
                      });
                    });
                    return Array.from(uniqueDrugs.values()).map((drug) => (
                      <DrugInfoCard
                        key={drug.drugId}
                        drugId={drug.drugId}
                        drugName={drug.drugName}
                      />
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code Card */}
            <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
              <CardHeader>
                <CardTitle className="text-center text-lg text-secondary dark:text-white">
                  Mã QR
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <PrescriptionQRCodeInline
                  prescriptionId={prescriptionId}
                  size="lg"
                />
                <p className="text-center text-xs text-muted-foreground">
                  Quét mã để xem đơn thuốc trên thiết bị di động
                </p>
                <PrescriptionQRCode
                  prescriptionId={prescriptionId}
                  prescriptionName={prescription.name}
                />
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
              <CardContent className="space-y-3 pt-6">
                <Button asChild className="w-full rounded-full" variant="outline">
                  <Link href="/prescription">
                    Quay lại danh sách
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
