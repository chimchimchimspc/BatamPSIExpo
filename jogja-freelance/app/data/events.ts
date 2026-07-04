export type EventType = "workshop" | "meetup" | "coffee_chat" | "networking";

export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  date: string;
  time: string;
  duration: number; // minutes
  location: string;
  latitude: number;
  longitude: number;
  organizerId: string;
  organizerName: string;
  image?: string;
  attendeeLimit: number;
  attendeeCount: number;
  checkInCode: string;
  skills: string[];
  isFree: boolean;
  price?: number;
  registrationUrl?: string;
}

export interface UserEventAttendance {
  eventId: string;
  checked_in: boolean;
  checkedInAt?: string;
}

export const EVENT_TYPES: Record<EventType, { label: string; icon: string; color: string }> = {
  workshop:    { label: "Workshop",    icon: "📚", color: "bg-blue-50 border-blue-200" },
  meetup:      { label: "Meetup",      icon: "👥", color: "bg-green-50 border-green-200" },
  coffee_chat: { label: "Coffee Chat", icon: "☕", color: "bg-orange-50 border-orange-200" },
  networking:  { label: "Networking",  icon: "🤝", color: "bg-purple-50 border-purple-200" },
};

export const MOCK_EVENTS: Event[] = [
  // Past events
  {
    id: "evt-past-1",
    title: "Vue.js Fundamentals Workshop",
    description: "Workshop dasar Vue.js yang telah selesai. Peserta belajar tentang components, data binding, dan lifecycle hooks.",
    type: "workshop",
    date: "2026-06-10",
    time: "10:00",
    duration: 120,
    location: "KORIDOR Coworking, Jl. Sosrowijayan, Yogyakarta",
    latitude: -7.797068,
    longitude: 110.370529,
    organizerId: "org-1",
    organizerName: "Komunitas Frontend Jogja",
    image: "/jogja-2.jpg",
    attendeeLimit: 25,
    attendeeCount: 22,
    checkInCode: "VUE2026",
    skills: ["Vue.js", "JavaScript"],
    isFree: true,
    registrationUrl: "https://meetup.example.com/vue-workshop",
  },
  {
    id: "evt-past-2",
    title: "Freelancer Networking Coffee Chat",
    description: "Networking event yang sudah berlangsung. Peserta berbagi pengalaman dan membangun koneksi bisnis.",
    type: "coffee_chat",
    date: "2026-06-12",
    time: "14:00",
    duration: 90,
    location: "Kopi Pendakian, Jl. Malioboro, Yogyakarta",
    latitude: -7.796368,
    longitude: 110.370123,
    organizerId: "org-2",
    organizerName: "Jogja Freelancer Community",
    image: "/jogja-1.jpg",
    attendeeLimit: 50,
    attendeeCount: 38,
    checkInCode: "NETWORK12",
    skills: [],
    isFree: true,
  },
  {
    id: "evt-past-3",
    title: "Figma Design Workshop - Advanced",
    description: "Workshop desain Figma level advanced yang telah selesai. Mencakup prototyping dan design systems.",
    type: "workshop",
    date: "2026-06-15",
    time: "09:00",
    duration: 180,
    location: "Ruang Kolektif, Jl. Diponegoro, Yogyakarta",
    latitude: -7.805434,
    longitude: 110.372856,
    organizerId: "org-3",
    organizerName: "Design Academy Jogja",
    image: "/jogja-3.jpg",
    attendeeLimit: 20,
    attendeeCount: 19,
    checkInCode: "FIGMA15",
    skills: ["Figma", "UI Design", "Design System"],
    isFree: false,
    price: 350000,
    registrationUrl: "https://designacademy.example.com/figma",
  },

  // Upcoming events
  {
    id: "evt-1",
    title: "React Advanced Patterns Workshop",
    description: "Belajar advanced React patterns seperti render props, custom hooks, dan context optimization. Workshop interaktif dengan live coding.",
    type: "workshop",
    date: "2026-06-20",
    time: "10:00",
    duration: 120,
    location: "KORIDOR Coworking, Jl. Sosrowijayan, Yogyakarta",
    latitude: -7.797068,
    longitude: 110.370529,
    organizerId: "org-1",
    organizerName: "Komunitas Frontend Jogja",
    image: "/km0.jpg",
    attendeeLimit: 30,
    attendeeCount: 18,
    checkInCode: "REACT2026",
    skills: ["React", "JavaScript", "TypeScript"],
    isFree: true,
    registrationUrl: "https://meetup.example.com/react-workshop",
  },
  {
    id: "evt-2",
    title: "Freelancer Networking Hangout",
    description: "Casual coffee hangout untuk para freelancer Jogja. Networking, share pengalaman, dan cari kolaborasi. Food & drinks tersedia.",
    type: "coffee_chat",
    date: "2026-06-21",
    time: "14:00",
    duration: 90,
    location: "Kopi Pendakian, Jl. Malioboro, Yogyakarta",
    latitude: -7.796368,
    longitude: 110.370123,
    organizerId: "org-2",
    organizerName: "Jogja Freelancer Community",
    image: "/jogja-1.jpg",
    attendeeLimit: 50,
    attendeeCount: 12,
    checkInCode: "NETWORK21",
    skills: [],
    isFree: true,
  },
  {
    id: "evt-3",
    title: "UI/UX Design Bootcamp",
    description: "3-hari intensive bootcamp untuk belajar UI/UX design dari 0. Meliputi design thinking, wireframing, prototyping, dan usability testing.",
    type: "workshop",
    date: "2026-06-23",
    time: "09:00",
    duration: 480,
    location: "Ruang Kolektif, Jl. Diponegoro, Yogyakarta",
    latitude: -7.805434,
    longitude: 110.372856,
    organizerId: "org-3",
    organizerName: "Design Academy Jogja",
    image: "/jogja-2.jpg",
    attendeeLimit: 20,
    attendeeCount: 16,
    checkInCode: "UIUX2026",
    skills: ["UI Design", "UX Design", "Figma"],
    isFree: false,
    price: 500000,
    registrationUrl: "https://designacademy.example.com/bootcamp",
  },
  {
    id: "evt-4",
    title: "Meetup: Content Creator & Marketing",
    description: "Bertemu dengan content creator dan digital marketer Jogja. Diskusi tentang trend content, platform, dan monetization.",
    type: "meetup",
    date: "2026-06-25",
    time: "19:00",
    duration: 120,
    location: "Workspace Jogja, Jl. Cendana, Yogyakarta",
    latitude: -7.802145,
    longitude: 110.368934,
    organizerId: "org-4",
    organizerName: "Content Creator Jogja",
    image: "/jogja-3.jpg",
    attendeeLimit: 40,
    attendeeCount: 28,
    checkInCode: "CONTENT25",
    skills: ["Content Writing", "Social Media", "Photography"],
    isFree: true,
  },
  {
    id: "evt-5",
    title: "Full-Stack JavaScript Development",
    description: "Deep dive ke full-stack JavaScript development. Frontend dengan React, backend dengan Node.js, dan database dengan MongoDB.",
    type: "workshop",
    date: "2026-06-28",
    time: "13:00",
    duration: 180,
    location: "Macchiato Coworking, Jl. Cendikia, Yogyakarta",
    latitude: -7.799678,
    longitude: 110.372451,
    organizerId: "org-1",
    organizerName: "Komunitas Frontend Jogja",
    image: "/jogja-4.jpg",
    attendeeLimit: 25,
    attendeeCount: 8,
    checkInCode: "FULLSTACK28",
    skills: ["React", "Node.js", "MongoDB", "JavaScript"],
    isFree: true,
    registrationUrl: "https://meetup.example.com/fullstack",
  },
  {
    id: "evt-6",
    title: "Freelancer Entrepreneur Networking",
    description: "Network dengan freelancer lain yang ambisi scale bisnis mereka. Diskusi tentang branding, pricing, dan growth strategy.",
    type: "networking",
    date: "2026-06-27",
    time: "18:00",
    duration: 120,
    location: "Kopi Santai, Jl. Prawirotaman, Yogyakarta",
    latitude: -7.814567,
    longitude: 110.375234,
    organizerId: "org-2",
    organizerName: "Jogja Freelancer Community",
    image: "/km0.jpg",
    attendeeLimit: 30,
    attendeeCount: 15,
    checkInCode: "ENTERP27",
    skills: [],
    isFree: true,
  },
];

export const MOCK_USER_ATTENDANCE: UserEventAttendance[] = [
  { eventId: "evt-2", checked_in: true, checkedInAt: "2026-06-21T14:15:00" },
];

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":");
  return `${h}:${m} WIB`;
}

export function getEventById(id: string): Event | undefined {
  return MOCK_EVENTS.find((e) => e.id === id);
}

export function getUpcomingEvents(): Event[] {
  const today = new Date().toISOString().split("T")[0];
  return MOCK_EVENTS.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
}

export function getPastEvents(): Event[] {
  const today = new Date().toISOString().split("T")[0];
  return MOCK_EVENTS.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date));
}

export function isEventFull(event: Event): boolean {
  return event.attendeeCount >= event.attendeeLimit;
}

export function isEventPast(event: Event): boolean {
  const today = new Date().toISOString().split("T")[0];
  return event.date < today;
}
