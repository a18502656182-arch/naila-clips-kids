"use client";
// app/components/HomeClient.js
import { useState, useEffect, useRef } from "react";
import FiltersClient from "./FiltersClient";
import ClipsGridClient from "./ClipsGridClient";

const BANNER_KEY = "meiju_free_banner_closed_v1";
const FILTERS_KEY = "meiju_home_filters_v1";
const SCROLL_KEY = "meiju_home_scroll_v1";

const DEFAULT_FILTERS = {
  sort: "newest",
  access: [],
  difficulty: [],
  genre: "",
  duration: "",
  show: [],
  showSearch: "",
};

export default function HomeClient({ allItems, initialTaxonomies }) {
  const [filters, setFilters] = useState(() => {
    try {
      const saved = sessionStorage.getItem(FILTERS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_FILTERS;
    } catch { return DEFAULT_FILTERS; }
  });

  const [showBanner, setShowBanner] = useState(false);
  const containerRef = useRef(null);
  const scrollRestored = useRef(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(BANNER_KEY)) setShowBanner(true);
    } catch {}
  }, []);

  // 恢复滚动位置
  useEffect(() => {
    if (scrollRestored.current) return;
    scrollRestored.current = true;
    try {
      const saved = sessionStorage.getItem(SCROLL_KEY);
      if (saved) {
        const top = parseInt(saved, 10);
        // 等 DOM 渲染完成再滚动
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({ top, behavior: "instant" });
          });
        });
      }
    } catch {}
  }, []);

  // 保存筛选状态
  useEffect(() => {
    try {
      sessionStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
    } catch {}
  }, [filters]);

  // 持续保存滚动位置（防抖200ms）
  useEffect(() => {
    let timer = null;
    function saveScroll() {
      try {
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
      } catch {}
    }
    function onScroll() {
      clearTimeout(timer);
      timer = setTimeout(saveScroll, 200);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("beforeunload", saveScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeunload", saveScroll);
    };
  }, []);

  function closeBanner() {
    try { localStorage.setItem(BANNER_KEY, "1"); } catch {}
    setShowBanner(false);
  }

  function handleClickFree() {
    setFilters(f => ({ ...f, access: ["free"] }));
    closeBanner();
  }

  return (
    <div ref={containerRef}>
      {showBanner && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(124,58,237,0.06))",
          border: "1px solid rgba(99,102,241,0.18)",
          borderRadius: 12, padding: "10px 14px", marginBottom: 14,
          flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 18 }}>👋</span>
          <span style={{ fontSize: 13, color: "#0b1220", lineHeight: 1.6, flex: 1 }}>
            新来的？点击{" "}
            <button
              onClick={handleClickFree}
              style={{
                display: "inline", border: "none", padding: "2px 8px",
                borderRadius: 6, background: "rgba(99,102,241,0.12)",
                color: "#6366f1", fontWeight: 900, fontSize: 13,
                cursor: "pointer",
              }}
            >访问权限 → 免费</button>
            {" "}先体验免费视频 🎬
          </span>
          <button
            onClick={closeBanner}
            style={{
              border: "none", background: "transparent",
              color: "rgba(11,18,32,0.35)", fontSize: 16,
              cursor: "pointer", padding: "0 4px", flexShrink: 0,
            }}
          >×</button>
        </div>
      )}
      <FiltersClient filters={filters} onFiltersChange={setFilters} initialTaxonomies={initialTaxonomies} />
      <div style={{ marginTop: 14 }}>
        <ClipsGridClient
          allItems={allItems || []}
          filters={filters}
        />
      </div>
    </div>
  );
}
