"use client";
import { useEffect, useMemo, useState } from "react";
import { THEME } from "../components/home/theme";
import { remote, authFetch, formatDate, useIsMobile } from "./journalUtils";
import { Card, SectionTitle } from "./JournalUI";
import { OverviewPanel, TodayPlan, Heatmap, LearningAnalysis } from "./JournalPanels";
import PosterGenerator from "./PosterGenerator";
import { createSupabaseBrowserClient } from "../../utils/supabase/client";

export default function Page({ accessToken }) {
  const isMobile = useIsMobile(960);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [journalData, setJournalData] = useState(null);
  const [gameSummary, setGameSummary] = useState({
    totalGameScore: 0,
    playedGameCount: 0,
  });

  // 监听 Supabase token 刷新，及时同步到 localStorage
  // 否则 token 1小时后过期，authFetch 还在用旧 token，导致误判未登录
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED" && session?.access_token) {
        try { localStorage.setItem("sb_access_token", session.access_token); } catch {}
      }
      if (event === "SIGNED_OUT") {
        try { localStorage.removeItem("sb_access_token"); } catch {}
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    authFetch(remote("/api/me"), { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setMe(d))
      .catch(() => setMe({ logged_in: false }));
  }, []);

  useEffect(() => {
    if (!me) return;
    if (!me.logged_in) {
      setLoading(false);
      return;
    }
    loadJournalData();
  }, [me]);

  const [starData, setStarData] = useState({ total_stars: 0, title: null, today: null });

  useEffect(() => {
    const token = localStorage.getItem("sb_access_token");
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE || ""}/api/game_scores`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setGameSummary({
          totalGameScore: data.totalGameScore || 0,
          playedGameCount: data.playedGameCount || 0,
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("sb_access_token");
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE || ""}/api/star_total`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { if (data.ok) setStarData(data); })
      .catch(() => {});
  }, []);

  async function loadJournalData() {
    setLoading(true);
    try {
      const [journalRes, vocabRes] = await Promise.all([
        authFetch(remote("/api/journal_stats"), { cache: "no-store" }),
        authFetch(remote("/api/vocab_favorites"), { cache: "no-store" }),
      ]);
      const journal = await journalRes.json();
      const vocab = await vocabRes.json();
      const items = vocab?.items || [];
      setJournalData({ ...journal, vocabItems: items });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  if (!loading && (!me || !me.logged_in || !me.is_member)) {
    if (typeof window !== "undefined") window.location.replace("/redeem");
    return null;
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: THEME.colors.bg }}>
        <div style={{ height: 56, background: THEME.colors.surface, borderBottom: `1px solid ${THEME.colors.border}` }} />
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "22px 16px 60px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 10,
          }}
        >
          {[220, 260, 320, 260, 220, 220].map((h, i) => (
            <div
              key={i}
              style={{
                height: h,
                borderRadius: 24,
                border: `1px solid ${THEME.colors.border}`,
                background: "linear-gradient(90deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.92) 30%, rgba(255,255,255,0.65) 60%)",
                backgroundSize: "200% 100%",
                animation: "shine 1.3s ease-in-out infinite",
              }}
            />
          ))}
        </div>
        <style>{`@keyframes shine { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      </div>
    );
  }

  const d = journalData || {};
  const vocabItems = d.vocabItems || [];
  const activeDays = Object.keys(d.heatmap || {}).length;

  const topicLabelMap = {
    "daily-life": "日常生活",
    "self-improvement": "个人成长",
    "food": "美食探店",
    "travel": "旅行",
    "business": "职场商务",
    "culture": "文化",
    "opinion": "观点表达",
    "skills": "方法技能",
  };

  const topicMap = {};
  (d.bookmarked_topics || []).forEach((slug) => {
    const label = topicLabelMap[slug] || slug;
    topicMap[label] = (topicMap[label] || 0) + 1;
  });
  const topicStats = Object.entries(topicMap)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const todayWatchCount = starData.today?.counts?.watch_clip || 0;
  const todayVocabCount = starData.today?.counts?.vocab_collect || 0;
  const tasks = [
    { label: `看动画视频 3 个（已看 ${todayWatchCount}/3）`, done: todayWatchCount >= 3 },
    { label: `收藏单词或短语 2 个（已收藏 ${todayVocabCount}/2）`, done: todayVocabCount >= 2 },
  ];

  const desktopHeroGrid = isMobile ? "1fr" : "1.08fr 0.92fr";
  const desktopMiddleGrid = isMobile ? "1fr" : "1.08fr 0.92fr";
  const desktopBottomGrid = isMobile ? "1fr" : "1.1fr 0.9fr";

  return (
    <div style={{ minHeight: "100vh", background: THEME.colors.bg }}>
      <style>{`
        @keyframes floatIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.82))",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(15,23,42,0.08)",
          height: 56,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", height: "100%", display: "flex", alignItems: "center", gap: 4 }}>
          <a
            href="/"
            style={{
              display: "flex", alignItems: "center",
              textDecoration: "none", color: THEME.colors.ink,
              fontWeight: 300, fontSize: 28, lineHeight: 1,
              flexShrink: 0, padding: "4px 6px 4px 0",
            }}
          >‹</a>
          <span style={{ fontSize: 15, fontWeight: 1000, color: THEME.colors.ink, whiteSpace: "nowrap" }}>⭐ 我的成就</span>
          <span style={{ fontSize: 11, color: THEME.colors.faint, fontWeight: 800, whiteSpace: "nowrap", marginLeft: 8 }}>📅 {formatDate()}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 16px 60px" }}>
        {/* Hero 区 - 儿童风格星星成就 */}
        <div style={{
          borderRadius: 28,
          padding: isMobile ? "20px 16px" : "24px 28px",
          color: "#fff",
          background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 40%, #3b82f6 100%)",
          boxShadow: "0 24px 70px rgba(99,102,241,0.35)",
          position: "relative", overflow: "hidden",
          animation: "floatIn 420ms ease",
        }}>
          {/* 装饰圆圈 */}
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", position: "relative" }}>
            {/* 左侧：问候 + 称号 */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 900, opacity: 0.9, marginBottom: 6 }}>
                👋 {me?.email?.split("@")[0] || "小朋友"}，今天继续加油！
              </div>
              {starData.title && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.18)", borderRadius: 999, padding: "4px 14px", fontSize: 13, fontWeight: 800, marginBottom: 8 }}>
                  {starData.title}
                </div>
              )}
              <div style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.7 }}>
                看动画、收藏单词都能得到⭐，快来积攒星星吧！
              </div>
            </div>

            {/* 右侧：星星大数字 */}
            <div style={{
              background: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.25)",
              borderRadius: 20, padding: "16px 24px",
              textAlign: "center", minWidth: 140, flexShrink: 0,
            }}>
              <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 800, letterSpacing: 1 }}>我的星星</div>
              <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1.1, marginTop: 4 }}>
                {starData.total_stars || 0}
              </div>
              <div style={{ fontSize: 18, marginTop: 2 }}>⭐</div>
              {/* 下一个里程碑提示 */}
              {(() => {
                const s = starData.total_stars || 0;
                const next = s < 10 ? { target: 10, label: "英语新星" } : s < 50 ? { target: 50, label: "动画迷" } : s < 100 ? { target: 100, label: "英语小达人" } : null;
                if (!next) return <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>已解锁最高称号！🏆</div>;
                return (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "#fde68a", borderRadius: 999, width: `${Math.min(100, (s / next.target) * 100)}%`, transition: "width 0.5s ease" }} />
                    </div>
                    <div style={{ fontSize: 10, opacity: 0.75, marginTop: 4 }}>再得 {next.target - s} 颗解锁「{next.label}」</div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: desktopHeroGrid, gap: 10, marginTop: 14, alignItems: "start" }}>
          <OverviewPanel
            streakDays={d.streak_days || 0}
            totalViews={d.total_views || 0}
            activeDays={activeDays}
            vocabCount={vocabItems.length}
            isMobile={isMobile}
          />
          <TodayPlan d={d} isMobile={isMobile} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: desktopMiddleGrid, gap: 10, marginTop: 14, alignItems: "start" }}>
          <Heatmap
            heatmapData={d.heatmap || {}}
            streakDays={d.streak_days || 0}
            totalViews={d.total_views || 0}
            isMobile={isMobile}
          />
          <LearningAnalysis
            d={d}
            vocabCount={vocabItems.length}
            topicStats={topicStats}
            gameSummary={gameSummary}
            isMobile={isMobile}
          />
        </div>

        {/* 海报生成器：全宽独占一行，内部横向布局 */}
        <div style={{ marginTop: 10 }}>
          <Card style={{ padding: 18 }}>
            <SectionTitle
              emoji="📸"
              title="海报生成器"
              sub="把今天的学习变成一张可爱的成就海报！"
            />
            <PosterGenerator
              me={me}
              streakDays={d.streak_days || 0}
              totalVideos={d.total_views || 0}
              vocabCount={vocabItems.length}
              masteredCount={0}
              heatmapData={d.heatmap || {}}
              tasks={tasks}
              activeDays={activeDays}
              topTopic={topicStats[0]?.label || "继续学习后会出现"}
              isMobile={isMobile}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
