"use client";
import { Suspense, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../components/layout/Header";
import {
  Send, MessageCircle, ArrowLeft, Search, Check, CheckCheck,
  Phone, Video, MoreVertical, Paperclip, Smile,
} from "lucide-react";
import { api, type ApiConversation, type ApiMessage, type ApiError } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { buildDemoData, DEMO_ME_ID } from "../data/chatDemo";

function initials(name: string) {
  return (name || "?").trim().charAt(0).toUpperCase();
}

function fmtTime(iso?: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

// Short relative label for the conversation list ("baru saja", "5 mnt", "3 jam", "Kemarin", date).
function fmtListTime(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} mnt`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam`;
  if (h < 48) return "Kemarin";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

// Date-separator label for the message thread.
function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (sameDay(d, today)) return "Hari ini";
  if (sameDay(d, yest)) return "Kemarin";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

const AVATAR_GRADIENTS = [
  "from-[#146EB4] to-[#5AA9E6]",
  "from-[#D64545] to-[#E8B4D1]",
  "from-[#6D28D9] to-[#A78BFA]",
  "from-[#059669] to-[#6EE7B7]",
  "from-[#EA580C] to-[#FDBA74]",
];
function gradientFor(id: string) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
}

function Avatar({ name, id, size = "md" }: { name: string; id: string; size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "w-11 h-11 text-base" : size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${dim} rounded-full bg-gradient-to-br ${gradientFor(id)} flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm`}>
      {initials(name)}
    </div>
  );
}

function ChatInner() {
  const { user, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const initialConv = searchParams.get("c");

  const [realConvos, setRealConvos] = useState<ApiConversation[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(initialConv);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const demoData = useMemo(() => buildDemoData(), []);

  // Demo mode: not logged in, or logged in but no real conversations yet.
  const demoMode = !authLoading && (!user || (!loadingList && realConvos.length === 0));
  const meId = demoMode ? DEMO_ME_ID : user?.id;
  const conversations = demoMode ? demoData.conversations : realConvos;

  const loadConversations = useCallback(() => {
    api.chat
      .conversations()
      .then((rows) => setRealConvos(rows || []))
      .catch(() => {})
      .finally(() => setLoadingList(false));
  }, []);

  const loadMessages = useCallback((convId: string) => {
    api.chat
      .messages(convId)
      .then((rows) => setMessages(rows || []))
      .catch(() => {});
  }, []);

  // Initial + polling for the (real) conversation list.
  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoadingList(false); return; }
    loadConversations();
    const t = setInterval(loadConversations, 8000);
    return () => clearInterval(t);
  }, [authLoading, user, loadConversations]);

  // Auto-select the first conversation on desktop when nothing is chosen.
  useEffect(() => {
    if (!selectedId && conversations.length > 0 && typeof window !== "undefined" && window.innerWidth >= 768) {
      setSelectedId(conversations[0].id);
    }
  }, [conversations, selectedId]);

  // Load + poll messages for the open conversation.
  useEffect(() => {
    if (!selectedId) return;
    if (demoMode) {
      setMessages(demoData.messagesByConv[selectedId] ?? []);
      return;
    }
    loadMessages(selectedId);
    const t = setInterval(() => loadMessages(selectedId), 4000);
    return () => clearInterval(t);
  }, [selectedId, demoMode, demoData, loadMessages]);

  // Auto-scroll to the newest message.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selected = conversations.find((c) => c.id === selectedId);

  const filteredConvos = conversations.filter((c) =>
    c.other_user_name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !selectedId) return;

    if (demoMode) {
      const msg: ApiMessage = {
        id: `local-${Date.now()}`,
        conversation_id: selectedId,
        sender_id: DEMO_ME_ID,
        body: text,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, msg]);
      setDraft("");
      return;
    }

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

  // Build a render list with date separators + grouping flags.
  const rendered: Array<{ sep: string } | { msg: ApiMessage; grouped: boolean }> = [];
  let lastDay = "";
  messages.forEach((m, i) => {
    const dl = dayLabel(m.created_at);
    if (dl !== lastDay) {
      rendered.push({ sep: dl });
      lastDay = dl;
    }
    const prev = messages[i - 1];
    const grouped = !!prev && prev.sender_id === m.sender_id && dayLabel(prev.created_at) === dl;
    rendered.push({ msg: m, grouped });
  });

  const totalUnread = conversations.reduce((s, c) => s + (c.unread_count || 0), 0);

  return (
    <main className="flex-1 flex flex-col min-h-0 bg-white">
      {demoMode && (
        <div className="flex flex-wrap items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          <span className="font-semibold">Mode contoh</span>
          <span className="text-amber-700">— data pesan ini hanya dummy untuk pratinjau.</span>
          {!user && (
            <Link href="/auth/login" className="ml-auto font-semibold text-[#146EB4] hover:underline">
              Login untuk pesan sungguhan →
            </Link>
          )}
        </div>
      )}

      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[340px_1fr]">
        {/* Conversation list */}
        <aside className={`border-r border-[#EDEDED] flex-col min-h-0 ${selectedId ? "hidden md:flex" : "flex"}`}>
          {/* Sidebar header */}
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#232F3E]">Pesan</h1>
            {totalUnread > 0 && (
              <span className="text-xs font-semibold text-white bg-[#D64545] rounded-full px-2 py-0.5">
                {totalUnread} baru
              </span>
            )}
          </div>

          {/* Search */}
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA0A6]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari percakapan…"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-full bg-[#F1F3F4] border border-transparent focus:bg-white focus:border-[#146EB4] focus:ring-2 focus:ring-[#146EB4]/10 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {loadingList && !demoMode ? (
              <p className="p-4 text-sm text-[#565A5C]">Memuat…</p>
            ) : filteredConvos.length === 0 ? (
              <div className="p-6 text-center text-sm text-[#565A5C]">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-[#CCC]" />
                {search ? "Tidak ada yang cocok." : "Belum ada percakapan."}
              </div>
            ) : (
              filteredConvos.map((c) => {
                const active = c.id === selectedId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 border-b border-[#F4F4F4] transition-colors ${
                      active ? "bg-[#EAF4FB]" : "hover:bg-[#F8F9FA]"
                    }`}
                  >
                    <div className="relative">
                      <Avatar name={c.other_user_name} id={c.other_user_id} />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#22C55E] border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm truncate text-[#232F3E] ${c.unread_count > 0 ? "font-bold" : "font-semibold"}`}>
                          {c.other_user_name}
                        </p>
                        <span className={`text-[10px] flex-shrink-0 ${c.unread_count > 0 ? "text-[#146EB4] font-semibold" : "text-[#9AA0A6]"}`}>
                          {fmtListTime(c.last_message_at)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className={`text-xs truncate ${c.unread_count > 0 ? "text-[#232F3E]" : "text-[#565A5C]"}`}>
                          {c.last_message || "Mulai percakapan…"}
                        </p>
                        {c.unread_count > 0 && (
                          <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#D64545] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Thread */}
        <section className={`flex-col min-h-0 bg-[#F7F8FA] ${selectedId ? "flex" : "hidden md:flex"}`}>
          {!selectedId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-[#EAF4FB] flex items-center justify-center mb-3">
                <MessageCircle className="w-8 h-8 text-[#146EB4]" />
              </div>
              <p className="text-sm font-semibold text-[#232F3E]">Pilih percakapan</p>
              <p className="text-xs text-[#565A5C] mt-1">Pilih salah satu chat di kiri untuk mulai mengobrol.</p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E7E7E7] bg-white">
                <button className="md:hidden text-[#565A5C]" onClick={() => setSelectedId(null)} aria-label="Kembali">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <Avatar name={selected?.other_user_name || "?"} id={selected?.other_user_id || "x"} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#232F3E] truncate">{selected?.other_user_name || "Percakapan"}</p>
                  <p className="text-xs text-[#22C55E] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> Online
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[#9AA0A6]">
                  <button className="p-2 rounded-full hover:bg-[#F1F3F4] transition-colors" aria-label="Telepon"><Phone className="w-[18px] h-[18px]" /></button>
                  <button className="p-2 rounded-full hover:bg-[#F1F3F4] transition-colors" aria-label="Video"><Video className="w-[18px] h-[18px]" /></button>
                  <button className="p-2 rounded-full hover:bg-[#F1F3F4] transition-colors" aria-label="Lainnya"><MoreVertical className="w-[18px] h-[18px]" /></button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto min-h-0 px-4 md:px-8 py-4 space-y-1.5">
                {messages.length === 0 ? (
                  <p className="text-center text-xs text-[#999] mt-8">Belum ada pesan. Sapa duluan! 👋</p>
                ) : (
                  rendered.map((item, idx) => {
                    if ("sep" in item) {
                      return (
                        <div key={`sep-${idx}`} className="flex justify-center my-3">
                          <span className="text-[11px] text-[#7A7F87] bg-[#E9ECEF] px-3 py-1 rounded-full">{item.sep}</span>
                        </div>
                      );
                    }
                    const m = item.msg;
                    const mine = m.sender_id === meId;
                    return (
                      <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"} ${item.grouped ? "mt-0.5" : "mt-2"}`}>
                        <div
                          className={`max-w-[78%] sm:max-w-[60%] px-3.5 py-2 text-sm shadow-sm ${
                            mine
                              ? "bg-[#146EB4] text-white rounded-2xl rounded-br-md"
                              : "bg-white border border-[#ECECEC] text-[#232F3E] rounded-2xl rounded-bl-md"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words leading-relaxed">{m.body}</p>
                          <div className={`flex items-center gap-1 mt-1 ${mine ? "justify-end text-blue-100" : "text-[#9AA0A6]"}`}>
                            <span className="text-[10px]">{fmtTime(m.created_at)}</span>
                            {mine && (m.is_read
                              ? <CheckCheck className="w-3.5 h-3.5 text-[#7FD4FF]" />
                              : <Check className="w-3.5 h-3.5" />)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={endRef} />
              </div>

              {/* Composer */}
              <div className="p-3 md:px-8 border-t border-[#E7E7E7] bg-white flex items-end gap-2">
                <button className="p-2 text-[#9AA0A6] hover:text-[#146EB4] hover:bg-[#F1F3F4] rounded-full transition-colors" aria-label="Lampirkan">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Ketik pesan…"
                    rows={1}
                    maxLength={2000}
                    className="w-full resize-none max-h-28 pl-4 pr-10 py-2.5 text-sm border border-[#E0E0E0] rounded-2xl bg-[#F8F9FA] focus:bg-white focus:outline-none focus:border-[#146EB4] focus:ring-2 focus:ring-[#146EB4]/10 transition-colors"
                  />
                  <button className="absolute right-2 bottom-2 p-1 text-[#9AA0A6] hover:text-[#146EB4] transition-colors" aria-label="Emoji">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={handleSend}
                  disabled={sending || !draft.trim()}
                  className="w-11 h-11 rounded-full bg-[#146EB4] hover:bg-[#125a94] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 flex-shrink-0 shadow-md"
                  aria-label="Kirim"
                >
                  <Send className="w-[18px] h-[18px]" />
                </button>
              </div>
            </>
          )}
        </section>
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
