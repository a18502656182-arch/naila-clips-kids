"use client";
// app/components/BuyFloatBtn.js
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export default function BuyFloatBtn() {
  // 默认显示，确认是会员后才隐藏，避免延迟感
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const token = localStorage.getItem("sb_access_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API_BASE}/api/me`, { cache: "no-store", headers });
        const data = await res.json();
        if (data?.is_member) setHidden(true);
      } catch {
        // 请求失败保持显示
      }
    }
    check();
  }, []);

  if (hidden) return null;

  return (
    <a
      href="/buy"
      className="buy-float-btn"
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(99,102,241,0.55)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(99,102,241,0.45)"; }}
      style={{
        position: "fixed",
        right: 20,
        bottom: 24,
        zIndex: 999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        borderRadius: 22,
        background: "linear-gradient(135deg, #7c3aed, #6366f1)",
        color: "#fff",
        textDecoration: "none",
        boxShadow: "0 8px 28px rgba(99,102,241,0.45)",
        cursor: "pointer",
        textAlign: "center",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <style>{`
        .buy-float-btn { padding: 14px 24px; min-width: 148px; }
        .buy-float-title { font-size: 15px; font-weight: 900; letter-spacing: 0.02em; }
        .buy-float-sub { font-size: 12px; opacity: 0.88; font-weight: 700; }
        .buy-float-badge {
          margin-top: 5px; font-size: 11px; font-weight: 700;
          background: rgba(255,255,255,0.18); border-radius: 999px;
          padding: 3px 10px; letter-spacing: 0.03em;
        }
        @media (max-width: 768px) {
          .buy-float-btn { padding: 12px 18px; min-width: 120px; }
          .buy-float-title { font-size: 13px; }
          .buy-float-sub { font-size: 11px; }
          .buy-float-badge { margin-top: 4px; font-size: 10px; padding: 2px 8px; }
        }
      `}</style>
      <div className="buy-float-title">加入会员</div>
      <div className="buy-float-sub">解锁全部影视片段</div>
      <div className="buy-float-badge">支持支付宝</div>
    </a>
  );
}
