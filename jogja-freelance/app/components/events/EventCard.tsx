import { Calendar, Clock, MapPin, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { type Event, type EventType, EVENT_TYPES, formatDate, formatTime, isEventFull, isEventPast } from "../../data/events";

interface EventCardProps {
  event: Event;
}

const categoryGradients: Record<string, string> = {
  workshop:    "bg-gradient-to-r from-[#1F4F7C] to-[#2E5FA8]",
  meetup:      "bg-gradient-to-r from-[#1F5C3C] to-[#2E7A52]",
  coffee_chat: "bg-gradient-to-r from-[#6B2E1F] to-[#8B3F2E]",
  networking:  "bg-gradient-to-r from-[#3F2E5C] to-[#5A3F7A]",
};

const badgeColors: Record<EventType, "blue" | "orange" | "green" | "red" | "gray" | "gold"> = {
  workshop:    "blue",
  meetup:      "green",
  coffee_chat: "orange",
  networking:  "red",
};

export default function EventCard({ event }: EventCardProps) {
  const type = EVENT_TYPES[event.type];
  const full = isEventFull(event);
  const past = isEventPast(event);
  const cardGradient = categoryGradients[event.type] || categoryGradients.workshop;

  return (
    <div className={`bg-white border border-[#E7E7E7] rounded-lg overflow-hidden transition-all duration-200 flex flex-col h-full min-h-[420px] ${past ? "opacity-70" : "hover:shadow-lg hover:-translate-y-0.5"}`}>
      {/* Header */}
      <div className={`${cardGradient} p-4 flex items-start justify-between gap-2 ${past ? "opacity-80" : ""}`}>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{event.title}</h3>
          <p className="text-sm text-white/70 line-clamp-1">{event.organizerName}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {past && <Badge label="Selesai" color="gray" />}
          <Badge label={type.label} color={badgeColors[event.type]} />
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-[#565A5C]">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#565A5C]">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{formatTime(event.time)} • {Math.floor(event.duration / 60)} jam</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#565A5C]">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#565A5C]">
            <Users className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{event.attendeeCount}/{event.attendeeLimit} peserta</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#232F3E] leading-relaxed mb-4 line-clamp-2 flex-1">
          {event.description}
        </p>

        {/* Skills */}
        {event.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 min-h-[24px]">
            {event.skills.map((skill) => (
              <span key={skill} className="text-xs bg-[#F1F1F1] text-[#565A5C] px-2 py-0.5 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        )}
        {event.skills.length === 0 && <div className="mb-4 min-h-[24px]" />}

        {/* Footer */}
        <div className="flex gap-2 mt-auto pt-4 border-t border-[#E7E7E7]">
          <Link href={`/events/${event.id}`} className="flex-1">
            <Button size="sm" fullWidth variant="secondary">
              Detail
            </Button>
          </Link>
          {past ? (
            <Button
              size="sm"
              fullWidth
              disabled
              title="Event sudah selesai"
              className="opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              Selesai
            </Button>
          ) : (
            <Button
              size="sm"
              fullWidth
              disabled={full}
              title={full ? "Event sudah penuh" : "RSVP ke event ini"}
            >
              {full ? "Penuh" : "RSVP"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
