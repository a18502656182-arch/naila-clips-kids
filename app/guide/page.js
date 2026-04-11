// app/guide/page.js
import Link from "next/link";

const WECHAT_QR_URL = "/cf-img/qvilyoTfnpu3-vu3LTcGwQ/94686906-f46c-44cc-b53c-0d6b77166500/qr";
const WECHAT_ID = "wll74748585";

const STEPS = [
  { num: "01", icon: "🎬", title: "选片段，建语感", content: "在首页按话题或剧集筛选你感兴趣的内容，感兴趣的主题学起来事半功倍。点开一个片段，先不看字幕整体看一遍，熟悉语境和语速。" },
  { num: "02", icon: "📚", title: "精学一个片段", content: "觉得太快就调到 0.75x，打开双语字幕再看一遍。结合词汇卡理解片段里的单词、短语和地道表达，遇到不认识的词直接点字幕查词，有意思的表达点词汇卡里的收藏存到词汇本。" },
  { num: "03", icon: "🗣️", title: "开口说出来", content: "打开单句暂停，每句播完之后凭记忆复述，反复几遍直到能脱口而出。最后挑战自己：关字幕、调回原速，跟着视频实时跟读，模仿语速、发音、语调和节奏。" },
  { num: "04", icon: "🎧", title: "练耳朵", content: "打开听写模式，播完一句写下你听到的，没听清就开单句循环反复听，写完所有字幕后打开英文字幕对照，记下没听出来的词，针对有困难的部分重点循环。" },
  { num: "05", icon: "🎮", title: "复习，别让词白学", content: "学完当天打开词汇本，看看今天收藏的词，进词汇游戏用6种不同的游戏模式巩固记忆，玩一轮下来印象深刻多了。" },
  { num: "06", icon: "📒", title: "打卡，看到自己的进步", content: "每天学完在手帐页查看今日任务完成状态和学习热力图，生成打卡海报记录自己的连续学习天数，坚持下去你会惊讶于自己的进步。" },
];

const FEATURES = [
  { icon: "🎬", title: "动态双语字幕", desc: "按语义群手工对齐，支持双语、纯英文、纯中文切换，单句暂停和单句循环都有。" },
  { icon: "🔍", title: "点词查词", desc: "点击字幕里任意单词，弹出音标、词性、中文释义，不用离开页面查字典。" },
  { icon: "📚", title: "词汇卡", desc: "精选单词、短语和地道表达，附音标、中英释义和例句，点击字幕块直接播放对应片段。" },
  { icon: "🎧", title: "听写模式", desc: "播放一句自己写下听到的，配合单句循环反复听，练听力的神器。" },
  { icon: "❤️", title: "收藏", desc: "收藏喜欢的片段和词汇，随时回来复习，词汇本里还能标记掌握程度。" },
  { icon: "🎮", title: "词汇游戏", desc: "6种游戏模式：气泡拼写、连连看、单词探探、台词磁力贴、盲听气球、极速二选一。" },
  { icon: "📒", title: "学习手帐", desc: "记录每天的学习轨迹，查看热力图和连续打卡天数，生成打卡海报分享给朋友。" },
];

export default function GuidePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fd", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`
        .guide-layout { display: flex; flex-direction: column; min-height: 100vh; }
        .guide-left { background: linear-gradient(160deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%); color: #fff; padding: 40px 32px; }
        .guide-right { padding: 32px 20px 60px; overflow-y: auto; }
        .feature-grid { display: flex; flex-direction: column; gap: 8px; }
        @media (min-width: 900px) {
          .guide-layout { flex-direction: row; height: 100vh; overflow: hidden; }
          .guide-left { width: 340px; min-width: 300px; flex-shrink: 0; overflow-y: auto; position: sticky; top: 0; height: 100vh; }
          .guide-right { flex: 1; overflow-y: auto; padding: 40px 48px 60px; }
          .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        }
      `}</style>

      {/* 顶部导航（手机端显示） */}
      <div style={{
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(11,18,32,0.07)",
        padding: "12px 20px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <Link href="/" style={{ fontSize: 13, color: "rgba(11,18,32,0.5)", textDecoration: "none", fontWeight: 600 }}>← 回首页</Link>
        <span style={{ color: "rgba(11,18,32,0.2)" }}>|</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: "#0b1220" }}>使用指南</span>
      </div>

      <div className="guide-layout">

        {/* 左栏：介绍 + 会员 + 客服 */}
        <div className="guide-left">
          <div style={{ fontSize: 28, marginBottom: 10 }}>📖</div>
          <h1 style={{ fontSize: 22, fontWeight: 950, margin: "0 0 12px", lineHeight: 1.3 }}>
            怎么用这个网站<br />学英语
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, margin: "0 0 28px" }}>
            精选来自美剧、电影、动画的真实英语片段，覆盖日常生活、职场、旅行、人文等实用场景，90% 来自英语核心圈母语演员的真实对话。
          </p>

          {/* 会员 */}
          <div style={{
            background: "rgba(255,255,255,0.08)", borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.12)", padding: "16px 18px", marginBottom: 12,
          }}>
            <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 6 }}>✨ 关于会员</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: 14 }}>
              免费片段随便看，会员解锁全站所有内容。支持支付宝购买，有月卡、季卡、年卡和永久卡可以选。
            </div>
            <a href="/buy" style={{
              display: "block", textAlign: "center", padding: "11px 0",
              borderRadius: 999, background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
              color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 800,
              boxShadow: "0 6px 16px rgba(99,102,241,0.35)",
            }}>立即开通会员 →</a>
          </div>

          {/* 客服 */}
          <div style={{
            background: "rgba(255,255,255,0.08)", borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.12)", padding: "16px 18px",
          }}>
            <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 6 }}>💬 联系客服</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: 14 }}>
              购买咨询、使用问题、对网站的任何建议都可以加微信联系我们。
            </div>
            <div style={{ borderRadius: 10, overflow: "hidden", maxWidth: 160, marginBottom: 8 }}>
              <img src={WECHAT_QR_URL} alt="微信客服" style={{ width: "100%", display: "block" }} />
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
              微信号：<span style={{ fontWeight: 700, color: "#fff" }}>{WECHAT_ID}</span>
            </div>
          </div>
        </div>

        {/* 右栏：功能 + 学习步骤 */}
        <div className="guide-right">

          {/* 功能介绍 */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#0b1220", margin: "0 0 14px" }}>🛠️ 这里有什么</h2>
            <div className="feature-grid">
              {FEATURES.map((f, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 12,
                  border: "1px solid rgba(11,18,32,0.07)",
                  padding: "12px 14px",
                  display: "flex", gap: 10, alignItems: "flex-start",
                }}>
                  <div style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#0b1220", marginBottom: 2 }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: "rgba(11,18,32,0.55)", lineHeight: 1.65 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 学习步骤 */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#0b1220", margin: "0 0 14px" }}>📋 完整学习步骤</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 12,
                  border: "1px solid rgba(11,18,32,0.07)",
                  padding: "14px 16px",
                  display: "flex", gap: 12, alignItems: "flex-start",
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(124,58,237,0.08))",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                  }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 900, color: "#6366f1", marginBottom: 2, letterSpacing: "0.06em" }}>STEP {s.num}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0b1220", marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: "rgba(11,18,32,0.58)", lineHeight: 1.75 }}>{s.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
