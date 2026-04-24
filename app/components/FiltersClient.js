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
          <SingleSelectDropdown label="适龄阶段" options={tax.difficulties} selected={filters.difficulty?.[0] || ""} onSelect={(slug) => update({ difficulty: slug ? [slug] : [] })} />
          <SingleSelectDropdown label="访问权限" options={accessOptions} selected={filters.access?.[0] || ""} onSelect={(slug) => update({ access: slug ? [slug] : [] })} renderLabel={(slug) => slug === "free" ? "免费" : slug === "vip" ? "会员" : slug} />
          <SingleSelectDropdown label="内容主题" options={tax.durations} selected={filters.duration || ""} onSelect={(slug) => update({ duration: slug })} />
          {hasAnyFilter && (
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={clearAll} className="clearBtn">清空筛选</button>
            </div>
          )}
        </div>

        <SingleSelectDropdown label="频道来源" options={tax.shows || []} selected={filters.show?.[0] || ""} onSelect={(slug) => update({ show: slug ? [slug] : [] })} />
      </div>
    </div>
  );
}
