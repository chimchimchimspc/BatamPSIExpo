"use client";
import { clsx } from "clsx";
import { X } from "lucide-react";
import { type ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export default function Modal({ isOpen, onClose, title, children, footer, size = "md" }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={clsx(
          "bg-white rounded-lg shadow-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in",
          sizes[size]
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E7E7]">
          <h3 className="text-xl font-semibold text-[#232F3E]">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#565A5C] hover:text-[#232F3E] transition-colors"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-6">{children}</div>

        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#E7E7E7]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
