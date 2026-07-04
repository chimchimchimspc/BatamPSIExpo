"use client";
import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import DailyTaskCard from "../components/passport/DailyTaskCard";
import PassportTimeline from "../components/passport/PassportTimeline";
import PassportSidebar from "../components/passport/PassportSidebar";
import BadgeUnlockModal from "../components/passport/BadgeUnlockModal";
import Toast from "../components/ui/Toast";
import { PASSPORT_DAYS, MOCK_PROGRESS, PHASE_COLORS } from "../data/passport";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import FadeInSection from "../components/ui/FadeInSection";

export default function PassportPage() {
  const [progress, setProgress] = useState(MOCK_PROGRESS);
  const [selectedDay, setSelectedDay] = useState(MOCK_PROGRESS.currentDay);
  const [unlockedBadge, setUnlockedBadge] = useState<{ name: string; icon: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const selectedEntry = PASSPORT_DAYS.find((d) => d.day === selectedDay)!;
  const isCompleted   = progress.completedDays.includes(selectedDay);
  const isFuture      = selectedDay > progress.currentDay;
  const phaseColor    = PHASE_COLORS[selectedEntry.phase];

  const handleComplete = () => {
    const newCompleted = [...progress.completedDays, selectedDay];
    const newCurrent   = Math.min(selectedDay + 1, 30);

    const newProgress = {
      ...progress,
      completedDays: newCompleted,
      currentDay: newCurrent,
    };

    // Badge unlock check
    if (selectedEntry.badgeUnlock && !progress.earnedBadges.includes(selectedEntry.badgeUnlock)) {
      newProgress.earnedBadges = [...progress.earnedBadges, selectedEntry.badgeUnlock];
      setTimeout(() => {
        setUnlockedBadge({ name: selectedEntry.badgeUnlock!, icon: selectedEntry.badgeIcon! });
      }, 400);
    } else {
      setToast(`Hari ${selectedDay} selesai! Lanjut ke hari berikutnya.`);
    }

    setProgress(newProgress);
    if (selectedDay < 30) setSelectedDay(newCurrent);
  };

  const goToDay = (delta: number) => {
    const next = Math.max(1, Math.min(30, selectedDay + delta));
    setSelectedDay(next);
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F1F1F1]">
        {/* Page header */}
        <div className="bg-white text-[#1E1B2E] py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 text-[#D64545]" />
              <h1 className="text-3xl font-bold">Jogja Passport</h1>
            </div>
            <p className="text-[#6B6880] text-sm">
              Panduan 30 hari untuk survive & thriving sebagai freelancer di Yogyakarta
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Left: timeline + daily task */}
            <div className="space-y-4">
              {/* Timeline */}
              <FadeInSection delay={100}>
              <PassportTimeline
                progress={progress}
                onSelectDay={setSelectedDay}
                selectedDay={selectedDay}
              />
              </FadeInSection>

              {/* Day nav */}
              <FadeInSection delay={180}>
              <div className="flex items-center justify-between bg-white border border-[#E7E7E7] rounded-lg px-5 py-3">
                <button
                  onClick={() => goToDay(-1)}
                  disabled={selectedDay === 1}
                  className="flex items-center gap-1 text-sm text-[#565A5C] hover:text-[#232F3E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Sebelumnya
                </button>

                <div className="text-center">
                  <span className={clsx(
                    "text-xs font-bold px-3 py-1 rounded-full",
                    phaseColor.bg, phaseColor.text
                  )}>
                    {selectedEntry.phase}
                  </span>
                  <p className="text-sm font-bold text-[#232F3E] mt-1">Hari {selectedDay}</p>
                </div>

                <button
                  onClick={() => goToDay(1)}
                  disabled={selectedDay === 30}
                  className="flex items-center gap-1 text-sm text-[#565A5C] hover:text-[#232F3E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Berikutnya <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              </FadeInSection>

              {/* Future day warning */}
              {isFuture && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-[#146EB4]">
                  <strong>Hari {selectedDay}</strong> belum tersedia. Selesaikan hari-hari sebelumnya
                  untuk membuka ini. Sekarang kamu di <strong>Hari {progress.currentDay}</strong>.
                </div>
              )}

              {/* Daily Task Card */}
              <FadeInSection delay={240}>
              <DailyTaskCard
                entry={selectedEntry}
                isCompleted={isCompleted}
                onComplete={isFuture ? () => {} : handleComplete}
              />
              </FadeInSection>

              {/* Phase overview */}
              <FadeInSection delay={300}>
              <div className="bg-white border border-[#E7E7E7] rounded-lg p-5">
                <h3 className="font-bold text-[#232F3E] mb-3">Fase Perjalanan</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(["Onboarding","Eksplorasi","Action","Wrap-up"] as const).map((phase) => {
                    const phaseDays = PASSPORT_DAYS.filter((d) => d.phase === phase);
                    const doneDays  = phaseDays.filter((d) => progress.completedDays.includes(d.day));
                    const pc        = PHASE_COLORS[phase];
                    const isActive  = selectedEntry.phase === phase;
                    const percentage = (doneDays.length / phaseDays.length) * 100;

                    // Count badges earned in this phase
                    const phaseEarnedBadges = phaseDays
                      .filter((d) => d.badgeUnlock && progress.earnedBadges.includes(d.badgeUnlock))
                      .length;

                    // Generate medals based on number of badges earned in this phase
                    const medalIcons = ["🥉", "🥈", "🥇", "💎", "⭐"];
                    const medalCount = Math.min(phaseEarnedBadges, medalIcons.length);
                    const medalPositions = medalCount > 0
                      ? Array.from({ length: medalCount }, (_, i) => ((i + 1) / (medalCount + 1)) * 100)
                      : [];

                    const getPhaseStartDay = () => {
                      const firstDayInPhase = phaseDays[0];
                      return firstDayInPhase.day;
                    };

                    return (
                      <div
                        key={phase}
                        onClick={() => setSelectedDay(getPhaseStartDay())}
                        className={clsx(
                          "rounded-lg p-3 text-center border cursor-pointer transition-all hover:shadow-md",
                          isActive ? `${pc.bg} ${pc.border}` : "bg-[#F1F1F1] border-transparent hover:bg-[#E7E7E7]"
                        )}
                      >
                        <p className={clsx("text-sm font-bold", isActive ? pc.text : "text-[#232F3E]")}>
                          {phase}
                        </p>
                        <p className="text-xs text-[#565A5C] mt-0.5">
                          {doneDays.length}/{phaseDays.length} hari
                        </p>

                        {/* Progress bar with dynamic medals */}
                        <div className="relative mt-4 pt-6">
                          {/* Medals container */}
                          {medalCount > 0 && (
                            <div className="absolute top-0 w-full h-6 pointer-events-none">
                              {medalPositions.map((pos, idx) => {
                                const medalPercentageThreshold = pos;
                                return (
                                  <div
                                    key={idx}
                                    className="absolute transition-all duration-500"
                                    style={{
                                      left: `calc(${pos}% - 10px)`,
                                      opacity: percentage >= medalPercentageThreshold ? 1 : 0.2,
                                      transform: percentage >= medalPercentageThreshold ? "scale(1)" : "scale(0.6)",
                                    }}
                                  >
                                    <div className="text-base">{medalIcons[idx]}</div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Progress bar */}
                          <div className="w-full bg-[#CCCCCC] rounded-full h-1.5 relative z-0">
                            <div
                              className="h-1.5 rounded-full transition-all duration-500 bg-[#12A54D]"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              </FadeInSection>
            </div>

            {/* Right: sidebar */}
            <PassportSidebar progress={progress} />
          </div>
        </div>
      </main>

      <Footer />

      <BadgeUnlockModal
        badge={unlockedBadge}
        onClose={() => {
          setUnlockedBadge(null);
          setToast(`Badge "${unlockedBadge?.name}" berhasil diraih!`);
        }}
      />

      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </>
  );
}
