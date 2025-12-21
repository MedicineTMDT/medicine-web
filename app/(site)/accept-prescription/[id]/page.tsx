"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/features/auth";
import { useAcceptPrescription, usePrescriptionById } from "@/features/prescriptions";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, FileText, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AcceptPrescriptionPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const prescriptionId = params.id as string;

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data: prescriptionData, isLoading: prescriptionLoading } = usePrescriptionById(
    prescriptionId,
    isAuthenticated
  );
  const acceptMutation = useAcceptPrescription();

  const prescription = prescriptionData?.result;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // Redirect to login with return URL
      router.push(`/signin?redirect=/accept-prescription/${prescriptionId}`);
    }
  }, [authLoading, isAuthenticated, prescriptionId, router]);

  const handleAccept = async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      await acceptMutation.mutateAsync(prescriptionId);
      setStatus("success");
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error?.message || "Đã có lỗi xảy ra khi xác nhận đơn thuốc.");
    }
  };

  if (authLoading || prescriptionLoading) {
    return (
      <div className="container max-w-lg py-16">
        <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Đang tải...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="container max-w-lg py-16">
        <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
            <XCircle className="h-12 w-12 text-destructive" />
            <p className="text-center text-lg font-medium">Không tìm thấy đơn thuốc</p>
            <p className="text-center text-sm text-muted-foreground">
              Đơn thuốc này có thể đã bị xóa hoặc không tồn tại.
            </p>
            <Button asChild variant="outline" className="mt-4 rounded-full">
              <Link href="/prescription">Quay lại danh sách đơn thuốc</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              Xác nhận đơn thuốc
            </p>
            <h1 className="text-3xl font-heading font-semibold leading-tight text-secondary dark:text-white md:text-4xl">
              Xác nhận đơn thuốc từ bác sĩ
            </h1>
            <p className="text-sm text-secondary/80 dark:text-white/80 md:text-base">
              Vui lòng xem xét và xác nhận đơn thuốc bên dưới.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="container mt-8 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-secondary dark:text-white">
                <FileText className="h-5 w-5" />
                {prescription.name || "Đơn thuốc"}
              </CardTitle>
              <CardDescription>
                {prescription.diagnosisNote || "Không có chẩn đoán"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Prescription Info */}
              <div className="space-y-3 rounded-xl border border-border/50 bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ngày bắt đầu:</span>
                  <span className="font-medium">
                    {prescription.startDate
                      ? new Date(prescription.startDate).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </span>
                </div>
                {prescription.endDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Ngày kết thúc:</span>
                    <span className="font-medium">
                      {new Date(prescription.endDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                )}
                {prescription.message && (
                  <div className="pt-2 text-sm">
                    <span className="text-muted-foreground">Lời dặn:</span>
                    <p className="mt-1 font-medium">{prescription.message}</p>
                  </div>
                )}
              </div>

              {/* Status-based content */}
              {status === "idle" && (
                <div className="space-y-4 pt-4">
                  <p className="text-center text-sm text-muted-foreground">
                    Bạn có muốn xác nhận đơn thuốc này không?
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full"
                      onClick={() => router.push("/prescription")}
                    >
                      Hủy
                    </Button>
                    <Button
                      className="flex-1 rounded-full"
                      onClick={handleAccept}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Xác nhận
                    </Button>
                  </div>
                </div>
              )}

              {status === "loading" && (
                <div className="flex flex-col items-center gap-4 py-8">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-muted-foreground">Đang xử lý...</p>
                </div>
              )}

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-8"
                >
                  <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                  <p className="text-center text-lg font-medium text-secondary dark:text-white">
                    Đơn thuốc đã được xác nhận!
                  </p>
                  <p className="text-center text-sm text-muted-foreground">
                    Đơn thuốc đã được thêm vào danh sách của bạn.
                  </p>
                  <Button asChild className="mt-4 rounded-full">
                    <Link href={`/prescription/${prescriptionId}`}>
                      Xem chi tiết đơn thuốc
                    </Link>
                  </Button>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-8"
                >
                  <XCircle className="h-16 w-16 text-destructive" />
                  <p className="text-center text-lg font-medium text-secondary dark:text-white">
                    Không thể xác nhận đơn thuốc
                  </p>
                  <p className="text-center text-sm text-muted-foreground">
                    {errorMessage}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={() => router.push("/prescription")}
                    >
                      Quay lại
                    </Button>
                    <Button className="rounded-full" onClick={handleAccept}>
                      Thử lại
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
