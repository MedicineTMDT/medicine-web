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
import { Camera, ImagePlus, Loader2, ScanLine, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface QRScannerProps {
  className?: string;
  onScan?: (decodedText: string) => void;
  buttonLabel?: string;
}

export function QRScanner({
  className,
  onScan,
  buttonLabel = "Quét mã QR",
}: QRScannerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerId = "html5-qr-scanner";

  const handleScanSuccess = useCallback(
    (decodedText: string) => {
      // Stop scanner before navigating
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
      setIsScanning(false);
      setOpen(false);

      if (onScan) {
        onScan(decodedText);
      } else {
        // Default behavior: navigate to the scanned URL
        try {
          const url = new URL(decodedText);
          if (url.pathname.includes("/prescription/")) {
            router.push(url.pathname);
          } else {
            window.open(decodedText, "_blank");
          }
        } catch {
          console.log("Scanned:", decodedText);
        }
      }
    },
    [onScan, router]
  );

  const startScanner = useCallback(async () => {
    setError(null);
    setIsStarting(true);

    try {
      // Dynamic import
      const { Html5Qrcode } = await import("html5-qrcode");
      
      const scanner = new Html5Qrcode(scannerId, { verbose: false });
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
        },
        handleScanSuccess,
        () => {} // Ignore errors
      );
      
      setIsScanning(true);
      setIsStarting(false);
    } catch (err: any) {
      console.error("Scanner error:", err);
      setIsStarting(false);
      setError(
        err.message?.includes("permission") || err.name === "NotAllowedError"
          ? "Vui lòng cho phép truy cập camera"
          : "Không thể khởi động camera"
      );
    }
  }, [handleScanSuccess]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setIsScanning(false);
    setIsStarting(false);
  }, []);

  // Cleanup on unmount or dialog close
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, []);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      stopScanner();
    }
    setOpen(isOpen);
    setError(null);
    setIsProcessingImage(false);
  };

  // Handle image file upload for QR scanning
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setError(null);
      setIsProcessingImage(true);

      try {
        // Dynamic import
        const { Html5Qrcode } = await import("html5-qrcode");

        // Create a temporary instance to scan file
        const html5QrCode = new Html5Qrcode("qr-file-reader", { verbose: false });
        
        // Scan the file
        const result = await html5QrCode.scanFileV2(file, false);
        html5QrCode.clear();
        
        // Success - handle the decoded text
        handleScanSuccess(result.decodedText);
      } catch (err: any) {
        console.error("Image scan error:", err);
        setError("Không tìm thấy mã QR trong ảnh. Vui lòng thử ảnh khác.");
      } finally {
        setIsProcessingImage(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [handleScanSuccess]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "gap-2 rounded-full border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur hover:bg-white/20 dark:border-white/10 dark:bg-white/5",
            className
          )}
        >
          <ScanLine className="h-4 w-4" />
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-secondary dark:text-white">
            Quét mã QR
          </DialogTitle>
          <DialogDescription className="text-center">
            Hướng camera vào mã QR của đơn thuốc
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {/* Scanner container - must have fixed dimensions */}
          <div className="relative w-[280px] h-[280px] rounded-xl overflow-hidden bg-gray-900">
            {/* This div is where html5-qrcode renders the video */}
            <div 
              id={scannerId} 
              className="w-full h-full"
              style={{ 
                display: isScanning || isStarting ? 'block' : 'none',
              }}
            />
            
            {/* Start button overlay */}
            {!isScanning && !isStarting && !isProcessingImage && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-900">
                <Camera className="h-10 w-10 text-white/50" />
                <div className="flex flex-col gap-2">
                  <Button onClick={startScanner} variant="secondary" size="sm">
                    Bật camera
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2 text-white border-white/30 hover:bg-white/20"
                  >
                    <ImagePlus className="h-4 w-4" />
                    Tải ảnh lên
                  </Button>
                </div>
              </div>
            )}

            {/* Image processing loader */}
            {isProcessingImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-900">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-white/70">Đang xử lý ảnh...</p>
              </div>
            )}

            {/* Starting loader */}
            {isStarting && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-900">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-white/70">Đang khởi động camera...</p>
              </div>
            )}

            {/* Scan frame overlay */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[200px] h-[200px] relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary" />
                </div>
              </div>
            )}
          </div>

          {/* Hidden file input for image upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {/* Hidden div for QR file reader (required by Html5Qrcode) */}
          <div id="qr-file-reader" className="hidden" />

          {/* Error message */}
          {error && (
            <div className="text-center">
              <p className="text-sm text-destructive mb-2">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setError(null);
                    startScanner();
                  }}
                >
                  Thử camera
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setError(null);
                    fileInputRef.current?.click();
                  }}
                >
                  Tải ảnh khác
                </Button>
              </div>
            </div>
          )}

          {/* Status */}
          {isScanning && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Đang quét mã QR...
            </div>
          )}

          {/* Stop button */}
          {isScanning && (
            <Button variant="outline" size="sm" onClick={stopScanner} className="gap-2">
              <X className="h-4 w-4" />
              Dừng quét
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
