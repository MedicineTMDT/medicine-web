import { AlertTriangle } from "lucide-react";

type MedicalSafetyNoticeProps = {
  className?: string;
};

export function MedicalSafetyNotice({ className = "" }: MedicalSafetyNoticeProps) {
  return (
    <aside
      role="alert"
      className={`rounded-xl border-2 border-amber-500/60 bg-amber-50 px-4 py-3 text-amber-950 shadow-sm dark:bg-amber-950/40 dark:text-amber-100 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />
        <div className="space-y-1.5 text-sm leading-relaxed">
          <p><strong>⚠ Cảnh báo an toàn y khoa:</strong> Kết quả Chatbot/OCR có thể sai hoặc thiếu. Luôn đối chiếu từng thông tin với đơn thuốc gốc và hỏi ý kiến bác sĩ hoặc dược sĩ. <strong>Không tự ý dùng thuốc dựa trên kết quả của Chatbot.</strong></p>
          <p lang="en"><strong>⚠ Medical safety warning:</strong> Chatbot/OCR results may be inaccurate or incomplete. Always verify every detail against the original prescription and consult a doctor or pharmacist. <strong>Never take medication based on chatbot output alone.</strong></p>
        </div>
      </div>
    </aside>
  );
}
