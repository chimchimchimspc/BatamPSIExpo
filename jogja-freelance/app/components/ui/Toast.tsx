"use client";
import { clsx } from "clsx";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const styles: Record<ToastType, { bg: string; border: string; text: string; icon: typeof CheckCircle }> = {
  success: { bg: "bg-green-50",  border: "border-l-4 border-[#12A54D]", text: "text-green-800", icon: CheckCircle },
  error:   { bg: "bg-red-50",    border: "border-l-4 border-[#DC2C1E]", text: "text-red-800",   icon: XCircle },
  info:    { bg: "bg-blue-50",   border: "border-l-4 border-[#146EB4]", text: "text-blue-800",  icon: Info },
  warning: { bg: "bg-orange-50", border: "border-l-4 border-[#E8B4D1]", text: "text-orange-800",icon: AlertTriangle },
};

export default function Toast({ message, type = "success", onClose, duration = 4000 }: ToastProps) {
  const { bg, border, text, icon: Icon } = styles[type];

  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div
      className={clsx(
        "fixed top-5 right-5 z-50 flex items-start gap-3 p-4 rounded shadow-lg max-w-sm w-full animate-slide-in",
        bg,
        border
      )}
      role="alert"
    >
      <Icon className={clsx("w-5 h-5 mt-0.5 flex-shrink-0", text)} />
      <p className={clsx("flex-1 text-sm font-medium", text)}>{message}</p>
      <button
        onClick={onClose}
        className={clsx("flex-shrink-0 hover:opacity-70 transition-opacity", text)}
        aria-label="Tutup notifikasi"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
