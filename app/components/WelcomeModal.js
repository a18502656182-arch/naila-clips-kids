"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createSupabaseBrowserClient } from "../../utils/supabase/client";

export default function WelcomeModal() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setShow(true);
    });
  }, [pathname]);

  function close() {
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      onClick={close}
      style={{
        position: "fixed", inset: 0, zIndex: 10001,
        background: "rgba(11,18,32,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20,
          border: "1px solid rgba(11,18,32,0.08)",
          boxShadow: "0 24px 60px rgba(11,18,32,0.18)",
          padding: "28px 24px 22px",
          width: "100%", maxWidth: 400,
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 10 }}>🎬</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#0b1220", marginBottom: 12, lineHeight: 1.3 }}>
          欢迎来到儿童英语启蒙库！
        </div>
        <div style={{ fontSize: 14, color: "rgba(11,18,32,0.65)", lineHeight: 1.8, marginBottom: 8 }}>
          这里收录了来自动画片、儿童影视的真实英语片段，双语字幕 + 词汇卡，让孩子在真实语境里快乐学英语。
        </div>
        <div style={{ fontSize: 14, marginBottom: 20, lineHeight: 1.8 }}>
          <span style={{ color: "rgba(11,18,32,0.65)" }}>点 </span>
          <span style={{ color: "#e53e3e", fontWeight: 800 }}>访问权限</span>
          <span style={{ color: "rgba(11,18,32,0.65)" }}>中的「</span>
          <span style={{ color: "#e53e3e", fontWeight: 800 }}>免费</span>
          <span style={{ color: "rgba(11,18,32,0.65)" }}>」选项可以试看多个视频哦！</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <a
            href="/guide"
            onClick={close}
            style={{
              display: "block", textAlign: "center",
              padding: "12px 0", borderRadius: 999,
              background: "linear-gradient(135deg, #6366f1, #7c3aed)",
              color: "#fff", textDecoration: "none",
              fontSize: 14, fontWeight: 800,
              boxShadow: "0 8px 20px rgba(124,58,237,0.25)",
            }}
          >
            查看使用指南 →
          </a>
          <button
            onClick={close}
            style={{
              border: "1px solid rgba(11,18,32,0.12)",
              background: "transparent", borderRadius: 999,
              padding: "11px 0", cursor: "pointer",
              fontSize: 14, color: "rgba(11,18,32,0.45)", fontWeight: 600,
            }}
          >
            直接开始看视频
          </button>
        </div>
      </div>
    </div>
  );
}
