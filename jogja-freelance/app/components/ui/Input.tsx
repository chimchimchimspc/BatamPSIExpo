"use client";
import { clsx } from "clsx";
import { type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="mb-6">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold mb-2 text-[#232F3E]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          "w-full px-4 py-3 text-sm border rounded bg-white transition-colors duration-200",
          "placeholder:text-[#999] text-[#232F3E]",
          "focus:outline-none focus:border-[#146EB4] focus:ring-2 focus:ring-[#146EB4]/10",
          "disabled:bg-[#F1F1F1] disabled:border-[#E7E7E7] disabled:text-[#999] disabled:cursor-not-allowed",
          error ? "border-[#DC2C1E]" : "border-[#CCCCCC]",
          className
        )}
        {...props}
      />
      {error && <span className="block text-xs text-[#DC2C1E] mt-1">{error}</span>}
      {hint && !error && <span className="block text-xs text-[#565A5C] mt-1">{hint}</span>}
    </div>
  );
}

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="mb-6">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold mb-2 text-[#232F3E]">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={clsx(
          "w-full px-4 py-3 text-sm border rounded bg-white transition-colors duration-200",
          "text-[#232F3E] focus:outline-none focus:border-[#146EB4] focus:ring-2 focus:ring-[#146EB4]/10",
          error ? "border-[#DC2C1E]" : "border-[#CCCCCC]",
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <span className="block text-xs text-[#DC2C1E] mt-1">{error}</span>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
  currentLength?: number;
}

export function Textarea({ label, error, hint, maxLength, currentLength, className, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="mb-6">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold mb-2 text-[#232F3E]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={clsx(
          "w-full px-4 py-3 text-sm border rounded bg-white transition-colors duration-200 resize-none",
          "placeholder:text-[#999] text-[#232F3E]",
          "focus:outline-none focus:border-[#146EB4] focus:ring-2 focus:ring-[#146EB4]/10",
          error ? "border-[#DC2C1E]" : "border-[#CCCCCC]",
          className
        )}
        {...props}
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-[#DC2C1E]">{error || ""}</span>
        {maxLength && (
          <span className={clsx("text-xs", (currentLength ?? 0) > maxLength ? "text-[#DC2C1E]" : "text-[#565A5C]")}>
            {currentLength ?? 0}/{maxLength}
          </span>
        )}
      </div>
      {hint && !error && <span className="block text-xs text-[#565A5C] mt-1">{hint}</span>}
    </div>
  );
}

interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({ label, checked, onChange, className }: CheckboxProps) {
  return (
    <label className={clsx("flex items-center gap-3 cursor-pointer text-sm select-none", className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="w-4 h-4 accent-[#146EB4] cursor-pointer"
      />
      <span className="text-[#232F3E]">{label}</span>
    </label>
  );
}
