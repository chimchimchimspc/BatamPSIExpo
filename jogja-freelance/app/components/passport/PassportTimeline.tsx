"use client";
import { CheckCircle, Circle, Star } from "lucide-react";
import { clsx } from "clsx";
import { PASSPORT_DAYS, PHASE_COLORS, BADGE_MILESTONES, type PassportProgress } from "../../data/passport";

interface PassportTimelineProps {
  progress: PassportProgress;
  onSelectDay: (day: number) => void;
  selectedDay: number;
}

const PHASE_GROUPS = [
  { label: "Onboarding", days: [1, 2, 3, 4, 5, 6], color: "bg-blue-500" },
  { label: "Eksplorasi", days: [7, 8, 9, 10, 11, 12, 13, 14, 15], color: "bg-green-500" },
  { label: "Action", days: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25], color: "bg-orange-500" },
  { label: "Wrap-up", days: [26, 27, 28, 29, 30], color: "bg-purple-500" },
];

export default function PassportTimeline({ progress, onSelectDay, selectedDay }: PassportTimelineProps) {
  const isCompleted = (day: number) => progress.completedDays.includes(day);
  const isCurrent   = (day: number) => day === progress.currentDay;
  const isMilestone = (day: number) => BADGE_MILESTONES.includes(day);

  return (
    <div className="bg-white border border-[#E7E7E7] rounded-lg p-5">
      <h3 className="font-bold text-[#232F3E] mb-4">30 Hari Passport</h3>

      {PHASE_GROUPS.map((group) => {
        const phaseEntry = PASSPORT_DAYS.find((d) => d.phase === group.label || (group.label === "Eksplorasi" && d.phase === "Eksplorasi"));
        const phaseColor = phaseEntry ? PHASE_COLORS[phaseEntry.phase] : PHASE_COLORS["Onboarding"];

        return (
          <div key={group.label} className="mb-5 last:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <div className={clsx("w-2 h-2 rounded-full", group.color)} />
              <span className={clsx("text-xs font-bold", phaseColor.text)}>{group.label}</span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {group.days.map((day) => {
                const done    = isCompleted(day);
                const current = isCurrent(day);
                const future  = day > progress.currentDay;
                const milestone = isMilestone(day);
                const selected  = selectedDay === day;
                const dayData   = PASSPORT_DAYS.find((d) => d.day === day);

                return (
                  <button
                    key={day}
                    onClick={() => onSelectDay(day)}
                    title={dayData?.task}
                    className={clsx(
                      "relative w-full aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all duration-150",
                      selected && "ring-2 ring-[#E8B4D1] ring-offset-1",
                      done    && "bg-[#12A54D] text-white",
                      current && !done && "bg-[#E8B4D1] text-white animate-pulse",
                      future  && !done && "bg-[#F1F1F1] text-[#CCCCCC]",
                      !future && !done && !current && "bg-[#232F3E] text-white",
                      milestone && "ring-2 ring-yellow-400"
                    )}
                  >
                    {done ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <span>{day}</span>
                    )}
                    {milestone && (
                      <Star className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 fill-yellow-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[#E7E7E7]">
        {[
          { color: "bg-[#12A54D]", label: "Selesai" },
          { color: "bg-[#E8B4D1]", label: "Hari ini" },
          { color: "bg-[#232F3E]", label: "Tersedia" },
          { color: "bg-[#F1F1F1] border border-[#CCCCCC]", label: "Belum waktunya" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={clsx("w-3 h-3 rounded", l.color)} />
            <span className="text-xs text-[#565A5C]">{l.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-[#565A5C]">Milestone badge</span>
        </div>
      </div>
    </div>
  );
}
