"use client";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
const remote = (p) => (API_BASE ? `${API_BASE}${p}` : p);

function makeAuthFetch(token) {
  return function authFetch(url, options = {}) {
    const headers = { ...(options.headers || {}) };
    const t = token || (() => { try { return localStorage.getItem("sb_access_token"); } catch { return null; } })();
    if (t) headers["Authorization"] = `Bearer ${t}`;
    return fetch(url, { ...options, headers, credentials: "include" });
  };
}

import { useEffect, useRef, useState } from "react";
import { THEME } from "../components/home/theme";

function fmtSec(s) {
  const n = Number(s || 0);
  if (!Number.isFinite(n) || n < 0) return "0:00";
  return `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;
}

function speakEn(text) {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; u.rate = 0.95;
    window.speechSynthesis.speak(u);
  } catch {}
}

// ─── 视频收藏卡片 ─────────────────────────────────────────
function VideoCard({ item, onRemove }) {
  const clip = item.clip;
  if (!clip) return null;
  const isVip = clip.access_tier === "vip";

  return (
    <div style={{
      border: `1px solid ${THEME.colors.border}`, borderRadius: THEME.radii.lg,
      background: THEME.colors.surface, overflow: "hidden",
      boxShadow: "0 2px 8px rgba(11,18,32,0.06)",
    }}>
      <a href={`/clips/${clip.id}`} style={{ textDecoration: "none", display: "block" }}>
        <div style={{ position: "relative", aspectRatio: "16/9", background: "#e8eaf0" }}>
          {clip.cover_url
            ? <Image src={clip.cover_url} alt="" fill style={{ objectFit: "cover" }} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            : <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: THEME.colors.faint, fontSize: 28 }}>🎬</div>
          }
          {clip.duration_sec > 0 && (
            <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(11,18,32,0.72)", color: "#fff", borderRadius: 6, padding: "2px 6px", fontSize: 11, fontWeight: 700 }}>
              {fmtSec(clip.duration_sec)}
            </div>
          )}
          <div style={{ position: "absolute", top: 8, left: 8, background: isVip ? "rgba(124,58,237,0.88)" : "rgba(16,185,129,0.88)", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
            {isVip ? "会员" : "免费"}
          </div>
        </div>
        <div style={{ padding: "10px 12px 4px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: THEME.colors.ink, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {clip.title || `视频 #${clip.id}`}
          </div>
        </div>
      </a>
      <div style={{ padding: "6px 12px 12px", display: "flex", justifyContent: "flex-end" }}>
        <button type="button" onClick={() => onRemove(item.bookmark_id, item.clip_id)} style={{
          border: `1px solid #ffd5d5`, background: "#fff5f5", color: "#b00000",
          borderRadius: THEME.radii.md, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}>取消收藏</button>
      </div>
    </div>
  );
}

// ─── 词汇卡片 ─────────────────────────────────────────────
function VocabFavCard({ item, onRemove, showZh, onMastery }) {
  const { term, kind, data, clip_id, mastery_level } = item;
  const [collapsed, setCollapsed] = useState(false);
  const [mastery, setMastery] = useState(mastery_level ?? 0);
  const MASTERY_OPTS = [
    { level: 0, emoji: "🔴", label: "还不会", bg: "#fff1f2", border: "#fecdd3", color: "#dc2626" },
    { level: 1, emoji: "🟡", label: "学一半", bg: "#fffbeb", border: "#fde68a", color: "#d97706" },
    { level: 2, emoji: "🟢", label: "学会了", bg: "#f0fdf4", border: "#86efac", color: "#16a34a" },
  ];
  function handleMastery(level) { setMastery(level); onMastery?.(item.id, level); }

  const kindLabel = kind === "phrases" ? "短语" : kind === "expressions" ? "地道表达" : "单词";
  const kindColor = kind === "phrases" ? "#0b5aa6" : kind === "expressions" ? "#3c3ccf" : "#b86b00";
  const kindBg = kind === "phrases" ? "#f3fbff" : kind === "expressions" ? "#f6f6ff" : "#fff8e8";
  const kindBorder = kind === "phrases" ? "#cfe6ff" : kind === "expressions" ? "#e7e7ff" : "#ffe3a3";

  const exampleEn = data?.example_en || "";
  const exampleZh = data?.example_zh || "";

  return (
    <div style={{
      border: `1px solid ${THEME.colors.border}`, borderRadius: THEME.radii.lg,
      background: THEME.colors.surface, padding: 14,
      boxShadow: "0 2px 8px rgba(11,18,32,0.06)",
    }}>
      <div className="bm-vocab-header" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div className="bm-vocab-term" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 17, fontWeight: 900, color: THEME.colors.ink }}>{term}</span>
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: kindBg, border: `1px solid ${kindBorder}`, color: kindColor, fontWeight: 700 }}>
              {kindLabel}
            </span>
          </div>
          {data?.ipa && <div style={{ marginTop: 4, fontSize: 12, color: THEME.colors.faint }}>/ {data.ipa} /</div>}
        </div>
        <div className="bm-vocab-btns" style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
          <button type="button" title="听发音"
            onClick={() => data?.audio_url ? new Audio(data.audio_url).play() : speakEn(term)}
            style={{ width: 32, height: 32, minWidth: 32, borderRadius: "50%", border: `1px solid ${THEME.colors.border}`, background: THEME.colors.surface, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, boxSizing: "border-box", flexShrink: 0 }}>🔊</button>
          <a href={`/clips/${clip_id}`} title="回到原视频"
            style={{ width: 32, height: 32, minWidth: 32, borderRadius: "50%", border: `1px solid ${THEME.colors.border}`, background: THEME.colors.surface, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", padding: 0, boxSizing: "border-box", flexShrink: 0 }}>🎬</a>
          <button type="button" title={collapsed ? "展开" : "收起"} onClick={() => setCollapsed(x => !x)}
            style={{ width: 32, height: 32, minWidth: 32, borderRadius: "50%", border: `1px solid ${THEME.colors.border}`, background: THEME.colors.surface, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, boxSizing: "border-box", flexShrink: 0 }}>
            {collapsed ? "▾" : "▴"}
          </button>
          <button type="button" title="取消收藏" onClick={() => onRemove(item.id, term, clip_id)}
            style={{ width: 32, height: 32, minWidth: 32, borderRadius: "50%", border: "1px solid #ffd5d5", background: "#fff5f5", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, boxSizing: "border-box", flexShrink: 0 }}>🗑️</button>
        </div>
      </div>

      {!collapsed && (
        <>
          {showZh && data?.meaning_zh && (
            <div style={{ marginTop: 10, border: "1px solid #ffe3a3", background: "#fff8e8", borderRadius: 12, padding: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: "#b86b00" }}>中文含义</div>
              <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.55 }}>{data.meaning_zh}</div>
            </div>
          )}
          {(exampleEn || exampleZh) && (
            <div style={{ marginTop: 10, border: "1px solid #cfe6ff", background: "#f3fbff", borderRadius: 12, padding: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: "#0b5aa6" }}>{kind === "expressions" ? "字幕原句" : "例句"}</div>
              {exampleEn && <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.55 }}>{exampleEn}</div>}
              {showZh && exampleZh && <div style={{ marginTop: 4, fontSize: 13, color: THEME.colors.muted, lineHeight: 1.55 }}>{exampleZh}</div>}
            </div>
          )}
          {kind === "expressions" && showZh && data?.use_case_zh && (
            <div style={{ marginTop: 10, border: "1px solid #e7e7ff", background: "#f6f6ff", borderRadius: 12, padding: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: "#3c3ccf" }}>详细解析</div>
              <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{data.use_case_zh}</div>
            </div>
          )}
          {/* 掌握度 */}
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>我的掌握：</span>
            {MASTERY_OPTS.map(m => (
              <button key={m.level} onClick={() => handleMastery(m.level)} style={{
                border: `2px solid ${mastery === m.level ? m.border : "#f3f4f6"}`,
                background: mastery === m.level ? m.bg : "#fafafa",
                color: mastery === m.level ? m.color : "#9ca3af",
                borderRadius: 999, padding: "5px 12px", fontSize: 12, fontWeight: 800,
                cursor: "pointer", transition: "all 120ms ease",
              }}>{m.emoji} {m.label}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── 主页面 ───────────────────────────────────────────────
export default function BookmarksClient({ accessToken: ssrToken = null }) {
  const tokenRef = useRef(ssrToken);
  const [liveToken, setLiveToken] = useState(ssrToken);

  // 客户端订阅 Supabase session，token 刷新时自动更新
  useEffect(() => {
    let mounted = true;
    let subscription = null;
    async function init() {
      try {
        const { createSupabaseBrowserClient } = await import("../../utils/supabase/client");
        const supabase = createSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session?.access_token) {
          tokenRef.current = session.access_token;
          setLiveToken(session.access_token);
        }
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!mounted) return;
          const t = session?.access_token ?? null;
          tokenRef.current = t;
          setLiveToken(t);
        });
        subscription = data.subscription;
      } catch {}
    }
    init();
    return () => { mounted = false; subscription?.unsubscribe(); };
  }, []);

  // authFetch 每次读 tokenRef.current，不受闭包旧值影响
  const authFetch = useRef(null);
  authFetch.current = (url, options = {}) => {
    const headers = { ...(options.headers || {}) };
    const t = tokenRef.current;
    if (t) headers["Authorization"] = `Bearer ${t}`;
    return fetch(url, { ...options, headers, credentials: "include" });
  };
  const doFetch = (url, options) => authFetch.current(url, options);

  const [me, setMe] = useState(null);
  const [tab, setTab] = useState("videos");
  const [showZh, setShowZh] = useState(true);

  const [videoItems, setVideoItems] = useState([]);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoSearch, setVideoSearch] = useState("");

  const [vocabItems, setVocabItems] = useState([]);
  const [vocabLoading, setVocabLoading] = useState(true);
  const [vocabSearch, setVocabSearch] = useState("");
  const [vocabKind, setVocabKind] = useState("all");

  useEffect(() => {
    doFetch(remote("/api/me"), { cache: "no-store" })
      .then(r => r.json())
      .then(d => setMe(d))
      .catch(() => setMe({ logged_in: false }));
    loadVideos();
    loadVocab();
  // liveToken 变化时重新加载
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveToken]);

  async function loadVideos() {
    setVideoLoading(true);
    try {
      const r = await doFetch(remote("/api/bookmarks?limit=100"), { cache: "no-store" });
      const d = await r.json();
      setVideoItems(d?.items || []);
    } catch {}
    setVideoLoading(false);
  }

  async function loadVocab() {
    setVocabLoading(true);
    try {
      const r = await doFetch(remote("/api/vocab_favorites"), { cache: "no-store" });
      const d = await r.json();
      setVocabItems(d?.items || []);
    } catch {}
    setVocabLoading(false);
  }

  async function removeVideo(bookmarkId, clipId) {
    try {
      await doFetch(remote("/api/bookmarks_delete"), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clip_id: clipId }),
      });
      setVideoItems(prev => prev.filter(x => x.bookmark_id !== bookmarkId));
    } catch {}
  }

  async function removeVocab(id, term, clipId) {
    try {
      await doFetch(remote("/api/vocab_fav_delete"), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term, clip_id: clipId }),
      });
      setVocabItems(prev => prev.filter(x => x.id !== id));
    } catch {}
  }

  async function updateMastery(id, level) {
    setVocabItems(prev => prev.map(x => x.id === id ? { ...x, mastery_level: level } : x));
    try {
      await doFetch(remote("/api/vocab_update_mastery"), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: [{ id, mastery_level: level }] }),
      });
    } catch {}
  }

  const [flashMode, setFlashMode] = useState(false);
  const [flashIdx, setFlashIdx] = useState(0);
  const [flashFlipped, setFlashFlipped] = useState(false);
  const [flashResults, setFlashResults] = useState({});
  const [flashDone, setFlashDone] = useState(false);
  const [groupByClip, setGroupByClip] = useState(false);
  const [masteryFilter, setMasteryFilter] = useState(null);

  const filteredVideos = videoItems.filter(item =>
    !videoSearch || (item.clip?.title || "").toLowerCase().includes(videoSearch.toLowerCase())
  );

  const filteredVocab = vocabItems.filter(item => {
    const matchSearch = !vocabSearch || item.term.toLowerCase().includes(vocabSearch.toLowerCase()) ||
      (item.data?.meaning_zh || "").includes(vocabSearch);
    const matchMastery = masteryFilter === null || (item.mastery_level ?? 0) === masteryFilter;
    if (!matchMastery) return false;
    const matchKind = vocabKind === "all" || item.kind === vocabKind;
    return matchSearch && matchKind;
  });

  const flashDeck = filteredVocab.filter(x => (x.mastery_level ?? 0) < 2);

  const groupedByClip = vocabItems.reduce((acc, item) => {
    const key = item.clip_id || 0;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  function startFlash() {
    if (flashDeck.length === 0) return;
    setFlashMode(true); setFlashIdx(0);
    setFlashFlipped(false); setFlashResults({}); setFlashDone(false);
  }

  function flashAnswer(knew, item) {
    const newLevel = knew ? Math.min(2, (item.mastery_level ?? 0) + 1) : Math.max(0, (item.mastery_level ?? 0) - 1);
    updateMastery(item.id, newLevel);
    setFlashResults(r => ({ ...r, [item.id]: knew }));
    if (flashIdx + 1 >= flashDeck.length) { setFlashDone(true); }
    else { setFlashIdx(i => i + 1); setFlashFlipped(false); }
  }

  const navBar = (
    <div style={{
      position: "sticky", top: 0, zIndex: 20,
      background: "rgba(246,247,251,0.92)", backdropFilter: "blur(10px)",
      borderBottom: `1px solid ${THEME.colors.border}`,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "10px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <a href="/" style={{
          display: "flex", alignItems: "center",
          border: "none", background: "transparent",
          textDecoration: "none", color: THEME.colors.ink,
          fontWeight: 300, fontSize: 28, lineHeight: 1, padding: "4px 6px",
        }}>‹</a>
        <div style={{ fontWeight: 900, fontSize: 17, color: THEME.colors.ink }}>我的收藏</div>
      </div>
    </div>
  );

  if (me !== null && (!me.logged_in || !me.is_member)) {
    window.location.replace("/redeem");
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .bm-vocab-header { display: flex; gap: 10px; align-items: flex-start; }
        .bm-vocab-term { flex: 1; min-width: 0; }
        .bm-vocab-btns { display: flex; gap: 6px; flex-shrink: 0; align-items: center; }
      `}</style>
      <div style={{ background: THEME.colors.bg, minHeight: "100vh" }}>
        {navBar}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 60px" }}>

          {/* 标签切换 */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <button type="button" onClick={() => setTab("videos")} style={{
              padding: "10px 20px", borderRadius: THEME.radii.pill, fontWeight: 700, fontSize: 14, cursor: "pointer",
              border: `1px solid ${tab === "videos" ? THEME.colors.ink : THEME.colors.border2}`,
              background: tab === "videos" ? THEME.colors.ink : THEME.colors.surface,
              color: tab === "videos" ? "#fff" : THEME.colors.ink,
            }}>❤️ 收藏视频 {videoItems.length > 0 ? `(${videoItems.length})` : ""}</button>
            <button type="button" onClick={() => setTab("vocab")} style={{
              padding: "10px 20px", borderRadius: THEME.radii.pill, fontWeight: 700, fontSize: 14, cursor: "pointer",
              border: `1px solid ${tab === "vocab" ? THEME.colors.ink : THEME.colors.border2}`,
              background: tab === "vocab" ? THEME.colors.ink : THEME.colors.surface,
              color: tab === "vocab" ? "#fff" : THEME.colors.ink,
            }}>📖 我的词汇本 {vocabItems.length > 0 ? `(${vocabItems.length})` : ""}</button>
          </div>

          {/* ── 视频收藏 tab ── */}
          {tab === "videos" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <input value={videoSearch} onChange={e => setVideoSearch(e.target.value)}
                  placeholder="搜索收藏的视频标题..."
                  style={{ flex: 1, padding: "10px 14px", border: `1px solid ${THEME.colors.border2}`, borderRadius: THEME.radii.md, fontSize: 13, background: THEME.colors.surface, outline: "none" }} />
                <span style={{ fontSize: 13, color: THEME.colors.faint, whiteSpace: "nowrap" }}>共 {filteredVideos.length} 条</span>
                <button type="button" onClick={loadVideos} style={{ border: `1px solid ${THEME.colors.border2}`, background: THEME.colors.surface, borderRadius: THEME.radii.md, padding: "8px 14px", fontSize: 13, cursor: "pointer" }}>刷新</button>
              </div>
              {videoLoading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} style={{ borderRadius: THEME.radii.lg, overflow: "hidden", background: THEME.colors.surface, border: `1px solid ${THEME.colors.border}` }}>
                      <div style={{ width: "100%", paddingTop: "56.25%", background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
                      <div style={{ padding: 12 }}>
                        <div style={{ height: 14, borderRadius: 6, background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite", marginBottom: 8 }} />
                        <div style={{ height: 12, width: "60%", borderRadius: 6, background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredVideos.length === 0 ? (
                <div style={{ border: `1px solid ${THEME.colors.border}`, borderRadius: THEME.radii.lg, background: THEME.colors.surface, padding: 40, textAlign: "center", color: THEME.colors.muted, fontSize: 14 }}>
                  还没有收藏任何视频，去首页挑一个吧 ~
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                  {filteredVideos.map(item => <VideoCard key={item.bookmark_id} item={item} onRemove={removeVideo} />)}
                </div>
              )}
            </>
          )}

          {/* ── 词汇本 tab ── */}
          {tab === "vocab" && (
            <>
              {/* 闪卡弹窗 */}
              {flashMode && (
                <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                  <div style={{ background: "#fff", borderRadius: 24, padding: 28, width: "100%", maxWidth: 420, boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}>
                    {flashDone ? (
                      <>
                        <div style={{ textAlign: "center", fontSize: 40, marginBottom: 12 }}>🎉</div>
                        <div style={{ textAlign: "center", fontSize: 18, fontWeight: 900, marginBottom: 8 }}>本轮复习完成！</div>
                        <div style={{ textAlign: "center", fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
                          会了 {Object.values(flashResults).filter(Boolean).length} 个 · 还需练习 {Object.values(flashResults).filter(x => !x).length} 个
                        </div>
                        <button onClick={() => setFlashMode(false)} style={{ width: "100%", background: "#6366f1", color: "#fff", border: "none", borderRadius: 999, padding: "14px 0", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>返回词汇本</button>
                      </>
                    ) : flashDeck[flashIdx] ? (() => {
                      const card = flashDeck[flashIdx];
                      return (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <span style={{ fontSize: 13, color: "#9ca3af" }}>{flashIdx + 1} / {flashDeck.length}</span>
                            <button onClick={() => setFlashMode(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
                          </div>
                          <div style={{ background: "#f8fafc", borderRadius: 16, padding: "28px 20px", textAlign: "center", marginBottom: 20, minHeight: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ fontSize: 28, fontWeight: 900, color: "#0b1220", marginBottom: 8 }}>{card.term}</div>
                            {card.data?.ipa && <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 8 }}>/{card.data.ipa}/</div>}
                            {flashFlipped ? (
                              <>
                                <div style={{ fontSize: 16, color: "#374151", fontWeight: 700, marginBottom: 6 }}>{card.data?.meaning_zh}</div>
                                {card.data?.example_en && <div style={{ fontSize: 13, color: "#6b7280", fontStyle: "italic" }}>{card.data.example_en}</div>}
                              </>
                            ) : (
                              <button onClick={() => setFlashFlipped(true)} style={{ marginTop: 8, background: "#e0e7ff", color: "#4f46e5", border: "none", borderRadius: 999, padding: "10px 24px", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>翻转看答案 👆</button>
                            )}
                          </div>
                          {flashFlipped && (
                            <div style={{ display: "flex", gap: 12 }}>
                              <button onClick={() => flashAnswer(false, card)} style={{ flex: 1, background: "#fff1f2", color: "#dc2626", border: "2px solid #fecdd3", borderRadius: 999, padding: "12px 0", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>❌ 还不会</button>
                              <button onClick={() => flashAnswer(true, card)} style={{ flex: 1, background: "#f0fdf4", color: "#16a34a", border: "2px solid #86efac", borderRadius: 999, padding: "12px 0", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>✅ 会了！</button>
                            </div>
                          )}
                        </>
                      );
                    })() : null}
                  </div>
                </div>
              )}

              {/* 工具栏 */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <input value={vocabSearch} onChange={e => setVocabSearch(e.target.value)}
                  placeholder="搜索单词或中文..."
                  style={{ flex: 1, minWidth: 160, padding: "10px 14px", border: "2px solid #e5e7eb", borderRadius: 12, fontSize: 13, outline: "none" }} />
                <button onClick={startFlash} disabled={flashDeck.length === 0} style={{
                  background: flashDeck.length > 0 ? "linear-gradient(135deg,#6366f1,#7c3aed)" : "#e5e7eb",
                  color: flashDeck.length > 0 ? "#fff" : "#9ca3af",
                  border: "none", borderRadius: 999, padding: "10px 16px", fontSize: 12, fontWeight: 800,
                  cursor: flashDeck.length > 0 ? "pointer" : "default", whiteSpace: "nowrap",
                }}>🃏 闪卡 ({flashDeck.length})</button>
                <button onClick={() => setGroupByClip(x => !x)} style={{
                  background: groupByClip ? "#eff6ff" : "#f9fafb", color: groupByClip ? "#3b82f6" : "#6b7280",
                  border: `2px solid ${groupByClip ? "#bfdbfe" : "#e5e7eb"}`,
                  borderRadius: 999, padding: "10px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                }}>📺 按视频</button>
                <button onClick={() => setShowZh(x => !x)} style={{
                  border: `2px solid ${showZh ? "#a5b4fc" : "#e5e7eb"}`,
                  background: showZh ? "#eef2ff" : "#f9fafb", color: showZh ? "#4f46e5" : "#6b7280",
                  borderRadius: 999, padding: "10px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                }}>{showZh ? "中文 ON" : "OFF"}</button>
                <button onClick={loadVocab} style={{ border: "2px solid #e5e7eb", background: "#f9fafb", borderRadius: 12, padding: "10px 12px", fontSize: 13, cursor: "pointer", color: "#6b7280" }}>↺</button>
              </div>

              {/* 掌握度筛选 */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {[
                  { val: null, emoji: "📚", label: `全部(${vocabItems.length})` },
                  { val: 0, emoji: "🔴", label: `还不会(${vocabItems.filter(x=>(x.mastery_level??0)===0).length})` },
                  { val: 1, emoji: "🟡", label: `学一半(${vocabItems.filter(x=>(x.mastery_level??0)===1).length})` },
                  { val: 2, emoji: "🟢", label: `学会了(${vocabItems.filter(x=>(x.mastery_level??0)===2).length})` },
                ].map(f => (
                  <button key={String(f.val)} onClick={() => setMasteryFilter(f.val)} style={{
                    border: `2px solid ${masteryFilter===f.val ? "#6366f1" : "#e5e7eb"}`,
                    background: masteryFilter===f.val ? "#eef2ff" : "#f9fafb",
                    color: masteryFilter===f.val ? "#4f46e5" : "#6b7280",
                    borderRadius: 999, padding: "7px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer",
                  }}>{f.emoji} {f.label}</button>
                ))}
              </div>

              {vocabLoading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} style={{ borderRadius: 16, background: "#fff", border: "1px solid #e5e7eb", padding: 16 }}>
                      <div style={{ height: 16, width: "30%", borderRadius: 6, background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite", marginBottom: 10 }} />
                      <div style={{ height: 12, width: "80%", borderRadius: 6, background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
                    </div>
                  ))}
                </div>
              ) : filteredVocab.length === 0 ? (
                <div style={{ border: "2px solid #e5e7eb", borderRadius: 16, background: "#fff", padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
                  {vocabItems.length === 0 ? "还没有收藏词汇，看视频时点词汇卡的 🤍 收藏吧" : "没有符合筛选条件的词汇"}
                </div>
              ) : groupByClip ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {Object.entries(groupedByClip).map(([clipId, items]) => {
                    const filtered = items.filter(item => {
                      const ms = !vocabSearch || item.term.toLowerCase().includes(vocabSearch.toLowerCase()) || (item.data?.meaning_zh||"").includes(vocabSearch);
                      const mm = masteryFilter === null || (item.mastery_level??0) === masteryFilter;
                      return ms && mm;
                    });
                    if (filtered.length === 0) return null;
                    return (
                      <div key={clipId}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                          <div style={{ height: 2, flex: 1, background: "#e5e7eb" }} />
                          <a href={`/clips/${clipId}`} style={{ fontSize: 13, fontWeight: 800, color: "#6366f1", textDecoration: "none", background: "#eef2ff", border: "2px solid #c7d2fe", borderRadius: 999, padding: "4px 14px", whiteSpace: "nowrap" }}>
                            📺 视频 #{clipId}（{filtered.length}个词）
                          </a>
                          <div style={{ height: 2, flex: 1, background: "#e5e7eb" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {filtered.map(item => <VocabFavCard key={item.id} item={item} onRemove={removeVocab} showZh={showZh} onMastery={updateMastery} />)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {filteredVocab.map(item => <VocabFavCard key={item.id} item={item} onRemove={removeVocab} showZh={showZh} onMastery={updateMastery} />)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
