import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProfileHeader from "../components/profile/ProfileHeader";
import BadgeGrid from "../components/profile/BadgeGrid";
import ProgressBar from "../components/ui/ProgressBar";
import { MOCK_USER_PROFILE } from "../data/profile";
import { Calendar, Award, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const user = MOCK_USER_PROFILE;

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F1F1F1]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Profile Header */}
          <ProfileHeader profile={user} isOwnProfile={true} />

          {/* Passport Journey */}
          <div className="bg-white border border-[#E7E7E7] rounded-lg p-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#E8B4D1]" />
              <h2 className="text-lg font-bold text-[#232F3E]">Jogja Passport Journey</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Days completed */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-[#146EB4]">{user.passportDaysCompleted}</p>
                <p className="text-sm text-[#565A5C] mt-1">Hari Selesai</p>
                <p className="text-xs text-[#565A5C] mt-2">dari 30 hari total</p>
              </div>

              {/* Progress bar */}
              <div className="bg-[#F1F1F1] border border-[#E7E7E7] rounded-lg p-4">
                <p className="text-xs font-bold text-[#565A5C] mb-2">Progress</p>
                <ProgressBar
                  value={user.passportDaysCompleted}
                  max={30}
                  showPercent
                  color="orange"
                  size="lg"
                />
                <p className="text-xs text-[#565A5C] mt-2">
                  {Math.round((user.passportDaysCompleted / 30) * 100)}% perjalanan selesai
                </p>
              </div>

              {/* Next milestone */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <p className="text-lg font-bold text-[#EC7211]">Hari 15</p>
                <p className="text-sm text-[#565A5C] mt-1">Milestone Berikutnya</p>
                <p className="text-xs text-[#565A5C] mt-2">8 hari lagi</p>
              </div>
            </div>

            <Link href="/passport" className="inline-block mt-4 text-sm text-[#146EB4] hover:underline font-semibold">
              Lanjutkan Panduan →
            </Link>
          </div>

          {/* Badge Grid */}
          <div className="mt-6">
            <BadgeGrid earnedBadges={user.earnedBadges} />
          </div>

          {/* Project Statistics */}
          <div className="bg-white border border-[#E7E7E7] rounded-lg p-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#E8B4D1]" />
              <h2 className="text-lg font-bold text-[#232F3E]">Statistik Pekerjaan</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-[#232F3E] mb-3">Rating & Review</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <p className="text-3xl font-bold text-[#232F3E]">{user.rating}</p>
                    <p className="text-xs text-[#565A5C]">dari 5.0</p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < Math.round(user.rating) ? "text-yellow-400" : "text-[#CCCCCC]"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[#565A5C]">
                  Berdasarkan <strong>{user.reviewCount} review</strong> dari employer
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#232F3E] mb-3">Pencapaian</h3>
                <div className="space-y-2">
                  {[
                    { icon: "✓", label: "Proyek Selesai", value: user.completedProjects },
                    { icon: "💰", label: "Total Earning", value: `Rp ${(user.totalEarnings / 1000000).toFixed(0)}jt` },
                    { icon: "⭐", label: "Review Positif", value: `${user.reviewCount} review` },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between p-2 bg-[#F1F1F1] rounded">
                      <span className="text-sm text-[#565A5C]">
                        <span className="mr-2">{stat.icon}</span>
                        {stat.label}
                      </span>
                      <p className="font-bold text-[#232F3E]">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA for upgrades */}
          <div className="bg-gradient-to-r from-[#D64545] to-[#E8B4D1] text-white rounded-lg p-6 mt-6 text-center">
            <h3 className="text-lg font-bold mb-2">Tingkatkan Profil Anda</h3>
            <p className="text-white/80 text-sm mb-4">
              Kumpulkan lebih banyak badge dan tingkatkan rating untuk menarik lebih banyak project.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/passport" className="inline-block px-4 py-2 bg-[#D64545] hover:bg-[#C23B3B] text-white rounded-lg font-semibold text-sm transition-colors">
                Lanjutkan Panduan
              </Link>
              <Link href="/jobs" className="inline-block px-4 py-2 bg-white text-[#232F3E] rounded-lg font-semibold text-sm hover:bg-[#F1F1F1] transition-colors">
                Cari Lowongan
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
