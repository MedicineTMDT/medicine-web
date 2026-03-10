"use client";

import { useAuth } from "@/features/auth";
import { useCreateRequest } from "@/features/requests";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

interface DrugUpdateRequestDialogProps {
  drugName: string;
  drugId: number | string;
}

type RequestType = "EDIT" | "ADD" | "QUESTION";

const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  EDIT: "Chỉnh sửa thông tin thuốc",
  ADD: "Bổ sung thông tin thuốc",
  QUESTION: "Đặt câu hỏi về thuốc",
};

export function DrugUpdateRequestDialog({
  drugName,
  drugId,
}: DrugUpdateRequestDialogProps) {
  const { isAuthenticated } = useAuth();
  const { mutate, isPending } = useCreateRequest();

  const [open, setOpen] = useState(false);
  const [requestType, setRequestType] = useState<RequestType>("EDIT");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleClose = () => {
    setOpen(false);
    // Reset after animation
    setTimeout(() => {
      setStatus("idle");
      setContent("");
      setRequestType("EDIT");
      setErrorMsg("");
    }, 300);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;

    const title = `[${requestType}] ${drugName} (ID: ${drugId})`;

    mutate(
      { title, content: content.trim(), typeOfRequest: requestType },
      {
        onSuccess: () => setStatus("success"),
        onError: (err: unknown) => {
          setStatus("error");
          setErrorMsg(
            err instanceof Error ? err.message : "Đã xảy ra lỗi, vui lòng thử lại."
          );
        },
      }
    );
  };

  // Not logged in — show a disabled button with tooltip hint
  if (!isAuthenticated) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2 opacity-60">
        <Send className="h-4 w-4" />
        Yêu cầu chỉnh sửa
        <span className="ml-1 text-xs text-muted-foreground">(cần đăng nhập)</span>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-primary/40 text-primary hover:bg-primary/5 hover:text-primary transition-all"
        >
          <Send className="h-4 w-4" />
          Yêu cầu chỉnh sửa
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px]">
        {status === "success" ? (
          /* ─── Success State ─── */
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Yêu cầu đã được gửi!
              </DialogTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Cảm ơn bạn. Quản trị viên sẽ xem xét và xử lý yêu cầu của bạn
                trong thời gian sớm nhất.
              </p>
            </div>
            <Button onClick={handleClose} className="mt-2 w-full">
              Đóng
            </Button>
          </div>
        ) : (
          /* ─── Form State ─── */
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-secondary dark:text-white">
                <Send className="h-5 w-5 text-primary" />
                Gửi yêu cầu chỉnh sửa dữ liệu
              </DialogTitle>
              <DialogDescription>
                Gửi yêu cầu cho quản trị viên về thông tin thuốc{" "}
                <span className="font-semibold text-secondary dark:text-white">
                  {drugName}
                </span>
                .
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Request Type */}
              <div className="space-y-1.5">
                <Label htmlFor="request-type">Loại yêu cầu</Label>
                <Select
                  value={requestType}
                  onValueChange={(v) => setRequestType(v as RequestType)}
                >
                  <SelectTrigger id="request-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(REQUEST_TYPE_LABELS) as RequestType[]).map(
                      (type) => (
                        <SelectItem key={type} value={type}>
                          {REQUEST_TYPE_LABELS[type]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <Label htmlFor="request-content">
                  Mô tả chi tiết{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="request-content"
                  placeholder={
                    requestType === "EDIT"
                      ? "Ví dụ: Thông tin liều dùng không chính xác, cần cập nhật theo phác đồ mới..."
                      : requestType === "ADD"
                      ? "Ví dụ: Cần bổ sung tác dụng phụ nghiêm trọng khi dùng cùng warfarin..."
                      : "Ví dụ: Thuốc này có thể dùng cho trẻ em dưới 6 tuổi không?"
                  }
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="resize-none"
                  disabled={isPending}
                />
                <p className="text-xs text-muted-foreground">
                  {content.trim().length} ký tự. Mô tả càng chi tiết, yêu cầu
                  của bạn sẽ được xử lý nhanh hơn.
                </p>
              </div>

              {/* Error */}
              {status === "error" && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {errorMsg}
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="ghost"
                onClick={handleClose}
                disabled={isPending}
              >
                Huỷ
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending || !content.trim()}
                className="gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Gửi yêu cầu
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
