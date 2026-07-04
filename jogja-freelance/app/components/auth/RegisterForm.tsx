"use client";
import { useState } from "react";
import { Input, Checkbox } from "../ui/Input";
import Button from "../ui/Button";
import Toast from "../ui/Toast";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

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

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  city: string;
  skills: string[];
  agreeTerms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function RegisterForm() {
  const { register } = useAuth();
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    city: "Yogyakarta",
    skills: [],
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.email) newErrors.email = "Email diperlukan";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Format email tidak valid";

    if (!form.password) newErrors.password = "Password diperlukan";
    else if (form.password.length < 8) newErrors.password = "Password minimal 8 karakter";

    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Password tidak cocok";

    if (!form.fullName) newErrors.fullName = "Nama lengkap diperlukan";
    if (form.fullName.length < 3) newErrors.fullName = "Nama minimal 3 karakter";

    if (form.skills.length === 0) newErrors.skills = "Pilih minimal 1 skill";
    if (form.skills.length > 5) newErrors.skills = "Maksimal 5 skill";

    if (!form.agreeTerms) newErrors.agreeTerms = "Setuju dengan syarat dan ketentuan";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        full_name: form.fullName,
        city: form.city,
      });
      setToast({ message: "Akun berhasil dibuat! Lengkapi profil Anda.", type: "success" });
      setTimeout(() => (window.location.href = "/auth/profile-setup"), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.";
      setToast({ message, type: "error" });
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
      <Input
        label="Email"
        type="email"
        placeholder="kamu@example.com"
        value={form.email}
        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
        error={errors.email}
      />

      <Input
        label="Nama Lengkap"
        type="text"
        placeholder="Nama Anda"
        value={form.fullName}
        onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
        error={errors.fullName}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Minimal 6 karakter"
        value={form.password}
        onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
        error={errors.password}
      />

      <Input
        label="Konfirmasi Password"
        type="password"
        placeholder="Masukkan ulang password"
        value={form.confirmPassword}
        onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
        error={errors.confirmPassword}
      />

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2 text-[#232F3E]">Pilih Skill (3-5)</label>
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
        label="Saya setuju dengan Syarat & Ketentuan"
        checked={form.agreeTerms}
        onChange={(v) => setForm((p) => ({ ...p, agreeTerms: v }))}
      />
      {errors.agreeTerms && <span className="block text-xs text-[#DC2C1E]">{errors.agreeTerms}</span>}

      <Button type="submit" fullWidth size="lg" loading={loading}>
        Daftar Akun
      </Button>

      <p className="text-center text-sm text-[#565A5C]">
        Sudah punya akun?{" "}
        <Link href="/auth/login" className="text-[#D64545] font-semibold hover:underline">
          Masuk di sini
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
