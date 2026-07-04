"use client";
import { useState } from "react";
import { Input, Textarea, Checkbox } from "../ui/Input";
import Button from "../ui/Button";
import Toast from "../ui/Toast";
import { Upload } from "lucide-react";
import Link from "next/link";

interface FormData {
  profilePicture: File | null;
  bio: string;
  portfolioUrl: string;
  skills: string[];
  agreeDataUsage: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const SKILL_OPTIONS = [
  "Web Development",
  "UI/UX Design",
  "Content Writing",
  "Video Editing",
  "Social Media",
  "Logo Design",
  "Mobile Development",
  "Photography",
];

export default function ProfileSetupForm() {
  const [form, setForm] = useState<FormData>({
    profilePicture: null,
    bio: "",
    portfolioUrl: "",
    skills: [],
    agreeDataUsage: false,
  });

  const [preview, setPreview] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (form.bio.length < 20) newErrors.bio = "Bio minimal 20 karakter";
    if (form.bio.length > 500) newErrors.bio = "Bio maksimal 500 karakter";

    if (form.portfolioUrl && !/^https?:\/\/.+/.test(form.portfolioUrl)) {
      newErrors.portfolioUrl = "URL portfolio tidak valid";
    }

    if (form.skills.length === 0) newErrors.skills = "Pilih minimal 1 skill";

    if (!form.agreeDataUsage) newErrors.agreeDataUsage = "Setuju dengan penggunaan data";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, profilePicture: "Ukuran maksimal 5MB" }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((p) => ({ ...p, profilePicture: "Hanya file gambar" }));
      return;
    }

    setForm((p) => ({ ...p, profilePicture: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setToast({ message: "Profil berhasil dibuat! Mulai panduan Anda.", type: "success" });
      setTimeout(() => (window.location.href = "/passport"), 2000);
    } catch (err) {
      setToast({ message: "Terjadi kesalahan. Coba lagi.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setForm((p) => ({
      ...p,
      skills: p.skills.includes(skill) ? p.skills.filter((s) => s !== skill) : [...p.skills, skill],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Profile Picture Upload */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3 text-[#232F3E]">Foto Profil</label>
        <div className="flex items-start gap-4">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#E8B4D1]"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#F1F1F1] border-2 border-dashed border-[#CCCCCC] flex items-center justify-center text-[#565A5C]">
              <span className="text-2xl">📷</span>
            </div>
          )}
          <div className="flex-1">
            <label className="flex items-center gap-2 px-4 py-2 bg-[#F1F1F1] border border-[#CCCCCC] rounded cursor-pointer hover:bg-[#E7E7E7] transition-colors">
              <Upload className="w-4 h-4" />
              <span className="text-sm font-semibold text-[#232F3E]">Pilih Foto</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-[#565A5C] mt-2">Max 5MB. Format: JPG, PNG, WebP</p>
            {errors.profilePicture && (
              <span className="block text-xs text-[#DC2C1E] mt-1">{errors.profilePicture}</span>
            )}
          </div>
        </div>
      </div>

      <Textarea
        label="Bio Singkat"
        placeholder="Ceritakan tentang Anda dalam 20-500 karakter..."
        value={form.bio}
        onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
        currentLength={form.bio.length}
        maxLength={500}
        error={errors.bio}
        rows={4}
      />

      <Input
        label="Portfolio URL (Opsional)"
        type="url"
        placeholder="https://portfolio.com atau https://github.com/username"
        value={form.portfolioUrl}
        onChange={(e) => setForm((p) => ({ ...p, portfolioUrl: e.target.value }))}
        error={errors.portfolioUrl}
        hint="Link ke portfolio, GitHub, atau website Anda"
      />

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2 text-[#232F3E]">Update Skill Anda</label>
        <div className="grid grid-cols-2 gap-2">
          {SKILL_OPTIONS.map((skill) => (
            <label key={skill} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.skills.includes(skill)}
                onChange={() => toggleSkill(skill)}
                className="w-4 h-4 accent-[#E8B4D1]"
              />
              <span className="text-sm text-[#232F3E]">{skill}</span>
            </label>
          ))}
        </div>
        {errors.skills && <span className="block text-xs text-[#DC2C1E] mt-2">{errors.skills}</span>}
        <span className="block text-xs text-[#565A5C] mt-2">{form.skills.length} skill dipilih</span>
      </div>

      <Checkbox
        label="Saya setuju data saya digunakan sesuai kebijakan privasi"
        checked={form.agreeDataUsage}
        onChange={(v) => setForm((p) => ({ ...p, agreeDataUsage: v }))}
      />
      {errors.agreeDataUsage && (
        <span className="block text-xs text-[#DC2C1E]">{errors.agreeDataUsage}</span>
      )}

      <Button type="submit" fullWidth size="lg" loading={loading}>
        Selesaikan Setup & Mulai Panduan
      </Button>

      <p className="text-center text-xs text-[#565A5C]">
        Bisa diubah nanti di{" "}
        <Link href="/profile" className="text-[#146EB4] hover:underline">
          halaman profil
        </Link>
      </p>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={toast.type === "success" ? 2000 : 4000}
        />
      )}
    </form>
  );
}
