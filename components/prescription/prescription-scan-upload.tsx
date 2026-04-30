"use client";

import { Button } from "@/components/ui/button";
import type { CreatePrescriptionRequest } from "@/features/prescriptions";
import { useScanPrescription } from "@/features/prescriptions";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ImagePlus, Loader2, QrCode, RefreshCcw, ScanLine, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface PrescriptionScanUploadProps {
  onScanComplete: (result: CreatePrescriptionRequest) => void;
  onError?: (error: string) => void;
}

type ScanMethod = null | "camera" | "upload" | "qr";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 10;

interface MethodCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  badge?: string;
}
function MethodCard({ icon, label, description, onClick, badge }: MethodCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border/50 bg-muted/20 p-6 text-center transition-all hover:border-primary/60 hover:bg-primary/5 dark:border-white/10 dark:bg-white/5 dark:hover:border-primary/50 dark:hover:bg-primary/10"
    >
      <div className="rounded-full bg-muted p-4 transition-transform group-hover:scale-105 group-hover:bg-primary/10 dark:bg-white/10">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-secondary dark:text-white">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      {badge && (
        <span className="rounded-full border border-border/50 bg-muted px-2.5 py-0.5 text-xs text-muted-foreground dark:border-white/10 dark:bg-white/10">
          {badge}
        </span>
      )}
    </button>
  );
}

export function PrescriptionScanUpload({
  onScanComplete,
  onError,
}: PrescriptionScanUploadProps) {
  const router = useRouter();
  const [method, setMethod] = useState<ScanMethod>(null);

  // ── Image / Camera state ──
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // ── Live Camera state ──
  const streamRef = useRef<MediaStream | null>(null);
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Always-mounted hidden inputs — refs are always valid
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const qrFileInputRef = useRef<HTMLInputElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scanMutation = useScanPrescription();

  // ── QR scanner state ──
  const [isQrScanning, setIsQrScanning] = useState(false);
  const [isQrStarting, setIsQrStarting] = useState(false);
  const [isQrProcessingImage, setIsQrProcessingImage] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const qrScannerRef = useRef<any>(null);
  const qrScannerId = "qr-scanner-inline";

  const stopQrScanner = useCallback(async () => {
    if (qrScannerRef.current) {
      try { await qrScannerRef.current.stop(); qrScannerRef.current.clear(); } catch {}
      qrScannerRef.current = null;
    }
    setIsQrScanning(false);
    setIsQrStarting(false);
    setIsQrOpen(false);
  }, []);

  const stopQrScannerRef = useRef(stopQrScanner);
  useEffect(() => { stopQrScannerRef.current = stopQrScanner; }, [stopQrScanner]);

  // Refs for live camera
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videoCallbackRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node && streamRef.current) {
      if (node.srcObject !== streamRef.current) {
        node.srcObject = streamRef.current;
      }
      node.play().catch(err => {
        if (err.name !== 'AbortError') console.error('Video play error', err);
      });
      // If already ready, set state immediately
      if (node.readyState >= 2) {
        setIsVideoReady(true);
      }
    }
  }, []);

  // Sync activeStream to video element
  useEffect(() => {
    streamRef.current = activeStream;
    if (videoRef.current && activeStream) {
      if (videoRef.current.srcObject !== activeStream) {
        videoRef.current.srcObject = activeStream;
      }
      videoRef.current.play().catch(err => {
        if (err.name !== 'AbortError') console.error('Video sync play error', err);
      });
    }
  }, [activeStream]);

  const stopLiveCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setActiveStream(null);
    setIsVideoReady(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraLoading(false);
    setIsCameraOpen(false);
  }, []); // Stable ref

  const stopLiveCameraRef = useRef(stopLiveCamera);
  useEffect(() => { stopLiveCameraRef.current = stopLiveCamera; }, [stopLiveCamera]);


  useEffect(() => () => { 
    stopQrScanner(); 
    stopLiveCamera();
  }, [stopQrScanner, stopLiveCamera]);

  // ── File validation ──
  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) return "Chỉ hỗ trợ JPG, PNG, WebP.";
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return `File quá lớn. Tối đa ${MAX_SIZE_MB}MB.`;
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const err = validateFile(file);
    if (err) { setFileError(err); return; }
    setFileError(null);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const startLiveCamera = useCallback(async (mode?: "environment" | "user") => {
    const targetMode = mode || facingMode;
    setCameraError(null);
    setIsCameraLoading(true);
    
    // Stop current stream if any before restarting/switching
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: targetMode },
      });
      streamRef.current = mediaStream; // Eagerly update ref
      setActiveStream(mediaStream);
      setFacingMode(targetMode);
      setIsCameraOpen(true); // Open portal AFTER stream is ready
    } catch (err: any) {

      console.error("Camera access error:", err);
      setCameraError(
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Vui lòng cho phép truy cập camera để chụp ảnh đơn thuốc."
          : "Không thể khởi động camera. Vui lòng thử lại hoặc tải ảnh lên."
      );
    } finally {
      setIsCameraLoading(false);
    }
  }, [facingMode]);


  const toggleCamera = useCallback(() => {
    const newMode = facingMode === "environment" ? "user" : "environment";
    startLiveCamera(newMode);
  }, [facingMode, startLiveCamera]);

  const toggleCameraRef = useRef(toggleCamera);
  useEffect(() => { toggleCameraRef.current = toggleCamera; }, [toggleCamera]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current ?? document.querySelector('video[autoplay]') as HTMLVideoElement | null;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;

    const width = video.videoWidth;
    const height = video.videoHeight;

    const doCapture = (w: number, h: number) => {
      const context = canvas.getContext("2d");
      if (!context) return;
      canvas.width = w;
      canvas.height = h;
      context.drawImage(video, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], `capture_${Date.now()}.jpg`, {
              type: "image/jpeg",
            });
            handleFile(file);
            stopLiveCamera(); // stop camera AFTER blob is ready
          }
        },
        "image/jpeg",
        0.95
      );
    };

    if (width > 0 && height > 0) {
      doCapture(width, height);
    } else {
      // Polling fallback — wait for valid frame dimensions
      const pollInterval = setInterval(() => {
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (w > 0 && h > 0) {
          clearInterval(pollInterval);
          doCapture(w, h);
        }
      }, 100);

      // Safety timeout
      setTimeout(() => {
        clearInterval(pollInterval);
      }, 8000);
    }
  }, [handleFile, stopLiveCamera]);

  const capturePhotoRef = useRef<() => void>(() => {});
  capturePhotoRef.current = capturePhoto;


  const handleBack = () => {
    stopQrScanner();
    stopLiveCamera();
    setMethod(null);
    setPreview(null);
    setSelectedFile(null);
    setFileError(null);
    setQrError(null);
    setCameraError(null);
  };


  // ── AI scan ──
  const handleScan = async () => {
    if (!selectedFile) return;
    try {
      const result = await scanMutation.mutateAsync(selectedFile);
      onScanComplete(result);
    } catch (err: any) {
      onError?.(err?.message ?? "Không thể phân tích ảnh. Vui lòng thử lại.");
    }
  };

  const isImageScanning = scanMutation.isPending;

  // ── QR ──
  const handleQrSuccess = useCallback(
    (decodedText: string) => {
      stopQrScanner();
      try {
        const url = new URL(decodedText);
        if (url.pathname.includes("/prescription/")) {
          router.push(url.pathname);
        } else {
          window.open(decodedText, "_blank");
        }
      } catch {}
    },
    [stopQrScanner, router]
  );

  const startQrScanner = useCallback(async () => {
    setQrError(null);
    setIsQrOpen(true);
    setIsQrStarting(true);
    // The actual starting logic is now in a useEffect that waits for the portal element
  }, []);

  // Sync QR scanner starting when portal opens
  useEffect(() => {
    if (!isQrOpen || isQrScanning || !isQrStarting) return;

    let isMounted = true;

    async function init() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        
        // Wait for portal DOM to stabilize
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (!isMounted) return;

        const el = document.getElementById(qrScannerId);
        if (!el) return;

        const scanner = new Html5Qrcode(qrScannerId, { verbose: false });
        qrScannerRef.current = scanner;
        
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
          handleQrSuccess,
          () => {}
        );
        
        if (isMounted) {
          setIsQrScanning(true);
          setIsQrStarting(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setIsQrStarting(false);
          setQrError(
            err.message?.includes("permission") || err.name === "NotAllowedError"
              ? "Vui lòng cho phép truy cập camera"
              : "Không thể khởi động camera"
          );
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [isQrOpen, isQrScanning, isQrStarting, handleQrSuccess]);

  // Helper to downscale and normalize image for QR detection
  const preprocessImageForQr = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const MAX_SIZE = 850; // Optimal size for ZXing detection
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error("Could not get canvas context"));
        
        // Use white background to avoid transparency issues
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], "preprocessed-qr.jpg", { type: "image/jpeg" }));
          } else {
            reject(new Error("Canvas to Blob failed"));
          }
          URL.revokeObjectURL(img.src);
        }, 'image/jpeg', 0.9);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error("Image load failed"));
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleQrFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setQrError(null);
      setIsQrProcessingImage(true);
      
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const reader = new Html5Qrcode("qr-file-reader-inline", { verbose: false });
        
        let decodedText = null;
        
        try {
          // Pass 1: Try raw file
          const result = await reader.scanFileV2(file, false);
          decodedText = result.decodedText;
        } catch (firstPassError) {
          // Pass 2: Try with preprocessed (downscaled & normalized) version
          try {
            const preprocessedFile = await preprocessImageForQr(file);
            const result = await reader.scanFileV2(preprocessedFile, false);
            decodedText = result.decodedText;
          } catch (secondPassError) {
            console.error("QR Robust Pass Failure:", secondPassError);
            throw firstPassError; // Throw original error if both fail
          }
        }

        reader.clear();
        if (decodedText) {
          handleQrSuccess(decodedText);
        }
      } catch (err: any) {
        console.error("QR File Upload Final Error:", err);
        setQrError("Không tìm thấy mã QR. Vui lòng thử ảnh khác hoặc đảm bảo mã QR rõ nét.");
      } finally {
        setIsQrProcessingImage(false);
        if (qrFileInputRef.current) qrFileInputRef.current.value = "";
      }
    },
    [handleQrSuccess]
  );

  // ── Image preview area (shared by camera & upload) ──
  const renderImageArea = (triggerRef: React.RefObject<HTMLInputElement>) => (
    <>
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed transition-all duration-200",
              isDragging
                ? "border-primary bg-primary/8 scale-[1.01]"
                : "border-border/50 bg-muted/30 hover:border-primary/50 hover:bg-primary/5 dark:border-white/15 dark:bg-white/5"
            )}
            onClick={() => triggerRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFile(file);
            }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
          >
            <div className="flex flex-col items-center gap-2 px-6 text-center">
              <div className={cn("rounded-full p-4 transition-colors", isDragging ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground")}>
                {method === "camera" ? <Camera className="h-8 w-8" /> : <ImagePlus className="h-8 w-8" />}
              </div>
              <p className="font-semibold text-secondary dark:text-white">
                {method === "camera" ? "Nhấn để mở camera" : "Kéo thả hoặc nhấn để chọn ảnh"}
              </p>
              <p className="text-xs text-muted-foreground">
                {method === "camera"
                  ? "Camera sẽ mở trên thiết bị của bạn"
                  : `Hỗ trợ JPG, PNG, WebP · Tối đa ${MAX_SIZE_MB}MB`}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative overflow-hidden rounded-2xl border border-border/50 bg-muted/20 dark:border-white/10 dark:bg-white/5"
          >
            <div className="relative flex max-h-[300px] items-center justify-center overflow-hidden">
              <img src={preview} alt="Ảnh đơn thuốc" className="max-h-[300px] w-full object-contain" />
              {isImageScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 backdrop-blur-sm">
                  <ScanLine className="h-10 w-10 text-primary animate-pulse" />
                  <div className="text-center">
                    <p className="font-semibold text-white">Đang phân tích AI...</p>
                    <p className="text-sm text-white/70">Gemini đang đọc đơn thuốc</p>
                  </div>
                  <div className="w-48 h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "90%" }}
                      transition={{ duration: 4, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-border/30 px-4 py-3 dark:border-white/10">
              <div className="flex items-center gap-2 min-w-0">
                <Camera className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm text-secondary dark:text-white">{selectedFile?.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  ({((selectedFile?.size ?? 0) / 1024 / 1024).toFixed(1)} MB)
                </span>
              </div>
              {!isImageScanning && (
                <button
                  type="button"
                  onClick={() => { setPreview(null); setSelectedFile(null); setFileError(null); }}
                  className="ml-2 shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {fileError && <p className="text-sm text-destructive">{fileError}</p>}

      {preview && !isImageScanning && (
        <Button className="w-full rounded-full py-6 text-base gap-2" onClick={handleScan} disabled={!selectedFile}>
          <ScanLine className="h-5 w-5" />
          Phân tích đơn thuốc bằng AI
        </Button>
      )}
      {isImageScanning && (
        <Button className="w-full rounded-full py-6" disabled>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Đang phân tích...
        </Button>
      )}
    </>
  );

  return (
    <div className="space-y-4">
      {/* 
        ── Always-mounted hidden inputs ──
        These MUST stay outside AnimatePresence so refs are never null.
      */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          // reset so same file can be re-selected
          if (cameraInputRef.current) cameraInputRef.current.value = "";
        }}
      />
      <input
        ref={uploadInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          if (uploadInputRef.current) uploadInputRef.current.value = "";
        }}
      />
      <input
        ref={qrFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleQrFileUpload}
      />
      <div id="qr-file-reader-inline" className="hidden" />
      
      {/* Hidden canvas for capturing frames — must be always mounted */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ── Animated views ── */}
      <AnimatePresence mode="wait">

        {/* METHOD SELECT */}
        {method === null && (
          <motion.div
            key="method-select"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground text-center">Chọn cách thêm đơn thuốc</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <MethodCard
                icon={<Camera className="h-7 w-7 text-primary" />}
                label="Chụp ảnh"
                description="Dùng camera để chụp đơn thuốc"
                badge="Nhanh nhất"
                onClick={() => {
                  setMethod("camera");
                  // Try to start live camera, fallback handled in UI
                  startLiveCamera();
                }}
              />
              <MethodCard
                icon={<ImagePlus className="h-7 w-7 text-primary" />}
                label="Tải ảnh lên"
                description="Chọn ảnh từ thư viện thiết bị"
                onClick={() => {
                  setMethod("upload");
                  uploadInputRef.current?.click();
                }}
              />
              <MethodCard
                icon={<QrCode className="h-7 w-7 text-primary" />}
                label="Quét mã QR"
                description="Quét mã QR trên đơn thuốc điện tử"
                onClick={() => {
                  setMethod("qr");
                  setTimeout(() => startQrScanner(), 150);
                }}
              />
            </div>
          </motion.div>
        )}
        {/* CAMERA VIEW */}
        {method === "camera" && (
          <motion.div
            key="camera"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <button type="button" onClick={handleBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Chọn cách khác
            </button>
            
            <AnimatePresence mode="wait">
              {preview ? (
                <motion.div
                  key="captured-preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {renderImageArea(cameraInputRef)}
                  {/* Re-shoot button when image already captured */}
                  {!isImageScanning && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-full gap-2 border-primary/20 hover:bg-primary/5"
                      onClick={() => startLiveCamera()}
                    >
                      <Camera className="h-4 w-4" />
                      Chụp lại
                    </Button>
                  )}
                </motion.div>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-sm text-muted-foreground">Đang mở camera scanner...</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* UPLOAD VIEW */}
        {method === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <button type="button" onClick={handleBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Chọn cách khác
            </button>
            {renderImageArea(uploadInputRef)}
          </motion.div>
        )}

        {/* QR VIEW */}
        {method === "qr" && (
          <motion.div
            key="qr"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <button type="button" onClick={handleBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Chọn cách khác
            </button>

            <div className="flex flex-col items-center gap-6 py-10">
              <div className="p-8 rounded-full bg-primary/10 text-primary">
                <QrCode className="h-10 w-10" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Quét mã QR</h3>
                <p className="text-sm text-muted-foreground max-w-[240px]">
                  Mở trình quét để đọc mã QR trên đơn thuốc điện tử của bạn
                </p>
              </div>
              
              <div className="flex flex-col w-full gap-3 max-w-xs">
                <Button onClick={startQrScanner} className="rounded-full gap-2 py-6">
                  <Camera className="h-5 w-5" />
                  Bật trình quét
                </Button>
                <Button variant="outline" onClick={() => qrFileInputRef.current?.click()} className="rounded-full gap-2 border-dashed">
                  <ImagePlus className="h-4 w-4" />
                  Tải ảnh QR từ máy
                </Button>
              </div>

              {qrError && <p className="text-sm text-destructive text-center">{qrError}</p>}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── Fullscreen Portals (Moved to Root) ── */}
      {isCameraOpen && typeof document !== 'undefined' && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* ── LIVE VIDEO ── */}
          <video
            ref={videoCallbackRef}
            autoPlay
            playsInline
            muted
            onCanPlay={() => setIsVideoReady(true)}
            onLoadedMetadata={() => {
              if (videoRef.current) videoRef.current.play().catch(() => {});
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start pointer-events-none">
            <button
              onClick={() => stopLiveCameraRef.current()}
              className="pointer-events-auto h-12 w-12 flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="bg-black/40 text-white px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-md pointer-events-none">
              Quét đơn thuốc
            </div>
            <div className="w-12 h-12 invisible" /> 
          </div>

          {/* Framing guide */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[85%] aspect-[3/4] max-w-[400px] relative">
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary/60 rounded-tl-3xl shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-primary/60 rounded-tr-3xl shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-primary/60 rounded-bl-3xl shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary/60 rounded-br-3xl shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" />
            </div>
          </div>

          {/* Bottom Controls */}
          <div 
            className="absolute bottom-0 left-0 right-0 p-10 flex items-center justify-around bg-gradient-to-t from-black/80 to-transparent z-[998]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12" />
            <div className="relative group">
              <button
                type="button"
                onMouseDown={(e) => { e.stopPropagation(); capturePhotoRef.current(); }}
                onTouchStart={(e) => { e.stopPropagation(); capturePhotoRef.current(); }}
                onClick={(e) => { e.stopPropagation(); capturePhotoRef.current(); }}
                className="relative h-20 w-20 flex items-center justify-center rounded-full bg-white transition-all transform active:scale-90 hover:scale-105 cursor-pointer z-[999]"
              >
                <div className={cn(
                  "h-[72px] w-[72px] rounded-full border-2 border-black/5 bg-white shadow-xl transition-opacity",
                  !isVideoReady && "opacity-60"
                )} />
              </button>
              <div className="absolute -inset-2 rounded-full border-2 border-white/20 animate-ping [animation-duration:3s] pointer-events-none" />
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleCameraRef.current(); }}
              className="h-12 w-12 flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95 z-[999]"
            >
              <RefreshCcw className="h-5 w-5" />
            </button>
          </div>

          {isCameraLoading && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-white text-sm">Đang tải camera...</p>
            </div>
          )}

          {cameraError && (
            <div className="absolute inset-0 bg-black px-10 flex flex-col items-center justify-center gap-6 text-center">
              <div className="p-4 rounded-full bg-destructive/10">
                <X className="h-10 w-10 text-destructive" />
              </div>
              <div className="space-y-2">
                <p className="text-white font-medium">Lỗi Camera</p>
                <p className="text-white/60 text-sm">{cameraError}</p>
              </div>
              <div className="flex flex-col w-full gap-3">
                <Button variant="secondary" onClick={() => startLiveCamera()}>Thử lại</Button>
                <Button variant="ghost" onClick={stopLiveCamera} className="text-white">Đóng</Button>
              </div>
            </div>
          )}
        </motion.div>,
        document.body
      )}

      {isQrOpen && typeof document !== 'undefined' && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          <div id={qrScannerId} className="absolute inset-0 h-full w-full bg-black flex items-center justify-center [&_video]:object-cover [&_video]:h-full [&_video]:w-full" />

          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start pointer-events-none z-50">
            <button
              onClick={() => stopQrScannerRef.current()}
              className="pointer-events-auto h-12 w-12 flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="bg-black/40 text-white px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-md pointer-events-none flex items-center gap-2">
              <QrCode className="h-3 w-3" />
              Quét mã QR
            </div>
            <button
              onClick={() => qrFileInputRef.current?.click()}
              className="pointer-events-auto h-12 w-12 flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95"
            >
              <ImagePlus className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[260px] h-[260px] relative">
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-lg shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-lg shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-lg shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-lg shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]" />
              <motion.div 
                className="absolute inset-x-0 h-1 bg-primary/40 shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)]"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          <div className="absolute bottom-12 left-0 right-0 p-8 flex flex-col items-center gap-4 pointer-events-none">
            <div className="bg-black/60 text-white/90 px-6 py-3 rounded-2xl backdrop-blur-xl border border-white/10 shadow-huge flex items-center gap-3">
              {isQrScanning ? (
                <>
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                  <span className="text-sm font-medium tracking-wide">Đang quét tìm mã QR...</span>
                </>
              ) : (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm font-medium tracking-wide">Đang khởi động camera...</span>
                </>
              )}
            </div>
          </div>

          {isQrProcessingImage && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-[60]">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-white font-medium">Đang xử lý mã QR...</p>
            </div>
          )}
        </motion.div>,
        document.body
      )}
    </div>
  );
}
