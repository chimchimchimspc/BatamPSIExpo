"use client";
import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../components/layout/Header";
import Button from "../components/ui/Button";
import { Send, MessageCircle, ArrowLeft } from "lucide-react";
import { api, type ApiConversation, type ApiMessage, type ApiError } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function initials(name: string) {
  return (name || "?").trim().charAt(0).toUpperCase();
}

function fmtTime(iso?: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function ChatInner() {
  const { user, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const initialConv = searchParams.get("c");

  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(initialConv);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(() => {
    api.chat
      .conversations()
      .then((rows) => setConversations(rows || []))
      .catch(() => {})
      .finally(() => setLoadingList(false));
  }, []);

  const loadMessages = useCallback((convId: string) => {
    api.chat
      .messages(convId)
      .then((rows) => setMessages(rows || []))
      .catch(() => {});
  }, []);

  // Initial + polling for the conversation list.
  useEffect(() => {
    if (authLoading || !user) return;
    loadConversations();
    const t = setInterval(loadConversations, 8000);
    return () => clearInterval(t);
  }, [authLoading, user, loadConversations]);

  // Load + poll messages for the open conversation.
  useEffect(() => {
    if (!selectedId) return;
    loadMessages(selectedId);
    const t = setInterval(() => loadMessages(selectedId), 4000);
    return () => clearInterval(t);
  }, [selectedId, loadMessages]);

  // Auto-scroll to the newest message.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selected = conversations.find((c) => c.id === selectedId);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !selectedId) return;
    setSending(true);
    try {
      const msg = await api.chat.send(selectedId, text);
      setMessages((prev) => [...prev, msg]);
      setDraft("");
      loadConversations();
    } catch (err) {
      alert((err as ApiError)?.message || "Gagal mengirim pesan.");
    } finally {
      setSending(false);
    }
  };

  if (!authLoading && !user) {
    return (
      <main className="flex-1 bg-[#F1F1F1] py-16">
        <div className="max-w-md mx-auto px-4 text-center bg-white border border-[#E7E7E7] rounded-lg p-12">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-lg font-bold text-[#232F3E] mb-2">Silakan login dulu</h3>
          <p className="text-sm text-[#565A5C] mb-4">Masuk untuk mengakses pesan Anda</p>
          <Link href="/auth/login"><Button size="sm">Login</Button></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#F1F1F1] py-6">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-[#232F3E] mb-4">Pesan</h1>
        <div className="bg-white border border-[#E7E7E7] rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-[300px_1fr] h-[70vh]">
          {/* Conversation list */}
          <aside className={`border-r border-[#E7E7E7] overflow-y-auto ${selectedId ? "hidden md:block" : "block"}`}>
            {loadingList ? (
              <p className="p-4 text-sm text-[#565A5C]">Memuat…</p>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-sm text-[#565A5C]">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-[#CCC]" />
                Belum ada percakapan.
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left flex items-center gap-3 p-3 border-b border-[#F1F1F1] hover:bg-[#F8F8F8] transition-colors ${
                    c.id === selectedId ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#146EB4] to-[#E8B4D1] flex items-center justify-center text-white font-bold flex-shrink-0">
                    {initials(c.other_user_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#232F3E] truncate">{c.other_user_name}</p>
                      <span className="text-[10px] text-[#999] flex-shrink-0">{fmtTime(c.last_message_at)}</span>
                    </div>
                    <p className="text-xs text-[#565A5C] truncate">{c.last_message || "Mulai percakapan…"}</p>
                  </div>
                  {c.unread_count > 0 && (
                    <span className="ml-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D64545] text-white text-[10px] flex items-center justify-center flex-shrink-0">
                      {c.unread_count}
                    </span>
                  )}
                </button>
              ))
            )}
          </aside>

          {/* Thread */}
          <section className={`flex-col ${selectedId ? "flex" : "hidden md:flex"}`}>
            {!selectedId ? (
              <div className="flex-1 flex items-center justify-center text-sm text-[#565A5C]">
                Pilih percakapan untuk mulai chatting.
              </div>
            ) : (
              <>
                {/* Thread header */}
                <div className="flex items-center gap-3 p-3 border-b border-[#E7E7E7] bg-[#F8F8F8]">
                  <button className="md:hidden text-[#565A5C]" onClick={() => setSelectedId(null)} aria-label="Kembali">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#146EB4] to-[#E8B4D1] flex items-center justify-center text-white font-bold text-sm">
                    {initials(selected?.other_user_name || "?")}
                  </div>
                  <p className="text-sm font-semibold text-[#232F3E]">{selected?.other_user_name || "Percakapan"}</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#FAFAFA]">
                  {messages.length === 0 ? (
                    <p className="text-center text-xs text-[#999] mt-8">Belum ada pesan. Sapa duluan! 👋</p>
                  ) : (
                    messages.map((m) => {
                      const mine = m.sender_id === user?.id;
                      return (
                        <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                              mine
                                ? "bg-[#146EB4] text-white rounded-br-sm"
                                : "bg-white border border-[#E7E7E7] text-[#232F3E] rounded-bl-sm"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{m.body}</p>
                            <p className={`text-[10px] mt-1 ${mine ? "text-blue-100" : "text-[#999]"}`}>{fmtTime(m.created_at)}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={endRef} />
                </div>

                {/* Composer */}
                <div className="p-3 border-t border-[#E7E7E7] flex items-center gap-2">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Ketik pesan…"
                    maxLength={2000}
                    className="flex-1 px-4 py-2 text-sm border border-[#E0E0E0] rounded-full bg-[#F8F8F8] focus:outline-none focus:border-[#146EB4] focus:ring-2 focus:ring-[#146EB4]/10"
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || !draft.trim()}
                    className="w-10 h-10 rounded-full bg-[#146EB4] hover:bg-[#125a94] text-white flex items-center justify-center disabled:opacity-50 transition-colors flex-shrink-0"
                    aria-label="Kirim"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<main className="flex-1 bg-[#F1F1F1] py-16 text-center text-sm text-[#565A5C]">Memuat…</main>}>
        <ChatInner />
      </Suspense>
    </>
  );
}
