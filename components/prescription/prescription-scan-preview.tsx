"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CreatePrescriptionRequest, IntakeRequest } from "@/features/prescriptions";
import {
  DosageUnitLabels,
  MedicineFormLabels,
  NoteLabels,
  TimingLabels,
  UsageLabels,
} from "@/features/prescriptions";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Calendar,
  Clock,
  Edit2,
  FileText,
  Pill,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";

interface PrescriptionScanPreviewProps {
  scannedData: CreatePrescriptionRequest;
  onConfirm: (editedData: CreatePrescriptionRequest) => void;
  onRescan: () => void;
  isSubmitting?: boolean;
}

export function PrescriptionScanPreview({
  scannedData,
  onConfirm,
  onRescan,
  isSubmitting = false,
}: PrescriptionScanPreviewProps) {
  // Editable state — initialize from scanned data
  const [name, setName] = useState(scannedData.name ?? "");
  const [description, setDescription] = useState(scannedData.description ?? "");
  const [startDate, setStartDate] = useState(
    scannedData.startDate ?? new Date().toISOString().split("T")[0]
  );
  const [diagnosisNote, setDiagnosisNote] = useState(scannedData.diagnosisNote ?? "");
  const [message, setMessage] = useState(scannedData.message ?? "");
  const [patientEmailAddress, setPatientEmailAddress] = useState(
    scannedData.patientEmailAddress ?? ""
  );
  const [intakes, setIntakes] = useState<IntakeRequest[]>(
    (scannedData.intakes ?? []).map((intake) => ({
      ...intake,
      drugId: intake.drugId ?? "",
      noteList: (intake.noteList ?? []) as any,
      timingList: (intake.timingList ?? []) as any,
    }))
  );

  const handleRemoveIntake = (index: number) => {
    setIntakes(intakes.filter((_, i) => i !== index));
  };

  const handleUpdateIntake = (index: number, updated: Partial<IntakeRequest>) => {
    setIntakes(intakes.map((intake, i) => (i === index ? { ...intake, ...updated } : intake)));
  };

  const handleConfirm = () => {
    onConfirm({
      ...scannedData,
      name,
      description,
      startDate,
      diagnosisNote,
      message,
      patientEmailAddress,
      intakes,
    });
  };

  const hasIntakes = intakes.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* AI Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 dark:border-primary/20 dark:bg-primary/10">
        <Bot className="h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-semibold text-secondary dark:text-white">
            Kết quả phân tích AI
          </p>
          <p className="text-xs text-muted-foreground">
            Gemini đã trích xuất thông tin bên dưới. Vui lòng kiểm tra và chỉnh sửa nếu cần trước khi tạo đơn.
          </p>
        </div>
      </div>

      {/* Prescription Info */}
      <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-secondary dark:text-white">
            <FileText className="h-5 w-5" />
            Thông tin đơn thuốc
          </CardTitle>
          <CardDescription>Chỉnh sửa các trường nếu AI đọc chưa chính xác</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tên đơn thuốc</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên đơn thuốc..."
              className="mt-1"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Ngày bắt đầu</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Chẩn đoán</label>
              <Input
                value={diagnosisNote}
                onChange={(e) => setDiagnosisNote(e.target.value)}
                placeholder="Chẩn đoán bệnh..."
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Lời dặn bác sĩ</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Lời dặn cho bệnh nhân..."
              rows={2}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              Email bệnh nhân{" "}
              <span className="ml-1 text-muted-foreground font-normal">(không bắt buộc)</span>
            </label>
            <Input
              type="email"
              value={patientEmailAddress}
              onChange={(e) => setPatientEmailAddress(e.target.value)}
              placeholder="patient@example.com"
              className="mt-1"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Hệ thống sẽ gửi email xác nhận nếu có địa chỉ.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Drugs List */}
      <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-secondary dark:text-white">
            <Pill className="h-5 w-5" />
            Thuốc đã nhận diện ({intakes.length})
          </CardTitle>
          <CardDescription>
            {hasIntakes
              ? "Kiểm tra lại thông tin mỗi loại thuốc bên dưới"
              : "AI không nhận diện được thuốc nào — bạn có thể tạo đơn và thêm thủ công"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasIntakes && (
            <div className="flex items-center gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Không tìm thấy thuốc. Bạn vẫn có thể tiếp tục và thêm thuốc thủ công.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {intakes.map((intake, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-xl border border-border/50 bg-muted/20 p-4 dark:border-white/10 dark:bg-white/5"
              >
                {/* Drug Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <Input
                      value={intake.drugName}
                      onChange={(e) => handleUpdateIntake(index, { drugName: e.target.value })}
                      className="h-8 border-0 bg-transparent px-1 font-semibold text-secondary dark:text-white focus-visible:ring-1"
                      placeholder="Tên thuốc..."
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveIntake(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {/* Total */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Tổng số</label>
                    <Input
                      type="number"
                      min={1}
                      value={intake.total}
                      onChange={(e) => handleUpdateIntake(index, { total: parseInt(e.target.value) || 1 })}
                      className="mt-1 h-8"
                    />
                  </div>

                  {/* Quantitative */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Định lượng</label>
                    <Input
                      type="number"
                      min={1}
                      value={intake.quantitative}
                      onChange={(e) => handleUpdateIntake(index, { quantitative: parseInt(e.target.value) || 1 })}
                      className="mt-1 h-8"
                    />
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Đơn vị</label>
                    <Select
                      value={intake.unit}
                      onValueChange={(v) => handleUpdateIntake(index, { unit: v as any })}
                    >
                      <SelectTrigger className="mt-1 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DosageUnitLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {/* Medicine Form */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Dạng thuốc</label>
                    <Select
                      value={intake.medicineForm}
                      onValueChange={(v) => handleUpdateIntake(index, { medicineForm: v as any })}
                    >
                      <SelectTrigger className="mt-1 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(MedicineFormLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Usage */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Cách dùng</label>
                    <Select
                      value={intake.usage}
                      onValueChange={(v) => handleUpdateIntake(index, { usage: v as any })}
                    >
                      <SelectTrigger className="mt-1 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(UsageLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Timing Badges */}
                {intake.timingList && intake.timingList.length > 0 && (
                  <div className="mt-3">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Lịch uống
                    </label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {intake.timingList.map((t: any, ti: number) => (
                        <Badge key={ti} variant="secondary" className="text-xs gap-1">
                          {TimingLabels[t.timing as keyof typeof TimingLabels] ?? t.timing}
                          <span className="font-bold">×{t.quantity}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Note Badges */}
                {intake.noteList && intake.noteList.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {intake.noteList.map((n: any, ni: number) => (
                        <Badge key={ni} variant="outline" className="text-xs">
                          {NoteLabels[n as keyof typeof NoteLabels] ?? n}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          className="rounded-full gap-2"
          onClick={onRescan}
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4" />
          Quét lại
        </Button>

        <Button
          className="rounded-full py-6 text-base gap-2 sm:flex-1"
          onClick={handleConfirm}
          disabled={isSubmitting || !name}
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Pill className="h-5 w-5" />
              </motion.div>
              Đang tạo đơn thuốc...
            </>
          ) : (
            <>
              <ArrowRight className="h-5 w-5" />
              Tạo đơn thuốc ({intakes.length} thuốc)
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
