"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

// Reset setiap refresh, tetap ada saat navigasi antar halaman
let splashShown = false;

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading]   = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Jangan tampilkan splash jika sudah pernah ditampilkan
    if (splashShown) {
      setVisible(false);
      setFading(false);
      return;
    }

    splashShown = true;
    setVisible(true);

    const fadeTimer = setTimeout(() => setFading(true), 1400);
    const hideTimer = setTimeout(() => setVisible(false), 1900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]"
      style={{
        transition: "opacity 500ms ease",
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "all",
      }}
    >
      {/* Logo */}
      <div className="mb-8" style={{ animation: "splash-bounce 0.8s ease infinite" }}>
        <Image src="/logo.png" alt="JogjaFreelance" width={260} height={64} className="object-contain" />
      </div>

      {/* Dot loader */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[#D64545]"
            style={{
              animation: "splash-dot 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <p className="mt-5 text-sm text-[#6B6880]">Memuat halaman...</p>

      <style>{`
        @keyframes splash-bounce {
          0%, 100% { transform: translateY(0);    }
          50%       { transform: translateY(-6px); }
        }
        @keyframes splash-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1.1); opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
