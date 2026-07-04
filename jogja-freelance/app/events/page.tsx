"use client";
import { useState, useMemo } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import EventCard from "../components/events/EventCard";
import CheckInModal from "../components/events/CheckInModal";
import Toast from "../components/ui/Toast";
import { Calendar, MapPin, Filter, X } from "lucide-react";
import { MOCK_EVENTS, EVENT_TYPES, type Event, type EventType } from "../data/events";
import FadeInSection from "../components/ui/FadeInSection";

type FilterType = "semua" | "upcoming" | "past";

export default function EventsPage() {
  const [filterType, setFilterType] = useState<FilterType>("upcoming");
  const [selectedCategory, setSelectedCategory] = useState<EventType | "semua">("semua");
  const [checkInEvent, setCheckInEvent] = useState<Event | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    let result = MOCK_EVENTS;

    if (filterType === "upcoming") {
      result = result.filter((e) => e.date >= today);
    } else if (filterType === "past") {
      result = result.filter((e) => e.date < today);
    }

    if (selectedCategory !== "semua") {
      result = result.filter((e) => e.type === selectedCategory);
    }

    return result.sort((a, b) => a.date.localeCompare(b.date));
  }, [filterType, selectedCategory]);

  const handleCheckInSuccess = () => {
    setToast("✓ Check-in berhasil! Badge pending verifikasi admin.");
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F1F1F1]">
        {/* Page header */}
        <div className="bg-white text-[#1E1B2E] py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-[#D64545]" />
              <h1 className="text-3xl font-bold">Events & Workshop</h1>
            </div>
            <p className="text-[#6B6880] text-sm">Workshop, meetup, dan networking event untuk freelancer Yogyakarta</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Filter tabs */}
            <div className="flex gap-2 bg-white border border-[#E7E7E7] rounded-lg p-1">
              {(["upcoming", "past"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-4 py-2 text-sm font-semibold rounded transition-colors ${
                    filterType === f
                      ? "bg-[#D64545] text-white"
                      : "text-[#565A5C] hover:bg-[#F1F1F1]"
                  }`}
                >
                  {f === "upcoming" ? "Mendatang" : "Selesai"}
                </button>
              ))}
            </div>

            {/* Category filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory("semua")}
                className={`text-xs px-3 py-2 rounded-full font-semibold transition-colors ${
                  selectedCategory === "semua"
                    ? "bg-[#D64545] text-white"
                    : "bg-white border border-[#CCCCCC] text-[#565A5C] hover:border-[#D64545]"
                }`}
              >
                Semua
              </button>
              {(Object.keys(EVENT_TYPES) as EventType[]).map((type) => {
                const icon = EVENT_TYPES[type].icon;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedCategory(type)}
                    className={`text-xs px-3 py-2 rounded-full font-semibold transition-colors flex items-center gap-1 ${
                      selectedCategory === type
                        ? "bg-[#D64545] text-white"
                        : "bg-white border border-[#CCCCCC] text-[#565A5C] hover:border-[#D64545]"
                    }`}
                  >
                    <span>{icon}</span> {EVENT_TYPES[type].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="bg-white border border-[#E7E7E7] rounded-lg p-16 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-lg font-bold text-[#232F3E] mb-2">Tidak ada event</h3>
              <p className="text-sm text-[#565A5C]">
                {filterType === "past" ? "Belum ada event sebelumnya" : "Tidak ada event mendatang untuk filter ini"}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-[#565A5C] mb-4">
                Menampilkan <strong>{filtered.length}</strong> event
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((event, i) => (
                  <FadeInSection key={event.id} delay={Math.min(i * 80, 320)}>
                    <EventCard event={event} />
                  </FadeInSection>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

      <CheckInModal
        event={checkInEvent}
        isOpen={!!checkInEvent}
        onClose={() => setCheckInEvent(null)}
        onSuccess={handleCheckInSuccess}
      />

      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} duration={5000} />}
    </>
  );
}
