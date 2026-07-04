import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  MOCK_EMPLOYER_PROFILE,
  MOCK_EMPLOYER_JOBS,
  MOCK_APPLICANTS,
  formatBudgetRange,
} from "../data/employer";
import {
  Briefcase, Users, CheckCircle, Clock, Plus,
  ChevronRight, MapPin, Building2, TrendingUp,
} from "lucide-react";
import Link from "next/link";

const levelColor: Record<string, string> = {
  Bronze:   "text-orange-700 bg-orange-50 border-orange-200",
  Silver:   "text-gray-600  bg-gray-50   border-gray-200",
  Gold:     "text-yellow-700 bg-yellow-50 border-yellow-200",
  Platinum: "text-blue-600  bg-blue-50   border-blue-200",
};

const statusBadge: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  closed: "bg-gray-100  text-gray-500",
  draft:  "bg-yellow-100 text-yellow-700",
};

const locationIcon: Record<string, string> = {
  Remote: "🌐", Onsite: "🏢", Hybrid: "🔀",
};

export default function EmployerDashboard() {
  const profile = MOCK_EMPLOYER_PROFILE;
  const jobs    = MOCK_EMPLOYER_JOBS;

  const totalApplicants  = MOCK_APPLICANTS.length;
  const totalShortlisted = MOCK_APPLICANTS.filter((a) => a.status === "shortlisted").length;
  const activeJobs       = jobs.filter((j) => j.status === "active").length;

  // Recent applicants across all jobs (latest 4)
  const recentApplicants = [...MOCK_APPLICANTS]
    .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
    .slice(0, 4);

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F6FF]">
        {/* Top banner */}
        <div className="bg-white text-[#1E1B2E] py-8">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#D64545] flex items-center justify-center text-2xl font-bold">
                {profile.companyName.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold">{profile.companyName}</h1>
                <p className="text-[#6B6880]/60 text-sm flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" /> {profile.location}
                  <span className="mx-1 text-[#CCCCCC]">·</span>
                  <Building2 className="w-3.5 h-3.5" /> {profile.industry}
                </p>
              </div>
            </div>
            <Link
              href="/employer/post-job"
              className="flex items-center gap-2 bg-[#D64545] hover:bg-[#C23B3B] text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Pasang Lowongan Baru
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Lowongan Aktif",    value: activeJobs,        icon: Briefcase,    color: "text-[#D64545]", bg: "bg-purple-50" },
              { label: "Total Pelamar",     value: totalApplicants,   icon: Users,        color: "text-blue-600",  bg: "bg-blue-50"   },
              { label: "Shortlisted",       value: totalShortlisted,  icon: CheckCircle,  color: "text-green-600", bg: "bg-green-50"  },
              { label: "Total Lowongan",    value: jobs.length,       icon: TrendingUp,   color: "text-[#E8B4D1]", bg: "bg-orange-50" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-[#EAE6F5] rounded-xl p-4">
                <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <p className="text-2xl font-bold text-[#1E1B2E]">{s.value}</p>
                <p className="text-xs text-[#6B6880] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Job listings */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[#1E1B2E]">Lowongan Saya</h2>
                <Link href="/employer/post-job" className="text-sm text-[#D64545] hover:underline font-semibold">
                  + Pasang baru
                </Link>
              </div>

              <div className="space-y-3">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white border border-[#EAE6F5] rounded-xl p-5 hover:border-[#D64545]/40 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-[#1E1B2E]">{job.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusBadge[job.status]}`}>
                            {job.status === "active" ? "Aktif" : job.status === "closed" ? "Selesai" : "Draft"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-[#6B6880]">
                          <span>{formatBudgetRange(job.budget.min, job.budget.max)}</span>
                          <span>·</span>
                          <span>{locationIcon[job.locationType]} {job.locationType}</span>
                          <span>·</span>
                          <span>Dipost {job.postedAt}</span>
                        </div>
                      </div>
                      {job.status === "active" && (
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-[#6B6880]">Deadline</p>
                          <p className={`text-sm font-bold ${job.deadlineDays <= 7 ? "text-[#E8B4D1]" : "text-[#1E1B2E]"}`}>
                            {job.deadlineDays} hari
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Users className="w-4 h-4 text-[#6B6880]" />
                        <span className="font-semibold text-[#1E1B2E]">{job.applicantCount}</span>
                        <span className="text-[#6B6880]">pelamar</span>
                      </div>
                      {job.shortlistedCount > 0 && (
                        <div className="flex items-center gap-1.5 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="font-semibold text-green-700">{job.shortlistedCount}</span>
                          <span className="text-[#6B6880]">shortlist</span>
                        </div>
                      )}
                      {job.status === "active" && job.applicantCount === 0 && (
                        <span className="text-xs text-[#6B6880] italic">Belum ada pelamar</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.skills.map((s) => (
                        <span key={s} className="text-xs bg-[#F3F0FB] text-[#D64545] px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>

                    {job.applicantCount > 0 && (
                      <Link
                        href={`/employer/jobs/${job.id}/applicants`}
                        className="flex items-center gap-1 text-sm text-[#D64545] hover:underline font-semibold"
                      >
                        Lihat Semua Pelamar <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-5">
              {/* Pelamar terbaru */}
              <div className="bg-white border border-[#EAE6F5] rounded-xl p-5">
                <h3 className="font-bold text-[#1E1B2E] mb-4">Pelamar Terbaru</h3>
                <div className="space-y-3">
                  {recentApplicants.map((a) => {
                    const job = jobs.find((j) => j.id === a.jobId);
                    return (
                      <div key={a.id} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D64545] to-[#E8B4D1] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {a.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1E1B2E] truncate">{a.name}</p>
                          <p className="text-xs text-[#6B6880] truncate">{job?.title}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold flex-shrink-0 ${levelColor[a.level]}`}>
                          {a.level}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Company stats */}
              <div className="bg-white text-white rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-[#E8B4D1]" />
                  <h3 className="font-bold text-sm">Bergabung {profile.joinedAt}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-[#E8B4D1]">{profile.totalJobsPosted}</p>
                    <p className="text-xs text-[#6B6880]/60 mt-0.5">Lowongan Dipost</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-[#E8B4D1]">{profile.totalHired}</p>
                    <p className="text-xs text-[#6B6880]/60 mt-0.5">Freelancer Hired</p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-800 mb-1">💡 Tips Employer</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Freelancer dengan badge <strong>Silver ke atas</strong> dan passport progress &gt;15 hari biasanya lebih konsisten dalam delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
