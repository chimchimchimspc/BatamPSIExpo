"use client";
import { useState, useMemo, useEffect } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import JobCard from "../components/jobs/JobCard";
import JobFilters, { DEFAULT_FILTERS, type Filters } from "../components/jobs/JobFilters";
import ApplyModal from "../components/jobs/ApplyModal";
import Toast from "../components/ui/Toast";
import { Search, SlidersHorizontal, X, Briefcase } from "lucide-react";
import { MOCK_JOBS, type Job } from "../data/jobs";
import Link from "next/link";
import FadeInSection from "../components/ui/FadeInSection";

const SORT_OPTIONS = [
  { value: "newest",  label: "Terbaru" },
  { value: "budget",  label: "Budget Tertinggi" },
  { value: "deadline",label: "Deadline Terdekat" },
  { value: "popular", label: "Paling Populer" },
];

export default function JobsPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState("newest");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const { user } = useAuth();

  // Mark jobs the user has already applied to (so their cards show "Applied").
  useEffect(() => {
    if (!user) {
      setAppliedIds(new Set());
      return;
    }
    let active = true;
    api.applications
      .mine()
      .then((rows) => {
        if (active) setAppliedIds(new Set((rows || []).map((a) => a.job_id)));
      })
      .catch(() => {
        /* ignore — applied state is best-effort */
      });
    return () => {
      active = false;
    };
  }, [user]);

  const filtered = useMemo(() => {
    let result = MOCK_JOBS.filter((job) => {
      if (filters.category !== "Semua Kategori" && job.category !== filters.category) return false;
      if (job.budget > filters.budgetMax) return false;
      if (job.deadline > filters.deadlineMax) return false;
      if (filters.skills.length > 0 && !filters.skills.some((s) => job.skills.includes(s))) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!job.title.toLowerCase().includes(q) && !job.company.toLowerCase().includes(q) && !job.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    if (sort === "budget")   result = [...result].sort((a, b) => b.budget - a.budget);
    if (sort === "deadline") result = [...result].sort((a, b) => a.deadline - b.deadline);
    if (sort === "popular")  result = [...result].sort((a, b) => b.views - a.views);

    return result;
  }, [filters, sort]);

  const handleApplySuccess = (jobId: string) => {
    setAppliedIds((p) => new Set([...p, jobId]));
    setToast("Lamaran berhasil dikirim! Pantau di halaman Lamaranku.");
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F1F1F1]">
        {/* Page Header */}
        <div className="bg-white text-[#1E1B2E] py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="w-6 h-6 text-[#D64545]" />
              <h1 className="text-3xl font-bold">Lowongan Freelance di Jogja</h1>
            </div>
            <p className="text-[#6B6880] text-sm">{MOCK_JOBS.length} lowongan aktif · Diverifikasi admin</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Search + Sort bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#565A5C]" />
              <input
                type="text"
                placeholder="Cari judul, company, atau deskripsi..."
                value={filters.search}
                onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#CCCCCC] rounded-lg bg-white focus:outline-none focus:border-[#146EB4] focus:ring-2 focus:ring-[#146EB4]/10"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters((p) => ({ ...p, search: "" }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#565A5C] hover:text-[#232F3E]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#CCCCCC] rounded-lg bg-white text-[#232F3E] focus:outline-none focus:border-[#146EB4]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <button
              onClick={() => setShowMobileFilter((v) => !v)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 text-sm border border-[#CCCCCC] rounded-lg bg-white text-[#232F3E]"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filter
            </button>

            <Link
              href="/jobs/applications"
              className="flex items-center gap-2 px-4 py-2.5 text-sm bg-[#D64545] hover:bg-[#C23B3B] text-white rounded-lg font-semibold transition-colors whitespace-nowrap"
            >
              Lamaranku ({appliedIds.size})
            </Link>
          </div>

          {/* Mobile filter */}
          {showMobileFilter && (
            <div className="md:hidden mb-4">
              <JobFilters
                filters={filters}
                onChange={setFilters}
                resultCount={filtered.length}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
            {/* Sidebar filter — desktop */}
            <div className="hidden md:block">
              <JobFilters filters={filters} onChange={setFilters} resultCount={filtered.length} />
            </div>

            {/* Job grid */}
            <div>
              {filtered.length === 0 ? (
                <div className="bg-white border border-[#E7E7E7] rounded-lg p-16 text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-lg font-bold text-[#232F3E] mb-2">Tidak ada hasil</h3>
                  <p className="text-sm text-[#565A5C] mb-4">Coba ubah filter atau kata kunci pencarian</p>
                  <button
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="text-sm text-[#146EB4] hover:underline"
                  >
                    Reset semua filter
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-[#565A5C] mb-4">
                    Menampilkan <strong>{filtered.length}</strong> dari {MOCK_JOBS.length} lowongan
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filtered.map((job, i) => (
                      <FadeInSection key={job.id} delay={Math.min(i * 80, 320)}>
                        <JobCard
                          job={job}
                          onApply={setApplyJob}
                          applied={appliedIds.has(job.id)}
                        />
                      </FadeInSection>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <ApplyModal
        job={applyJob}
        isOpen={!!applyJob}
        onClose={() => setApplyJob(null)}
        onSuccess={handleApplySuccess}
      />

      {toast && (
        <Toast
          message={toast}
          type="success"
          onClose={() => setToast(null)}
          duration={5000}
        />
      )}
    </>
  );
}
