import { LayoutDashboard, Briefcase, Users, Calendar, Award, BarChart3, Settings, MapPin, LogOut } from "lucide-react";
import Link from "next/link";

const NAV = [
  { href: "/admin",          icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/jobs",     icon: Briefcase,       label: "Lowongan" },
  { href: "/admin/users",    icon: Users,           label: "Pengguna" },
  { href: "/admin/events",   icon: Calendar,        label: "Events" },
  { href: "/admin/badges",   icon: Award,           label: "Badge" },
  { href: "/admin/analytics",icon: BarChart3,       label: "Analitik" },
  { href: "/admin/settings", icon: Settings,        label: "Pengaturan" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F1F1F1]">
      {/* Admin top bar */}
      <header className="bg-white text-[#1E1B2E] px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-[#D64545]" />
          <span className="font-bold text-lg">
            Jogja<span className="text-[#D64545]">Freelance</span>
            <span className="ml-2 text-xs bg-[#D64545] text-white px-2 py-0.5 rounded font-normal">ADMIN</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#6B6880]">admin@jogjafrelance.id</span>
          <Link href="/" className="flex items-center gap-1 text-sm text-[#6B6880] hover:text-[#D64545]">
            <LogOut className="w-4 h-4" /> Keluar
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-[#232F3E] text-white flex-shrink-0 hidden md:flex flex-col sticky top-14 h-[calc(100vh-3.5rem)]">
          <nav className="flex-1 py-4">
            {NAV.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-5 py-3 text-sm text-[#6B6880] hover:bg-white/10 hover:text-white transition-colors"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <Link href="/" className="text-xs text-white/40 hover:text-[#6B6880] transition-colors">
              ← Kembali ke Site
            </Link>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
