import { Briefcase, BookOpen, Award, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Briefcase,
    iconColor: "text-[#146EB4]",
    bgColor: "bg-white",
    borderTopColor: "#146EB4",
    tagBgColor: "#F8F8F8",
    tagTextColor: "#565A5C",
    title: "Job Board Lokal",
    desc: "Lowongan freelance dari UMKM & startup Yogyakarta. Diverifikasi admin, bebas spam.",
    href: "/jobs",
    cta: "Lihat Lowongan",
    tags: ["Web Dev", "Design", "Content"],
  },
  {
    icon: BookOpen,
    iconColor: "text-[#EC7211]",
    bgColor: "bg-white",
    borderTopColor: "#EC7211",
    tagBgColor: "#F8F8F8",
    tagTextColor: "#565A5C",
    title: "Panduan 30 Hari",
    desc: "Panduan harian terstruktur — dari setup profil, networking, hingga apply kerja pertama.",
    href: "/passport",
    cta: "Mulai Panduan",
    tags: ["Hari 1-5: Onboarding", "Hari 7-15: Eksplorasi", "Hari 18+: Action"],
  },
  {
    icon: Award,
    iconColor: "text-amber-600",
    bgColor: "bg-white",
    borderTopColor: "#f59e0b",
    tagBgColor: "#F8F8F8",
    tagTextColor: "#565A5C",
    title: "Badge & Kredibilitas",
    desc: "Kumpulkan badge dari setiap pencapaian. Tampilkan di profil sebagai trust signal ke employer.",
    href: "/profile",
    cta: "Lihat Badge",
    tags: ["Profile Complete", "First Application", "30-Day Finisher"],
  },
  {
    icon: Users,
    iconColor: "text-[#12A54D]",
    bgColor: "bg-white",
    borderTopColor: "#12A54D",
    tagBgColor: "#F8F8F8",
    tagTextColor: "#565A5C",
    title: "Komunitas & Events",
    desc: "Workshop, meetup, dan coffee session dengan freelancer lain di Jogja.",
    href: "/events",
    cta: "Lihat Events",
    tags: ["Workshop", "Meetup", "Coffee Chat"],
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-[#F1F1F1]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#232F3E] mb-3">Satu Platform, Semua yang Kamu Butuhkan</h2>
          <p className="text-[#565A5C] max-w-xl mx-auto">
            Dari mencari project pertama hingga membangun reputasi sebagai freelancer Jogja.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link key={f.title} href={f.href}>
                <div
                  className={`group h-full rounded-lg p-6 flex flex-col items-center cursor-pointer border-4 border-t-4 border-[#E7E7E7] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${f.bgColor}`}
                  style={{ borderTopColor: f.borderTopColor }}
                >
                  <Icon className={`w-14 h-14 mb-4 transform transition-transform duration-300 group-hover:scale-110 ${f.iconColor}`} />
                  <h3 className="text-lg font-bold text-[#232F3E] mb-2 text-center group-hover:opacity-80 transition-opacity">{f.title}</h3>
                  <p className="text-sm text-[#565A5C] leading-relaxed mb-4 flex-1 text-center">{f.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4 justify-center w-full">
                    {f.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-1 rounded-full group-hover:opacity-80 transition-all"
                        style={{
                          backgroundColor: f.tagBgColor,
                          color: f.tagTextColor,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-sm text-[#DC3545] group-hover:gap-3 transition-all">
                    {f.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
