const { buildContext, streamChat, checkAndCountUsage, DAILY_LIMIT } = require("./aiChat.service");

// POST /ai/chat — streaming SSE. Body: { message, history?: [{role, text}] }
async function chat(req, res) {
  const { message, history = [] } = req.body || {};
  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ success: false, message: "Pesan tidak boleh kosong" });
  }
  if (message.length > 2000) {
    return res.status(400).json({ success: false, message: "Pesan terlalu panjang (maks 2000 karakter)" });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ success: false, message: "AI belum dikonfigurasi (GEMINI_API_KEY kosong)" });
  }

  const { allowed, remaining } = checkAndCountUsage(req.user.id);
  if (!allowed) {
    return res.status(429).json({
      success: false,
      message: `Batas ${DAILY_LIMIT} pesan per hari tercapai. Coba lagi besok ya!`,
    });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

  try {
    const systemPrompt = await buildContext(req.user.id);
    send({ type: "meta", remaining });
    await streamChat({
      systemPrompt,
      history: Array.isArray(history) ? history.slice(-10) : [],
      message: message.trim(),
      onText: (text) => send({ type: "text", text }),
    });
    send({ type: "done" });
  } catch (err) {
    console.error("AI chat error:", err.status || "", err.message, err.body ? String(err.body).slice(0, 300) : "");
    const friendly = err.status === 429
      ? "Kuota AI harian dari Google sedang penuh. Coba lagi nanti ya."
      : "AI sedang tidak bisa dihubungi. Coba lagi sebentar lagi.";
    send({ type: "error", message: friendly });
  } finally {
    res.end();
  }
}

module.exports = { chat };
