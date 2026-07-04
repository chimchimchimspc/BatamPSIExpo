"use client";
import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Toast from "../ui/Toast";
import { Textarea } from "../ui/Input";
import { type Job, formatBudget } from "../../data/jobs";
import { api, type ApiError } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { DollarSign, Clock, Building2 } from "lucide-react";

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (jobId: string) => void;
}

const MAX_COVER = 300;

export default function ApplyModal({ job, isOpen, onClose, onSuccess }: ApplyModalProps) {
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleClose = () => {
    setCoverLetter("");
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!user) {
      setError("Silakan login sebagai freelancer dulu untuk melamar.");
      return;
    }
    if (user.role && user.role !== "freelancer") {
      setError("Hanya akun freelancer yang dapat melamar pekerjaan.");
      return;
    }
    if (coverLetter.trim().length < 20) {
      setError("Pesan minimal 20 karakter");
      return;
    }
    if (coverLetter.length > MAX_COVER) {
      setError(`Pesan maksimal ${MAX_COVER} karakter`);
      return;
    }
    if (!job) return;
    setError("");
    setLoading(true);

    try {
      // Persist the application in the backend so it shows on "Lamaranku".
      await api.applications.create(job.id, coverLetter.trim());
      setToast({ message: "Lamaran berhasil dikirim!", type: "success" });
      setTimeout(() => {
        onSuccess(job.id);
        handleClose();
        setToast(null);
      }, 1200);
    } catch (err) {
      const e = err as ApiError;
      setToast({
        message: e?.message || "Gagal mengirim lamaran. Coba lagi.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Lamar Pekerjaan"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Batal
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              Kirim Lamaran
            </Button>
          </>
        }
      >
        {/* Job Summary */}
        <div className="bg-[#F1F1F1] rounded-lg p-4 mb-5">
          <h4 className="font-bold text-[#232F3E] mb-1">{job.title}</h4>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#565A5C]">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> {job.company}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> {formatBudget(job.budget)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {job.deadline} hari
            </span>
          </div>
        </div>

        {/* Profile Preview */}
        <div className="flex items-center gap-3 bg-blue-50 border border-[#EBF5FF] rounded-lg p-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-[#146EB4] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            AN
          </div>
          <div>
            <p className="text-sm font-semibold text-[#232F3E]">Andi Nugroho</p>
            <p className="text-xs text-[#565A5C]">Web Developer · 3 skill · 0 badge</p>
          </div>
          <span className="ml-auto text-xs text-[#146EB4] bg-blue-100 px-2 py-1 rounded font-medium">
            Profil Anda
          </span>
        </div>

        {/* Cover Letter */}
        <Textarea
          label={`Pesan Singkat ke Employer`}
          placeholder="Ceritakan kenapa Anda cocok untuk pekerjaan ini, pengalaman relevan, dan kapan bisa mulai. Singkat, padat, menarik!"
          value={coverLetter}
          onChange={(e) => {
            setCoverLetter(e.target.value);
            if (error) setError("");
          }}
          rows={5}
          maxLength={MAX_COVER}
          currentLength={coverLetter.length}
          error={error}
          hint="Tips: Sebutkan pengalaman relevan & link portfolio Anda"
        />

        <p className="text-xs text-[#565A5C]">
          Employer akan menghubungi Anda via{" "}
          <span className="font-semibold">{job.contactWhatsapp ? "WhatsApp / " : ""}Email</span> jika tertarik.
        </p>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
