"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Bell,
  FileText,
  CheckCircle,
  Briefcase,
  Calendar,
  Award,
  MailOpen,
  Trash2,
  Filter,
  Inbox,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export type NotifType = "application" | "accepted" | "rejected" | "new_job" | "event" | "badge";

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "accepted",
    title: "Lamaran Diterima",
    message: "Selamat! Lamaran Anda untuk posisi Content Writer di Kreatif Studio telah diterima. Silakan cek email untuk langkah selanjutnya.",
    time: "5 jam lalu",
    read: false,
  },
  {
    id: "2",
    type: "application",
    title: "Lamaran Direview",
    message: "Lamaran Anda untuk posisi React Frontend Developer di TechJogja sedang direview oleh tim perekrutan.",
    time: "2 jam lalu",
    read: false,
  },
  {
    id: "3",
    type: "new_job",
    title: "Lowongan Baru",
    message: "Ada lowongan baru yang cocok dengan profilmu: Flutter Developer di Startup Lokal — Budget Rp 7.500.000/bulan.",
    time: "1 hari lalu",
    read: false,
  },
  {
    id: "4",
    type: "event",
    title: "Pengingat Event",
    message: "Workshop: Advanced React Patterns dimulai besok jam 19.00 WIB. Jangan lupa hadir untuk mendapatkan badge peserta!",
    time: "2 hari lalu",
    read: true,
  },
  {
    id: "5",
    type: "badge",
    title: "Badge Baru Terbuka!",
    message: "Anda mendapatkan badge \"First Application\" karena sudah mengirimkan lamaran pertama. Lihat koleksi badge Anda di halaman Profil.",
    time: "3 hari lalu",
    read: true,
  },
  {
    id: "6",
    type: "rejected",
    title: "Lamaran Tidak Lolos",
    message: "Lamaran Anda untuk posisi UI/UX Designer di DigitalKerja tidak melanjutkan ke tahap berikutnya. Tetap semangat, banyak peluang lain!",
    time: "4 hari lalu",
    read: true,
  },
  {
    id: "7",
    type: "new_job",
    title: "Lowongan Baru",
    message: "Lowongan baru: Backend Node.js Developer di DataJogja — Remote, Budget Rp 9.000.000/bulan. Segera lamar sebelum kuota penuh!",
    time: "5 hari lalu",
    read: true,
  },
  {
    id: "8",
    type: "event",
    title: "Event Baru",
    message: "Event: Batam Tech Fair 2025 telah dibuka pendaftarannya. Daftarkan diri Anda sekarang dan dapatkan akses ke 20+ sesi workshop.",
    time: "1 minggu lalu",
    read: true,
  },
  {
    id: "9",
    type: "badge",
    title: "Badge Baru Terbuka!",
    message: "Anda mendapatkan badge \"Event Enthusiast\" karena menghadiri 3 event berturut-turut. Terus tingkatkan pencapaianmu!",
    time: "1 minggu lalu",
    read: true,
  },
  {
    id: "10",
    type: "application",
    title: "Lamaran Direview",
    message: "Lamaran Anda untuk posisi Copywriter di MediaKreatif telah dilihat oleh employer. Pantau terus statusnya.",
    time: "2 minggu lalu",
    read: true,
  },
];

const TYPE_FILTERS = [
  { key: "all",         label: "Semua" },
  { key: "application", label: "Lamaran" },
  { key: "new_job",     label: "Lowongan Baru" },
  { key: "event",       label: "Event" },
  { key: "badge",       label: "Badge" },
] as const;

type FilterKey = (typeof TYPE_FILTERS)[number]["key"];

function notifIcon(type: NotifType) {
  switch (type) {
    case "application": return <FileText className="w-5 h-5 text-blue-500" />;
    case "accepted":    return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "rejected":    return <FileText className="w-5 h-5 text-[#565A5C]" />;
    case "new_job":     return <Briefcase className="w-5 h-5 text-[#D64545]" />;
    case "event":       return <Calendar className="w-5 h-5 text-purple-500" />;
    case "badge":       return <Award className="w-5 h-5 text-yellow-500" />;
  }
}

function notifBg(type: NotifType) {
  switch (type) {
    case "application": return "bg-blue-50";
    case "accepted":    return "bg-green-50";
    case "rejected":    return "bg-gray-50";
    case "new_job":     return "bg-red-50";
    case "event":       return "bg-purple-50";
    case "badge":       return "bg-yellow-50";
  }
}

export default function NotificationsPage() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");

  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(highlightId);

  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (showUnreadOnly && n.read) return false;
      if (activeFilter === "all") return true;
      if (activeFilter === "application") return n.type === "application" || n.type === "accepted" || n.type === "rejected";
      return n.type === activeFilter;
    });
  }, [notifications, activeFilter, showUnreadOnly]);

  // Scroll to and highlight the target notification
  useEffect(() => {
    if (!highlightId) return;

    const el = itemRefs.current[highlightId];
    if (el) {
      // Small delay so page finishes rendering
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    }

    // Remove highlight class after animation
    const timer = setTimeout(() => setHighlightedId(null), 2200);
    return () => clearTimeout(timer);
  }, [highlightId]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      <Header />
      <main className="flex-1 min-h-screen bg-[#F1F1F1]">
        {/* Page Header */}
        <div className="bg-white border-b border-[#E7E7E7]">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-[#FFF0F0] flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#D64545]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1E1B2E]">Kotak Masuk</h1>
                <p className="text-sm text-[#565A5C]">
                  {unreadCount > 0
                    ? `${unreadCount} notifikasi belum dibaca`
                    : "Semua notifikasi sudah dibaca"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilter === f.key
                      ? "bg-[#D64545] text-white"
                      : "bg-white text-[#565A5C] hover:bg-[#F0F0F0] border border-[#E7E7E7]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowUnreadOnly((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  showUnreadOnly
                    ? "bg-[#1E1B2E] text-white border-[#1E1B2E]"
                    : "bg-white text-[#565A5C] border-[#E7E7E7] hover:bg-[#F0F0F0]"
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                Belum Dibaca
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-white text-[#565A5C] border border-[#E7E7E7] hover:bg-[#F0F0F0] transition-colors"
                >
                  <MailOpen className="w-3.5 h-3.5" />
                  Tandai Semua Dibaca
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-[#565A5C] mb-3">{filtered.length} notifikasi</p>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E7E7E7] p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F1F1F1] flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-8 h-8 text-[#CCCCCC]" />
              </div>
              <h3 className="font-semibold text-[#232F3E] mb-1">Tidak ada notifikasi</h3>
              <p className="text-sm text-[#565A5C]">
                {showUnreadOnly
                  ? "Semua notifikasi sudah kamu baca."
                  : "Belum ada notifikasi masuk."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((notif) => {
                const isHighlighted = highlightedId === notif.id;
                return (
                  <div
                    key={notif.id}
                    ref={(el) => { itemRefs.current[notif.id] = el; }}
                    onClick={() => markRead(notif.id)}
                    className={`group relative flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:shadow-sm ${
                      isHighlighted
                        ? "notif-highlight"
                        : notif.read
                        ? "bg-white border-[#E7E7E7]"
                        : "bg-blue-50 border-blue-200 shadow-sm"
                    }`}
                  >
                    {!notif.read && !isHighlighted && (
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#D64545]" />
                    )}

                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notifBg(notif.type)}`}>
                      {notifIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <p className={`text-sm font-semibold mb-0.5 ${notif.read && !isHighlighted ? "text-[#565A5C]" : "text-[#1E1B2E]"}`}>
                        {notif.title}
                      </p>
                      <p className={`text-sm leading-relaxed ${notif.read && !isHighlighted ? "text-[#888]" : "text-[#232F3E]"}`}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-[#AAAAAA] mt-1.5">{notif.time}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotif(notif.id);
                      }}
                      className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-[#F0F0F0] text-[#CCCCCC] hover:text-[#D64545]"
                      aria-label="Hapus notifikasi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />

      <style>{`
        @keyframes notif-highlight-pulse {
          0%   { background-color: #fff7e6; border-color: #f59e0b; box-shadow: 0 0 0 4px rgba(245,158,11,0.15); }
          35%  { background-color: #fef3c7; border-color: #f59e0b; box-shadow: 0 0 0 6px rgba(245,158,11,0.20); }
          100% { background-color: #ffffff; border-color: #E7E7E7; box-shadow: none; }
        }
        .notif-highlight {
          animation: notif-highlight-pulse 2s ease-out forwards;
        }
      `}</style>
    </>
  );
}
