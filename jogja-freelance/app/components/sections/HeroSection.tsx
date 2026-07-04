"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "../ui/Button";

const PHOTOS = [
  "/km0.jpg",
  "/jogja-1.jpg",
  "/jogja-2.jpg",
  "/jogja-3.jpg",
  "/jogja-4.jpg",
];

const FACTS = [
  "Temukan lowongan lokal, ikuti panduan 30 hari, kumpulkan badge kredibilitas, dan bangun komunitas freelancer di Yogyakarta.",
  "Jogja punya 100+ perguruan tinggi — kota dengan konsentrasi talenta muda kreatif tertinggi di Indonesia.",
  "Harga hidup di Jogja 40% lebih murah dibanding Jakarta. Penghasilan freelance-mu bisa jauh lebih bermakna di sini.",
  "Lebih dari 50 coworking space tersebar di Yogyakarta — selalu ada tempat produktif untuk bekerja.",
  "Industri kreatif Jogja tumbuh 12% per tahun. Peluang freelance lokal makin terbuka lebar.",
  "Dengan 300+ hari cerah per tahun, Jogja adalah kota ideal untuk menjaga work-life balance.",
  "Komunitas freelancer Jogja adalah yang paling aktif di luar Jakarta — networking-mu dimulai dari sini.",
];

const STATS = [
  { target: 500, suffix: "+", label: "Freelancer" },
  { target: 120, suffix: "+", label: "Lowongan"   },
  { target: 9,   suffix: "",  label: "Badge Tier"  },
];

function useCountUp(target: number, duration = 3500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    const start = performance.now();
    let raf: number;

    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return count;
}

function StatNumber({ target, suffix }: { target: number; suffix: string }) {
  const count = useCountUp(target);
  return <>{count}{suffix}</>;
}

export default function HeroSection() {
  const [current,     setCurrent]     = useState(0);
  const [fading,      setFading]      = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [factIndex,   setFactIndex]   = useState(0);
  const [factFading,  setFactFading]  = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCardVisible(true), 60);
    return () => clearTimeout(timer);
  }, []);

  // Photo slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % PHOTOS.length);
        setTimeout(() => {
          setFading(false);
        }, 50);
      }, 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Facts cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setFactFading(true);
      setTimeout(() => {
        setFactIndex((prev) => (prev + 1) % FACTS.length);
        setFactFading(false);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0 z-0">
        <Image
          key={current}
          src={PHOTOS[current]}
          alt="Yogyakarta"
          fill
          className="object-cover object-center"
          style={{
            transition: fading ? "opacity 400ms ease-out" : "opacity 1000ms ease-in",
            opacity: fading ? 0 : 1,
          }}
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, rgba(255,245,245,0.6) 50%, rgba(255,245,245,0.92) 80%, #FFF5F5 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-20 text-center">
        {/* Frosted glass card */}
        <div
          className="rounded-2xl px-8 py-12 md:px-14 md:py-16 mx-auto max-w-3xl"
          style={{
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(30,27,46,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
            border: "1px solid rgba(255,255,255,0.7)",
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}
        >
          {/* Logo */}
          <div className="-mb-3">
            <Image src="/logo.png" alt="Jogja Freelance" width={200} height={50} className="object-contain mx-auto" />
          </div>

          <p className="text-sm text-[#1E1B2E] font-medium mb-6">
            Platform Freelancer Yogyakarta
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-[#1E1B2E]">
            Mulai Perjalanan Freelance-mu di Jogja
          </h1>

          <p
            className="text-lg md:text-xl text-[#4A4760] mb-10 max-w-2xl mx-auto leading-relaxed min-h-[3.5rem]"
            style={{
              opacity: factFading ? 0 : 1,
              transform: factFading ? "translateY(6px)" : "translateY(0)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {FACTS[factIndex]}
          </p>

          {/* Main CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=freelancer">
              <Button
                size="lg"
                className="min-w-56 bg-[#D64545] hover:bg-[#C23B3B] text-white font-bold"
              >
                Mulai Sekarang
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="secondary" className="min-w-56">
                Lihat Lowongan
              </Button>
            </Link>
          </div>

          {/* Stats dengan count-up */}
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-bold text-[#D64545]">
                  <StatNumber target={s.target} suffix={s.suffix} />
                </p>
                <p className="text-xs md:text-sm text-[#6B6880] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {PHOTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i === current ? "#D64545" : "rgba(255,255,255,0.6)",
                transform: i === current ? "scale(1.3)" : "scale(1)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
