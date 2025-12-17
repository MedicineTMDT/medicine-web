"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/features/auth";
import { useCopyPrescription } from "@/features/prescriptions";
import { AlertTriangle, CheckCircle2, Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClaimPrescriptionPage() {
  const params = useParams();
  const router = useRouter();
  const prescriptionId = params.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const copyMutation = useCopyPrescription();
  
  const [claimStatus, setClaimStatus] = useState<"idle" | "claiming" | "success" | "error">("idle");
  const [claimedId, setClaimedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Auto-claim when authenticated
  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      // Don't auto-claim if not authenticated
      return;
    }

    if (claimStatus !== "idle") return;

    // Start claiming
    const claimPrescription = async () => {
      setClaimStatus("claiming");
      try {
        const result = await copyMutation.mutateAsync(prescriptionId);
        const newPrescription = (result as any)?.result || result;
        
        if (newPrescription?.id) {
          setClaimedId(newPrescription.id);
          setClaimStatus("success");
          
          // Redirect to the new prescription after a brief delay
          setTimeout(() => {
            router.push(`/prescription/${newPrescription.id}`);
          }, 1500);
        } else {
          throw new Error("Không thể nhận đơn thuốc");
        }
      } catch (error: any) {
        setClaimStatus("error");
        setErrorMessage(error?.message || "Đã xảy ra lỗi khi nhận đơn thuốc");
      }
    };

    claimPrescription();
  }, [isAuthenticated, authLoading, claimStatus, prescriptionId, copyMutation, router]);

  // Loading auth state
  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="mx-auto w-full max-w-md border-none bg-white/95 shadow-card backdrop-blur-sm dark:bg-secondary/70">
          <CardContent className="py-12 text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Đang kiểm tra...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-md border-none bg-white/95 shadow-card backdrop-blur-sm dark:bg-secondary/70">
          <CardContent className="py-12 text-center">
            <LogIn className="mx-auto mb-4 h-16 w-16 text-primary" />
            <h1 className="text-2xl font-semibold text-secondary dark:text-white">
              Nhận đơn thuốc
            </h1>
            <p className="mt-2 text-muted-foreground">
              Vui lòng đăng nhập để nhận đơn thuốc vào tài khoản của bạn
            </p>
            <Button asChild className="mt-6 w-full rounded-full" size="lg">
              <Link href={`/signin?redirect=/prescription/claim/${prescriptionId}`}>
                Đăng nhập để nhận
              </Link>
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full" size="sm">
              <Link href={`/signup?redirect=/prescription/claim/${prescriptionId}`}>
                Chưa có tài khoản? Đăng ký
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Claiming in progress
  if (claimStatus === "idle" || claimStatus === "claiming") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="mx-auto w-full max-w-md border-none bg-white/95 shadow-card backdrop-blur-sm dark:bg-secondary/70">
          <CardContent className="py-12 text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
            <h1 className="text-xl font-semibold text-secondary dark:text-white">
              Đang nhận đơn thuốc...
            </h1>
            <p className="mt-2 text-muted-foreground">
              Vui lòng đợi trong giây lát
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success - will redirect shortly
  if (claimStatus === "success") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="mx-auto w-full max-w-md border-none bg-white/95 shadow-card backdrop-blur-sm dark:bg-secondary/70">
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-500" />
            <h1 className="text-xl font-semibold text-secondary dark:text-white">
              Nhận đơn thuốc thành công!
            </h1>
            <p className="mt-2 text-muted-foreground">
              Đang chuyển đến đơn thuốc của bạn...
            </p>
            {claimedId && (
              <Button asChild className="mt-6 rounded-full" size="lg">
                <Link href={`/prescription/${claimedId}`}>
                  Xem đơn thuốc
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-md border-none bg-white/95 shadow-card backdrop-blur-sm dark:bg-secondary/70">
        <CardContent className="py-12 text-center">
          <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-destructive" />
          <h1 className="text-xl font-semibold text-secondary dark:text-white">
            Không thể nhận đơn thuốc
          </h1>
          <p className="mt-2 text-muted-foreground">
            {errorMessage}
          </p>
          <div className="mt-6 space-y-2">
            <Button
              onClick={() => {
                setClaimStatus("idle");
                setErrorMessage("");
              }}
              className="w-full rounded-full"
            >
              Thử lại
            </Button>
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link href="/prescription">
                Quay lại danh sách
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
