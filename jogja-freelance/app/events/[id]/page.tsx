"use client";
import { use, useState } from "react";
import { notFound } from "next/navigation";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import CheckInModal from "../../components/events/CheckInModal";
import Toast from "../../components/ui/Toast";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Link2, CheckCircle } from "lucide-react";
import Image from "next/image";
import EventMap from "../../components/events/EventMap";
import { getEventById, EVENT_TYPES, formatDate, formatTime, isEventFull } from "../../data/events";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const event = getEventById(id);

  const [showCheckIn, setShowCheckIn] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!event) return notFound();

  const type = EVENT_TYPES[event.type];
  const full = isEventFull(event);

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F1F1F1] py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back button */}
          <a
            href="/events"
            className="inline-flex items-center gap-1 text-sm text-[#D64545] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Events
          </a>

          {/* Event Image */}
          {event.image && (
            <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden mb-6 border border-[#E7E7E7]">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          )}

          {/* Header */}
          <div className="bg-white border border-[#E7E7E7] rounded-lg p-6 sm:p-8 mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge label={type.label} color="orange" />
                  {full && <Badge label="Penuh" color="red" />}
                </div>
                <h1 className="text-3xl font-bold text-[#232F3E] mb-1">{event.title}</h1>
                <p className="text-sm text-[#565A5C]">Oleh {event.organizerName}</p>
              </div>
            </div>

            {/* Event meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-t border-b border-[#E7E7E7]">
              {[
                { icon: Calendar, label: formatDate(event.date) },
                { icon: Clock, label: `${formatTime(event.time)} • ${Math.floor(event.duration / 60)} jam` },
                { icon: MapPin, label: event.location },
                { icon: Users, label: `${event.attendeeCount}/${event.attendeeLimit} peserta` },
              ].map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-[#E8B4D1] flex-shrink-0" />
                    <span className="text-sm text-[#232F3E]">{m.label}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 mt-6">
              {checkedIn ? (
                <div className="flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-[#12A54D]" />
                  <span className="font-semibold text-green-700">Sudah Check-in</span>
                </div>
              ) : isAttending ? (
                <Button onClick={() => setShowCheckIn(true)} size="lg">
                  Check-in Event
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setIsAttending(true);
                    setToast("✓ RSVP berhasil! Jangan lupa check-in saat event dimulai.");
                  }}
                  disabled={full}
                  size="lg"
                >
                  {full ? "Event Sudah Penuh" : "RSVP Sekarang"}
                </Button>
              )}

              {event.registrationUrl && (
                <Button variant="secondary" size="lg">
                  <Link2 className="w-5 h-5" />
                  Daftar Eksternal
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Description */}
            <div className="bg-white border border-[#E7E7E7] rounded-lg p-6">
              <h2 className="text-lg font-bold text-[#232F3E] mb-4">Tentang Event</h2>
              <p className="text-sm text-[#232F3E] leading-relaxed mb-6">{event.description}</p>

              {/* Skills */}
              {event.skills.length > 0 && (
                <>
                  <h3 className="text-sm font-bold text-[#232F3E] mb-2">Skill yang Relevan</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {event.skills.map((skill) => (
                      <span key={skill} className="text-xs bg-blue-50 text-[#146EB4] px-3 py-1.5 rounded-full font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Organizer */}
              <div className="bg-[#F1F1F1] rounded-lg p-4">
                <h3 className="text-sm font-bold text-[#232F3E] mb-3">Penyelenggara</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#146EB4] flex items-center justify-center text-white font-bold">
                    {event.organizerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#232F3E]">{event.organizerName}</p>
                    <p className="text-xs text-[#565A5C]">Verified Organizer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Price */}
              <div className="bg-white border border-[#E7E7E7] rounded-lg p-5">
                <p className="text-xs text-[#565A5C] font-bold uppercase mb-2">Biaya</p>
                {event.isFree ? (
                  <p className="text-2xl font-bold text-[#12A54D]">GRATIS</p>
                ) : (
                  <p className="text-2xl font-bold text-[#232F3E]">
                    Rp {(event.price || 0).toLocaleString("id-ID")}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden">
                <div className="p-5 border-b border-[#E7E7E7]">
                  <p className="text-sm font-bold text-[#232F3E] mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D64545]" />
                    Lokasi
                  </p>
                  <p className="text-sm text-[#232F3E] leading-relaxed bg-[#F8F8F8] p-3 rounded">
                    {event.location}
                  </p>
                </div>

                {/* Map */}
                <div style={{ height: "300px" }} className="w-full">
                  <EventMap event={event} />
                </div>

                <div className="p-5 border-t border-[#E7E7E7]">
                  <a
                    href={`https://maps.google.com/?q=${event.latitude},${event.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#D64545] hover:text-[#C23B3B] font-semibold"
                  >
                    <MapPin className="w-4 h-4" />
                    Buka di Google Maps →
                  </a>
                </div>
              </div>

              {/* Attendees */}
              <div className="bg-white border border-[#E7E7E7] rounded-lg p-5">
                <p className="text-sm font-bold text-[#232F3E] mb-3">Peserta</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#565A5C]">Terdaftar</span>
                    <strong className="text-[#232F3E]">{event.attendeeCount}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#565A5C]">Kapasitas</span>
                    <strong className="text-[#232F3E]">{event.attendeeLimit}</strong>
                  </div>
                  <div className="w-full bg-[#E7E7E7] rounded-full h-2 mt-2">
                    <div
                      className="bg-[#E8B4D1] h-2 rounded-full transition-all"
                      style={{ width: `${(event.attendeeCount / event.attendeeLimit) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <CheckInModal
        event={showCheckIn ? event : null}
        isOpen={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        onSuccess={() => {
          setCheckedIn(true);
          setShowCheckIn(false);
          setToast("✓ Check-in berhasil!");
        }}
      />

      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </>
  );
}
