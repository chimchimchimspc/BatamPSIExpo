"use client";
import { useEffect, useState } from "react";
import { Share2, X } from "lucide-react";
import Button from "../ui/Button";

interface BadgeUnlockModalProps {
  badge: { name: string; icon: string } | null;
  onClose: () => void;
}

export default function BadgeUnlockModal({ badge, onClose }: BadgeUnlockModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (badge) {
      setTimeout(() => setShow(true), 50);
    } else {
      setShow(false);
    }
  }, [badge]);

  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      {/* Confetti dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              backgroundColor: ["#E8B4D1","#146EB4","#12A54D","#FFD700","#EC7211"][i % 5],
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${0.8 + Math.random() * 0.6}s`,
            }}
          />
        ))}
      </div>

      <div
        className={`relative bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transition-all duration-500 ${
          show ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#565A5C] hover:text-[#232F3E]"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="text-sm font-bold text-[#E8B4D1] uppercase tracking-widest mb-4">
          Badge Baru Terbuka!
        </p>

        {/* Badge */}
        <div className="relative inline-flex items-center justify-center mb-5">
          <div className="w-28 h-28 rounded-full border-4 border-[#FFD700] bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center text-6xl animate-badge shadow-lg">
            {badge.icon}
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#E8B4D1] rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">✓</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#232F3E] mb-2">{badge.name}</h2>
        <p className="text-sm text-[#565A5C] mb-6">
          Badge ini ditambahkan ke Passport kamu dan terlihat oleh employer.
        </p>

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Lanjutkan
          </Button>
          <Button fullWidth>
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </div>
      </div>
    </div>
  );
}
