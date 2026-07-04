"use client";
import { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Toast from "../../components/ui/Toast";
import { Briefcase, CheckCircle, ChevronLeft, X } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  "Web Development", "Mobile Development", "UI/UX Design",
  "Graphic Design", "Content Writing", "Video Editing",
  "Social Media", "Photography", "Translation", "Lainnya",
];

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  "Web Development":    ["React", "Vue.js", "Next.js", "TypeScript", "Node.js", "Laravel", "Tailwind CSS"],
  "Mobile Development": ["React Native", "Flutter", "Kotlin", "Swift", "Expo"],
  "UI/UX Design":       ["Figma", "Prototyping", "User Research", "Adobe XD", "Sketch"],
  "Graphic Design":     ["Illustrator", "Photoshop", "Canva", "Branding", "Logo Design"],
  "Content Writing":    ["SEO Writing", "Copywriting", "WordPress", "Content Strategy"],
  "Video Editing":      ["Premiere Pro", "After Effects", "DaVinci Resolve", "Color Grading"],
  "Social Media":       ["Instagram", "TikTok", "Copywriting", "Analytics", "Ads"],
  "Photography":        ["Product Photography", "Editing", "Lightroom"],
  "Translation":        ["Inggris-Indonesia", "Proofreading", "Subtitling"],
  "Lainnya":            [],
};

interface FormData {
  title: string;
  category: string;
  description: string;
  skills: string[];
  budgetMin: string;
  budgetMax: string;
  deadlineDays: string;
  locationType: "Remote" | "Onsite" | "Hybrid";
  experienceLevel: "Junior" | "Mid" | "Senior";
}

const INIT: FormData = {
  title: "", category: "", description: "",
  skills: [], budgetMin: "", budgetMax: "",
  deadlineDays: "14",
  locationType: "Remote", experienceLevel: "Mid",
};

export default function PostJobPage() {
  const [form, setForm]         = useState<FormData>(INIT);
  const [skillInput, setSkillInput] = useState("");
  const [submitted, setSubmitted]   = useState(false);
  const [toast, setToast]           = useState<string | null>(null);
  const [errors, setErrors]         = useState<Partial<Record<keyof FormData, string>>>({});

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !form.skills.includes(s) && form.skills.length < 6) {
      set("skills", [...form.skills, s]);
      setSkillInput("");
    }
  };

  const removeSkill = (s: string) => set("skills", form.skills.filter((x) => x !== s));

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.title.trim())         e.title = "Judul lowongan wajib diisi";
    if (!form.category)             e.category = "Pilih kategori";
    if (!form.description.trim() || form.description.length < 50)
                                    e.description = "Deskripsi minimal 50 karakter";
    if (!form.budgetMin || +form.budgetMin < 100000) e.budgetMin = "Budget minimal Rp 100.000";
    if (!form.budgetMax || +form.budgetMax < +form.budgetMin)
                                    e.budgetMax = "Budget maks harus lebih besar dari min";
    if (!form.deadlineDays || +form.deadlineDays < 3) e.deadlineDays = "Minimal 3 hari";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setToast("Lowongan berhasil dipasang! Menunggu review admin (1–2 hari kerja).");
  };

  const fmtBudget = (val: string) =>
    val ? `Rp ${Number(val).toLocaleString("id-ID")}` : "—";

  if (submitted) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-[#F8F6FF]">
          <div className="max-w-lg mx-auto px-4 py-20 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#1E1B2E] mb-3">Lowongan Berhasil Dipasang!</h1>
            <p className="text-[#6B6880] mb-2">
              <strong className="text-[#1E1B2E]">{form.title}</strong> sedang direview oleh admin.
            </p>
            <p className="text-sm text-[#6B6880] mb-8">
              Biasanya disetujui dalam 1–2 hari kerja. Anda akan diberitahu saat lowongan live.
            </p>
            <div className="bg-white border border-[#EAE6F5] rounded-xl p-5 text-left mb-8">
              <h3 className="font-bold text-[#1E1B2E] mb-3 text-sm">Ringkasan</h3>
              <div className="space-y-2 text-sm">
                {[
                  ["Kategori",   form.category],
                  ["Budget",     `${fmtBudget(form.budgetMin)} – ${fmtBudget(form.budgetMax)}`],
                  ["Deadline",   `${form.deadlineDays} hari`],
                  ["Lokasi",     form.locationType],
                  ["Level",      form.experienceLevel],
                  ["Skill",      form.skills.join(", ") || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <span className="text-[#6B6880] w-24 flex-shrink-0">{k}</span>
                    <span className="font-semibold text-[#1E1B2E]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/employer" className="px-5 py-2.5 bg-[#D64545] hover:bg-[#C23B3B] text-white rounded-lg font-semibold text-sm transition-colors">
                Kembali ke Dashboard
              </Link>
              <button
                onClick={() => { setForm(INIT); setSubmitted(false); setErrors({}); }}
                className="px-5 py-2.5 border border-[#EAE6F5] text-[#1E1B2E] rounded-lg font-semibold text-sm hover:bg-white transition-colors"
              >
                Pasang Lowongan Lain
              </button>
            </div>
          </div>
        </main>
        <Footer />
        {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} duration={6000} />}
      </>
    );
  }

  const suggestions = SKILL_SUGGESTIONS[form.category] ?? [];

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F6FF]">
        {/* Page header */}
        <div className="bg-white text-[#1E1B2E] py-8">
          <div className="max-w-3xl mx-auto px-4">
            <Link href="/employer" className="flex items-center gap-1.5 text-[#6B6880] hover:text-[#D64545] text-sm mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Dashboard Employer
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D64545] rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Pasang Lowongan Baru</h1>
                <p className="text-[#6B6880]/60 text-sm">Isi detail lowongan Anda untuk mencari freelancer terbaik</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Judul */}
            <div className="bg-white border border-[#EAE6F5] rounded-xl p-6">
              <h2 className="font-bold text-[#1E1B2E] mb-4">Informasi Dasar</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B2E] mb-1.5">
                    Judul Lowongan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="Contoh: React Developer untuk Landing Page UMKM"
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D64545]/30 transition-colors ${errors.title ? "border-red-400" : "border-[#EAE6F5]"}`}
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1E1B2E] mb-1.5">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => { set("category", e.target.value); set("skills", []); }}
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D64545]/30 bg-white transition-colors ${errors.category ? "border-red-400" : "border-[#EAE6F5]"}`}
                  >
                    <option value="">Pilih kategori...</option>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1E1B2E] mb-1.5">
                    Deskripsi Pekerjaan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    rows={5}
                    placeholder="Jelaskan scope pekerjaan, output yang diharapkan, dan preferensi pengerjaan..."
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D64545]/30 resize-none transition-colors ${errors.description ? "border-red-400" : "border-[#EAE6F5]"}`}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.description
                      ? <p className="text-xs text-red-500">{errors.description}</p>
                      : <span />}
                    <p className={`text-xs ml-auto ${form.description.length < 50 ? "text-[#6B6880]" : "text-green-600"}`}>
                      {form.description.length} / 50 min
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white border border-[#EAE6F5] rounded-xl p-6">
              <h2 className="font-bold text-[#1E1B2E] mb-1">Skill yang Dibutuhkan</h2>
              <p className="text-xs text-[#6B6880] mb-4">Maksimal 6 skill. Ketik atau pilih dari saran.</p>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); } }}
                  placeholder="Ketik skill lalu Enter..."
                  className="flex-1 px-3.5 py-2 text-sm border border-[#EAE6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D64545]/30"
                  disabled={form.skills.length >= 6}
                />
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  className="px-4 py-2 bg-[#D64545] text-white text-sm rounded-lg hover:bg-[#C23B3B] transition-colors disabled:opacity-40"
                  disabled={form.skills.length >= 6}
                >
                  Tambah
                </button>
              </div>

              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.skills.map((s) => (
                    <span key={s} className="flex items-center gap-1.5 text-xs bg-[#F3F0FB] text-[#D64545] px-2.5 py-1 rounded-full">
                      {s}
                      <button type="button" onClick={() => removeSkill(s)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {suggestions.length > 0 && (
                <div>
                  <p className="text-xs text-[#6B6880] mb-2">Saran untuk {form.category}:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.filter((s) => !form.skills.includes(s)).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addSkill(s)}
                        disabled={form.skills.length >= 6}
                        className="text-xs border border-[#EAE6F5] text-[#6B6880] hover:border-[#D64545] hover:text-[#D64545] px-2.5 py-1 rounded-full transition-colors disabled:opacity-40"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Budget & Timeline */}
            <div className="bg-white border border-[#EAE6F5] rounded-xl p-6">
              <h2 className="font-bold text-[#1E1B2E] mb-4">Budget & Tenggat Waktu</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B2E] mb-1.5">
                    Budget Minimum (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={form.budgetMin}
                    onChange={(e) => set("budgetMin", e.target.value)}
                    placeholder="Contoh: 1000000"
                    min={100000}
                    step={100000}
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D64545]/30 ${errors.budgetMin ? "border-red-400" : "border-[#EAE6F5]"}`}
                  />
                  {errors.budgetMin && <p className="text-xs text-red-500 mt-1">{errors.budgetMin}</p>}
                  {form.budgetMin && !errors.budgetMin && (
                    <p className="text-xs text-green-600 mt-1">{fmtBudget(form.budgetMin)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1E1B2E] mb-1.5">
                    Budget Maksimum (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={form.budgetMax}
                    onChange={(e) => set("budgetMax", e.target.value)}
                    placeholder="Contoh: 3000000"
                    min={100000}
                    step={100000}
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D64545]/30 ${errors.budgetMax ? "border-red-400" : "border-[#EAE6F5]"}`}
                  />
                  {errors.budgetMax && <p className="text-xs text-red-500 mt-1">{errors.budgetMax}</p>}
                  {form.budgetMax && !errors.budgetMax && (
                    <p className="text-xs text-green-600 mt-1">{fmtBudget(form.budgetMax)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1E1B2E] mb-1.5">
                    Deadline Lamaran (hari) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={form.deadlineDays}
                    onChange={(e) => set("deadlineDays", e.target.value)}
                    min={3}
                    max={60}
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D64545]/30 ${errors.deadlineDays ? "border-red-400" : "border-[#EAE6F5]"}`}
                  />
                  {errors.deadlineDays && <p className="text-xs text-red-500 mt-1">{errors.deadlineDays}</p>}
                  {form.deadlineDays && !errors.deadlineDays && (
                    <p className="text-xs text-[#6B6880] mt-1">Lowongan tutup dalam {form.deadlineDays} hari</p>
                  )}
                </div>
              </div>
            </div>

            {/* Preference */}
            <div className="bg-white border border-[#EAE6F5] rounded-xl p-6">
              <h2 className="font-bold text-[#1E1B2E] mb-4">Preferensi Kerja</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B2E] mb-2">Tipe Lokasi</label>
                  <div className="flex flex-col gap-2">
                    {(["Remote", "Onsite", "Hybrid"] as const).map((t) => (
                      <label key={t} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${form.locationType === t ? "border-[#D64545] bg-[#D64545]" : "border-[#D5D0E8]"}`}>
                          {form.locationType === t && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <input type="radio" className="sr-only" checked={form.locationType === t} onChange={() => set("locationType", t)} />
                        <span className="text-sm text-[#1E1B2E]">{t === "Remote" ? "🌐 Remote" : t === "Onsite" ? "🏢 Onsite (Jogja)" : "🔀 Hybrid"}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1E1B2E] mb-2">Level Pengalaman</label>
                  <div className="flex flex-col gap-2">
                    {(["Junior", "Mid", "Senior"] as const).map((l) => (
                      <label key={l} className="flex items-center gap-3 cursor-pointer">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${form.experienceLevel === l ? "border-[#D64545] bg-[#D64545]" : "border-[#D5D0E8]"}`}>
                          {form.experienceLevel === l && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <input type="radio" className="sr-only" checked={form.experienceLevel === l} onChange={() => set("experienceLevel", l)} />
                        <span className="text-sm text-[#1E1B2E]">
                          {l === "Junior" ? "Junior (0–2 thn)" : l === "Mid" ? "Mid (2–5 thn)" : "Senior (5+ thn)"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Link
                href="/employer"
                className="px-6 py-2.5 border border-[#EAE6F5] text-[#1E1B2E] rounded-lg font-semibold text-sm hover:bg-white transition-colors text-center"
              >
                Batal
              </Link>
              <button
                type="submit"
                className="px-8 py-2.5 bg-[#D64545] hover:bg-[#C23B3B] text-white rounded-lg font-bold text-sm transition-colors"
              >
                Pasang Lowongan
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} duration={6000} />}
    </>
  );
}
