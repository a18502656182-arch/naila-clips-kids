"use client";

// app/components/FiltersClient.js
import { useEffect, useMemo, useRef, useState } from "react";
import { THEME } from "./home/theme";

function toggleInArray(arr, value) {
  const set = new Set(arr || []);
  if (set.has(value)) set.delete(value);
  else set.add(value);
  return Array.from(set);
}

function useOutsideClose(open, setOpen, refs = []) {
  useEffect(() => {
    if (!open) return;
    function onDown(e) {
      for (const r of refs) {
        if (r?.current && r.current.contains(e.target)) return;
      }
      setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, setOpen, refs]);
}

// 通用单选下拉
function SingleSelectDropdown({ label, options, selected, onSelect, renderLabel }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useOutsideClose(open, setOpen, [wrapRef]);
  const buttonText = selected ? (renderLabel ? renderLabel(selected) : selected) : "全部";
  return (
    <div ref={wrapRef} style={{ position: "relative", minWidth: 0 }}>
      <div style={{ fontSize: 12, color: THEME.colors.faint, marginBottom: 6 }}>{label}</div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 12,
          border: `1px solid ${THEME.colors.border2}`, background: THEME.colors.surface,
          color: THEME.colors.ink, fontSize: 13, display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 10, cursor: "pointer",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{buttonText}</span>
        <span style={{ color: THEME.colors.faint, fontSize: 12 }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: "absolute", zIndex: 30, top: "calc(100% + 8px)", left: 0,
          width: "100%", minWidth: 180, maxHeight: 280, overflow: "auto",
          borderRadius: 12, border: `1px solid ${THEME.colors.border}`,
          background: "rgba(255,255,255,0.98)", boxShadow: "0 18px 46px rgba(11,18,32,0.18)", padding: 8,
        }}>
          <div
            onClick={() => { onSelect(""); setOpen(false); }}
            style={{
              padding: "8px 10px", borderRadius: 10, cursor: "pointer", fontSize: 13,
              color: !selected ? THEME.colors.accent : THEME.colors.ink,
              fontWeight: !selected ? 700 : 400,
              background: !selected ? "rgba(79,70,229,0.06)" : "transparent",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(11,18,32,0.04)"}
            onMouseLeave={(e) => e.currentTarget.style.background = !selected ? "rgba(79,70,229,0.06)" : "transparent"}
          >全部</div>
          {(options || []).map((o) => (
            <div
              key={o.slug}
              onClick={() => { onSelect(o.slug); setOpen(false); }}
              style={{
                padding: "8px 10px", borderRadius: 10, cursor: "pointer", fontSize: 13,
                color: selected === o.slug ? THEME.colors.accent : THEME.colors.ink,
                fontWeight: selected === o.slug ? 700 : 400,
                background: selected === o.slug ? "rgba(79,70,229,0.06)" : "transparent",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(11,18,32,0.04)"}
              onMouseLeave={(e) => e.currentTarget.style.background = selected === o.slug ? "rgba(79,70,229,0.06)" : "transparent"}
            >{renderLabel ? renderLabel(o.slug) : o.slug}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 剧集目录抽屉（纯展示）────────────────────────────────
function ShowDrawer({ shows, sources, onClose }) {
  // sources: [{ slug }]  e.g. [{ slug:"美剧" }, { slug:"电影" }]
  // shows:   [{ slug, source }]

  // 默认选第一个来源 tab
  const [activeSource, setActiveSource] = useState(sources[0]?.slug || null);

  // 当前 tab 下的剧集
  const displayShows = useMemo(() => {
    if (!activeSource) return shows;
    return shows.filter((s) => s.source === activeSource);
  }, [shows, activeSource, sources]);

  // Esc 关闭 + body 锁定
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <>
      {/* 遮罩 */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(11,18,32,0.35)", backdropFilter: "blur(2px)",
        }}
      />

      {/* 抽屉 */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 201,
        width: "min(420px, 96vw)", background: "#fff",
        boxShadow: "-16px 0 60px rgba(11,18,32,0.14)",
        display: "flex", flexDirection: "column",
        animation: "drawerSlideIn 0.22s ease",
      }}>
        <style>{`
          @keyframes drawerSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          .drawerBody::-webkit-scrollbar { width: 4px; }
          .drawerBody::-webkit-scrollbar-thumb { background: rgba(11,18,32,0.12); border-radius: 4px; }
        `}</style>

        {/* 头部 */}
        <div style={{
          padding: "18px 20px 14px",
          borderBottom: `1px solid ${THEME.colors.border}`,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: THEME.colors.ink }}>🎬 全部剧集目录</div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: "50%", border: `1px solid ${THEME.colors.border}`,
              background: "#f4f6fb", cursor: "pointer", fontSize: 16,
              display: "grid", placeItems: "center", color: THEME.colors.muted,
            }}>✕</button>
          </div>

          {/* 来源 Tab */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {sources.map((src) => {
              const isActive = activeSource === src.slug;
              return (
                <button
                  key={src.slug}
                  onClick={() => setActiveSource(src.slug)}
                  style={{
                    padding: "6px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700,
                    cursor: "pointer", border: "none", transition: "all 0.15s",
                    background: isActive ? THEME.colors.accent : "#f0f1f8",
                    color: isActive ? "#fff" : THEME.colors.muted,
                  }}
                >{src.slug}</button>
              );
            })}
          </div>
        </div>

        {/* 剧集标签列表 */}
        <div className="drawerBody" style={{ flex: 1, overflowY: "auto", padding: "16px 20px 24px" }}>
          {displayShows.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: THEME.colors.faint, fontSize: 13 }}>
              暂无剧集
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {displayShows.map((s) => (
                <span key={s.slug} style={{
                  display: "inline-block", padding: "6px 14px", borderRadius: 999,
                  fontSize: 13, background: "#f4f6fb",
                  border: `1px solid ${THEME.colors.border2}`,
                  color: THEME.colors.ink, fontWeight: 500,
                }}>
                  {s.slug}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── 剧名行：热门标签 + 全目录按钮 ────────────────────────
const HOT_COUNT = 5;

function ShowFilter({ shows, sources, selectedShows, showSearch, onToggleShow, onSearchChange, onClearShows }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredShows = useMemo(() => {
    if (!showSearch.trim()) return shows;
    return shows.filter((s) => s.slug.toLowerCase().includes(showSearch.toLowerCase()));
  }, [shows, showSearch]);

  // 已选的优先展示，再补满 HOT_COUNT 个
  const hotShows = useMemo(() => {
    const selected = shows.filter((s) => selectedShows.includes(s.slug));
    const rest = shows.filter((s) => !selectedShows.includes(s.slug));
    return [...selected, ...rest].slice(0, HOT_COUNT);
  }, [shows, selectedShows]);

  const displayShows = showSearch.trim() ? filteredShows : hotShows;

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: THEME.colors.faint }}>剧集筛选</span>
        {selectedShows.length > 0 && (
          <span onClick={onClearShows} style={{ fontSize: 11, color: THEME.colors.accent, cursor: "pointer" }}>
            清空已选 ({selectedShows.length})
          </span>
        )}
      </div>

      <div style={{ marginBottom: 8 }}>
        <input
          type="text" value={showSearch} onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜索剧名…"
          style={{
            width: "100%", boxSizing: "border-box", padding: "7px 12px",
            borderRadius: 10, border: `1px solid ${THEME.colors.border2}`,
            background: THEME.colors.surface, color: THEME.colors.ink,
            fontSize: 13, outline: "none",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {displayShows.map((s) => {
          const isSelected = selectedShows.includes(s.slug);
          return (
            <span
              key={s.slug}
              onClick={() => onToggleShow(s.slug)}
              style={{
                padding: "5px 12px", borderRadius: 999, fontSize: 12, cursor: "pointer",
                userSelect: "none", transition: "all 0.15s", whiteSpace: "nowrap",
                border: `1px solid ${isSelected ? THEME.colors.accent : THEME.colors.border2}`,
                background: isSelected ? "rgba(79,70,229,0.10)" : THEME.colors.surface,
                color: isSelected ? THEME.colors.accent : THEME.colors.ink,
                fontWeight: isSelected ? 700 : 400,
              }}
            >{s.slug}</span>
          );
        })}

        {!showSearch.trim() && (
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700,
              cursor: "pointer", whiteSpace: "nowrap", border: "none",
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
              color: "#fff", boxShadow: "0 2px 8px rgba(99,102,241,0.30)",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >🎬 全部剧集目录</button>
        )}
      </div>

      {drawerOpen && (
        <ShowDrawer
          shows={shows}
          sources={sources}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
}

// 标签映射
const GENRE_LABELS = {
  sitcom: "情景喜剧", drama: "剧情", thriller: "悬疑犯罪", reality: "真人秀", movie: "电影",
};
const DURATION_LABELS = { short: "短片", medium: "中等", long: "长片" };

export default function FiltersClient({ filters, onFiltersChange, initialTaxonomies }) {
  const tax = initialTaxonomies || { difficulties: [], genres: [], durations: [], shows: [] };

  function update(patch) { onFiltersChange({ ...filters, ...patch }); }

  const chips = useMemo(() => {
    const out = [];
    if (filters.difficulty?.length) filters.difficulty.forEach((v) => out.push({ kind: "difficulty", v, label: v }));
    if (filters.genre) out.push({ kind: "genre", v: filters.genre, label: GENRE_LABELS[filters.genre] || filters.genre });
    if (filters.duration) out.push({ kind: "duration", v: filters.duration, label: filters.duration });
    (filters.access || []).forEach((v) => out.push({ kind: "access", v, label: v === "free" ? "免费" : v === "vip" ? "会员" : v }));
    return out;
  }, [filters]);

  function removeChip(kind, v) {
    if (kind === "difficulty") update({ difficulty: filters.difficulty.filter((x) => x !== v) });
    if (kind === "genre") update({ genre: "" });
    if (kind === "duration") update({ duration: "" });
    if (kind === "access") update({ access: filters.access.filter((x) => x !== v) });
  }

  const accessOptions = useMemo(() => [{ slug: "free" }, { slug: "vip" }], []);

  function clearAll() {
    onFiltersChange({ sort: "newest", access: [], difficulty: [], genre: "", duration: "", show: [], showSearch: "" });
  }

  const hasAnyFilter = chips.length > 0 || (filters.show?.length > 0);

  return (
    <div>
      <style>{`
        .panel { position: relative; border: 1px solid ${THEME.colors.border}; border-radius: ${THEME.radii.lg}px; background: rgba(255,255,255,0.72); box-shadow: 0 10px 26px rgba(11,18,32,0.08); padding: 12px 14px; }
        .chipsRow { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
        .chip { display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 999px; border: 1px solid rgba(79,70,229,0.20); background: rgba(79,70,229,0.10); color: #3730a3; font-size: 13px; user-select: none; }
        .chipX { width: 18px; height: 18px; border-radius: 999px; display: grid; place-items: center; border: 1px solid rgba(11,18,32,0.14); background: rgba(255,255,255,0.75); cursor: pointer; font-size: 12px; color: ${THEME.colors.ink}; }
        .topRow { display: grid; grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr; gap: 10px; align-items: end; }
        .topRowWithClear { display: grid; grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr auto; gap: 10px; align-items: end; }
        .select { padding: 8px 10px; border-radius: 12px; border: 1px solid ${THEME.colors.border2}; background: ${THEME.colors.surface}; color: ${THEME.colors.ink}; font-size: 13px; outline: none; width: 100%; }
        .clearBtn { padding: 7px 12px; border-radius: 999px; border: 1px solid ${THEME.colors.border2}; background: ${THEME.colors.surface}; cursor: pointer; color: ${THEME.colors.ink}; font-size: 13px; white-space: nowrap; }
        @media (max-width: 960px) {
          .topRow { grid-template-columns: 1fr 1fr; }
          .topRowWithClear { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="panel">
        {chips.length > 0 && (
          <div className="chipsRow">
            {chips.map((c) => (
              <span key={`${c.kind}:${c.v}`} className="chip">
                {c.label}
                <span className="chipX" onClick={() => removeChip(c.kind, c.v)}>×</span>
              </span>
            ))}
          </div>
        )}

        <div className={hasAnyFilter ? "topRowWithClear" : "topRow"}>
          <div>
            <div style={{ fontSize: 12, color: THEME.colors.faint, marginBottom: 6 }}>上传时间</div>
            <select value={filters.sort} onChange={(e) => update({ sort: e.target.value })} className="select">
              <option value="newest">最新优先</option>
              <option value="oldest">最早优先</option>
            </select>
          </div>
          <SingleSelectDropdown label="视频难度" options={tax.difficulties} selected={filters.difficulty?.[0] || ""} onSelect={(slug) => update({ difficulty: slug ? [slug] : [] })} />
          <SingleSelectDropdown label="访问权限" options={accessOptions} selected={filters.access?.[0] || ""} onSelect={(slug) => update({ access: slug ? [slug] : [] })} renderLabel={(slug) => slug === "free" ? "免费" : slug === "vip" ? "会员" : slug} />
          <SingleSelectDropdown label="内容类型" options={tax.genres} selected={filters.genre || ""} onSelect={(slug) => update({ genre: slug })} renderLabel={(slug) => GENRE_LABELS[slug] || slug} />
          <SingleSelectDropdown label="来源" options={tax.durations} selected={filters.duration || ""} onSelect={(slug) => update({ duration: slug })} />
          {hasAnyFilter && (
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={clearAll} className="clearBtn">清空筛选</button>
            </div>
          )}
        </div>

        <ShowFilter
          shows={tax.shows || []}
          sources={tax.durations || []}
          selectedShows={filters.show || []}
          showSearch={filters.showSearch || ""}
          onToggleShow={(slug) => update({ show: toggleInArray(filters.show, slug) })}
          onSearchChange={(val) => update({ showSearch: val })}
          onClearShows={() => update({ show: [], showSearch: "" })}
        />
      </div>
    </div>
  );
}
