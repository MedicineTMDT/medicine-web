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
import { 
  usePrescriptionById, 
  useUpdateIntakeStatus,
  useAnalyzePrescription,
  useUpdatePrescriptionMessage
} from "@/features/prescriptions";
import { cn, sanitizeAiAnalysis } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  LayoutList,
  Loader2,
  MessageSquare,
  Pill,
  Stethoscope,
  Image as ImageIcon,
  Bot,
  Sparkles,
  Save,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { PrescriptionCalendar } from "@/components/prescription/prescription-calendar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PrescriptionDetailPage() {
  const params = useParams();
  const prescriptionId = params.id as string;

  const { data, isLoading, error } = usePrescriptionById(prescriptionId);
  const updateIntakeStatusMutation = useUpdateIntakeStatus();
  
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const rawData = data as any;
  const prescription = rawData?.result || rawData;
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUseful, setIsUseful] = useState<boolean | null>(null);

  useEffect(() => {
    if (prescription?.info?.ai_analysis) {
      setAiAnalysis(sanitizeAiAnalysis(prescription.info.ai_analysis as string) || null);
    }
  }, [prescription?.info?.ai_analysis]);

  const analyzeMutation = useAnalyzePrescription();
  const updateMessageMutation = useUpdatePrescriptionMessage();
  
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

  // Group intakes by date using a consistent key format (DD/MM/YYYY)
  const intakesByDate = (prescription.intakes || []).reduce(
    (acc: Record<string, any[]>, intake: any) => {
      const d = new Date(intake.time);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      const dateKey = `${day}/${month}/${year}`;
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(intake);
      return acc;
    },
    {} as Record<string, any[]>
  );

  // Consistency: Use the same manual formatter for the selected date lookup
  const selectedDateKey = (() => {
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear();
    return `${day}/${month}/${year}`;
  })();

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
                    <CalendarIcon className="h-5 w-5 text-primary" />
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
                    <CalendarIcon className="h-5 w-5 text-primary" />
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

            {/* Intake Schedule */}
            <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2 text-xl text-secondary dark:text-white">
                  <Clock className="h-5 w-5" />
                  Lịch uống thuốc
                </CardTitle>
                <div className="flex items-center gap-1 rounded-lg border border-[var(--glass-border)] bg-muted/30 p-1 dark:border-white/10">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 gap-2 rounded-md px-3 text-xs transition-all",
                      viewMode === "calendar"
                        ? "bg-white text-secondary shadow-sm dark:bg-white/10 dark:text-white"
                        : "text-muted-foreground hover:text-secondary dark:hover:text-white"
                    )}
                    onClick={() => setViewMode("calendar")}
                  >
                    <CalendarIcon className="h-3.5 w-3.5" />
                    Lịch
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 gap-2 rounded-md px-3 text-xs transition-all",
                      viewMode === "list"
                        ? "bg-white text-secondary shadow-sm dark:bg-white/10 dark:text-white"
                        : "text-muted-foreground hover:text-secondary dark:hover:text-white"
                    )}
                    onClick={() => setViewMode("list")}
                  >
                    <LayoutList className="h-3.5 w-3.5" />
                    Danh sách
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {viewMode === "calendar" ? (
                    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                      <div className="space-y-4">
                        <PrescriptionCalendar
                          intakesByDate={intakesByDate}
                          selectedDate={selectedDate}
                          onSelectDate={setSelectedDate}
                        />
                      </div>
                      
                      {/* Selected Date Details */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-secondary dark:text-white">
                            Chi tiết ngày {selectedDateKey}
                          </h3>
                          {intakesByDate[selectedDateKey]?.length > 0 && (
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                              {intakesByDate[selectedDateKey].length} lần uống
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          {intakesByDate[selectedDateKey] ? (
                            intakesByDate[selectedDateKey]
                              .sort(
                                (a: any, b: any) =>
                                  new Date(a.time).getTime() -
                                  new Date(b.time).getTime()
                              )
                              .map((intake: any) => (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  key={intake.id}
                                  className={cn(
                                    "rounded-xl border p-4 transition-all duration-300",
                                    intake.status
                                      ? "border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_15px_-5px_rgba(16,185,129,0.1)]"
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
                                    {intake.status ? (
                                      <Badge
                                        variant="outline"
                                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                                      >
                                        Đã uống
                                      </Badge>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 rounded-full border-primary/30 text-xs text-primary hover:bg-primary/5"
                                        onClick={() => updateIntakeStatusMutation.mutate(intake.id)}
                                        disabled={updateIntakeStatusMutation.isPending}
                                      >
                                        {updateIntakeStatusMutation.isPending ? (
                                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                        ) : (
                                          <CheckCircle2 className="mr-1 h-3 w-3" />
                                        )}
                                        Đánh dấu đã uống
                                      </Button>
                                    )}
                                  </div>
                                  
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
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              ))
                          ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                              <div className="mb-4 rounded-full bg-muted/30 p-4">
                                <Clock className="h-8 w-8 text-muted-foreground/50" />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Không có lịch uống thuốc cho ngày này
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    (Object.entries(intakesByDate) as [string, any[]][]).map(([date, intakes]) => (
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
                                  {intake.status ? (
                                    <Badge
                                      variant="outline"
                                      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                                    >
                                      Đã uống
                                    </Badge>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-7 rounded-full border-primary/30 text-xs text-primary hover:bg-primary/5"
                                      onClick={() => updateIntakeStatusMutation.mutate(intake.id)}
                                      disabled={updateIntakeStatusMutation.isPending}
                                    >
                                      {updateIntakeStatusMutation.isPending ? (
                                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                      ) : (
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                      )}
                                      Đánh dấu đã uống
                                    </Button>
                                  )}
                                </div>
                                
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
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

                {(prescription.message || aiAnalysis || prescription?.info?.ai_analysis) ? (
                  <>
                    <Separator className="bg-border/30" />
                    <div className="space-y-4">
                      {prescription.message && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-secondary dark:text-white">
                            <MessageSquare className="h-4 w-4" />
                            Lời dặn của bác sĩ
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {prescription.message}
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-medium text-primary">
                            <Bot className="h-4 w-4" />
                            Phân tích chuyên sâu từ AI
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1.5 text-xs font-semibold text-primary hover:bg-primary/5"
                            onClick={async () => {
                              setIsAnalyzing(true);
                              try {
                                const res = await analyzeMutation.mutateAsync(prescription);
                                setAiAnalysis(sanitizeAiAnalysis(res.answer) || null);
                                setIsUseful(res.is_useful);
                              } catch (e) {}
                              setIsAnalyzing(false);
                            }}
                            disabled={isAnalyzing}
                          >
                            {isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                            Phân tích lại
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {isUseful === false && (
                            <div className="flex items-start gap-2.5 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3.5 py-2.5 text-xs text-amber-700 dark:text-amber-300">
                              <Info className="h-4 w-4 shrink-0 mt-0.5" />
                              <span>
                                <span className="font-semibold">Lưu ý:</span> Câu trả lời này được tạo ra từ kiến thức chung của AI, không dựa trên cơ sở dữ liệu chuyên khoa (RAG). Thông tin có thể chưa đầy đủ — hãy tham khảo ý kiến bác sĩ.
                              </span>
                            </div>
                          )}
                          <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 text-sm text-secondary dark:text-white leading-relaxed shadow-sm prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-primary">
                          {aiAnalysis || prescription?.info?.ai_analysis ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {sanitizeAiAnalysis((aiAnalysis || prescription?.info?.ai_analysis) as string)}
                            </ReactMarkdown>
                          ) : (
                            <span className="text-muted-foreground">Chưa có phân tích AI cho đơn thuốc này.</span>
                          )}
                          </div>
                        </div>
                        {aiAnalysis && aiAnalysis !== sanitizeAiAnalysis((prescription?.info?.ai_analysis as string) || "") && (
                          <Button
                            size="sm"
                            className="w-full mt-2 rounded-xl gap-2"
                            onClick={() => updateMessageMutation.mutate({ id: prescriptionId, message: sanitizeAiAnalysis(aiAnalysis) })}
                            disabled={updateMessageMutation.isPending}
                          >
                            <Save className="h-4 w-4" />
                            Lưu bản phân tích mới này
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Separator className="bg-border/30" />
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <Bot className="mb-3 h-10 w-10 text-primary/40" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Đơn thuốc này chưa có lời dặn hoặc phân tích AI.
                      </p>
                      <Button
                        size="sm"
                        className="rounded-full gap-2 px-6"
                        onClick={async () => {
                          setIsAnalyzing(true);
                          try {
                            const res = await analyzeMutation.mutateAsync(prescription);
                            setAiAnalysis(sanitizeAiAnalysis(res.answer) || null);
                            setIsUseful(res.is_useful);
                          } catch (e) {}
                          setIsAnalyzing(false);
                        }}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
                        Phân tích bằng AI ngay
                      </Button>

                      {aiAnalysis && (
                        <div className="mt-6">
                           <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 text-sm text-secondary dark:text-white leading-relaxed shadow-sm prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-primary">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {sanitizeAiAnalysis(aiAnalysis)}
                              </ReactMarkdown>
                           </div>
                           <Button
                              variant="outline"
                              className="w-full mt-4 rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/5"
                              onClick={() => updateMessageMutation.mutate({ id: prescriptionId, message: sanitizeAiAnalysis(aiAnalysis) })}
                              disabled={updateMessageMutation.isPending}
                           >
                              <Save className="h-4 w-4" />
                              Lưu vào đơn thuốc
                           </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}


              </CardContent>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Original Image Card */}
            {prescription.info?.image && typeof prescription.info.image === 'string' && (
              <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2 text-lg text-secondary dark:text-white">
                    <ImageIcon className="h-5 w-5" />
                    Ảnh gốc
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="relative w-full overflow-hidden rounded-xl border border-border/50 bg-black/5 dark:bg-white/5">
                    <img 
                      src={prescription.info.image} 
                      alt="Prescription scan" 
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

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
