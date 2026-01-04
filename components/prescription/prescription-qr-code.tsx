"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Download, QrCode, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

interface PrescriptionQRCodeProps {
  prescriptionId: string;
  prescriptionName?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: 128,
  md: 200,
  lg: 256,
};

export function PrescriptionQRCode({
  prescriptionId,
  prescriptionName,
  className,
  size = "md",
}: PrescriptionQRCodeProps) {
  const [open, setOpen] = useState(false);

  // Generate the full URL for the prescription claim page (auto-copy on scan)
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const prescriptionUrl = `${baseUrl}/prescription/claim/${prescriptionId}`;

  const handleDownload = () => {
    const svg = document.getElementById(`qr-${prescriptionId}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `prescription-${prescriptionId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: prescriptionName || `Đơn thuốc ${prescriptionId}`,
          text: "Xem chi tiết đơn thuốc",
          url: prescriptionUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(prescriptionUrl);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2 rounded-full border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur hover:bg-white/20 dark:border-white/10 dark:bg-white/5",
            className
          )}
        >
          <QrCode className="h-4 w-4" />
          Mã QR
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-secondary dark:text-white">
            Mã QR Đơn Thuốc
          </DialogTitle>
          <DialogDescription className="text-center">
            Quét mã QR để xem chi tiết đơn thuốc trên thiết bị di động
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="rounded-2xl border border-[var(--glass-border)] bg-white p-4 shadow-lg dark:border-white/10">
            <QRCodeSVG
              id={`qr-${prescriptionId}`}
              value={prescriptionUrl}
              size={sizeMap[size]}
              level="H"
              includeMargin
              bgColor="#ffffff"
              fgColor="#0a2542"
            />
          </div>
          {prescriptionName && (
            <p className="text-sm font-medium text-secondary dark:text-white">
              {prescriptionName}
            </p>
          )}
          <p className="max-w-xs break-all text-center text-xs text-muted-foreground">
            {prescriptionUrl}
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2 rounded-full"
            >
              <Download className="h-4 w-4" />
              Tải xuống
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2 rounded-full"
            >
              <Share2 className="h-4 w-4" />
              Chia sẻ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Inline QR code display (without dialog)
 */
export function PrescriptionQRCodeInline({
  prescriptionId,
  size = "md",
  className,
}: Omit<PrescriptionQRCodeProps, "prescriptionName">) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const prescriptionUrl = `${baseUrl}/prescription/claim/${prescriptionId}`;

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--glass-border)] bg-white p-4 dark:border-white/10",
        className
      )}
    >
      <QRCodeSVG
        id={`qr-inline-${prescriptionId}`}
        value={prescriptionUrl}
        size={sizeMap[size]}
        level="H"
        includeMargin
        bgColor="#ffffff"
        fgColor="#0a2542"
      />
    </div>
  );
}
