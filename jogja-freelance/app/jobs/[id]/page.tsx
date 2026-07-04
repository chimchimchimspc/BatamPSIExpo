"use client";
import { useState } from "react";
import { use } from "react";
import { notFound } from "next/navigation";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import ApplyModal from "../../components/jobs/ApplyModal";
import Toast from "../../components/ui/Toast";
import { ArrowLeft, DollarSign, Clock, Eye, Users, MapPin, Mail, Phone, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getJobById, formatBudget, MOCK_JOBS } from "../../data/jobs";

const categoryColor: Record<string, "blue" | "orange" | "green" | "gray"> = {
  "Web Development":    "blue",
  "UI/UX Design":       "orange",
  "Mobile Development": "blue",
  "Content Writing":    "green",
  "Video Editing":      "gray",
  "Social Media":       "orange",
  "Logo Design":        "green",
};

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const job = getJobById(id);

  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!job) return notFound();

  const relatedJobs = MOCK_JOBS.filter((j) => j.id !== job.id && j.category === job.category).slice(0, 3);

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F1F1F1] py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#565A5C] mb-6">
            <Link href="/jobs" className="flex items-center gap-1 hover:text-[#146EB4] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Lowongan
            </Link>
            <span>/</span>
            <span className="text-[#232F3E]">{job.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Main Content */}
            <div className="space-y-4">
              {/* Job Header Card */}
              <div className="bg-white border border-[#E7E7E7] rounded-lg p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <Badge
                      label={job.category}
                      color={categoryColor[job.category] ?? "blue"}
                      className="mb-2"
                    />
                    <h1 className="text-2xl font-bold text-[#232F3E] mb-1">{job.title}</h1>
                    <p className="text-[#565A5C]">{job.company}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#565A5C] flex-shrink-0">
                    <Eye className="w-4 h-4" />
                    <span>{job.views} views</span>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E7E7E7]">
                  {[
                    { icon: DollarSign, label: "Budget",    val: formatBudget(job.budget) },
                    { icon: Clock,       label: "Deadline",  val: `${job.deadline} hari lagi` },
                    { icon: MapPin,      label: "Lokasi",    val: job.location },
                    { icon: Users,       label: "Pelamar",   val: `${job.applicationCount} orang` },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label} className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[#565A5C] mb-1">
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{label}</span>
                      </div>
                      <p className="text-sm font-semibold text-[#232F3E]">{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white border border-[#E7E7E7] rounded-lg p-6">
                <h2 className="text-lg font-bold text-[#232F3E] mb-4">Deskripsi Pekerjaan</h2>
                <p className="text-sm text-[#232F3E] leading-relaxed">{job.description}</p>
              </div>

              {/* Requirements */}
              <div className="bg-white border border-[#E7E7E7] rounded-lg p-6">
                <h2 className="text-lg font-bold text-[#232F3E] mb-4">Persyaratan</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#232F3E]">
                      <CheckCircle className="w-4 h-4 text-[#12A54D] flex-shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div className="bg-white border border-[#E7E7E7] rounded-lg p-6">
                <h2 className="text-lg font-bold text-[#232F3E] mb-4">Skill yang Dibutuhkan</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 bg-blue-50 text-[#146EB4] rounded-full text-sm font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related Jobs */}
              {relatedJobs.length > 0 && (
                <div className="bg-white border border-[#E7E7E7] rounded-lg p-6">
                  <h2 className="text-lg font-bold text-[#232F3E] mb-4">Lowongan Serupa</h2>
                  <div className="space-y-3">
                    {relatedJobs.map((rj) => (
                      <Link
                        key={rj.id}
                        href={`/jobs/${rj.id}`}
                        className="flex items-start justify-between gap-3 p-3 bg-[#F1F1F1] rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#232F3E]">{rj.title}</p>
                          <p className="text-xs text-[#565A5C]">{rj.company}</p>
                        </div>
                        <span className="text-xs font-semibold text-[#E8B4D1] flex-shrink-0">
                          {formatBudget(rj.budget)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Apply CTA */}
              <div className="bg-white border border-[#E7E7E7] rounded-lg p-5 sticky top-24">
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-[#232F3E]">{formatBudget(job.budget)}</p>
                  <p className="text-xs text-[#565A5C]">Budget proyek</p>
                </div>

                {applied ? (
                  <div className="text-center py-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                    <CheckCircle className="w-5 h-5 text-[#12A54D] mx-auto mb-1" />
                    <p className="text-sm font-semibold text-[#12A54D]">Lamaran Terkirim!</p>
                    <p className="text-xs text-[#565A5C] mt-1">Tunggu respon dari employer</p>
                  </div>
                ) : (
                  <Button fullWidth size="lg" onClick={() => setShowModal(true)} className="mb-3">
                    Lamar Sekarang
                  </Button>
                )}

                {job.deadline <= 7 && (
                  <div className="flex items-center gap-2 text-xs text-[#DC2C1E] bg-red-50 rounded-lg p-2 mt-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    Deadline sangat dekat — {job.deadline} hari lagi!
                  </div>
                )}

                <div className="border-t border-[#E7E7E7] mt-4 pt-4 space-y-2">
                  <h4 className="text-sm font-semibold text-[#232F3E]">Kontak Employer</h4>
                  <div className="flex items-center gap-2 text-sm text-[#565A5C]">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{job.contactEmail}</span>
                  </div>
                  {job.contactWhatsapp && (
                    <div className="flex items-center gap-2 text-sm text-[#565A5C]">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{job.contactWhatsapp}</span>
                    </div>
                  )}
                  <p className="text-xs text-[#565A5C] mt-2">
                    Kontak tersedia setelah lamaran diterima
                  </p>
                </div>
              </div>

              {/* Employer Card */}
              <div className="bg-white border border-[#E7E7E7] rounded-lg p-5">
                <h4 className="text-sm font-bold text-[#232F3E] mb-3">Tentang Employer</h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#232F3E] flex items-center justify-center text-white font-bold">
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#232F3E]">{job.company}</p>
                    <p className="text-xs text-[#565A5C]">Verified Employer</p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-[#565A5C] space-y-1">
                  <p>📍 {job.location}</p>
                  <p>📅 Diposting {job.postedAt}</p>
                  <p>👁️ {job.views} kali dilihat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <ApplyModal
        job={showModal ? job : null}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setApplied(true);
          setShowModal(false);
          setToast("Lamaran berhasil dikirim! Employer akan menghubungi Anda.");
        }}
      />

      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast(null)} />
      )}
    </>
  );
}
