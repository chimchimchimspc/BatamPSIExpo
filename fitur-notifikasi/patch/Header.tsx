"use client";
import { useState, useRef, useEffect } from "react";
import { Search, Bell, Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { useAuth } from "../../context/AuthContext";
import Toast from "../ui/Toast";

const navLinks = [
  { href: "/jobs",     label: "Lowongan" },
  { href: "/passport", label: "Panduan" },
  { href: "/events",   label: "Events" },
  { href: "/employer", label: "Employer" },
];

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "application",
    message: "Lamaran Anda untuk React Frontend Developer telah direview",
    time: "2 jam lalu",
    read: false,
  },
  {
    id: "2",
    type: "accepted",
    message: "Selamat! Lamaran Anda untuk Content Writer diterima",
    time: "5 jam lalu",
    read: false,
  },
  {
    id: "3",
    type: "new_job",
    message: "Ada lowongan baru: Flutter Developer - Rp 7.5jt",
    time: "1 hari lalu",
    read: true,
  },
  {
    id: "4",
    type: "event",
    message: "Workshop: Advanced React Patterns - Besok jam 7 malam",
    time: "2 hari lalu",
    read: true,
  },
  {
    id: "5",
    type: "badge",
    message: "Anda mendapat badge baru: First Application",
    time: "3 hari lalu",
    read: true,
  },
];

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("searchOpen") === "true";
    }
    return false;
  });
  const [notifOpen,  setNotifOpen]  = useState(false);
  const [notifClosing, setNotifClosing] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search,     setSearch]     = useState("");
  const [samePageToast, setSamePageToast] = useState<string | null>(null);

  const handleNavClick = (href: string, label: string, e: React.MouseEvent) => {
    if (pathname === href) {
      e.preventDefault();
      setSamePageToast(`Kamu sudah berada di halaman "${label}".`);
    }
  };
  const pathname  = usePathname();
  const inputRef  = useRef<HTMLInputElement>(null);
  const notifRef  = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
    localStorage.setItem("searchOpen", String(searchOpen));
  }, [searchOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifClosing(true);
        setTimeout(() => {
          setNotifOpen(false);
          setNotifClosing(false);
        }, 200);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }
    if ((notifOpen || accountOpen) && !notifClosing) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [notifOpen, accountOpen, notifClosing]);

  return (
    <header className="sticky top-0 z-40 shadow-md bg-white">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image src="/logo.png" alt="JogjaFreelance" width={150} height={36} className="object-contain" style={{ mixBlendMode: "multiply" }} />
        </Link>

        {/* Nav links — kiri, desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => {
            const isActive = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={(e) => handleNavClick(l.href, l.label, e)}
                className={clsx(
                  "text-sm transition-colors relative whitespace-nowrap",
                  isActive
                    ? "text-[#D64545] font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-[#D64545] after:rounded-full"
                    : "text-[#1E1B2E] hover:text-[#D64545]"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search bar expandable */}
        <div className="hidden sm:flex items-center">
          <div
            className="flex items-center overflow-hidden transition-all duration-300"
            style={{ width: searchOpen ? 220 : 0, opacity: searchOpen ? 1 : 0 }}
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#565A5C]" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari lowongan, skill, event..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-[#E0E0E0] rounded-lg bg-[#F8F8F8] text-[#232F3E] placeholder:text-[#999] focus:outline-none focus:border-[#D64545] focus:ring-2 focus:ring-[#D64545]/10"
              />
            </div>
          </div>
          <button
            onClick={() => {
              if (searchOpen) {
                setSearchOpen(false);
                setSearch("");
                localStorage.removeItem("searchOpen");
              } else {
                setSearchOpen(true);
              }
            }}
            className="p-1.5 hover:bg-[#F0F0F0] rounded transition-colors ml-1"
            aria-label="Toggle search"
          >
            {searchOpen
              ? <X className="w-5 h-5 text-[#1E1B2E]" />
              : <Search className="w-5 h-5 text-[#1E1B2E]" />
            }
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative p-1.5 hover:bg-[#F0F0F0] rounded transition-colors"
              aria-label="Notifikasi"
            >
              <Bell className="w-5 h-5 text-[#1E1B2E]" />
              {MOCK_NOTIFICATIONS.some((n) => !n.read) && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#D64545] rounded-full" />
              )}
            </button>

            {/* Notification dropdown */}
            {notifOpen && (
              <div
                className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-[#E7E7E7] z-50 overflow-hidden"
                style={{
                  animation: notifClosing
                    ? "notif-dropup 200ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                    : "notif-dropdown 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                }}
              >
                <div className="p-4 border-b border-[#E7E7E7] flex items-center justify-between bg-[#F8F8F8]">
                  <h3 className="font-semibold text-[#232F3E]">Notifikasi</h3>
                  <button
                    onClick={() => {
                      setNotifClosing(true);
                      setTimeout(() => {
                        setNotifOpen(false);
                        setNotifClosing(false);
                      }, 200);
                    }}
                    className="text-[#565A5C] hover:text-[#232F3E]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {MOCK_NOTIFICATIONS.map((notif) => (
                    <Link
                      key={notif.id}
                      href={`/notifications?highlight=${notif.id}`}
                      onClick={() => {
                        setNotifClosing(true);
                        setTimeout(() => {
                          setNotifOpen(false);
                          setNotifClosing(false);
                        }, 200);
                      }}
                      className={`block p-4 border-b border-[#E7E7E7] hover:bg-[#F8F8F8] transition-colors ${
                        !notif.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                            !notif.read ? "bg-[#D64545]" : "bg-transparent"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#232F3E] line-clamp-2">{notif.message}</p>
                          <p className="text-xs text-[#565A5C] mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="p-3 border-t border-[#E7E7E7] bg-[#F8F8F8]">
                  <Link
                    href="/notifications"
                    onClick={() => {
                      setNotifClosing(true);
                      setTimeout(() => {
                        setNotifOpen(false);
                        setNotifClosing(false);
                      }, 200);
                    }}
                    className="w-full text-center block text-sm text-[#DC3545] font-semibold hover:text-[#C23B3B] py-2 transition-colors"
                  >
                    Lihat semua notifikasi
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Account menu */}
          {user ? (
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-[#D64545] hover:border-[#C23B3B] transition-colors bg-gradient-to-br from-[#D64545] to-[#E8B4D1] flex items-center justify-center text-white text-xs font-bold"
                title={user.full_name}
              >
                {user.full_name.charAt(0).toUpperCase()}
              </button>

              {accountOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-[#E7E7E7] z-50 overflow-hidden"
                  style={{
                    animation: "notif-dropdown 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                  }}
                >
                  <div className="p-4 border-b border-[#E7E7E7] bg-[#F8F8F8]">
                    <p className="font-semibold text-[#232F3E] text-sm">{user.full_name}</p>
                    <p className="text-xs text-[#565A5C]">{user.email}</p>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-[#232F3E] hover:bg-[#F8F8F8] rounded transition-colors"
                      onClick={() => setAccountOpen(false)}
                    >
                      Profil Saya
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setAccountOpen(false);
                        router.push("/auth/login");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#DC3545] hover:bg-[#F8F8F8] rounded transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm bg-[#D64545] hover:bg-[#C23B3B] text-white rounded-lg font-semibold transition-colors whitespace-nowrap"
            >
              Masuk
            </Link>
          )}
          {/* Hamburger mobile */}
          <button
            className="md:hidden p-1.5 hover:bg-[#F0F0F0] rounded"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-5 h-5 text-[#1E1B2E]" /> : <Menu className="w-5 h-5 text-[#1E1B2E]" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className={clsx(
          "md:hidden bg-white overflow-hidden transition-all duration-200 border-t border-[#EAE6F5]",
          menuOpen ? "max-h-80 py-2" : "max-h-0"
        )}
      >
        {/* Mobile search */}
        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#565A5C]" />
            <input
              type="text"
              placeholder="Cari lowongan atau event..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] text-[#232F3E] placeholder:text-[#999] focus:outline-none"
            />
          </div>
        </div>
        {navLinks.map((l) => {
          const isActive = pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={(e) => {
                setMenuOpen(false);
                handleNavClick(l.href, l.label, e);
              }}
              className={clsx(
                "block px-4 py-3 text-sm transition-colors",
                isActive
                  ? "text-[#D64545] font-semibold bg-[#FFF5F5] border-l-2 border-[#D64545]"
                  : "text-[#1E1B2E] hover:bg-[#F5F5F5]"
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </div>

      {samePageToast && (
        <Toast
          message={samePageToast}
          type="warning"
          onClose={() => setSamePageToast(null)}
          duration={3000}
        />
      )}

      <style>{`
        @keyframes notif-dropdown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes notif-dropup {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
      `}</style>
    </header>
  );
}
