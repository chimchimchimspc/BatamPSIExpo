"use client";
import { clsx } from "clsx";
import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "tertiary" | "danger";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[#D64545] text-white font-bold hover:bg-[#C23B3B] active:bg-[#A83030] disabled:bg-[#E8B4D1] disabled:text-[#999] disabled:cursor-not-allowed",
  secondary:
    "bg-white text-[#232F3E] border border-[#CCCCCC] hover:bg-[#F1F1F1] hover:border-[#999] disabled:opacity-50 disabled:cursor-not-allowed",
  tertiary:
    "bg-transparent text-[#146EB4] hover:underline p-0 disabled:opacity-50 disabled:cursor-not-allowed",
  danger:
    "bg-[#DC2C1E] text-white font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded cursor-pointer transition-all duration-200 select-none",
        variant !== "tertiary" && sizes[size],
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  );
}
