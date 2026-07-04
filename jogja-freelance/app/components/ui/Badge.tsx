import { clsx } from "clsx";

type Color = "blue" | "orange" | "green" | "red" | "gray" | "gold";

interface BadgeProps {
  label: string;
  color?: Color;
  className?: string;
}

const colors: Record<Color, string> = {
  blue:   "bg-[#EBF5FF] text-[#146EB4]",
  orange: "bg-orange-50 text-[#EC7211]",
  green:  "bg-green-50 text-[#12A54D]",
  red:    "bg-red-50 text-[#DC2C1E]",
  gray:   "bg-[#F1F1F1] text-[#565A5C]",
  gold:   "bg-yellow-50 text-yellow-700 border border-yellow-300",
};

export default function Badge({ label, color = "blue", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-block px-3 py-1 rounded-full text-xs font-semibold",
        colors[color],
        className
      )}
    >
      {label}
    </span>
  );
}
