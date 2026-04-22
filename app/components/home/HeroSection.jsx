// app/components/home/HeroSection.jsx
"use client";
import { THEME } from "./theme";
import FeaturedExamples from "./FeaturedExamples";

// 更新特征列表组件，添加了 className 方便手机端精准控制缩放
function FeatureItem({ children }) {
  return (
    <div className="featureItem">
      <svg className="featureIcon" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span className="featureText">{children}</span>
    </div>
  );
}

export default function HeroSection({ featured }) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 32,
        border: `1px solid rgba(255,255,255,0.6)`,
        background: "#f8fafc",
        boxShadow: "0 30px 80px rgba(15,23,42,0.06), inset 0 0 0 1px rgba(255,255,255,0.8)",
      }}
    >
      <style>{`
        @keyframes floatBlob {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        
        .heroOrb {
          position: absolute;
          filter: blur(80px);
          opacity: 0.5;
          border-radius: 50%;
          animation: floatBlob 12s infinite ease-in-out;
          pointer-events: none;
        }
        .orb-1 { top: -10%; left: -10%; width: 500px; height: 500px; background: rgba(99,102,241,0.4); animation-delay: 0s; }
        .orb-2 { bottom: -20%; right: -10%; width: 600px; height: 600px; background: rgba(6,182,212,0.3); animation-delay: -3s; }
        .orb-3 { top: 30%; left: 40%; width: 450px; height: 450px; background: rgba(236,72,153,0.25); animation-delay: -6s; }

        .heroWrap {
          position: relative;
          z-index: 10;
          padding: 24px 32px;
          background: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="1" fill="rgba(15,23,42,0.03)"/></svg>') repeat;
        }
        
        .heroGrid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 480px;
          gap: 32px;
          align-items: center;
        }

        .heroLeft {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .heroEyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.8);
          color: ${THEME.colors.accent};
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 12px rgba(79,70,229,0.08);
        }

        .heroTitle {
          margin: 16px 0 0;
          font-size: 56px;
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 900;
          color: #0f172a;
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .heroDesc {
          margin-top: 14px;
          max-width: 520px;
          color: #475569;
          font-size: 16px;
          line-height: 1.7;
          font-weight: 500;
        }

        /* 特征列表的基础样式 (电脑端) */
        .heroFeatures {
          margin-top: 16px;
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .featureItem {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .featureIcon {
          width: 16px;
          height: 16px;
        }
        .featureText {
          color: #334155;
          font-size: 14px;
          font-weight: 700;
          white-space: nowrap;
        }

        /* 按钮基础样式 (电脑端) */
        .heroActions {
          margin-top: 24px;
          display: flex;
          gap: 12px;
          flex-wrap: nowrap;
          align-items: center;
        }

        .heroBtnPrimary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 50px;
          padding: 0 24px;
          border-radius: 999px;
          text-decoration: none;
          background: linear-gradient(135deg, #0f172a 0%, #312e81 100%);
          color: #fff;
          font-size: 14px;
          font-weight: 900;
          box-shadow: 0 12px 24px rgba(49, 46, 129, 0.25);
          white-space: nowrap;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .heroBtnPrimary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 16px 32px rgba(49, 46, 129, 0.35);
        }

        .heroBtnJournal, .heroBtnGame {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 50px;
          padding: 0 20px;
          border-radius: 999px;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.7);
          color: ${THEME.colors.ink};
          font-size: 14px;
          font-weight: 800;
          white-space: nowrap;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .heroBtnJournal { border: 1.5px solid rgba(79,70,229,0.2); }
        .heroBtnJournal:hover {
          background: #fff;
          border-color: rgba(79,70,229,0.4);
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(79,70,229,0.12);
          color: #4f46e5;
        }

        .heroBtnGame { border: 1.5px solid rgba(124,58,237,0.2); }
        .heroBtnGame:hover {
          background: #fff;
          border-color: rgba(124,58,237,0.4);
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(124,58,237,0.12);
          color: #7c3aed;
        }

        .heroNote {
          margin-top: 16px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .heroNote::before {
          content: '';
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        .heroRight {
          display: flex;
          align-items: center;
          justify-content: stretch;
          min-width: 0;
          position: relative;
        }

        @media (max-width: 1180px) {
          .heroGrid { grid-template-columns: minmax(0, 1fr) 420px; gap: 24px; }
          .heroTitle { font-size: 44px; }
        }

        @media (max-width: 960px) {
          .heroWrap { padding: 24px 20px; }
          .heroGrid { grid-template-columns: 1fr; gap: 24px; }
          .heroTitle { font-size: 38px; margin-top: 16px; }
        }

        /* 📱 手机端极限压缩优化区 */
        @media (max-width: 640px) {
          .heroWrap { padding: 20px 16px; }
          .heroTitle { font-size: 30px; line-height: 1.1; }
          .heroDesc { font-size: 14px; margin-top: 12px; }
          
          /* 特征列表强制同行并缩小 */
          .heroFeatures {
            flex-wrap: nowrap;
            justify-content: space-between;
            gap: 4px;
            margin-top: 14px;
          }
          .featureItem { gap: 4px; }
          .featureIcon { width: 14px; height: 14px; }
          .featureText { font-size: 11px; }

          /* 按钮强制同行并均分宽度 */
          .heroActions {
            flex-wrap: nowrap;
            gap: 6px;
            width: 100%;
            margin-top: 18px;
          }
          .heroBtnPrimary, .heroBtnJournal, .heroBtnGame {
            flex: 1; /* 平分空间，保证绝对一样大 */
            height: 42px;
            font-size: 11px;
            padding: 0; /* 移除左右内边距由 flex 接管 */
            gap: 4px;
            letter-spacing: -0.2px;
            border-width: 1px;
          }
          
          .heroNote { font-size: 12px; margin-top: 12px; }
        }
      `}</style>

      {/* 动感模糊光晕 */}
      <div className="heroOrb orb-1" />
      <div className="heroOrb orb-2" />
      <div className="heroOrb orb-3" />

      <div className="heroWrap">
        <div className="heroGrid">
          <div className="heroLeft">
            <div className="heroEyebrow">
              ✦ KIDS ENGLISH LIBRARY
            </div>

            <h1 className="heroTitle">
              看动画学英语，
              <br />
              快乐启蒙每一天
            </h1>

            <div className="heroDesc">
              精选儿童动画真实片段，配合双语字幕和词汇卡片，让孩子在快乐的语境中自然学英语，建立英语语感。
            </div>

            <div className="heroFeatures">
              <FeatureItem>动画原声片段</FeatureItem>
              <FeatureItem>双语字幕对照</FeatureItem>
              <FeatureItem>趣味词汇卡片</FeatureItem>
            </div>

            <div className="heroActions">
              <a href="#all" className="heroBtnPrimary">
                开始看动画学英语 🎬
              </a>
              <a href="/journal" className="heroBtnJournal">
                ⭐ 我的学习成就
              </a>
              {/* 改为游戏闯关 */}
              <a href="/practice" className="heroBtnGame">
                🎮 游戏闯关
              </a>
            </div>

            <div className="heroNote">每天看动画，英语越来越好！</div>
          </div>

          <div className="heroRight">
            <FeaturedExamples featured={featured} />
          </div>
        </div>
      </div>
    </section>
  );
}
