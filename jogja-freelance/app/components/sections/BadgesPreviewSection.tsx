"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Button from "../ui/Button";

const BADGES = [
  { icon: "✓",  name: "Profile Complete",       earned: true,  rarity: "common" },
  { icon: "🎯", name: "First Application",       earned: true,  rarity: "common" },
  { icon: "🎤", name: "Event Attendee",          earned: true,  rarity: "common" },
  { icon: "📅", name: "Day 5 Completer",         earned: false, rarity: "uncommon" },
  { icon: "🌟", name: "Day 15 Milestone",        earned: false, rarity: "rare" },
  { icon: "💼", name: "Job Completed",           earned: false, rarity: "uncommon" },
  { icon: "🤝", name: "Community Helper",        earned: false, rarity: "rare" },
  { icon: "🏆", name: "30-Day Passport Finisher",earned: false, rarity: "legendary" },
];

const rarityStyle: Record<string, string> = {
  common:    "border-[#CCCCCC]",
  uncommon:  "border-[#146EB4]",
  rare:      "border-[#12A54D]",
  legendary: "border-[#E8B4D1]",
};

export default function BadgesPreviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => setDisplayPct(75), 120);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#232F3E] mb-3">Kumpulkan Badge, Bangun Kredibilitas</h2>
          <p className="text-[#565A5C] max-w-lg mx-auto">
            Setiap pencapaian menghasilkan badge. Tampilkan di profil sebagai bukti nyata ke employer.
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 mb-8">
          {BADGES.map((b) => (
            <div
              key={b.name}
              className={`flex flex-col items-center gap-2 ${!b.earned ? "opacity-40 grayscale" : ""}`}
            >
              <div
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 ${rarityStyle[b.rarity]} ${b.earned ? "animate-pulse-gold" : ""}`}
                title={b.name}
              >
                {b.icon}
              </div>
              <p className="text-xs text-center text-[#232F3E] leading-tight font-medium">{b.name}</p>
            </div>
          ))}
        </div>

        {/* Level progress */}
        <div ref={ref} className="bg-white rounded-xl p-8 max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-4xl">🥉</span>
            <div className="text-left">
              <div className="font-bold text-lg text-[#232F3E]">Level Bronze</div>
              <div className="text-[#6B6880] text-sm">3 dari 4 badge untuk Silver</div>
            </div>
          </div>

          {/* Medal milestones with progress bar */}
          <div className="relative pt-8 pb-6">
            {/* Medals */}
            <div className="absolute top-0 w-full flex justify-between px-0">
              {["🥉", "🥈", "🥇", "💎"].map((medal, idx) => {
                const thresholds = [0, 33, 66, 100];
                const threshold = thresholds[idx];
                const isReached = displayPct >= threshold;

                return (
                  <div
                    key={idx}
                    className="relative transition-all duration-500"
                    style={{
                      opacity: isReached ? 1 : 0.2,
                      transform: isReached ? "scale(1.1)" : "scale(0.8)",
                      filter: isReached ? "drop-shadow(0 0 8px rgba(214, 69, 69, 0.5))" : "none",
                    }}
                  >
                    <div className="text-3xl">{medal}</div>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#E7E7E7] rounded-full h-2.5 mt-4">
              <div
                className="bg-gradient-to-r from-[#D64545] to-[#E8B4D1] h-2.5 rounded-full"
                style={{
                  width: `${displayPct}%`,
                  transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 0 12px rgba(214, 69, 69, 0.4)",
                }}
              />
            </div>

            {/* Labels */}
            <div className="flex justify-between text-xs text-[#6B6880] mt-3">
              {["Bronze", "Silver", "Gold", "Platinum"].map((label) => (
                <span key={label} className="font-medium">{label}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/auth/register">
            <Button size="lg">Mulai Kumpulkan Badge Sekarang</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
