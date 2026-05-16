"use client";

import { DrugSearchSelect } from "@/components/prescription/drug-search-select";
import { PrescriptionListCard } from "@/components/prescription/prescription-list-card";
import { PrescriptionQRCodeWithDownload } from "@/components/prescription/prescription-qr-code";
import { PrescriptionScanPreview } from "@/components/prescription/prescription-scan-preview";
import { PrescriptionScanUpload } from "@/components/prescription/prescription-scan-upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth";
import type { Drug } from "@/features/drugs";
import {
  createPrescriptionSchema,
  DosageUnitLabels,
  MedicineFormLabels,
  NoteLabels,
  processdrugForAutoFill,
  TimingLabels,
  UsageLabels,
  useCreatePrescription,
  useReviewPrescription,
  useSearchPrescriptionsByDate,
  useSearchPrescriptionsByName,
  type CreatePrescriptionFormValues,
  type CreatePrescriptionRequest,
  type DrugInteractionDetail,
  type IntakeRequest
} from "@/features/prescriptions";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Loader2,
  Pencil,
  Pill,
  Plus,
  ScanLine,
  Search,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Type for drug entry in the preview list
interface DrugEntry {
  id: string;
  drugId: string;
  drugName: string;
  total: number;
  unit: string;
  quantitative: number;
  medicineForm: string;
  usage: string;
  timingList: { timing: string; quantity: number }[];
  noteList: string[];
}

// Step type for create flow
type CreateStep = "method-select" | "scan" | "scan-preview" | "manual";

const PATIENT_EMAIL_CONFIRMATION_TEXT =
  "Nếu có email, hệ thống sẽ gửi thông báo để bệnh nhân xác nhận đơn thuốc.";
const CALENDAR_OWNERSHIP_NOTE_TEXT =
  "Lịch Google Calendar sẽ được tạo trên tài khoản của bạn.";

export function PrescriptionPageScreen() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [successPrescriptionId, setSuccessPrescriptionId] = useState<string | null>(null);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [interactions, setInteractions] = useState<DrugInteractionDetail[]>([]);
  const [activeTab, setActiveTab] = useState<"create" | "history">("create");
  const [patientTab, setPatientTab] = useState<"scan" | "history">("scan");
  const [patientScanStep, setPatientScanStep] = useState<"upload" | "preview">("upload");
  const [patientScannedData, setPatientScannedData] = useState<CreatePrescriptionRequest | null>(null);
  const [patientScanError, setPatientScanError] = useState<string | null>(null);
  const [patientSuccessPrescriptionId, setPatientSuccessPrescriptionId] = useState<string | null>(null);
  const [historyPage, setHistoryPage] = useState(0);
  const [historyPageSize] = useState(20);

  // Create flow step state
  const [createStep, setCreateStep] = useState<CreateStep>("manual");
  const [scannedData, setScannedData] = useState<CreatePrescriptionRequest | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  
  // List of drugs added to the prescription
  const [drugList, setDrugList] = useState<DrugEntry[]>([]);
  
  // Single drug entry state
  const [currentDrug, setCurrentDrug] = useState<DrugEntry>({
    id: crypto.randomUUID(),
    drugId: "",
    drugName: "",
    total: 7,
    unit: "MG",
    quantitative: 500,
    medicineForm: "TABLET",
    usage: "ORAL",
    timingList: [{ timing: "MORNING", quantity: 1 }],
    noteList: [],
  });

  const isMedRole = user?.role === "MED" || user?.role === "ADMIN";

  // Queries
  // Date range for default view (past 2 years to future)
  const today = new Date();
  const pastDate = new Date();
  pastDate.setFullYear(today.getFullYear() - 2);
  const futureDate = new Date();
  futureDate.setFullYear(today.getFullYear() + 1);

  // Search by name query
  const {
    data: nameSearchResults,
    isLoading: nameSearchLoading,
  } = useSearchPrescriptionsByName(
    searchQuery || "",
    { page: historyPage, size: historyPageSize },
    isAuthenticated && !!searchQuery
  );

  // Default view: fetch by date query
  const {
    data: dateSearchResults,
    isLoading: dateSearchLoading,
  } = useSearchPrescriptionsByDate(
    pastDate.toISOString().split('T')[0],
    futureDate.toISOString().split('T')[0],
    { page: historyPage, size: historyPageSize },
    isAuthenticated && !searchQuery
  );

  const activePageData = searchQuery ? nameSearchResults : dateSearchResults;
  const prescriptions = searchQuery 
    ? nameSearchResults?.content || []
    : dateSearchResults?.content || [];

  const prescriptionsLoading = searchQuery ? nameSearchLoading : dateSearchLoading;
  const totalPages = activePageData?.totalPages ?? 0;
  const currentPage = activePageData?.number ?? historyPage;
  const isFirstPage = activePageData?.first ?? historyPage === 0;
  const isLastPage = activePageData?.last ?? totalPages <= 1;

  useEffect(() => {
    setHistoryPage(0);
  }, [searchQuery]);

  useEffect(() => {
    if (!prescriptionsLoading && totalPages > 0 && historyPage >= totalPages) {
      setHistoryPage(totalPages - 1);
    }
  }, [historyPage, prescriptionsLoading, totalPages]);

  // Mutations
  const createMutation = useCreatePrescription();
  const reviewMutation = useReviewPrescription();

  // --- Scan handlers ---
  const handleScanComplete = (result: CreatePrescriptionRequest) => {
    setScanError(null);
    setScannedData(result);
    setCreateStep("scan-preview");
  };

  const handleScanError = (error: string) => {
    setScanError(error);
  };

  const handleRescan = () => {
    setScannedData(null);
    setScanError(null);
    setCreateStep("scan");
  };

  const handleScanConfirm = async (editedData: CreatePrescriptionRequest) => {
    try {
      const result = await createMutation.mutateAsync(editedData);
      const prescription = (result as any).result || result;
      if ((prescription as any)?.id) {
        setSuccessPrescriptionId((prescription as any).id);
        setCreateStep("manual");
        setScannedData(null);
      }
    } catch (err) {
      console.error("Error creating prescription from scan:", err);
    }
  };

  const resetCreateFlow = () => {
    setCreateStep("manual");
    setScannedData(null);
    setScanError(null);
    setDrugList([]);
    form.reset({
      name: "",
      description: "",
      userId: "",
      patientEmailAddress: "",
      startDate: new Date().toISOString().split("T")[0],
      message: "",
      diagnosisNote: "",
      info: {},
      intakes: [],
    });
  };

  // Prescription form (patient info only)
  const form = useForm<CreatePrescriptionFormValues>({
    resolver: zodResolver(createPrescriptionSchema),
    defaultValues: {
      name: "",
      description: "",
      userId: "",
      patientEmailAddress: "",
      startDate: new Date().toISOString().split("T")[0],
      message: "",
      diagnosisNote: "",
      info: {},
      intakes: [],
    },
  });

  // Add current drug to the list
  const handleAddDrug = () => {
    if (!currentDrug.drugId || !currentDrug.drugName) {
      return;
    }
    
    setDrugList([...drugList, currentDrug]);
    
    // Reset current drug for new entry
    setCurrentDrug({
      id: crypto.randomUUID(),
      drugId: "",
      drugName: "",
      total: 7,
      unit: "MG",
      quantitative: 500,
      medicineForm: "TABLET",
      usage: "ORAL",
      timingList: [{ timing: "MORNING", quantity: 1 }],
      noteList: [],
    });
  };

  // Remove drug from list
  const handleRemoveDrug = (id: string) => {
    setDrugList(drugList.filter(d => d.id !== id));
  };

  // Handle form submission
  const onSubmit = async (values: CreatePrescriptionFormValues) => {
    if (drugList.length === 0) {
      return;
    }

    // Convert drugList to intakes format
    const intakes: IntakeRequest[] = drugList.map(drug => ({
      drugName: drug.drugName,
      drugId: drug.drugId,
      total: drug.total,
      unit: drug.unit as any,
      quantitative: drug.quantitative,
      medicineForm: drug.medicineForm as any,
      usage: drug.usage as any,
      timingList: drug.timingList as any,
      noteList: drug.noteList as any,
    }));

    // Check for drug interactions if more than 1 drug
    const drugIds = drugList.map(d => parseInt(d.drugId)).filter(id => !isNaN(id));
    
    if (drugIds.length > 1) {
      try {
        const reviewResult = await reviewMutation.mutateAsync(drugIds);
        const interactionList =
          (reviewResult as any)?.result?.drugInteractionResponseList ??
          (reviewResult as any)?.drugInteractionResponseList ??
          [];

        const matchedInteractions = interactionList.filter(
          (interaction: DrugInteractionDetail) => interaction.matchedFromSelected !== false
        );

        if (matchedInteractions.length > 0) {
          setInteractions(matchedInteractions);
          setShowInteractionModal(true);
          return;
        }
      } catch (error) {
        console.error("Error checking interactions:", error);
      }
    }

    // No interactions, proceed with creation
    await createPrescription({ ...values, intakes });
  };

  const createPrescription = async (values: CreatePrescriptionFormValues) => {
    try {
      console.log("Creating prescription with values:", values);
      const result = await createMutation.mutateAsync(values);
      console.log("Create prescription result:", result);
      
      // Handle both wrapped { result: {...} } and direct Prescription response
      const prescription = result.result || result;
      console.log("Prescription data:", prescription);
      
      if (prescription?.id) {
        setSuccessPrescriptionId(prescription.id);
        form.reset();
        setDrugList([]);
      } else {
        console.error("No prescription ID in response:", result);
      }
    } catch (error) {
      console.error("Error creating prescription:", error);
    }
  };

  const handleConfirmWithInteractions = async () => {
    setShowInteractionModal(false);
    const values = form.getValues();
    const intakes: IntakeRequest[] = drugList.map(drug => ({
      drugName: drug.drugName,
      drugId: drug.drugId,
      total: drug.total,
      unit: drug.unit as any,
      quantitative: drug.quantitative,
      medicineForm: drug.medicineForm as any,
      usage: drug.usage as any,
      timingList: drug.timingList as any,
      noteList: drug.noteList as any,
    }));
    await createPrescription({ ...values, intakes });
  };



  // Toggle timing in current drug
  const toggleTiming = (timing: string) => {
    const exists = currentDrug.timingList.find(t => t.timing === timing);
    if (exists) {
      setCurrentDrug({
        ...currentDrug,
        timingList: currentDrug.timingList.filter(t => t.timing !== timing),
      });
    } else {
      setCurrentDrug({
        ...currentDrug,
        timingList: [...currentDrug.timingList, { timing, quantity: 1 }],
      });
    }
  };

  // Render for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="relative pb-24">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#04121f]/85 via-[#0a2542]/90 to-[#071b2f]" />
          <div className="container relative flex flex-col items-center gap-6 py-12 text-center text-secondary dark:text-white">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mx-auto max-w-2xl space-y-4"
            >
              <h1 className="text-3xl font-heading font-semibold leading-tight text-secondary dark:text-white md:text-4xl">
                Quản lý đơn thuốc
              </h1>
              <p className="text-sm text-secondary/80 dark:text-white/80 md:text-base">
                Vui lòng đăng nhập để xem và quản lý đơn thuốc của bạn.
              </p>
              <Button asChild className="mt-4 rounded-full">
                <a href="/signin">Đăng nhập</a>
              </Button>
            </motion.div>
          </div>
        </section>
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
              {isMedRole ? "Bác sĩ / Dược sĩ" : "Bệnh nhân"}
            </p>
            <h1 className="text-3xl font-heading font-semibold leading-tight text-secondary dark:text-white md:text-4xl">
              {isMedRole ? "Kê đơn thuốc" : "Đơn thuốc của tôi"}
            </h1>
            <p className="text-sm text-secondary/80 dark:text-white/80 md:text-base">
              {isMedRole
                ? "Tạo và quản lý đơn thuốc cho bệnh nhân với kiểm tra tương tác thuốc tự động."
                : "Chụp ảnh, tải lên hoặc quét mã QR để lưu đơn thuốc của bạn."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content based on role */}
      {isMedRole ? (
        // MED Role: Show tabs for create and history
        <section className="container mt-12 space-y-8">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-border/50 pb-4">
            <Button
              variant={activeTab === "create" ? "default" : "ghost"}
              onClick={() => setActiveTab("create")}
              className="rounded-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Kê đơn mới
            </Button>
            <Button
              variant={activeTab === "history" ? "default" : "ghost"}
              onClick={() => setActiveTab("history")}
              className="rounded-full"
            >
              <Clock className="mr-2 h-4 w-4" />
              Lịch sử kê đơn
            </Button>
          </div>

          {/* Tab Content */}
          {activeTab === "create" ? (
          <div>
            {/* -- Success State -- */}
            {successPrescriptionId ? (
              <Card className="border-none bg-white/90 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/60">
                <CardContent className="flex flex-col items-center gap-6 py-8">
                  <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                  <p className="text-center text-lg font-medium text-secondary dark:text-white">
                    Đơn thuốc đã được tạo thành công!
                  </p>
                  <PrescriptionQRCodeWithDownload
                    prescriptionId={successPrescriptionId}
                    size="lg"
                  />
                  <p className="text-center text-sm text-muted-foreground">
                    Quét mã QR hoặc tải xuống để chia sẻ đơn thuốc
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={() => {
                        setSuccessPrescriptionId(null);
                        resetCreateFlow();
                      }}
                    >
                      Tạo đơn mới
                    </Button>
                    <Button asChild className="rounded-full">
                      <a href={`/prescription/${successPrescriptionId}`}>Xem chi tiết</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
            <AnimatePresence mode="wait">
              {/* ======= STEP: method-select ======= */}
              {createStep === "method-select" && (
                <motion.div
                  key="method-select"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-6 md:grid-cols-2"
                >
                  {/* Scan Card */}
                  <button
                    type="button"
                    onClick={() => { setScanError(null); setCreateStep("scan"); }}
                    className="group relative flex flex-col items-center gap-5 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-10 text-center transition-all hover:border-primary hover:bg-primary/10 dark:border-primary/30 dark:bg-primary/10 dark:hover:border-primary dark:hover:bg-primary/15"
                  >
                    <div className="rounded-full bg-primary/15 p-5 transition-transform group-hover:scale-105">
                      <ScanLine className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-secondary dark:text-white">
                        Quét đơn thuốc
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Chụp ảnh đơn thuốc — AI sẽ tự động trích xuất thông tin
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Nhanh hơn · Dùng AI
                    </Badge>
                  </button>

                  {/* Manual Card */}
                  <button
                    type="button"
                    onClick={() => setCreateStep("manual")}
                    className="group relative flex flex-col items-center gap-5 rounded-2xl border-2 border-dashed border-border/50 bg-muted/20 p-10 text-center transition-all hover:border-foreground/40 hover:bg-muted/40 dark:border-white/15 dark:bg-white/5 dark:hover:border-white/30"
                  >
                    <div className="rounded-full bg-muted p-5 transition-transform group-hover:scale-105">
                      <Pencil className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-secondary dark:text-white">
                        Tạo đơn thuốc
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Tìm thuốc và nhập thông tin liều dùng từng bước
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Kiểm soát đầy đủ
                    </Badge>
                  </button>
                </motion.div>
              )}

              {/* ======= STEP: scan (upload) ======= */}
              {createStep === "scan" && (
                <motion.div
                  key="scan"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-secondary dark:text-white">
                      Quét ảnh đơn thuốc
                    </h3>
                  </div>

                  {scanError && (
                    <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
                      <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
                      <p className="text-sm text-destructive">{scanError}</p>
                    </div>
                  )}

                  <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg text-secondary dark:text-white">
                        <Camera className="h-5 w-5" />
                        Tải ảnh đơn thuốc
                      </CardTitle>
                      <CardDescription>
                        Hỗ trợ ảnh chụp rõ nét · AI sẽ tự đọc và điền thông tin
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PrescriptionScanUpload
                        onScanComplete={handleScanComplete}
                        onError={handleScanError}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* ======= STEP: scan-preview ======= */}
              {createStep === "scan-preview" && scannedData && (
                <motion.div
                  key="scan-preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <PrescriptionScanPreview
                    scannedData={scannedData}
                    onConfirm={handleScanConfirm}
                    onRescan={handleRescan}
                    isSubmitting={createMutation.isPending}
                    patientEmailHelperText={PATIENT_EMAIL_CONFIRMATION_TEXT}
                    calendarOwnershipNote={CALENDAR_OWNERSHIP_NOTE_TEXT}
                    showCalendarOwnershipNote={false}
                  />
                </motion.div>
              )}

              {/* ======= STEP: manual ======= */}
              {createStep === "manual" && (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-1"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-lg font-semibold text-secondary dark:text-white">
                      Tạo đơn thuốc
                    </h3>
                  </div>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Left Column: Form */}
            <div className="space-y-6">
              {/* Patient Info Card */}
              <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
                <CardHeader>
                  <CardTitle className="text-2xl text-secondary dark:text-white">
                    Thông tin đơn thuốc
                  </CardTitle>
                  <CardDescription className="text-secondary/75 dark:text-muted-foreground">
                    Điền thông tin bệnh nhân và chẩn đoán
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên đơn thuốc</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="VD: Đơn thuốc cảm cúm" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày bắt đầu</FormLabel>
                              <FormControl>
                                <Input {...field} type="date" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="diagnosisNote"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chẩn đoán</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="VD: Cảm cúm thông thường" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lời dặn</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Lời dặn cho bệnh nhân..."
                                rows={2}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="patientEmailAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email bệnh nhân (không bắt buộc)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="patient@example.com"
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              {PATIENT_EMAIL_CONFIRMATION_TEXT}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Drug Entry Card */}
              <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-secondary dark:text-white">
                    <Plus className="h-5 w-5" />
                    Thêm thuốc vào đơn
                  </CardTitle>
                  <CardDescription>
                    Chọn thuốc và nhập thông tin sử dụng
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Drug Search */}
                  <div>
                    <label className="text-sm font-medium">Chọn thuốc</label>
                    <DrugSearchSelect
                      value={{
                        drugId: currentDrug.drugId,
                        drugName: currentDrug.drugName,
                      }}
                      onSelect={(drug) => {
                        setCurrentDrug({
                          ...currentDrug,
                          drugId: drug.drugId,
                          drugName: drug.drugName,
                        });
                      }}
                      onDrugDetailsLoaded={(drugDetails: Drug) => {
                        // Auto-fill form fields from drug details
                        const autoFillData = processdrugForAutoFill(
                          drugDetails.name,
                          drugDetails.metadata as Record<string, unknown>
                        );
                        
                        setCurrentDrug(prev => ({
                          ...prev,
                          // Only update if we got valid data
                          quantitative: autoFillData.quantitative ?? prev.quantitative,
                          unit: autoFillData.unit ?? prev.unit,
                          medicineForm: autoFillData.medicineForm ?? prev.medicineForm,
                          usage: autoFillData.usage ?? prev.usage,
                        }));
                      }}
                      placeholder="Tìm kiếm thuốc theo tên..."
                    />
                  </div>

                  {/* Dosage Info */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium">Tổng số lượng</label>
                      <Input
                        type="number"
                        min={1}
                        value={currentDrug.total || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentDrug({ ...currentDrug, total: val === "" ? 0 : parseInt(val) });
                        }}
                        onBlur={(e) => {
                          if (!currentDrug.total || currentDrug.total < 1) {
                            setCurrentDrug({ ...currentDrug, total: 1 });
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Định lượng</label>
                      <Input
                        type="number"
                        min={1}
                        value={currentDrug.quantitative || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentDrug({ ...currentDrug, quantitative: val === "" ? 0 : parseInt(val) });
                        }}
                        onBlur={(e) => {
                          if (!currentDrug.quantitative || currentDrug.quantitative < 1) {
                            setCurrentDrug({ ...currentDrug, quantitative: 1 });
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Đơn vị</label>
                      <Select
                        value={currentDrug.unit}
                        onValueChange={(value) => setCurrentDrug({ ...currentDrug, unit: value })}
                      >
                        <SelectTrigger>
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

                  {/* Form and Usage */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Dạng thuốc</label>
                      <Select
                        value={currentDrug.medicineForm}
                        onValueChange={(value) => setCurrentDrug({ ...currentDrug, medicineForm: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(MedicineFormLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Cách dùng</label>
                      <Select
                        value={currentDrug.usage}
                        onValueChange={(value) => setCurrentDrug({ ...currentDrug, usage: value })}
                      >
                        <SelectTrigger>
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

                  {/* Timing */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Thời điểm uống</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {Object.entries(TimingLabels).map(([key, label]) => {
                        const isSelected = currentDrug.timingList.some(t => t.timing === key);
                        return (
                          <Badge
                            key={key}
                            variant={isSelected ? "default" : "outline"}
                            className="cursor-pointer px-3 py-1"
                            onClick={() => toggleTiming(key)}
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            {label}
                          </Badge>
                        );
                      })}
                    </div>
                    {/* Quantity per timing */}
                    {currentDrug.timingList.length > 0 && (
                      <div className="grid gap-2 mt-2 p-3 rounded-lg bg-muted/30 dark:bg-slate-900/50">
                        <p className="text-xs text-muted-foreground mb-1">Số lượng mỗi lần uống:</p>
                        {currentDrug.timingList.map((timing) => (
                          <div key={timing.timing} className="flex items-center gap-2">
                            <span className="text-sm w-16">{TimingLabels[timing.timing as keyof typeof TimingLabels]}</span>
                            <Input
                              type="number"
                              min={1}
                              value={timing.quantity || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCurrentDrug({
                                  ...currentDrug,
                                  timingList: currentDrug.timingList.map(t =>
                                    t.timing === timing.timing
                                      ? { ...t, quantity: val === "" ? 0 : parseInt(val) }
                                      : t
                                  ),
                                });
                              }}
                              onBlur={() => {
                                setCurrentDrug({
                                  ...currentDrug,
                                  timingList: currentDrug.timingList.map(t =>
                                    t.timing === timing.timing && (!t.quantity || t.quantity < 1)
                                      ? { ...t, quantity: 1 }
                                      : t
                                  ),
                                });
                              }}
                              className="w-20 h-8"
                              wrapperClassName="w-20 !h-8 !px-2"
                            />
                            <span className="text-sm text-muted-foreground">
                              {MedicineFormLabels[currentDrug.medicineForm as keyof typeof MedicineFormLabels] || 'viên'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ghi chú</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(NoteLabels).map(([key, label]) => {
                        const isSelected = currentDrug.noteList.includes(key);
                        return (
                          <Badge
                            key={key}
                            variant={isSelected ? "default" : "outline"}
                            className="cursor-pointer px-3 py-1"
                            onClick={() => {
                              if (isSelected) {
                                setCurrentDrug({
                                  ...currentDrug,
                                  noteList: currentDrug.noteList.filter(n => n !== key),
                                });
                              } else {
                                setCurrentDrug({
                                  ...currentDrug,
                                  noteList: [...currentDrug.noteList, key],
                                });
                              }
                            }}
                          >
                            {label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* Add Button */}
                  <Button
                    type="button"
                    className="w-full rounded-full"
                    onClick={handleAddDrug}
                    disabled={!currentDrug.drugId}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm thuốc vào đơn
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Preview */}
            <div className="space-y-6">
              {/* Drug List Preview */}
              <>
                {/* Drug List Preview */}
                <Card className="border-none bg-white/90 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/60">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl text-secondary dark:text-white">
                        <Eye className="h-5 w-5" />
                        Xem trước đơn thuốc
                      </CardTitle>
                      <CardDescription>
                        {drugList.length > 0
                          ? `${drugList.length} thuốc trong đơn`
                          : "Chưa có thuốc nào được thêm"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {drugList.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                          <Pill className="mx-auto mb-3 h-10 w-10 opacity-50" />
                          <p>Thêm thuốc từ form bên trái</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {drugList.map((drug, index) => (
                            <div
                              key={drug.id}
                              className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-4 dark:border-white/10 dark:bg-white/5"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                      #{index + 1}
                                    </span>
                                    <h4 className="font-semibold text-secondary dark:text-white">
                                      {drug.drugName}
                                    </h4>
                                  </div>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {drug.quantitative} {DosageUnitLabels[drug.unit as keyof typeof DosageUnitLabels]} × {drug.total} {MedicineFormLabels[drug.medicineForm as keyof typeof MedicineFormLabels]}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {UsageLabels[drug.usage as keyof typeof UsageLabels]}
                                  </p>
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {drug.timingList.map((t) => (
                                      <Badge key={t.timing} variant="secondary" className="text-xs">
                                        {TimingLabels[t.timing as keyof typeof TimingLabels]}
                                      </Badge>
                                    ))}
                                    {drug.noteList.map((n) => (
                                      <Badge key={n} variant="outline" className="text-xs">
                                        {NoteLabels[n as keyof typeof NoteLabels]}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveDrug(drug.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Create Button */}
                  {drugList.length > 0 && (
                    <Button
                      size="lg"
                      className="w-full rounded-full text-lg py-6"
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={createMutation.isPending || reviewMutation.isPending}
                    >
                      {(createMutation.isPending || reviewMutation.isPending) && (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      )}
                      Tạo đơn thuốc ({drugList.length} thuốc)
                    </Button>
                  )}

                  {/* Instructions */}
                  <Card className="border-none bg-white/80 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/50">
                    <CardHeader>
                      <CardTitle className="text-lg text-secondary dark:text-white">
                        Hướng dẫn
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-secondary/80 dark:text-muted-foreground">
                      <p><strong>1.</strong> Điền thông tin bệnh nhân ở trên.</p>
                      <p><strong>2.</strong> Tìm và chọn thuốc, nhập liều lượng.</p>
                      <p><strong>3.</strong> Chọn thời điểm uống và ghi chú.</p>
                      <p><strong>4.</strong> Nhấn "Thêm thuốc" để thêm vào đơn.</p>
                      <p><strong>5.</strong> Xem trước và nhấn "Tạo đơn thuốc".</p>
                    </CardContent>
                  </Card>
                </>
            </div>
          </div>
          </motion.div>
          )}
            </AnimatePresence>
            )}
          </div>
          ) : (
          /* History Tab Content */
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-heading font-semibold text-secondary dark:text-white">
                Danh sách đơn thuốc đã kê
              </h2>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm đơn thuốc..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-full"
                />
              </div>
            </div>

            {prescriptionsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : prescriptions.length > 0 ? (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {prescriptions.map((prescription, index) => (
                    <PrescriptionListCard
                      key={prescription.id}
                      prescription={prescription}
                      index={index}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setHistoryPage((prev) => Math.max(0, prev - 1))}
                      disabled={prescriptionsLoading || isFirstPage}
                      className="rounded-full"
                    >
                      Trước
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Trang {currentPage + 1}/{Math.max(1, totalPages)}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setHistoryPage((prev) => prev + 1)}
                      disabled={prescriptionsLoading || isLastPage}
                      className="rounded-full"
                    >
                      Sau
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card className="mx-auto max-w-lg border-none bg-white/95 shadow-card dark:bg-secondary/70">
                <CardContent className="py-12 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-secondary dark:text-white">
                    Chưa có đơn thuốc
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Bạn chưa kê đơn thuốc nào.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          )}
        </section>
      ) : (
        // USER Role: Tabs — Scan image | My prescriptions
        <section className="container mt-12 space-y-8">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-border/50 pb-4">
            <Button
              variant={patientTab === "scan" ? "default" : "ghost"}
              onClick={() => setPatientTab("scan")}
              className="rounded-full"
            >
              <ScanLine className="mr-2 h-4 w-4" />
              Quét đơn thuốc
            </Button>
            <Button
              variant={patientTab === "history" ? "default" : "ghost"}
              onClick={() => setPatientTab("history")}
              className="rounded-full"
            >
              <Clock className="mr-2 h-4 w-4" />
              Đơn thuốc của tôi
            </Button>
          </div>

          {patientTab === "scan" ? (
            <div>
              {/* ---- Success state ---- */}
              {patientSuccessPrescriptionId ? (
                <Card className="border-none bg-white/90 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/60">
                  <CardContent className="flex flex-col items-center gap-6 py-8">
                    <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                    <p className="text-center text-lg font-medium text-secondary dark:text-white">
                      Đơn thuốc đã được lưu thành công!
                    </p>
                    <PrescriptionQRCodeWithDownload
                      prescriptionId={patientSuccessPrescriptionId}
                      size="lg"
                    />
                    <p className="text-center text-sm text-muted-foreground">
                      Quét mã QR hoặc tải xuống để chia sẻ đơn thuốc
                    </p>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => {
                          setPatientSuccessPrescriptionId(null);
                          setPatientScanStep("upload");
                          setPatientScannedData(null);
                          setPatientScanError(null);
                        }}
                      >
                        Quét đơn khác
                      </Button>
                      <Button asChild className="rounded-full">
                        <a href={`/prescription/${patientSuccessPrescriptionId}`}>Xem chi tiết</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <AnimatePresence mode="wait">
                  {/* ---- STEP: upload ---- */}
                  {patientScanStep === "upload" && (
                    <motion.div
                      key="patient-upload"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      {patientScanError && (
                        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
                          <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
                          <p className="text-sm text-destructive">{patientScanError}</p>
                        </div>
                      )}
                      <Card className="border-none bg-white/95 shadow-card ring-1 ring-border/15 backdrop-blur-sm dark:bg-secondary/70">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg text-secondary dark:text-white">
                            <Camera className="h-5 w-5" />
                            Tải ảnh đơn thuốc
                          </CardTitle>
                          <CardDescription>
                            Hỗ trợ ảnh chụp rõ nét · AI sẽ tự đọc và điền thông tin
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <PrescriptionScanUpload
                            onScanComplete={(result) => {
                              setPatientScanError(null);
                              setPatientScannedData(result);
                              setPatientScanStep("preview");
                            }}
                            onError={(err) => setPatientScanError(err)}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* ---- STEP: preview ---- */}
                  {patientScanStep === "preview" && patientScannedData && (
                    <motion.div
                      key="patient-preview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <PrescriptionScanPreview
                        scannedData={patientScannedData}
                        showStorageNotice
                        showPatientEmailInput={false}
                        showCalendarOwnershipNote
                        calendarOwnershipNote={CALENDAR_OWNERSHIP_NOTE_TEXT}
                        onConfirm={async (editedData) => {
                          try {
                            const result = await createMutation.mutateAsync(editedData);
                            const prescription = (result as any).result || result;
                            if ((prescription as any)?.id) {
                              setPatientSuccessPrescriptionId((prescription as any).id);
                              setPatientScanStep("upload");
                              setPatientScannedData(null);
                            }
                          } catch (err) {
                            console.error("Error creating prescription from scan:", err);
                          }
                        }}
                        onRescan={() => {
                          setPatientScannedData(null);
                          setPatientScanError(null);
                          setPatientScanStep("upload");
                        }}
                        isSubmitting={createMutation.isPending}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ) : (
            /* History tab */
            <div>
              <div className="mb-6 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm đơn thuốc..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-full"
                  />
                </div>
              </div>

              {prescriptionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : prescriptions.length > 0 ? (
                <>
                  <div className="grid gap-6 md:grid-cols-2">
                    {prescriptions.map((prescription, index) => (
                      <PrescriptionListCard
                        key={prescription.id}
                        prescription={prescription}
                        index={index}
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setHistoryPage((prev) => Math.max(0, prev - 1))}
                        disabled={prescriptionsLoading || isFirstPage}
                        className="rounded-full"
                      >
                        Trước
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Trang {currentPage + 1}/{Math.max(1, totalPages)}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setHistoryPage((prev) => prev + 1)}
                        disabled={prescriptionsLoading || isLastPage}
                        className="rounded-full"
                      >
                        Sau
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <Card className="mx-auto max-w-lg border-none bg-white/95 shadow-card dark:bg-secondary/70">
                  <CardContent className="py-12 text-center">
                    <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-secondary dark:text-white">
                      Chưa có đơn thuốc
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Bạn chưa có đơn thuốc nào.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </section>
      )}

      {/* Drug Interaction Warning Modal */}
      <AnimatePresence>
        {showInteractionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="w-full max-w-2xl rounded-2xl border border-[var(--glass-border)] bg-white/95 p-6 shadow-2xl dark:border-white/10 dark:bg-secondary/90"
            >
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-8 w-8 text-amber-500 shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-secondary dark:text-white">
                    Phát hiện tương tác thuốc
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Các thuốc trong đơn có thể có tương tác với nhau.
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="max-h-64 space-y-3 overflow-y-auto">
                {interactions.map((interaction, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4"
                  >
                    <p className="font-semibold text-amber-800 dark:text-amber-200">
                      Mức độ: {interaction.mucDoNghiemTrong}
                    </p>
                    <p className="mt-1 text-sm">
                      <strong>Hậu quả:</strong> {interaction.hauQuaCuaTuongTac}
                    </p>
                    <p className="text-sm">
                      <strong>Cơ chế:</strong> {interaction.coCheTuongTac}
                    </p>
                    <p className="text-sm">
                      <strong>Xử trí:</strong> {interaction.xuTriTuongTac}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setShowInteractionModal(false)}
                >
                  Hủy và sửa đơn
                </Button>
                <Button
                  className="rounded-full"
                  onClick={handleConfirmWithInteractions}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Vẫn tiếp tục tạo
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


