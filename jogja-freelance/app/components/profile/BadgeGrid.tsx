"use client";
import { Share2, Lock } from "lucide-react";
import { clsx } from "clsx";
import { ALL_BADGES, rarityConfig } from "../../data/profile";

interface BadgeGridProps {
  earnedBadges: string[];
}

export default function BadgeGrid({ earnedBadges }: BadgeGridProps) {
  const getBadgeConfig = (badgeName: string) => {
    return ALL_BADGES.find((b) => b.name === badgeName);
  };

  const getRarityStyle = (badgeName: string) => {
    const config = getBadgeConfig(badgeName);
    if (!config) return rarityConfig.common;
    return rarityConfig[config.rarity as keyof typeof rarityConfig];
  };

  return (
    <div className="bg-white border border-[#E7E7E7] rounded-lg p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-[#232F3E]">Badge & Achievements</h2>
        <span className="text-sm font-semibold text-[#E8B4D1]">
          {earnedBadges.length}/{ALL_BADGES.length}
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
        {ALL_BADGES.map((badge) => {
          const isEarned = earnedBadges.includes(badge.name);
          const style = getRarityStyle(badge.name);

          return (
            <div key={badge.name} className="group">
              <div
                className={clsx(
                  "relative w-full aspect-square rounded-lg border-2 flex items-center justify-center text-3xl transition-all duration-200 cursor-pointer",
                  "hover:scale-105 hover:shadow-lg",
                  isEarned
                    ? `${style.border} bg-gradient-to-br ${style.bg} animate-pulse-gold`
                    : "border-[#CCCCCC] bg-[#F1F1F1] opacity-40 grayscale"
                )}
              >
                {badge.icon}
                {!isEarned && (
                  <Lock className="absolute bottom-1 right-1 w-4 h-4 text-[#CCCCCC]" />
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-10 w-48">
                <div className="bg-[#232F3E] text-white text-xs rounded-lg p-3 mb-1">
                  <p className="font-bold">{badge.name}</p>
                  <p className="text-[#6B6880] mt-1">{badge.description}</p>
                  {isEarned && (
                    <p className="text-[#E8B4D1] mt-1.5 font-semibold flex items-center gap-1">
                      <Share2 className="w-3 h-3" /> Shareable!
                    </p>
                  )}
                </div>
                <div className="bg-[#232F3E] w-3 h-3 mx-auto -mb-1.5 transform rotate-45" />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#565A5C] mt-4">
        💡 Kumpulkan badge untuk naik level dan tingkatkan kredibilitas Anda di mata employer.
      </p>
    </div>
  );
}
