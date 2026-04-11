// app/guide/page.js
import Link from "next/link";

const WECHAT_QR_URL = "/cf-img/qvilyoTfnpu3-vu3LTcGwQ/94686906-f46c-44cc-b53c-0d6b77166500/qr";
const WECHAT_ID = "wll74748585";

const STEPS = [
  {
    num: "01",
    title: "选片段，建语感",
    content: "在首页按话题或剧集筛选你感兴趣的内容，感兴趣的主题学起来事半功倍。点开一个片段，先不看字幕整体看一遍，熟悉语境和语速。",
    icon: "🎬",
  },
  {
    num: "02",
    title: "精学一个片段",
    content: "觉得太快就调到 0.75x，打开双语字幕再看一遍。结合词汇卡理解片段里的单词、短语和地道表达，遇到不认识的词直接点字幕查词，有意思的表达点词汇卡里的收藏存到词汇本。",
    icon: "📚",
  },
  {
    num: "03",
    title: "开口说出来",
    content: "打开单句暂停，每句播完之后凭记忆复述，反复几遍直到能脱口而出。最后挑战自己：关字幕、调回原速，跟着视频实时跟读，模仿语速、发音、语调和节奏。",
    icon: "🗣️",
  },
  {
    num: "04",
    title: "练耳朵",
    content: "打开听写模式，播完一句写下你听到的，没听清就开单句循环反复听，写完所有字幕后打开英文字幕对照，记下没听出来的词，针对有困难的部分重点循环。",
    icon: "🎧",
  },
  {
    num: "05",
    title: "复习，别让词白学",
    content: "学完当天打开词汇本，看看今天收藏的词，进词汇游戏用6种不同的游戏模式巩固记忆，玩一轮下来印象深刻多了。",
    icon: "🎮",
  },
  {
    num: "06",
    title: "打卡，看到自己的进步",
    content: "每天学完在手帐页查看今日任务完成状态和学习热力图，生成打卡海报记录自己的连续学习天数，坚持下去你会惊讶于自己的进步。",
    icon: "📒",
  },
];

const FEATURES = [
  { icon: "🎬", title: "动态双语字幕", desc: "按语义群手工对齐，每句都是完整的意思。支持双语、纯英文、纯中文切换，还有单句暂停和单句循环。" },
  { icon: "🔍", title: "点词查词", desc: "点击字幕里任意单词，弹出音标、词性、中文释义，不用离开页面查字典。" },
  { icon: "📚", title: "词汇卡", desc: "精选单词、短语和地道表达，按类型分类，附音标、中英释义和例句，点击字幕块直接播放对应片段。" },
  { icon: "🎧", title: "听写模式", desc: "播放一句自己写下听到的，配合单句循环反复听，练听力的神器。" },
  { icon: "❤️", title: "收藏", desc: "收藏喜欢的片段和词汇，随时回来复习，词汇本里还能标记掌握程度。" },
  { icon: "🎮", title: "词汇游戏", desc: "6种游戏模式：气泡拼写、连连看、单词探探、台词磁力贴、盲听气球、极速二选一，用玩的方式巩固新词。" },
  { icon: "📒", title: "学习手帐", desc: "记录每天的学习轨迹，查看热力图和连续打卡天数，生成打卡海报分享给朋友。" },
];

export default function GuidePage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f7f8fd 0%, #f3f5fb 100%)",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {/* 顶部导航 */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(11,18,32,0.07)",
        padding: "14px 20px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <Link href="/" style={{ fontSize: 13, color: "rgba(11,18,32,0.5)", textDecoration: "none", fontWeight: 600 }}>← 回首页</Link>
        <span style={{ color: "rgba(11,18,32,0.2)" }}>|</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: "#0b1220" }}>使用指南</span>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* 标题区 */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📖</div>
          <h1 style={{ fontSize: 26, fontWeight: 950, color: "#0b1220", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            怎么用这个网站学英语
          </h1>
          <p style={{ fontSize: 15, color: "rgba(11,18,32,0.55)", lineHeight: 1.7, margin: 0 }}>
            精选来自美剧、电影、动画的真实英语片段，覆盖日常生活、职场、旅行、人文等实用场景，90% 来自英语核心圈母语演员的真实对话。
          </p>
        </div>

        {/* 功能介绍 */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#0b1220", margin: "0 0 16px" }}>🛠️ 这里有什么</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 14,
                border: "1px solid rgba(11,18,32,0.07)",
                padding: "14px 16px",
                display: "flex", gap: 14, alignItems: "flex-start",
              }}>
                <div style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0b1220", marginBottom: 3 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(11,18,32,0.58)", lineHeight: 1.65 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 学习步骤 */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#0b1220", margin: "0 0 16px" }}>📋 完整学习步骤</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 14,
                border: "1px solid rgba(11,18,32,0.07)",
                padding: "16px 18px",
                display: "flex", gap: 14, alignItems: "flex-start",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(124,58,237,0.08))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: "#6366f1", marginBottom: 3, letterSpacing: "0.05em" }}>STEP {s.num}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0b1220", marginBottom: 5 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(11,18,32,0.60)", lineHeight: 1.75 }}>{s.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 会员 */}
        <div style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.07), rgba(124,58,237,0.05))",
          borderRadius: 16, border: "1px solid rgba(99,102,241,0.15)",
          padding: "22px 20px", marginBottom: 16,
        }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#0b1220", marginBottom: 8 }}>✨ 关于会员</div>
          <div style={{ fontSize: 14, color: "rgba(11,18,32,0.62)", lineHeight: 1.8, marginBottom: 18 }}>
            免费片段随便看，会员解锁全站所有内容。支持支付宝购买，有月卡、季卡、年卡和永久卡可以选，也可以联系客服了解。
          </div>
          <a href="/buy" style={{
            display: "block", textAlign: "center",
            padding: "13px 0", borderRadius: 999,
            background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            color: "#fff", textDecoration: "none",
            fontSize: 15, fontWeight: 800,
            boxShadow: "0 8px 20px rgba(124,58,237,0.25)",
          }}>
            立即开通会员 →
          </a>
        </div>

        {/* 客服 */}
        <div style={{
          background: "#fff", borderRadius: 16,
          border: "1px solid rgba(5,150,105,0.15)",
          padding: "22px 20px",
        }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#0b1220", marginBottom: 8 }}>💬 有问题找我们</div>
          <div style={{ fontSize: 14, color: "rgba(11,18,32,0.62)", lineHeight: 1.8, marginBottom: 16 }}>
            购买咨询、使用问题、对网站的任何建议，都可以加微信联系客服，我们会认真看每一条反馈。
          </div>
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(11,18,32,0.08)", marginBottom: 12, maxWidth: 220, margin: "0 auto 12px" }}>
            <img src={WECHAT_QR_URL} alt="微信客服二维码" style={{ width: "100%", display: "block" }} />
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "rgba(11,18,32,0.45)" }}>
            微信号：<span style={{ fontWeight: 700, color: "#0b1220" }}>{WECHAT_ID}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
