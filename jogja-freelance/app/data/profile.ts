export interface UserProfile {
  id: string;
  name: string;
  email: string;
  city: string;
  bio: string;
  profilePicture?: string;
  portfolioUrl?: string;
  skills: string[];
  verified: boolean;
  joinDate: string;
  level: "Bronze" | "Silver" | "Gold" | "Platinum";
  earnedBadges: string[];
  passportDaysCompleted: number;
  rating: number;
  reviewCount: number;
  completedProjects: number;
  totalEarnings: number;
}

export const MOCK_USER_PROFILE: UserProfile = {
  id: "user-1",
  name: "Andi Nugroho",
  email: "andi@example.com",
  city: "Yogyakarta",
  bio: "React developer dengan 3 tahun pengalaman. Spesialisasi: frontend development, UI/UX implementation, dan testing. Passionate tentang clean code dan user experience.",
  profilePicture: "https://via.placeholder.com/120?text=AN",
  portfolioUrl: "https://github.com/andinugroho",
  skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js"],
  verified: true,
  joinDate: "2026-06-10",
  level: "Bronze",
  earnedBadges: ["Profile Complete", "Day 5 Milestone"],
  passportDaysCompleted: 7,
  rating: 4.8,
  reviewCount: 3,
  completedProjects: 5,
  totalEarnings: 15000000,
};

export const ALL_BADGES = [
  { name: "Profile Complete",         icon: "✓",  rarity: "common",    description: "Lengkapi profil 100%" },
  { name: "Day 5 Milestone",          icon: "📅", rarity: "uncommon",  description: "Selesaikan 5 hari pertama" },
  { name: "Event Attendee",           icon: "🎤", rarity: "common",    description: "Hadiri event atau meetup" },
  { name: "Day 15 Milestone",         icon: "🌟", rarity: "rare",      description: "Selesaikan 15 hari" },
  { name: "First Application",        icon: "🎯", rarity: "common",    description: "Submit lamaran pertama" },
  { name: "Job Completed",            icon: "💼", rarity: "uncommon",  description: "Selesaikan project pertama" },
  { name: "Community Helper",         icon: "🤝", rarity: "rare",      description: "Bantu 3+ freelancer lain" },
  { name: "30-Day Passport Finisher", icon: "🏆", rarity: "legendary", description: "Selesaikan 30 hari perjalanan" },
];

export const rarityConfig = {
  common:    { border: "border-[#CCCCCC]", bg: "from-gray-50 to-gray-100",   text: "text-gray-700" },
  uncommon:  { border: "border-[#146EB4]", bg: "from-blue-50 to-blue-100",   text: "text-blue-700" },
  rare:      { border: "border-[#12A54D]", bg: "from-green-50 to-green-100", text: "text-green-700" },
  legendary: { border: "border-[#FFD700]", bg: "from-yellow-50 to-yellow-100", text: "text-yellow-700" },
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDaysAgoText(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Hari ini";
  if (diff === 1) return "Kemarin";
  if (diff < 7) return `${diff} hari lalu`;
  if (diff < 30) return `${Math.floor(diff / 7)} minggu lalu`;
  return `${Math.floor(diff / 30)} bulan lalu`;
}
