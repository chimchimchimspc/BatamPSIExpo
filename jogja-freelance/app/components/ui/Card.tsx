import { clsx } from "clsx";
import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export default function Card({ children, className, hover = false, padding = "md" }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-white border border-[#E7E7E7] rounded-lg",
        paddings[padding],
        hover && "transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
