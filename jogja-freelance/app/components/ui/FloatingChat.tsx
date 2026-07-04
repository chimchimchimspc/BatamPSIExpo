"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

export default function FloatingChat() {
  const [chatOpen, setChatOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        chatRef.current &&
        buttonRef.current &&
        !chatRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setChatOpen(false);
      }
    }

    if (chatOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [chatOpen]);

  return (
    <>
      {/* Chat button */}
      <button
        ref={buttonRef}
        onClick={() => setChatOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-[#D64545] hover:bg-[#C23B3B] text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Chat dengan kami"
      >
        {chatOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat window */}
      {chatOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-24 right-6 z-40 w-80 bg-white rounded-lg shadow-xl border border-[#E7E7E7] overflow-hidden flex flex-col h-96"
          style={{ animation: "chat-popup 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
        >
          {/* Header */}
          <div className="bg-[#D64545] text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Chat dengan Tim Kami</h3>
              <p className="text-xs text-white/80">Biasanya kami balas dalam hitungan menit</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#F8F8F8] space-y-3">
            {/* Sample messages */}
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D64545] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                CS
              </div>
              <div className="bg-white rounded-lg p-3 max-w-xs">
                <p className="text-sm text-[#232F3E]">Halo! 👋 Ada yang bisa kami bantu?</p>
                <p className="text-xs text-[#565A5C] mt-1">10:30</p>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#E7E7E7] bg-white flex gap-2">
            <input
              type="text"
              placeholder="Ketik pesan..."
              className="flex-1 px-3 py-2 text-sm border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#D64545] focus:ring-2 focus:ring-[#D64545]/10"
            />
            <button className="px-4 py-2 bg-[#D64545] hover:bg-[#C23B3B] text-white rounded-lg text-sm font-semibold transition-colors">
              Kirim
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chat-popup {
          from {
            opacity: 0;
            transform: scale(0.3) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}
