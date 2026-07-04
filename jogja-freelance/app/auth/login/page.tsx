import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import LoginForm from "../../components/auth/LoginForm";
import AuthBackground from "../../components/auth/AuthBackground";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="flex-1 relative overflow-hidden py-12 min-h-[calc(100vh-200px)]">
        <AuthBackground />
        <div className="relative z-10 max-w-md mx-auto px-4 animate-auth-page">
          <Link href="/" className="inline-flex items-center gap-2 text-[#D64545] hover:underline text-sm mb-6">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>

          <div className="bg-white rounded-xl border border-[#E7E7E7] p-8 shadow-sm">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-[#232F3E] mb-1">Masuk Akun</h1>
              <p className="text-sm text-[#565A5C]">Akses dashboard Anda</p>
            </div>

            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
