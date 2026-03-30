"use client";

import React, { useState } from "react";
import { AlertTriangle, X, Info } from "lucide-react";

const DisclaimerBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl px-3 py-2 text-[10px] md:text-xs flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-top-1 duration-300">
      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
      <p className="flex-1 font-medium leading-none">
        <span className="font-bold uppercase mr-1">Lưu ý:</span>
        AI hỗ trợ tra cứu phác đồ, không thay thế chỉ định bác sĩ. Vui lòng đối chiếu văn bản gốc.
      </p>
      <button 
        onClick={() => setIsVisible(false)}
        className="p-1 hover:bg-amber-500/10 rounded-md transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

export default DisclaimerBanner;

