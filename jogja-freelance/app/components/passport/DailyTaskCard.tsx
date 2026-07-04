"use client";
import { Clock, CheckCircle, ChevronRight, Lightbulb } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";
import { type DayEntry, PHASE_COLORS } from "../../data/passport";
import { clsx } from "clsx";

interface DailyTaskCardProps {
  entry: DayEntry;
  isCompleted: boolean;
  onComplete: () => void;
}

export default function DailyTaskCard({ entry, isCompleted, onComplete }: DailyTaskCardProps) {
  const [showTips, setShowTips] = useState(false);
  const [loading, setLoading] = useState(false);
  const phase = PHASE_COLORS[entry.phase];

  const handleComplete = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    onComplete();
  };

  return (
    <div className={clsx(
      "bg-white border-2 rounded-xl p-6 transition-all duration-300",
      isCompleted ? "border-[#12A54D] bg-green-50/30" : "border-[#E8B4D1] shadow-md"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {isCompleted ? (
            <div className="w-12 h-12 rounded-full bg-[#12A54D] flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#E8B4D1] flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
              {entry.day}
            </div>
          )}
          <div>
            <span className={clsx("text-xs font-bold px-2 py-0.5 rounded-full", phase.bg, phase.text)}>
              {entry.phase}
            </span>
            <p className="text-xs text-[#565A5C] mt-0.5">Hari {entry.day} dari 30</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#565A5C] flex-shrink-0">
          <Clock className="w-3.5 h-3.5" />
          {entry.estimatedTime}
        </div>
      </div>

      {/* Task */}
      <h3 className={clsx(
        "text-xl font-bold mb-2",
        isCompleted ? "text-[#12A54D] line-through" : "text-[#232F3E]"
      )}>
        {entry.task}
      </h3>
      <p className="text-sm text-[#565A5C] leading-relaxed mb-4">{entry.description}</p>

      {/* Badge unlock preview */}
      {entry.badgeUnlock && !isCompleted && (
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <span className="text-xl">{entry.badgeIcon}</span>
          <div>
            <p className="text-xs font-bold text-yellow-800">Badge akan terbuka!</p>
            <p className="text-xs text-yellow-700">{entry.badgeUnlock}</p>
          </div>
        </div>
      )}

      {/* Resources */}
      {entry.resources && entry.resources.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {entry.resources.map((r) => (
            <a
              key={r.label}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-[#146EB4] bg-blue-50 px-2.5 py-1 rounded-full hover:underline"
            >
              {r.label} <ChevronRight className="w-3 h-3" />
            </a>
          ))}
        </div>
      )}

      {/* Tips toggle */}
      <button
        onClick={() => setShowTips((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-[#565A5C] hover:text-[#232F3E] mb-4 transition-colors"
      >
        <Lightbulb className="w-3.5 h-3.5 text-[#E8B4D1]" />
        {showTips ? "Sembunyikan tips" : "Lihat tips"} ({entry.tips.length})
      </button>

      {showTips && (
        <ul className="space-y-1.5 mb-4 animate-fade-in">
          {entry.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[#565A5C]">
              <span className="text-[#E8B4D1] mt-0.5 flex-shrink-0">•</span>
              {tip}
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      {!isCompleted && (
        <Button fullWidth size="lg" onClick={handleComplete} loading={loading}>
          <CheckCircle className="w-5 h-5" />
          Tandai Selesai
        </Button>
      )}

      {isCompleted && (
        <div className="text-center py-2 text-sm font-semibold text-[#12A54D]">
          ✓ Selesai!
        </div>
      )}
    </div>
  );
}
