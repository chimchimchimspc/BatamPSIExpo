import Link from "next/link";
import Image from "next/image";
import Button from "../ui/Button";

export default function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background image with blur */}
      <Image
        src="/cta-bg.jpg"
        alt="CTA Background"
        fill
        className="object-cover object-center absolute inset-0"
        style={{
          filter: "blur(8px)",
          zIndex: 0
        }}
        priority
      />
      {/* Overlay with fade top */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,245,245,0.85) 20%, rgba(255,235,240,0.75) 100%)"
        }}
      />

      <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1E1B2E]">
          Siap Mulai Perjalanan Freelance-mu di Jogja?
        </h2>
        <p className="text-[#6B6880] text-lg mb-8 max-w-xl mx-auto">
          Daftar gratis, mulai panduan 30 hari, dan temukan peluang pertamamu hari ini.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register">
            <Button size="lg" className="min-w-48">
              Daftar Gratis — Mulai Sekarang
            </Button>
          </Link>
          <Link href="/jobs">
            <Button size="lg" variant="secondary" className="min-w-48">
              Lihat Lowongan Dulu
            </Button>
          </Link>
        </div>
        <p className="text-[#6B6880]/60 text-xs mt-6">Gratis selamanya untuk freelancer · Tidak perlu kartu kredit</p>
      </div>
    </section>
  );
}
