// pages/api/word_lookup.js
// 并行查询 Free Dictionary API（音标/词性）+ 有道翻译（中文释义）
import crypto from "crypto";

const YOUDAO_APP_ID = process.env.YOUDAO_APP_ID;
const YOUDAO_APP_SECRET = process.env.YOUDAO_APP_SECRET;
const YOUDAO_API = "https://openapi.youdao.com/v2/api";

function youdaoSign(appId, word, salt, curtime, appSecret) {
  const input = word.length <= 20
    ? word
    : word.slice(0, 10) + word.length + word.slice(-10);
  const signStr = appId + input + salt + curtime + appSecret;
  return crypto.createHash("sha256").update(signStr).digest("hex");
}

async function queryYoudao(word) {
  if (!YOUDAO_APP_ID || !YOUDAO_APP_SECRET) return null;
  try {
    const salt = Date.now().toString();
    const curtime = Math.floor(Date.now() / 1000).toString();
    const sign = youdaoSign(YOUDAO_APP_ID, word, salt, curtime, YOUDAO_APP_SECRET);
    const params = new URLSearchParams({
      q: word, from: "en", to: "zh-CHS",
      appKey: YOUDAO_APP_ID, salt, sign, signType: "v3", curtime,
    });
    const r = await fetch(`${YOUDAO_API}?${params}`);
    if (!r.ok) return null;
    const data = await r.json();
    if (data.errorCode !== "0") return null;
    const dictExplains = data.basic?.explains || [];
    const translation = data.translation?.[0] || "";
    return dictExplains.length > 0 ? dictExplains.join("；") : translation;
  } catch {
    return null;
  }
}

async function queryDictionary(word) {
  try {
    const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (!r.ok) return null;
    const data = await r.json();
    if (!Array.isArray(data) || !data[0]) return null;
    const entry = data[0];
    const phonetic = entry.phonetic || entry.phonetics?.find(p => p.text)?.text || "";
    const audio = entry.phonetics?.find(p => p.audio)?.audio || "";
    const partOfSpeech = entry.meanings?.[0]?.partOfSpeech || "";
    return { phonetic, audio, partOfSpeech };
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "public, max-age=86400");
  const word = (req.query.q || "").trim().toLowerCase();
  if (!word || !/^[a-z'-]+$/.test(word)) {
    return res.status(400).json({ error: "invalid_word" });
  }

  const [youdaoResult, dictResult] = await Promise.allSettled([
    queryYoudao(word),
    queryDictionary(word),
  ]);

  const zh = youdaoResult.status === "fulfilled" ? youdaoResult.value : null;
  const dict = dictResult.status === "fulfilled" ? dictResult.value : null;

  return res.status(200).json({
    word,
    phonetic: dict?.phonetic || "",
    audio: dict?.audio || "",
    partOfSpeech: dict?.partOfSpeech || "",
    zh: zh || "",
  });
}
