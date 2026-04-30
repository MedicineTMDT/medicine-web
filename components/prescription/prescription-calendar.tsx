"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PrescriptionCalendarProps {
  intakesByDate: Record<string, any[]>;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function PrescriptionCalendar({
  intakesByDate,
  selectedDate,
  onSelectDate,
}: PrescriptionCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));

  // Calendar helpers
  const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    
    // Days from prev month to fill the first week
    // Sunday is 0, Monday is 1. We want T2 (1) to CN (0)
    let firstDayOfWeek = firstDay.getDay(); // 0-6
    if (firstDayOfWeek === 0) firstDayOfWeek = 7; // Convert Sunday to 7
    
    for (let i = 1; i < firstDayOfWeek; i++) {
      const d = new Date(year, month, 1 - (firstDayOfWeek - i));
      days.push({ date: d, isCurrentMonth: false });
    }
    
    // Days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Days from next month to fill the last week
    const remaining = 42 - days.length; // 6 weeks total for consistent height
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getDayStatus = (date: Date) => {
    const dateKey = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    const dayIntakes = intakesByDate[dateKey];
    
    if (!dayIntakes || dayIntakes.length === 0) return null;
    
    const allTaken = dayIntakes.every((i) => i.status);
    const someTaken = dayIntakes.some((i) => i.status);
    
    if (allTaken) return "completed";
    if (someTaken) return "partial";
    return "pending";
  };

  const monthName = viewDate.toLocaleString("vi-VN", { month: "long" });
  const year = viewDate.getFullYear();

  return (
    <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold capitalize text-secondary dark:text-white">
          {monthName} {year}
        </h2>
        <div className="flex gap-1.5">
          <button
            onClick={handlePrevMonth}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--glass-border)] bg-white/50 transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <ChevronLeft className="h-3.5 w-3.5 text-secondary dark:text-white" />
          </button>
          <button
            onClick={handleNextMonth}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--glass-border)] bg-white/50 transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <ChevronRight className="h-3.5 w-3.5 text-secondary dark:text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="mb-1 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60"
          >
            {day}
          </div>
        ))}

        <AnimatePresence mode="wait">
          <motion.div
            key={viewDate.toISOString()}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="col-span-7 grid grid-cols-7 gap-0.5"
          >
            {getDaysInMonth(viewDate).map(({ date, isCurrentMonth }, idx) => {
              const status = getDayStatus(date);
              const selected = isSelected(date);
              const today = isToday(date);

              return (
                <button
                  key={idx}
                  onClick={() => onSelectDate(date)}
                  className={cn(
                    "relative flex h-8 w-full flex-col items-center justify-center rounded-lg p-0 text-[10px] transition-all",
                    !isCurrentMonth && "opacity-20",
                    selected
                      ? "bg-primary font-bold text-white shadow-md ring-1 ring-primary/20 ring-offset-0 ring-offset-background"
                      : "hover:bg-white/80 dark:hover:bg-white/10",
                    today && !selected && "border border-primary/50 text-primary font-bold"
                  )}
                >
                  <span>{date.getDate()}</span>
                  
                  {status && (
                    <div className="absolute bottom-1.5 flex gap-0.5">
                      <motion.div
                        initial={false}
                        animate={{ scale: [0.8, 1.2, 1] }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "h-1 w-1 rounded-full shadow-[0_0_4px_rgba(0,0,0,0.1)]",
                          status === "completed" && "bg-emerald-500",
                          status === "partial" && "bg-amber-500",
                          status === "pending" && (selected ? "bg-white" : "bg-primary")
                        )}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[9px] uppercase tracking-widest text-muted-foreground/70">
        <div className="flex items-center gap-1">
          <div className="h-1 w-1 rounded-full bg-emerald-500" />
          <span>Hoàn thành</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-1 w-1 rounded-full bg-amber-500" />
          <span>Một phần</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-1 w-1 rounded-full bg-primary" />
          <span>Chưa uống</span>
        </div>
      </div>
    </div>
  );
}
