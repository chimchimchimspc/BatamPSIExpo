import { Clock, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const SAMPLE_JOBS = [
  {
    id: "1",
    title: "React Frontend Developer",
    company: "Startup Jogja Tech",
    category: "Web Development",
    badgeColor: "blue",
    budget: "Rp 5.000.000",
    deadline: "30 hari",
    skills: ["React", "TypeScript", "Tailwind"],
    desc: "Kami mencari React developer untuk membangun dashboard analytics. Remote friendly.",
  },
  {
    id: "2",
    title: "UI/UX Designer Mobile App",
    company: "UMKM Digital Jogja",
    category: "UI/UX Design",
    badgeColor: "orange",
    budget: "Rp 3.500.000",
    deadline: "21 hari",
    skills: ["Figma", "Mobile Design", "Prototyping"],
    desc: "Desain ulang aplikasi mobile UMKM kami. Portfolio wajib dilampirkan.",
  },
  {
    id: "3",
    title: "Content Writer Pariwisata",
    company: "Visit Jogja Agency",
    category: "Content Writing",
    badgeColor: "green",
    budget: "Rp 1.500.000",
    deadline: "14 hari",
    skills: ["SEO Writing", "Bahasa Indonesia", "Pariwisata"],
    desc: "Tulis 10 artikel pariwisata Jogja untuk website dan media sosial kami.",
  },
  {
    id: "4",
    title: "Flutter Developer Mobile App",
    company: "Tech Startup Jogja",
    category: "Mobile Development",
    badgeColor: "blue",
    budget: "Rp 7.000.000",
    deadline: "45 hari",
    skills: ["Flutter", "Firebase", "Dart"],
    desc: "Develop mobile app untuk platform e-commerce dengan fitur payment gateway.",
  },
  {
    id: "5",
    title: "Graphic Designer Logo & Branding",
    company: "Creative Agency Jogja",
    category: "Logo Design",
    badgeColor: "green",
    budget: "Rp 2.500.000",
    deadline: "10 hari",
    skills: ["Adobe Illustrator", "Photoshop", "Branding"],
    desc: "Desain logo dan identitas visual lengkap untuk startup fashion local.",
  },
  {
    id: "6",
    title: "Video Editor YouTube Content",
    company: "Content Creator Jogja",
    category: "Video Editing",
    badgeColor: "orange",
    budget: "Rp 2.000.000",
    deadline: "7 hari",
    skills: ["Premiere Pro", "After Effects", "Color Grading"],
    desc: "Edit video YouTube berkualitas tinggi dengan duration 10-15 menit per video.",
  },
];

export default function JobPreviewSection() {
  return (
    <>
      <style>{`
        #jobs-scroll::-webkit-scrollbar {
          height: 4px;
        }
        #jobs-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        #jobs-scroll::-webkit-scrollbar-thumb {
          background: #D64545;
          border-radius: 10px;
        }
        #jobs-scroll::-webkit-scrollbar-thumb:hover {
          background: #C23B3B;
        }
        #jobs-scroll {
          scrollbar-color: #D64545 #f1f1f1;
          scrollbar-width: thin;
        }
      `}</style>
      <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#232F3E] mb-1">Lowongan Terbaru</h2>
            <p className="text-[#565A5C] text-sm">Diverifikasi admin • Khusus Yogyakarta</p>
          </div>
          <Link href="/jobs" className="hidden sm:flex items-center gap-1 text-[#DC3545] text-sm font-semibold hover:underline">
            Lihat semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div
          id="jobs-scroll"
          className="overflow-x-auto pb-4"
          style={{
            scrollBehavior: "smooth"
          }}
        >
          <div className="flex gap-4 px-4">
            {SAMPLE_JOBS.map((job) => (
              <div
                key={job.id}
                className="flex-shrink-0 w-80 border border-[#E7E7E7] rounded-lg p-4 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
              >
              <Badge label={job.category} color={job.badgeColor} className="self-start mb-3" />
              <h3 className="text-base font-bold text-[#232F3E] mb-1">{job.title}</h3>
              <p className="text-sm text-[#565A5C] mb-2">{job.company}</p>
              <p className="text-sm text-[#232F3E] leading-relaxed mb-3 line-clamp-2">{job.desc}</p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {job.skills.map((s) => (
                  <span key={s} className="text-xs bg-[#F1F1F1] text-[#565A5C] px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-[#565A5C] mb-4">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> {job.budget}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {job.deadline}
                </span>
              </div>

              <div className="flex gap-2 mt-auto">
                <Link href={`/jobs/${job.id}`} className="flex-1">
                  <Button variant="primary" size="sm" fullWidth>Lamar</Button>
                </Link>
                <Link href={`/jobs/${job.id}`} className="flex-1">
                  <Button variant="secondary" size="sm" fullWidth>Detail</Button>
                </Link>
              </div>
            </div>
            ))}
          </div>
        </div>

      </div>
    </section>
    </>
  );
}
