"use client";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { THEME } from "../components/home/theme";

const POSTER_THEMES = [
  {
    name: "星空探险家",
    bg: ["#1a0533", "#2d0a6b", "#1a0533"],
    bubbles: [
      { x: 150, y: 300, r: 500, color: "rgba(167,139,250,0.4)" },
      { x: 900, y: 800, r: 600, color: "rgba(251,191,36,0.25)" },
      { x: 400, y: 1600, r: 700, color: "rgba(52,211,153,0.2)" },
    ],
    starDeco: [
      { x: 950, y: 200, r: 25, alpha: 0.9 },
      { x: 80, y: 500, r: 18, alpha: 0.7 },
      { x: 1000, y: 700, r: 15, alpha: 0.6 },
      { x: 100, y: 1200, r: 20, alpha: 0.8 },
      { x: 950, y: 1500, r: 22, alpha: 0.7 },
    ],
    textHero: ["#fde68a", "#fb923c", "#f472b6"],
    textMain: "#ffffff",
    textSub: "rgba(255,255,255,0.85)",
    textFaint: "rgba(255,255,255,0.45)",
    glassBg: "rgba(255,255,255,0.1)",
    glassBorder: "rgba(255,255,255,0.2)",
    glassShadow: "rgba(0,0,0,0.3)",
    badgeBg: "rgba(251,191,36,0.3)",
    badgeText: "#fde68a",
    calendarEmpty: "rgba(255,255,255,0.12)",
  },
  {
    name: "彩虹阳光天",
    bg: ["#fff9c4", "#fce4ec", "#e8f5e9"],
    bubbles: [
      { x: 100, y: 200, r: 500, color: "rgba(251,146,60,0.25)" },
      { x: 950, y: 600, r: 600, color: "rgba(99,102,241,0.2)" },
      { x: 300, y: 1600, r: 700, color: "rgba(52,211,153,0.2)" },
    ],
    starDeco: [
      { x: 950, y: 150, r: 28, alpha: 0.9 },
      { x: 80, y: 450, r: 20, alpha: 0.8 },
      { x: 1000, y: 750, r: 16, alpha: 0.7 },
      { x: 80, y: 1200, r: 22, alpha: 0.8 },
      { x: 960, y: 1550, r: 24, alpha: 0.7 },
    ],
    textHero: ["#f59e0b", "#10b981", "#6366f1"],
    textMain: "#1e1b4b",
    textSub: "rgba(30,27,75,0.75)",
    textFaint: "rgba(30,27,75,0.4)",
    glassBg: "rgba(255,255,255,0.65)",
    glassBorder: "rgba(255,255,255,0.9)",
    glassShadow: "rgba(30,27,75,0.08)",
    badgeBg: "rgba(251,146,60,0.2)",
    badgeText: "#f59e0b",
    calendarEmpty: "rgba(30,27,75,0.12)",
  },
];


const FONT_FAMILY = `system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif`;

function PosterGenerator({ me, streakDays, totalVideos, vocabCount, heatmapData, activeDays, isMobile }) {
  const canvasRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const [posterBlobUrl, setPosterBlobUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [themeIdx, setThemeIdx] = useState(0);

  function roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function drawGlassCard(ctx, x, y, w, h, radius, bgColor, borderColor, shadowColor) {
    ctx.save();
    roundRectPath(ctx, x, y, w, h, radius);
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 20;
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.lineWidth = 2;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    ctx.restore();
  }


  async function generate(forceTheme) {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 80));

    const nextTheme = forceTheme !== undefined ? forceTheme : themeIdx;
    setThemeIdx(nextTheme);
    const T = POSTER_THEMES[nextTheme];

    const canvas = canvasRef.current;
    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // ── 背景 ──
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, T.bg[0]);
    bgGrad.addColorStop(0.5, T.bg[1]);
    bgGrad.addColorStop(1, T.bg[2]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // ── 装饰圆形气泡 ──
    const bubbles = T.bubbles;
    bubbles.forEach(b => {
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      grad.addColorStop(0, b.color);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    });

    // ── 装饰星星 ──
    function drawStar(cx, cy, r, color, alpha = 1) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.font = `${r * 2}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("⭐", cx, cy);
      ctx.restore();
    }
    T.starDeco.forEach(s => drawStar(s.x, s.y, s.r, "#fde68a", s.alpha));

    let currentY = 100;

    // ── 顶部日期 ──
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
    ctx.font = `700 28px ${FONT_FAMILY}`;
    ctx.fillStyle = T.textFaint;
    ctx.textAlign = "right";
    ctx.fillText(dateStr, W - 80, currentY);
    ctx.textAlign = "left";

    // ── 大标题卡片 ──
    currentY += 40;
    const titleCardH = 220;
    drawGlassCard(ctx, 60, currentY, W - 120, titleCardH, 40, T.glassBg, T.glassBorder, T.glassShadow);

    const userName = me?.email?.split("@")[0] || "小朋友";
    ctx.font = `900 52px ${FONT_FAMILY}`;
    ctx.fillStyle = T.textMain;
    ctx.fillText(`🌟 ${userName} 的英语成就`, 110, currentY + 80);

    ctx.font = `700 32px ${FONT_FAMILY}`;
    ctx.fillStyle = T.textSub;
    ctx.fillText("每天看动画，英语越来越棒！", 110, currentY + 135);

    // 称号徽章
    let badgeText = "英语启蒙小达人 🌱";
    if (streakDays >= 21) badgeText = "动画英语超级达人 🏆";
    else if (streakDays >= 7) badgeText = "坚持学习小明星 ⭐";
    else if (vocabCount >= 30) badgeText = "单词收集小能手 📚";
    ctx.font = `800 26px ${FONT_FAMILY}`;
    const bw = ctx.measureText(badgeText).width + 50;
    const bh = 52;
    const bx = 110;
    const by = currentY + 158;
    roundRectPath(ctx, bx, by, bw, bh, 26);
    ctx.fillStyle = T.badgeBg;
    ctx.fill();
    ctx.fillStyle = T.badgeText;
    ctx.textBaseline = "middle";
    ctx.fillText(badgeText, bx + 25, by + bh / 2);
    ctx.textBaseline = "alphabetic";

    // ── 星星大数字区 ──
    currentY += titleCardH + 50;
    const starCardH = 280;
    drawGlassCard(ctx, 60, currentY, W - 120, starCardH, 40, T.glassBg, T.glassBorder, T.glassShadow);

    ctx.font = `900 200px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    const textGrad = ctx.createLinearGradient(W / 2 - 150, currentY, W / 2 + 150, currentY + 200);
    textGrad.addColorStop(0, T.textHero[0]);
    textGrad.addColorStop(0.5, T.textHero[1]);
    textGrad.addColorStop(1, T.textHero[2]);
    ctx.fillStyle = textGrad;
    ctx.fillText(String(streakDays || 0), W / 2 - 80, currentY + 185);

    ctx.font = `900 48px ${FONT_FAMILY}`;
    ctx.fillStyle = "#fde68a";
    ctx.fillText("⭐", W / 2 + 130, currentY + 160);

    ctx.font = `700 34px ${FONT_FAMILY}`;
    ctx.fillStyle = T.textSub;
    ctx.fillText("连续学习天数", W / 2, currentY + 248);
    ctx.textAlign = "left";

    // ── 数据三格卡 ──
    currentY += starCardH + 40;
    const statCardH = 200;
    drawGlassCard(ctx, 60, currentY, W - 120, statCardH, 40, T.glassBg, T.glassBorder, T.glassShadow);

    const statCols = [
      { label: "看了动画", val: totalVideos || 0, unit: "个", emoji: "🎬" },
      { label: "收藏单词", val: vocabCount || 0, unit: "个", emoji: "📖" },
      { label: "活跃天数", val: activeDays || 0, unit: "天", emoji: "🔥" },
    ];
    const colW = (W - 120) / 3;
    statCols.forEach((stat, i) => {
      const cx = 60 + colW * i + colW / 2;
      ctx.textAlign = "center";
      // emoji
      ctx.font = `42px serif`;
      ctx.fillText(stat.emoji, cx, currentY + 65);
      // 数字
      ctx.font = `900 58px ${FONT_FAMILY}`;
      ctx.fillStyle = T.textMain;
      ctx.fillText(`${stat.val}${stat.unit}`, cx, currentY + 138);
      // 标签
      ctx.font = `600 24px ${FONT_FAMILY}`;
      ctx.fillStyle = T.textSub;
      ctx.fillText(stat.label, cx, currentY + 178);
      // 分隔线
      if (i < 2) {
        ctx.beginPath();
        ctx.moveTo(60 + colW * (i + 1), currentY + 40);
        ctx.lineTo(60 + colW * (i + 1), currentY + statCardH - 30);
        ctx.strokeStyle = T.glassBorder;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
    ctx.textAlign = "left";

    // ── 月历卡 ──
    currentY += statCardH + 40;
    const calRows = Math.ceil((new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() + new Date(now.getFullYear(), now.getMonth(), 1).getDay()) / 7);
    const calCardH = 80 + 50 + calRows * 100 + 40;
    drawGlassCard(ctx, 60, currentY, W - 120, calCardH, 40, T.glassBg, T.glassBorder, T.glassShadow);

    ctx.font = `900 36px ${FONT_FAMILY}`;
    ctx.fillStyle = T.textMain;
    ctx.textAlign = "center";
    const MONTH_ZH = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
    ctx.fillText(`📅 ${now.getFullYear()}年${MONTH_ZH[now.getMonth()]}学习足迹`, W / 2, currentY + 55);
    ctx.textAlign = "left";

    const calTop = currentY + 80;
    const calColW = (W - 120) / 7;
    const weekZH = ["日","一","二","三","四","五","六"];
    ctx.font = `700 22px ${FONT_FAMILY}`;
    ctx.fillStyle = T.textFaint;
    weekZH.forEach((w, i) => {
      ctx.textAlign = "center";
      ctx.fillText(w, 60 + calColW * i + calColW / 2, calTop + 30);
    });

    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = firstDay.getDay();
    const totalDaysNum = lastDay.getDate();
    const todayStr = now.toISOString().slice(0, 10);

    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= totalDaysNum; d++) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ d, key, count: heatmapData?.[key] || 0 });
    }

    const rowH = 95;
    cells.forEach((cell, idx) => {
      const col = idx % 7;
      const row = Math.floor(idx / 7);
      const cx = 60 + col * calColW + calColW / 2;
      const cy = calTop + 50 + row * rowH + rowH / 2;
      if (!cell) return;
      const { d, key, count } = cell;
      if (count > 0) {
        // 有学习记录用星星背景
        ctx.font = `52px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.globalAlpha = Math.min(1, 0.5 + count * 0.25);
        ctx.fillText("⭐", cx, cy - 8);
        ctx.globalAlpha = 1;
      } else {
        ctx.beginPath();
        ctx.arc(cx, cy - 8, 32, 0, Math.PI * 2);
        ctx.fillStyle = T.calendarEmpty;
        ctx.fill();
      }
      if (key === todayStr) {
        ctx.beginPath();
        ctx.arc(cx, cy - 8, 38, 0, Math.PI * 2);
        ctx.strokeStyle = T.badgeBg;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.font = `700 24px ${FONT_FAMILY}`;
      ctx.fillStyle = count > 0 ? T.textMain : T.textFaint;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(d), cx, cy + 28);
      ctx.textBaseline = "alphabetic";
    });
    ctx.textAlign = "left";

    // ── 底部 ──
    ctx.textAlign = "center";
    ctx.font = `900 34px ${FONT_FAMILY}`;
    ctx.fillStyle = T.textMain;
    ctx.fillText("🌈 儿童英语启蒙库 · Kids English", W / 2, H - 100);
    ctx.font = `600 24px ${FONT_FAMILY}`;
    ctx.fillStyle = T.textFaint;
    ctx.fillText("看动画 · 学单词 · 每天进步 ⭐", W / 2, H - 55);
    ctx.textAlign = "left";

      setShowModal(true);
    }, "image/png", 1.0);
  }

  async function handleSwitchTheme() {
    await generate((themeIdx + 1) % POSTER_THEMES.length);
  }

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* 风格指示行 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: THEME.colors.muted, fontWeight: 800 }}>
          当前风格：{POSTER_THEMES[themeIdx].name}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {POSTER_THEMES.map((_, i) => (
            <div key={i} style={{ width: i === themeIdx ? 20 : 8, height: 8, borderRadius: 999, background: i === themeIdx ? "#4f46e5" : "rgba(15,23,42,0.14)", transition: "all 0.3s ease" }} />
          ))}
        </div>
      </div>

      {/* 生成按钮 */}
      <button
        onClick={() => generate()}
        disabled={generating}
        style={{
          width: "100%",
          padding: "16px 0",
          borderRadius: 16,
          border: "none",
          background: generating ? "rgba(79,70,229,0.45)" : "linear-gradient(135deg, #0f172a 0%, #312e81 100%)",
          color: "#fff",
          fontSize: 15,
          fontWeight: 1000,
          cursor: generating ? "not-allowed" : "pointer",
          boxShadow: generating ? "none" : "0 12px 28px rgba(15,23,42,0.20)",
          transition: "all 0.2s ease",
        }}
      >
        {generating ? "⏳ 生成中..." : "生成高清海报 ✦"}
      </button>

      {/* ─── 预览弹窗：全屏图片，长按保存（兼容所有国内浏览器）──────────── */}
      {showModal && posterBlobUrl && createPortal(
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          {/* 顶部操作栏 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              background: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              ← 返回
            </button>
            <span style={{ fontSize: 14, fontWeight: 1000, color: "#fff" }}>
              {POSTER_THEMES[themeIdx].name}
            </span>
            <button
              onClick={handleSwitchTheme}
              disabled={generating}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 800,
                cursor: generating ? "not-allowed" : "pointer",
                opacity: generating ? 0.5 : 1,
              }}
            >
              {generating ? "切换中..." : "换风格"}
            </button>
          </div>

          {/* 长按提示横幅 */}
          <div
            style={{
              textAlign: "center",
              padding: "10px 16px",
              background: "rgba(99,102,241,0.85)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: "0.3px",
              flexShrink: 0,
            }}
          >
            👆 长按图片 → 选择"保存图片"即可存入相册
          </div>

          {/* 图片主体：blob: URL，长按弹出保存菜单 */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "12px",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <img
              src={posterBlobUrl}
              alt="学习成就海报"
              style={{
                width: "100%",
                maxWidth: 480,
                borderRadius: 12,
                display: "block",
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
              onDragStart={(e) => e.preventDefault()}
            />
          </div>

          {/* 底部：电脑端显示下载按钮，手机端只显示主题点 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              padding: "14px 20px 28px",
              background: "rgba(0,0,0,0.85)",
              flexShrink: 0,
            }}
          >
            {!isMobile && (
              <a
                href={posterBlobUrl}
                download={`儿童英语启蒙库_${new Date().toISOString().slice(0, 10)}.png`}
                style={{
                  display: "block",
                  width: "100%",
                  maxWidth: 360,
                  padding: "13px 0",
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #0f172a, #312e81)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 1000,
                  textAlign: "center",
                  textDecoration: "none",
                  boxSizing: "border-box",
                }}
              >
                ⬇️ 下载图片到本地
              </a>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              {POSTER_THEMES.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === themeIdx ? 24 : 8,
                    height: 8,
                    borderRadius: 999,
                    background: i === themeIdx ? "#fff" : "rgba(255,255,255,0.25)",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default PosterGenerator;
