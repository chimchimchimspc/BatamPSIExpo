import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const links = {
  Platform: [
    { href: "/jobs",     label: "Lowongan" },
    { href: "/passport", label: "Panduan 30 Hari" },
    { href: "/events",   label: "Events & Workshop" },
    { href: "/profile",  label: "Profil & Badge" },
  ],
  Untuk: [
    { href: "/auth/register?role=freelancer", label: "Freelancer" },
    { href: "/auth/register?role=employer",   label: "Employer / UMKM" },
    { href: "/admin",                          label: "Admin" },
  ],
  Info: [
    { href: "#", label: "Tentang Kami" },
    { href: "#", label: "Syarat & Ketentuan" },
    { href: "#", label: "Kebijakan Privasi" },
    { href: "#", label: "Hubungi Kami" },
  ],
};

export default function Footer() {
  return (
    <footer className="text-white mt-auto" style={{background:"#2B2B2B"}}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3 inline-block bg-white rounded-lg px-3 py-1.5">
              <Image
                src="/logo.png"
                alt="JogjaFreelance"
                width={140}
                height={34}
                className="object-contain"
              />
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Platform untuk freelancer menemukan peluang & panduan harian di Yogyakarta.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-sm font-bold mb-4 text-white/80">{group}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>© 2026 Jogja Freelance Passport. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3 h-3 text-[#D64545]" /> untuk komunitas Jogja
          </span>
        </div>
      </div>
    </footer>
  );
}
