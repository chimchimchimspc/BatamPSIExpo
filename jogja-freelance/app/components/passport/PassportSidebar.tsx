"use client";
import { useEffect, useState } from "react";
import ProgressBar from "../ui/ProgressBar";
import { Trophy, Flame } from "lucide-react";
import { type PassportProgress } from "../../data/passport";

const ALL_BADGES = [
  { name: "Profile Complete",         icon: "✓",  day: 1  },
  { name: "Day 5 Milestone",          icon: "📅", day: 5  },
  { name: "Event Attendee",           icon: "🎤", day: 7  },
  { name: "Day 15 Milestone",         icon: "🌟", day: 15 },
  { name: "First Application",        icon: "🎯", day: 18 },
  { name: "30-Day Passport Finisher", icon: "🏆", day: 30 },
];

const LEVEL_CONFIG = [
  { name: "Bronze",   min: 0,  max: 3,  icon: "🥉", color: "text-orange-700", bgColor: "bg-[#8B4513]", textColor: "text-white", contrastText: "white" },
  { name: "Silver",   min: 3,  max: 6,  icon: "🥈", color: "text-gray-500",   bgColor: "bg-[#708090]", textColor: "text-white", contrastText: "white" },
  { name: "Gold",     min: 6,  max: 10, icon: "🥇", color: "text-yellow-600", bgColor: "bg-[#FFD700]", textColor: "text-[#1a1a1a]", contrastText: "#1a1a1a" },
  { name: "Platinum", min: 10, max: 15, icon: "💎", color: "text-blue-500",   bgColor: "bg-[#E5E4E2]", textColor: "text-[#1a1a1a]", contrastText: "#1a1a1a" },
];

interface PassportSidebarProps {
  progress: PassportProgress;
}

export default function PassportSidebar({ progress }: PassportSidebarProps) {
  const earned = progress.earnedBadges;
  const level  = LEVEL_CONFIG.find((l) => l.name === progress.level) ?? LEVEL_CONFIG[0];
  const nextLevel = LEVEL_CONFIG[LEVEL_CONFIG.indexOf(level) + 1];
  const toNext = nextLevel ? nextLevel.min - earned.length : 0;
  const streakDays = progress.completedDays.length;

  const targetPct = nextLevel
    ? Math.round(((earned.length - level.min) / (nextLevel.min - level.min)) * 100)
    : 100;
  const [levelPct, setLevelPct] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLevelPct(targetPct), 120);
    return () => clearTimeout(timer);
  }, [targetPct]);

  return (
    <div className="space-y-4">
      {/* Overall progress */}
      <div className="bg-white border border-[#E7E7E7] rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-[#232F3E]">Progress Passport</h3>
          <span className="text-sm font-bold text-[#D64545]">
            {progress.completedDays.length}/30
          </span>
        </div>
        <div className="w-full">
          <ProgressBar
            value={progress.completedDays.length}
            max={30}
            showPercent
            size="lg"
            className="mb-3"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-[#F1F1F1] rounded-lg py-2">
            <p className="text-lg font-bold text-[#232F3E]">{progress.completedDays.length}</p>
            <p className="text-xs text-[#565A5C]">Hari selesai</p>
          </div>
          <div className="bg-[#F1F1F1] rounded-lg py-2">
            <p className="text-lg font-bold text-[#232F3E]">{30 - progress.completedDays.length}</p>
            <p className="text-xs text-[#565A5C]">Hari tersisa</p>
          </div>
        </div>
      </div>

      {/* Level */}
      <div className={`${level.bgColor} rounded-lg p-5`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{level.icon}</span>
          <div>
            <p className={`font-bold text-lg ${level.textColor}`}>Level {level.name}</p>
            {nextLevel && (
              <p className="text-xs" style={{ color: level.contrastText === "white" ? "rgba(255,255,255,0.7)" : "rgba(26,26,26,0.7)" }}>
                {toNext} badge lagi untuk {nextLevel.name}
              </p>
            )}
          </div>
        </div>
        {nextLevel && (
          <div className="relative pt-4 pb-2">
            {/* Medal milestones */}
            <div className="absolute top-0 w-full flex justify-between px-0">
              {LEVEL_CONFIG.map((l) => {
                const isReached = earned.length >= l.min;
                return (
                  <div
                    key={l.name}
                    className="relative transition-all duration-500"
                    style={{
                      opacity: isReached ? 1 : 0.2,
                      transform: isReached ? "scale(1.1)" : "scale(0.8)",
                      color: level.contrastText,
                    }}
                  >
                    <div className="text-lg">{l.icon}</div>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div
              className="w-full rounded-full h-2 mt-6"
              style={{
                backgroundColor: level.contrastText === "white" ? "rgba(255,255,255,0.2)" : "rgba(26,26,26,0.2)"
              }}
            >
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${levelPct}%`,
                  transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                  backgroundColor: level.contrastText,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Streak */}
      <div className="bg-white border border-[#E7E7E7] rounded-lg p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
          <Flame className="w-5 h-5 text-[#D64545]" />
        </div>
        <div>
          <p className="font-bold text-[#232F3E]">{streakDays} hari</p>
          <p className="text-xs text-[#565A5C]">Total hari selesai</p>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white border border-[#E7E7E7] rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-[#D64545]" />
          <h3 className="font-bold text-[#232F3E]">Badge ({earned.length}/{ALL_BADGES.length})</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {ALL_BADGES.map((b) => {
            const isEarned = earned.includes(b.name);
            return (
              <div key={b.name} className="text-center" title={b.name}>
                <div className={`w-12 h-12 mx-auto rounded-full border-2 flex items-center justify-center text-xl mb-1 transition-all
                  ${isEarned
                    ? "border-[#FFD700] bg-gradient-to-br from-yellow-50 to-yellow-100 animate-pulse-gold"
                    : "border-[#CCCCCC] bg-[#F1F1F1] grayscale opacity-40"}`
                }>
                  {b.icon}
                </div>
                <p className="text-[9px] text-[#565A5C] leading-tight">{b.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
