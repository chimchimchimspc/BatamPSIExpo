"use client";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: "orange" | "blue" | "green";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colors = {
  orange: "bg-[#D64545]",
  blue:   "bg-[#146EB4]",
  green:  "bg-[#12A54D]",
};

const heights = { sm: "h-1.5", md: "h-2", lg: "h-3" };

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = false,
  color = "orange",
  size = "md",
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayPct(pct), 120);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <div className={clsx("w-full", className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs font-semibold text-[#565A5C]">{label}</span>}
          {showPercent && <span className="text-xs text-[#565A5C]">{pct}%</span>}
        </div>
      )}
      <div className={clsx("w-full bg-[#E7E7E7] rounded-full overflow-hidden", heights[size])}>
        <div
          className={clsx("h-full rounded-full", colors[color])}
          style={{
            width: `${displayPct}%`,
            transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
