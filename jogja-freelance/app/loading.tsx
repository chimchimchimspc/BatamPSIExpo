import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      {/* Logo */}
      <div className="mb-8">
        <Image src="/logo.png" alt="JogjaFreelance" width={220} height={54} className="object-contain" />
      </div>

      {/* Dot loader */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[#D64545]"
            style={{
              animation: "dotPulse 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <p className="mt-5 text-sm text-[#6B6880]">Memuat halaman...</p>

      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
