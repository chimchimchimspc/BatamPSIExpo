"use client";
import { useEffect, useRef, useState } from "react";
import { CheckCircle, Circle, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Button from "../ui/Button";
import ProgressBar from "../ui/ProgressBar";

const PREVIEW_DAYS = [
  { day: 1,  phase: "Onboarding", task: "Lengkapi profil dasar", done: true,    badge: "Profile Complete" },
  { day: 3,  phase: "Onboarding", task: "Tambah portfolio link", done: true,    badge: null },
  { day: 5,  phase: "Onboarding", task: "Selesaikan profil",     done: true,    badge: "Day 5 Milestone" },
  { day: 7,  phase: "Eksplorasi", task: "Ikuti 1 event Jogja",   done: false,   badge: "Event Attendee" },
  { day: 10, phase: "Eksplorasi", task: "Network 5 freelancer",  done: false,   badge: null },
  { day: 18, phase: "Action",     task: "Apply lowongan pertama",done: false,   badge: "First Application" },
  { day: 30, phase: "Wrap-up",    task: "Finalisasi & next step",done: false,   badge: "30-Day Finisher" },
];

const phaseColors: Record<string, string> = {
  Onboarding: "text-[#146EB4] bg-blue-50",
  Eksplorasi: "text-[#12A54D] bg-green-50",
  Action:     "text-[#EC7211] bg-orange-50",
  "Wrap-up":  "text-purple-700 bg-purple-50",
};

export default function PassportPreviewSection() {
  const ref        = useRef<HTMLDivElement>(null);
  const [barKey, setBarKey] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBarKey((k) => k + 1);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 relative overflow-hidden">
      {/* Background image with blur */}
      <Image
        src="/kereta.jpg"
        alt="Kereta Yogyakarta"
        fill
        className="object-cover object-center absolute inset-0"
        style={{
          filter: "blur(6px)",
          zIndex: 0
        }}
        priority
      />
      {/* Overlay with fade top and bottom */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.75) 15%, rgba(255,255,255,0.75) 85%, rgba(255,255,255,0.95) 100%)"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-[#E7E7E7]">
            <span className="inline-block bg-[#D64545]/10 text-[#D64545] text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              Core Feature
            </span>
            <h2 className="text-3xl font-bold text-[#232F3E] mb-4">
              Panduan 30 Hari Survival di Jogja
            </h2>
            <p className="text-[#565A5C] mb-6 leading-relaxed">
              Bukan sekadar checklist — panduan harian personal yang memandu kamu dari zero hingga dapat project pertama. Setiap hari ada task, rekomendasi event, dan lowongan yang cocok.
            </p>

            <div className="space-y-3 mb-8">
              {[
                { phase: "Hari 1-5",   label: "Onboarding — Setup profil & portfolio" },
                { phase: "Hari 7-15",  label: "Eksplorasi — Events, networking, coworking" },
                { phase: "Hari 18-25", label: "Action — Apply lowongan, interview" },
                { phase: "Hari 28-30", label: "Wrap-up — Konsolidasi & next steps" },
              ].map((p) => (
                <div key={p.phase} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#D64545] w-20 flex-shrink-0">{p.phase}</span>
                  <span className="text-sm text-[#232F3E]">{p.label}</span>
                </div>
              ))}
            </div>

            <Link href="/passport">
              <Button size="md">Mulai Perjalanan Saya</Button>
            </Link>
          </div>

          {/* Right: Passport preview card */}
          <div className="bg-white rounded-xl border border-[#E7E7E7] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#232F3E]">My Jogja Passport</h3>
              <span className="text-xs text-[#565A5C]">Hari 5 / 30</span>
            </div>

            <ProgressBar key={barKey} value={0} max={30} label="Progress" showPercent className="mb-6" />

            <div className="space-y-3">
              {PREVIEW_DAYS.map((d) => (
                <div
                  key={d.day}
                  className={`flex items-start gap-3 p-3 rounded-lg ${d.done ? "bg-green-50" : "bg-[#F1F1F1]"}`}
                >
                  {d.done ? (
                    <CheckCircle className="w-5 h-5 text-[#12A54D] flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#CCCCCC] flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-[#565A5C]">Hari {d.day}</span>
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${phaseColors[d.phase]}`}>
                        {d.phase}
                      </span>
                    </div>
                    <p className={`text-sm ${d.done ? "text-[#232F3E] line-through" : "text-[#232F3E]"}`}>
                      {d.task}
                    </p>
                    {d.badge && (
                      <span className="text-xs text-[#D64545] font-semibold">🏅 {d.badge}</span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#CCCCCC] flex-shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
