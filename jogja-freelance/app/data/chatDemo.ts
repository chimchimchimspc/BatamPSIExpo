// Demo/sample chat data — shown on the /chat page when the user is not logged in
// or has no real conversations yet, so the UI can be previewed with realistic content.
// Shapes match the real API types (ApiConversation / ApiMessage).
import type { ApiConversation, ApiMessage } from "../lib/api";

export const DEMO_ME_ID = "demo-me";

export interface DemoData {
  conversations: ApiConversation[];
  messagesByConv: Record<string, ApiMessage[]>;
}

// Build fresh each call so timestamps look recent. Called from a client component
// (useMemo), so this only runs in the browser — no SSR hydration mismatch.
export function buildDemoData(): DemoData {
  const now = Date.now();
  const min = (m: number) => new Date(now - m * 60_000).toISOString();
  const hr = (h: number) => new Date(now - h * 3_600_000).toISOString();
  const day = (d: number) => new Date(now - d * 86_400_000).toISOString();

  let seq = 0;
  const mk = (
    conv: string,
    from: "me" | "them",
    body: string,
    at: string,
    read = true
  ): ApiMessage => ({
    id: `demo-msg-${++seq}`,
    conversation_id: conv,
    sender_id: from === "me" ? DEMO_ME_ID : `other-${conv}`,
    body,
    is_read: read,
    created_at: at,
  });

  const conversations: ApiConversation[] = [
    {
      id: "demo-c1",
      created_at: day(3),
      updated_at: min(4),
      other_user_id: "other-demo-c1",
      other_user_name: "Budi Santoso",
      other_user_avatar: null,
      last_message: "Oke, saya tunggu revisi desainnya ya 🙏",
      last_message_at: min(4),
      unread_count: 2,
    },
    {
      id: "demo-c2",
      created_at: day(2),
      updated_at: hr(3),
      other_user_id: "other-demo-c2",
      other_user_name: "Startup Jogja Tech",
      other_user_avatar: null,
      last_message: "Portfolio kamu keren, lanjut ke tahap interview yuk",
      last_message_at: hr(3),
      unread_count: 0,
    },
    {
      id: "demo-c3",
      created_at: day(5),
      updated_at: hr(20),
      other_user_id: "other-demo-c3",
      other_user_name: "Visit Jogja Agency",
      other_user_avatar: null,
      last_message: "Artikel pertama sudah kami terima, terima kasih!",
      last_message_at: hr(20),
      unread_count: 1,
    },
    {
      id: "demo-c4",
      created_at: day(7),
      updated_at: day(2),
      other_user_id: "other-demo-c4",
      other_user_name: "Aulia Rahma",
      other_user_avatar: null,
      last_message: "Nanti aku share file Figma-nya",
      last_message_at: day(2),
      unread_count: 0,
    },
  ];

  const messagesByConv: Record<string, ApiMessage[]> = {
    "demo-c1": [
      mk("demo-c1", "them", "Halo, saya Budi dari Batik Digital Studio 👋", hr(26)),
      mk("demo-c1", "them", "Kami tertarik dengan lamaran kamu untuk React Developer", hr(26)),
      mk("demo-c1", "me", "Halo Pak Budi! Terima kasih, saya sangat tertarik dengan proyeknya", hr(25)),
      mk("demo-c1", "me", "Kapan kira-kira bisa mulai diskusi detail scope-nya?", hr(25)),
      mk("demo-c1", "them", "Bisa hari ini. Ini saya kirim draft brief-nya dulu ya", hr(24)),
      mk("demo-c1", "me", "Siap, sudah saya baca. Menurut saya timeline 2 minggu realistis 👍", hr(5)),
      mk("demo-c1", "them", "Mantap. Tolong bikin proposal singkat + estimasi biaya", min(30), false),
      mk("demo-c1", "them", "Oke, saya tunggu revisi desainnya ya 🙏", min(4), false),
    ],
    "demo-c2": [
      mk("demo-c2", "them", "Hai! Kami lihat profil passport kamu, ratingnya bagus", hr(6)),
      mk("demo-c2", "me", "Terima kasih! Senang bisa terhubung 😊", hr(5)),
      mk("demo-c2", "them", "Boleh share portfolio UI/UX terbaru?", hr(5)),
      mk("demo-c2", "me", "Tentu, ini link Behance saya: behance.net/contoh", hr(4)),
      mk("demo-c2", "them", "Portfolio kamu keren, lanjut ke tahap interview yuk", hr(3)),
    ],
    "demo-c3": [
      mk("demo-c3", "them", "Selamat siang, ini untuk proyek 10 artikel wisata ya", day(1)),
      mk("demo-c3", "me", "Siang! Betul, saya sudah siapkan outline 10 topiknya", day(1)),
      mk("demo-c3", "them", "Boleh mulai dari artikel Malioboro dulu", hr(22)),
      mk("demo-c3", "me", "Sudah saya kirim ke email tim ya 📄", hr(21)),
      mk("demo-c3", "them", "Artikel pertama sudah kami terima, terima kasih!", hr(20), false),
    ],
    "demo-c4": [
      mk("demo-c4", "them", "Eh, jadi kolaborasi bareng buat proyek batik itu kan?", day(3)),
      mk("demo-c4", "me", "Jadi dong! Kamu handle UI, aku front-end 🔥", day(3)),
      mk("demo-c4", "them", "Sip. Nanti aku share file Figma-nya", day(2)),
    ],
  };

  return { conversations, messagesByConv };
}
