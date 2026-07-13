const { query } = require("../../config/database");

// Model utama + cadangan kalau yang utama overload (503) / kena kuota (429)
const GEMINI_MODELS = ["gemini-flash-latest", "gemini-flash-lite-latest"];
const geminiUrl = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`;

// Rate limit sederhana in-memory: reset saat server restart, cukup untuk
// membatasi pemakaian free tier Gemini. Kuota per user per hari.
const DAILY_LIMIT = 10;
const usage = new Map(); // userId -> { date: "YYYY-MM-DD", count }

function checkAndCountUsage(userId) {
  const today = new Date().toISOString().slice(0, 10);
  const entry = usage.get(userId);
  if (!entry || entry.date !== today) {
    usage.set(userId, { date: today, count: 1 });
    return { allowed: true, remaining: DAILY_LIMIT - 1 };
  }
  if (entry.count >= DAILY_LIMIT) return { allowed: false, remaining: 0 };
  entry.count += 1;
  return { allowed: true, remaining: DAILY_LIMIT - entry.count };
}

async function buildContext(userId) {
  const [profileRes, recJobsRes, categoryStatsRes] = await Promise.all([
    query(
      `SELECT u.full_name, u.city,
              COALESCE(json_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL), '[]') AS skills
       FROM users u
       LEFT JOIN user_skills us ON us.user_id = u.id
       LEFT JOIN skills s ON s.id = us.skill_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [userId]
    ),
    query(
      `SELECT jp.title, jc.name AS category, ep.company_name,
              jp.budget_min, jp.budget_max, jp.location_type, jp.experience_level,
              COALESCE(json_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL), '[]') AS skills
       FROM job_postings jp
       JOIN job_categories jc ON jc.id = jp.category_id
       LEFT JOIN employer_profiles ep ON ep.user_id = jp.employer_id
       LEFT JOIN job_skills js ON js.job_id = jp.id
       LEFT JOIN skills s ON s.id = js.skill_id
       WHERE jp.status = 'active'
         AND jp.id NOT IN (SELECT job_id FROM applications WHERE freelancer_id = $1)
       GROUP BY jp.id, jc.name, ep.company_name
       ORDER BY jp.created_at DESC
       LIMIT 20`,
      [userId]
    ),
    query(
      `SELECT jc.name AS category, COUNT(*) AS job_count,
              ROUND(AVG(jp.budget_min)) AS avg_budget_min,
              ROUND(AVG(jp.budget_max)) AS avg_budget_max
       FROM job_postings jp
       JOIN job_categories jc ON jc.id = jp.category_id
       WHERE jp.status = 'active'
       GROUP BY jc.name
       ORDER BY job_count DESC`
    ),
  ]);

  const profile = profileRes.rows[0] || {};
  const jobs = recJobsRes.rows;
  const stats = categoryStatsRes.rows;

  const fmtIDR = (n) => (n ? `Rp ${Number(n).toLocaleString("id-ID")}` : "-");

  const jobLines = jobs.map((j, i) =>
    `${i + 1}. ${j.title} (${j.category}, ${j.company_name || "?"}) — ${fmtIDR(j.budget_min)}–${fmtIDR(j.budget_max)}, ${j.location_type}, level ${j.experience_level || "-"}, skills: ${j.skills.join(", ") || "-"}`
  ).join("\n");

  const statLines = stats.map((s) =>
    `- ${s.category}: ${s.job_count} lowongan aktif, rata-rata budget ${fmtIDR(s.avg_budget_min)}–${fmtIDR(s.avg_budget_max)}`
  ).join("\n");

  return `Kamu adalah asisten karier AI di platform "Jogja Freelance Passport", platform freelance untuk wilayah Yogyakarta.
Tugasmu membantu freelancer berdiskusi tentang:
- Rekomendasi lowongan yang cocok berdasarkan skill mereka
- Perbandingan antar kategori pekerjaan (jumlah lowongan, rata-rata budget, mana yang menjanjikan)
- Tips melamar, menulis proposal, dan pengembangan karier freelance

Jawab SELALU dalam Bahasa Indonesia yang santai tapi profesional. Jawaban ringkas dan actionable (maksimal ~250 kata). PENTING: tulis dalam teks polos TANPA format markdown — jangan pakai **, *, #, atau tabel. Untuk daftar, gunakan tanda "-" di awal baris. Jangan mengarang lowongan yang tidak ada di data. Kalau ditanya di luar topik karier/freelance, arahkan kembali dengan sopan.

=== PROFIL USER ===
Nama: ${profile.full_name || "-"}
Kota: ${profile.city || "-"}
Skills: ${(profile.skills || []).join(", ") || "(belum mengisi skill)"}

=== LOWONGAN AKTIF TERBARU (maks 20, yang belum dilamar user) ===
${jobLines || "(tidak ada lowongan aktif)"}

=== STATISTIK PERBANDINGAN KATEGORI ===
${statLines || "(tidak ada data)"}`;
}

/**
 * Stream jawaban Gemini ke callback onText per potongan teks.
 * history: [{ role: "user"|"model", text }]
 */
async function streamChat({ systemPrompt, history, message, onText }) {
  const contents = [
    ...history.map((m) => ({ role: m.role === "model" ? "model" : "user", parts: [{ text: String(m.text).slice(0, 2000) }] })),
    { role: "user", parts: [{ text: message }] },
  ];

  const doFetch = (model) => fetch(geminiUrl(model), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.7,
        // Gemini 2.5 defaultnya "berpikir" dulu dan itu ikut memakan
        // maxOutputTokens — matikan supaya jawaban tidak terpotong.
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  // Coba model utama; kalau overload/kuota (429/500/503) pindah ke model
  // berikutnya, dengan satu retry ringan per model.
  let resp;
  outer: for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      resp = await doFetch(model);
      if (resp.ok) break outer;
      if (![429, 500, 503].includes(resp.status)) break outer;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  if (!resp.ok) {
    const body = await resp.text();
    const err = new Error(`Gemini API error ${resp.status}`);
    err.status = resp.status;
    err.body = body;
    throw err;
  }

  // Parse SSE dari Gemini: baris "data: {...}"
  const decoder = new TextDecoder();
  let buffer = "";
  for await (const chunk of resp.body) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop(); // sisakan baris yang belum lengkap
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const json = JSON.parse(payload);
        const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
        if (text) onText(text);
      } catch { /* potongan JSON tidak lengkap, abaikan */ }
    }
  }
}

module.exports = { buildContext, streamChat, checkAndCountUsage, DAILY_LIMIT };
