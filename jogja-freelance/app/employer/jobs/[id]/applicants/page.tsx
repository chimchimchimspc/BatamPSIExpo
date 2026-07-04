"use client";
import { useState, use } from "react";
import { notFound } from "next/navigation";
import Header from "../../../../components/layout/Header";
import Footer from "../../../../components/layout/Footer";
import Toast from "../../../../components/ui/Toast";
import {
  getEmployerJobById,
  getApplicantsByJob,
  formatBudgetRange,
  type Applicant,
} from "../../../../data/employer";
import {
  ChevronLeft, Star, CheckCircle, XCircle, Clock,
  Award, Briefcase, Users, MapPin,
} from "lucide-react";
import Link from "next/link";

const TABS = ["Semua", "Pending", "Shortlisted", "Ditolak"] as const;
type Tab = typeof TABS[number];

const levelConfig: Record<string, { badge: string; ring: string; label: string }> = {
  Bronze:   { badge: "bg-orange-100 text-orange-700",  ring: "ring-orange-300",  label: "🥉 Bronze"   },
  Silver:   { badge: "bg-gray-100   text-gray-600",    ring: "ring-gray-300",    label: "🥈 Silver"   },
  Gold:     { badge: "bg-yellow-100 text-yellow-700",  ring: "ring-yellow-300",  label: "🥇 Gold"     },
  Platinum: { badge: "bg-blue-100   text-blue-600",    ring: "ring-blue-300",    label: "💎 Platinum" },
};

const statusConfig = {
  pending:     { label: "Pending",     bg: "bg-gray-100     text-gray-600",    icon: Clock        },
  shortlisted: { label: "Shortlisted", bg: "bg-green-100    text-green-700",   icon: CheckCircle  },
  rejected:    { label: "Ditolak",     bg: "bg-red-50       text-red-600",     icon: XCircle      },
};

export default function ApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const job = getEmployerJobById(id);
  if (!job) notFound();

  const initialApplicants = getApplicantsByJob(id);
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [activeTab, setActiveTab]   = useState<Tab>("Semua");
  const [expanded, setExpanded]     = useState<string | null>(null);
  const [toast, setToast]           = useState<string | null>(null);

  const updateStatus = (applicantId: string, status: Applicant["status"]) => {
    setApplicants((prev) =>
      prev.map((a) => a.id === applicantId ? { ...a, status } : a)
    );
    const msg =
      status === "shortlisted" ? "Pelamar berhasil di-shortlist!" :
      status === "rejected"    ? "Pelamar ditolak." :
                                 "Status dikembalikan ke pending.";
    setToast(msg);
  };

  const filtered = applicants.filter((a) => {
    if (activeTab === "Semua")      return true;
    if (activeTab === "Pending")    return a.status === "pending";
    if (activeTab === "Shortlisted")return a.status === "shortlisted";
    if (activeTab === "Ditolak")    return a.status === "rejected";
    return true;
  });

  const counts: Record<Tab, number> = {
    Semua:       applicants.length,
    Pending:     applicants.filter((a) => a.status === "pending").length,
    Shortlisted: applicants.filter((a) => a.status === "shortlisted").length,
    Ditolak:     applicants.filter((a) => a.status === "rejected").length,
  };

  const avatarColors = [
    "from-[#D64545] to-[#E8B4D1]",
    "from-[#D64545] to-[#E8B4D1]",
    "from-[#D64545] to-[#E8B4D1]",
    "from-[#E8B4D1] to-[#D64545]",
  ];

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F6FF]">
        {/* Header */}
        <div className="bg-white text-[#1E1B2E] py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Link href="/employer" className="flex items-center gap-1.5 text-[#6B6880] hover:text-[#D64545] text-sm mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Dashboard Employer
            </Link>
            <h1 className="text-xl font-bold mb-1">{job.title}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-[#6B6880]/60">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" /> {job.category}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {job.locationType}
              </span>
              <span>{formatBudgetRange(job.budget.min, job.budget.max)}</span>
              <span>· Dipost {job.postedAt}</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total Pelamar",   value: counts.Semua,       icon: Users,       color: "text-[#D64545]", bg: "bg-red-50" },
              { label: "Shortlisted",     value: counts.Shortlisted, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50"  },
              { label: "Pending Review",  value: counts.Pending,     icon: Clock,       color: "text-[#E8B4D1]", bg: "bg-pink-50" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-[#EAE6F5] rounded-xl p-4 text-center">
                <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <p className="text-xl font-bold text-[#1E1B2E]">{s.value}</p>
                <p className="text-xs text-[#6B6880]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-[#EAE6F5] rounded-xl p-1 mb-5">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-sm py-2 rounded-lg font-semibold transition-colors ${
                  activeTab === tab
                    ? "bg-[#D64545] text-white"
                    : "text-[#6B6880] hover:bg-[#F3F0FB]"
                }`}
              >
                {tab}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? "bg-white/20" : "bg-[#EAE6F5]"}`}>
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Applicant cards */}
          {filtered.length === 0 ? (
            <div className="bg-white border border-[#EAE6F5] rounded-xl p-12 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-[#1E1B2E] font-semibold mb-1">Belum ada pelamar di kategori ini</p>
              <p className="text-sm text-[#6B6880]">Coba pilih tab lain</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((a, i) => {
                const level  = levelConfig[a.level];
                const st     = statusConfig[a.status];
                const isOpen = expanded === a.id;

                return (
                  <div
                    key={a.id}
                    className={`bg-white border rounded-xl overflow-hidden transition-all ${
                      a.status === "shortlisted"
                        ? "border-green-200"
                        : a.status === "rejected"
                        ? "border-red-100 opacity-70"
                        : "border-[#EAE6F5]"
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ring-2 ring-white ${a.status === "shortlisted" ? `ring-offset-1 ${level.ring}` : ""}`}>
                          {a.name.charAt(0)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-[#1E1B2E]">{a.name}</h3>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${level.badge}`}>
                              {level.label}
                            </span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${st.bg}`}>
                              <st.icon className="w-3 h-3" />
                              {st.label}
                            </span>
                          </div>

                          {/* Stats row */}
                          <div className="flex flex-wrap gap-3 text-xs text-[#6B6880] mb-2">
                            <span className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
                              {a.rating}
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                              {a.completedProjects} proyek
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="w-3.5 h-3.5 text-[#E8B4D1]" />
                              {a.badgeCount} badge
                            </span>
                            <span>📅 {a.passportDays} hari passport</span>
                            <span>Melamar {a.appliedAt}</span>
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1.5">
                            {a.skills.map((s) => (
                              <span key={s} className="text-xs bg-[#F3F0FB] text-[#D64545] px-2 py-0.5 rounded">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Cover note toggle */}
                      <button
                        onClick={() => setExpanded(isOpen ? null : a.id)}
                        className="mt-3 text-xs text-[#D64545] hover:underline font-semibold"
                      >
                        {isOpen ? "Sembunyikan cover note ▲" : "Lihat cover note ▼"}
                      </button>

                      {isOpen && (
                        <div className="mt-2 p-3 bg-[#F8F6FF] border border-[#EAE6F5] rounded-lg text-sm text-[#1E1B2E] italic">
                          "{a.coverNote}"
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#EAE6F5]">
                        {a.status !== "shortlisted" && (
                          <button
                            onClick={() => updateStatus(a.id, "shortlisted")}
                            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Shortlist
                          </button>
                        )}
                        {a.status !== "rejected" && (
                          <button
                            onClick={() => updateStatus(a.id, "rejected")}
                            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Tolak
                          </button>
                        )}
                        {a.status !== "pending" && (
                          <button
                            onClick={() => updateStatus(a.id, "pending")}
                            className="flex items-center gap-1.5 px-3.5 py-2 text-xs text-[#6B6880] border border-[#EAE6F5] rounded-lg hover:bg-[#F8F6FF] transition-colors"
                          >
                            <Clock className="w-3.5 h-3.5" /> Reset ke Pending
                          </button>
                        )}
                        <Link
                          href="/profile"
                          className="flex items-center gap-1.5 px-3.5 py-2 text-xs text-[#D64545] border border-[#EAE6F5] rounded-lg hover:bg-[#F3F0FB] transition-colors ml-auto font-semibold"
                        >
                          Lihat Profil →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
      {toast && (
        <Toast
          message={toast}
          type={toast.includes("shortlist") ? "success" : "info"}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
    </>
  );
}
