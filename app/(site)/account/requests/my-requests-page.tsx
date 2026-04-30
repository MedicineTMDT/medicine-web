"use client";

import { useAuth } from "@/features/auth";
import type { RequestResponse, TypeOfRequest } from "@/features/requests";
import { useUserRequests } from "@/features/requests";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    FileEdit,
    HelpCircle,
    Loader2,
    MessageSquarePlus,
    PlusCircle,
    RefreshCw,
    Send,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// ============================================
// Constants
// ============================================

const TYPE_CONFIG: Record<TypeOfRequest, { label: string; icon: typeof FileEdit; colorClass: string }> = {
  EDIT: {
    label: "Chỉnh sửa",
    icon: FileEdit,
    colorClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  ADD: {
    label: "Bổ sung",
    icon: PlusCircle,
    colorClass: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  QUESTION: {
    label: "Câu hỏi",
    icon: HelpCircle,
    colorClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
};

// ============================================
// RequestCard
// ============================================

function RequestCard({ request, index }: { request: RequestResponse; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const typeConfig = TYPE_CONFIG[request.typeOfRequest] || TYPE_CONFIG.QUESTION;
  const TypeIcon = typeConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="group rounded-xl border border-border/20 bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-secondary/80"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Type icon */}
          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", typeConfig.colorClass)}>
            <TypeIcon className="h-4 w-4" />
          </div>

          {/* Title & type badge */}
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-secondary dark:text-white line-clamp-1 text-sm">
              {request.title}
            </h4>
            <span className={cn("mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", typeConfig.colorClass)}>
              {typeConfig.label}
            </span>
          </div>
        </div>

        {/* Status badge */}
        <div className="shrink-0">
          {request.proceed ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Đã xử lý
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <Clock className="h-3.5 w-3.5" />
              Đang chờ
            </span>
          )}
        </div>
      </div>

      {/* Content preview */}
      <div className="mt-3 pl-12">
        <p
          className={cn(
            "text-sm text-muted-foreground leading-relaxed",
            !expanded && "line-clamp-2"
          )}
        >
          {request.content}
        </p>
        {request.content.length > 120 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-xs font-medium text-primary hover:underline"
          >
            {expanded ? "Thu gọn" : "Xem thêm"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// MyRequestsPage
// ============================================

export function MyRequestsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, isLoading, error, refetch, isRefetching } = useUserRequests(
    user?.id,
    page,
    pageSize
  );

  const requests = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-secondary dark:text-white">
            Yêu cầu của tôi
          </h1>
          <p className="text-muted-foreground">
            Theo dõi các yêu cầu chỉnh sửa và bổ sung dữ liệu thuốc bạn đã gửi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh button */}
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="inline-flex items-center gap-2 rounded-lg border border-border/30 px-3 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-primary disabled:opacity-50"
          >
            <RefreshCw className={cn("h-4 w-4", isRefetching && "animate-spin")} />
            Làm mới
          </button>

          {/* New request link */}
          <Link
            href="/drugs-info"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
            Gửi yêu cầu mới
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      {!isLoading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3"
        >
          <div className="rounded-xl border border-border/20 bg-white p-4 shadow-sm dark:bg-secondary/80">
            <p className="text-sm text-muted-foreground">Tổng yêu cầu</p>
            <p className="mt-1 text-2xl font-bold text-secondary dark:text-white">
              {totalElements}
            </p>
          </div>
          <div className="rounded-xl border border-border/20 bg-white p-4 shadow-sm dark:bg-secondary/80">
            <p className="text-sm text-muted-foreground">Đang chờ xử lý</p>
            <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
              {requests.filter((r) => !r.proceed).length}
              {page === 0 && totalPages > 1 && <span className="text-sm font-normal text-muted-foreground">+</span>}
            </p>
          </div>
          <div className="rounded-xl border border-border/20 bg-white p-4 shadow-sm dark:bg-secondary/80 col-span-2 sm:col-span-1">
            <p className="text-sm text-muted-foreground">Đã xử lý</p>
            <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
              {requests.filter((r) => r.proceed).length}
              {page === 0 && totalPages > 1 && <span className="text-sm font-normal text-muted-foreground">+</span>}
            </p>
          </div>
        </motion.div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Đang tải yêu cầu...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 py-12 text-center"
        >
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <p className="font-medium text-destructive">Không thể tải yêu cầu</p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Đã xảy ra lỗi"}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Thử lại
          </button>
        </motion.div>
      )}

      {/* Empty state */}
      {!isLoading && !error && requests.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border/40 bg-white/50 py-16 text-center dark:bg-secondary/50"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MessageSquarePlus className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary dark:text-white">
              Chưa có yêu cầu nào
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Bạn có thể gửi yêu cầu chỉnh sửa hoặc bổ sung thông tin thuốc từ trang chi tiết thuốc.
            </p>
          </div>
          <Link
            href="/drugs-info"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
            Đi đến trang thuốc
          </Link>
        </motion.div>
      )}

      {/* Request list */}
      {!isLoading && !error && requests.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="space-y-3"
        >
          {requests.map((request, index) => (
            <RequestCard key={request.id} request={request} index={index} />
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-center justify-center gap-2 pt-4"
        >
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-lg border border-border/30 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-primary disabled:opacity-40"
          >
            Trước
          </button>
          <span className="px-3 text-sm text-muted-foreground">
            Trang {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-lg border border-border/30 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-primary disabled:opacity-40"
          >
            Tiếp
          </button>
        </motion.div>
      )}
    </div>
  );
}
