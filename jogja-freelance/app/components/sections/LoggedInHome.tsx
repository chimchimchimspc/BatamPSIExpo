"use client";
import Link from "next/link";
import { Calendar, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { PASSPORT_DAYS, MOCK_PROGRESS } from "../../data/passport";

interface TodayEvent {
  day: number;
  task: string;
  estimatedTime: string;
  isCompleted: boolean;
  phase: string;
}

export default function LoggedInHome() {
  // Get today's task from current day
  const todayEntry = PASSPORT_DAYS.find((d) => d.day === MOCK_PROGRESS.currentDay);
  const isCompleted = MOCK_PROGRESS.completedDays.includes(MOCK_PROGRESS.currentDay);

  const upcomingDays = PASSPORT_DAYS.slice(
    MOCK_PROGRESS.currentDay - 1,
    MOCK_PROGRESS.currentDay + 3
  );

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      {/* Header Section */}
      <div className="bg-white border-b border-[#E7E7E7] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-[#232F3E] mb-2">
            Lanjutkan Progress Anda
          </h1>
          <p className="text-[#6B6880]">
            Hari ke-{MOCK_PROGRESS.currentDay} dari 30 | {MOCK_PROGRESS.completedDays.length} hari selesai
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Today's Task */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-[#E7E7E7] overflow-hidden">
              {/* Today's Focus */}
              {todayEntry && (
                <>
                  <div className="bg-gradient-to-r from-[#D64545] to-[#E8B4D1] text-white p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="inline-block bg-white/20 text-sm px-3 py-1 rounded-full font-semibold mb-2">
                          HARI INI
                        </span>
                        <h2 className="text-2xl font-bold">{todayEntry.task}</h2>
                      </div>
                      {isCompleted && (
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <p className="text-white/80 mb-4">{todayEntry.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>⏱️ {todayEntry.estimatedTime}</span>
                      <span>📍 Fase: {todayEntry.phase}</span>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="p-6 border-t border-[#E7E7E7]">
                    <h3 className="font-bold text-[#232F3E] mb-3">💡 Tips</h3>
                    <ul className="space-y-2">
                      {todayEntry.tips.slice(0, 3).map((tip, i) => (
                        <li key={i} className="text-sm text-[#6B6880] flex gap-2">
                          <span className="text-[#D64545]">✓</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="p-6 border-t border-[#E7E7E7] bg-[#F8F8F8]">
                    <Link
                      href={`/passport?day=${MOCK_PROGRESS.currentDay}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#D64545] hover:bg-[#C23B3B] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      {isCompleted ? "Lihat Hari Ini" : "Mulai Sekarang"}
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Progress Summary */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-[#E7E7E7] p-4 text-center">
                <p className="text-2xl font-bold text-[#D64545]">
                  {MOCK_PROGRESS.completedDays.length}
                </p>
                <p className="text-sm text-[#6B6880] mt-1">Hari Selesai</p>
              </div>
              <div className="bg-white rounded-lg border border-[#E7E7E7] p-4 text-center">
                <p className="text-2xl font-bold text-[#12A54D]">
                  {MOCK_PROGRESS.earnedBadges.length}
                </p>
                <p className="text-sm text-[#6B6880] mt-1">Badge Earned</p>
              </div>
              <div className="bg-white rounded-lg border border-[#E7E7E7] p-4 text-center">
                <p className="text-2xl font-bold text-[#146EB4]">
                  {30 - MOCK_PROGRESS.completedDays.length}
                </p>
                <p className="text-sm text-[#6B6880] mt-1">Hari Tersisa</p>
              </div>
            </div>
          </div>

          {/* Right: Upcoming Days */}
          <div className="bg-white rounded-lg border border-[#E7E7E7] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#D64545]" />
              <h3 className="font-bold text-[#232F3E]">Jadwal Berikutnya</h3>
            </div>

            <div className="space-y-3">
              {upcomingDays.map((day) => {
                const isCurrent = day.day === MOCK_PROGRESS.currentDay;
                const isDone = MOCK_PROGRESS.completedDays.includes(day.day);
                const isFuture = day.day > MOCK_PROGRESS.currentDay;

                return (
                  <Link
                    key={day.day}
                    href={`/passport?day=${day.day}`}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-[#FFF5F5] border-[#D64545] shadow-sm"
                        : isDone
                          ? "bg-[#F0FFF4] border-[#12A54D]"
                          : isFuture
                            ? "bg-[#F5F5F5] border-[#CCCCCC] opacity-60"
                            : "bg-white border-[#E7E7E7] hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[#6B6880] mb-1">
                          {isCurrent ? "HARI INI" : isFuture ? "TERKUNCI" : "SELESAI"}
                        </p>
                        <p className="text-sm font-semibold text-[#232F3E] line-clamp-2">
                          {day.task}
                        </p>
                      </div>
                      {isDone && (
                        <CheckCircle2 className="w-4 h-4 text-[#12A54D] flex-shrink-0 mt-0.5" />
                      )}
                      {isFuture && (
                        <AlertCircle className="w-4 h-4 text-[#CCCCCC] flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <Link
              href="/passport"
              className="mt-4 w-full text-center text-sm text-[#D64545] font-semibold hover:text-[#C23B3B] py-2 border-t border-[#E7E7E7] pt-4"
            >
              Lihat Semua Hari →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
