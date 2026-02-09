"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"

const API = "https://ruhangcodeguide.ruhang365.cn/api"
interface SearchResult { type: string; id: string; title: string; snippet: string; url?: string }

const typeLabels: Record<string, string> = { guide: "指南", tool: "工具", resource: "资源" }
const typeColors: Record<string, string> = { guide: "hsl(187 100% 45%)", tool: "hsl(142 76% 36%)", resource: "hsl(199 89% 48%)" }
const suggestions = ["Cursor", "提示词", "Vibe Coding", "Claude Code", "调试", "MCP", "v0", "Bolt"]

const SvgCode2 = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
const SvgSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
const SvgArrowLeft = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
const SvgArrowRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
const SvgX = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
const SvgLoader = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>

const st = {
  page: { minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--font-sans)" } as React.CSSProperties,
  header: { position: "sticky" as const, top: 0, zIndex: 50, borderBottom: "1px solid var(--border)", background: "hsl(222 47% 6% / 0.7)", backdropFilter: "blur(12px)" },
  headerInner: { maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" } as React.CSSProperties,
  main: { maxWidth: 720, margin: "0 auto", padding: "64px 24px" } as React.CSSProperties,
  input: { width: "100%", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-card)", padding: "16px 48px 16px 48px", fontSize: 16, color: "var(--fg)", outline: "none", fontFamily: "var(--font-sans)", transition: "border-color 0.2s" } as React.CSSProperties,
  card: { display: "flex", alignItems: "flex-start", gap: 16, borderRadius: "var(--radius)", border: "1px solid var(--border)", background: "var(--bg-card)", padding: 20, transition: "all 0.3s", cursor: "pointer" } as React.CSSProperties,
  suggestion: { borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-card)", padding: "8px 16px", fontSize: 14, color: "var(--fg-muted)", cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all 0.2s" } as React.CSSProperties,
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) { e.preventDefault(); inputRef.current?.focus() }
      if (e.key === "Escape") { setQuery(""); inputRef.current?.blur() }
    }
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h)
  }, [])

  const performSearch = useCallback(async (q: string) => {
    if (q.trim().length < 1) { setResults([]); setHasSearched(false); return }
    setLoading(true); setHasSearched(true)
    try { const res = await fetch(`${API}/search?q=${encodeURIComponent(q)}`); const json = await res.json(); setResults(json.success ? json.data : []) } catch { setResults([]) } finally { setLoading(false) }
  }, [])

  const handleInput = (v: string) => { setQuery(v); if (debounceRef.current) clearTimeout(debounceRef.current); debounceRef.current = setTimeout(() => performSearch(v), 300) }

  return (
    <div style={st.page} className="grid-bg">
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <header style={st.header}>
        <div style={st.headerInner}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}><img src="https://ruhang365.cn/wp-content/uploads/2025/01/cropped-ai-ruhang365-.png" alt="入行 365" width={32} height={32} style={{ borderRadius: 8 }} /><span style={{ fontSize: 18, fontWeight: 700 }}>{"代码指南"}</span></Link>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--fg-muted)" }}><SvgArrowLeft /><span>{"返回首页"}</span></Link>
        </div>
      </header>
      <main style={st.main}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, marginBottom: 16 }}><span className="gradient-text">{"搜索"}</span></h1>
          <p style={{ fontSize: 18, color: "var(--fg-muted)" }}>{"在指南、工具和资源中快速找到你需要的内容。"}</p>
          <div style={{ marginTop: 32, position: "relative" }}>
            <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--fg-muted)", opacity: 0.5, pointerEvents: "none" }}><SvgSearch /></div>
            <input ref={inputRef} type="text" placeholder="搜索指南、工具、资源..." value={query} onChange={e => handleInput(e.target.value)} style={st.input} onFocus={e => (e.target.style.borderColor = "hsl(187 100% 45% / 0.5)")} onBlur={e => (e.target.style.borderColor = "var(--border)")} aria-label="搜索内容" />
            {query && <button onClick={() => { setQuery(""); setResults([]); setHasSearched(false); inputRef.current?.focus() }} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--fg-muted)", cursor: "pointer", padding: 4 }} aria-label="清除"><SvgX /></button>}
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--fg-muted)", opacity: 0.4 }}>
              <kbd style={{ borderRadius: 4, border: "1px solid var(--border)", background: "var(--secondary)", padding: "1px 6px", fontFamily: "var(--font-mono)", fontSize: 10 }}>{"/"}</kbd><span>{"聚焦"}</span>
              <kbd style={{ borderRadius: 4, border: "1px solid var(--border)", background: "var(--secondary)", padding: "1px 6px", fontFamily: "var(--font-mono)", fontSize: 10 }}>{"ESC"}</kbd><span>{"清除"}</span>
            </div>
          </div>
        </div>

        {!hasSearched && (
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 500, color: "var(--fg-muted)", marginBottom: 16 }}>{"热门搜索"}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {suggestions.map(sg => <button key={sg} onClick={() => { setQuery(sg); performSearch(sg) }} style={st.suggestion} onMouseEnter={e => { e.currentTarget.style.borderColor = "hsl(187 100% 45% / 0.3)"; e.currentTarget.style.color = "var(--fg)" }} onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--fg-muted)" }}>{sg}</button>)}
            </div>
          </div>
        )}

        {loading && <div style={{ display: "flex", justifyContent: "center", padding: "64px 0", color: "var(--primary)" }}><SvgLoader /></div>}

        {hasSearched && !loading && results.length > 0 && (
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 500, color: "var(--fg-muted)", marginBottom: 16 }}>{`找到 ${results.length} 个结果`}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {results.map(r => {
                const color = typeColors[r.type] || typeColors.guide
                const label = typeLabels[r.type] || r.type
                const link = r.type === "guide" ? `/guide/${r.id}` : r.url || "/"
                const ext = r.type !== "guide"
                const inner = (
                  <div className="card-glow" style={st.card}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}><SvgSearch /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 500, padding: "1px 6px", borderRadius: 4, border: `1px solid ${color}30`, color, background: `${color}10` }}>{label}</span>
                      <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>{r.title}</h3>
                      <p style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 4, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{r.snippet}</p>
                    </div>
                    <span style={{ color: "var(--fg-muted)", opacity: 0.3, flexShrink: 0, marginTop: 4 }}><SvgArrowRight /></span>
                  </div>
                )
                return ext ? <a key={r.id} href={link} target="_blank" rel="noopener noreferrer">{inner}</a> : <Link key={r.id} href={link}>{inner}</Link>
              })}
            </div>
          </div>
        )}

        {hasSearched && !loading && results.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--fg-muted)", opacity: 0.4 }}><SvgSearch /></div>
            <p style={{ color: "var(--fg-muted)" }}>{'没有找到与 "'}<span style={{ color: "var(--fg)", fontWeight: 500 }}>{query}</span>{'" 相关的结果'}</p>
          </div>
        )}
      </main>
    </div>
  )
}
