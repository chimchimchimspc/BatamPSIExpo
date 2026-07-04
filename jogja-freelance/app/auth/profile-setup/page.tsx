import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProfileSetupForm from "../../components/auth/ProfileSetupForm";
import ProgressBar from "../../components/ui/ProgressBar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfileSetupPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F1F1F1] py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-[#146EB4] hover:underline text-sm mb-6">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>

          <div className="bg-white rounded-xl border border-[#E7E7E7] p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="inline-block bg-blue-50 text-[#146EB4] text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
                Langkah 2 dari 2
              </div>
              <h1 className="text-2xl font-bold text-[#232F3E] mb-2">Lengkapi Profil Anda</h1>
              <p className="text-sm text-[#565A5C] max-w-md mx-auto">
                Informasi ini akan ditampilkan ke employer untuk meningkatkan peluang Anda mendapat project.
              </p>
            </div>

            <ProgressBar value={2} max={2} label="Progress Setup" showPercent className="mb-8" />

            <ProfileSetupForm />

            {/* Tips section */}
            <div className="mt-8 p-4 bg-blue-50 border border-[#EBF5FF] rounded-lg">
              <h4 className="text-sm font-semibold text-[#146EB4] mb-2">💡 Tips Profil Terbaik</h4>
              <ul className="text-xs text-[#565A5C] space-y-1">
                <li>• Foto profil berkualitas dengan wajah terlihat jelas</li>
                <li>• Bio singkat tapi informatif — sebutkan spesialisasi & pengalaman</li>
                <li>• Link portfolio/GitHub untuk showcase karya Anda</li>
                <li>• Pilih skill yang benar-benar Anda kuasai</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
