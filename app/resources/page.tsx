"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"

const API = "https://ruhangcodeguide.ruhang365.cn/api"
interface Resource { id: string; title: string; description: string; url: string; type: string; author?: string; tags: string[] }

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(false)
  useEffect(() => { const el = ref.current; if (!el) return; const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold: 0.1 }); o.observe(el); return () => o.disconnect() }, [])
  return { ref, v }
}

const typeConfig: Record<string, { label: string; color: string }> = {
  article: { label: "文章", color: "hsl(187 100% 45%)" },
  video: { label: "视频", color: "hsl(142 76% 36%)" },
  course: { label: "课程", color: "hsl(199 89% 48%)" },
  documentation: { label: "文档", color: "hsl(280 65% 60%)" },
  tutorial: { label: "教程", color: "hsl(32 95% 44%)" },
}
const typeFilters = [
  { id: "all", label: "全部" }, { id: "article", label: "文章" }, { id: "video", label: "视频" },
  { id: "course", label: "课程" }, { id: "documentation", label: "文档" }, { id: "tutorial", label: "教程" },
]

const fallbackResources: Resource[] = [
  { id: "end-of-programming", title: "编程的终结", description: "Tim O'Reilly 关于 AI 如何改变软件开发的深度分析。", url: "https://www.oreilly.com/radar/the-end-of-programming-as-we-know-it", type: "article", author: "Tim O'Reilly", tags: ["行业趋势"] },
  { id: "70-percent-problem", title: "70% 问题：AI 辅助编程的残酷真相", description: "Addy Osmani 揭示 AI 编程的局限性和真实效率。", url: "https://addyo.substack.com/p/the-70-problem-hard-truths-about", type: "article", author: "Addy Osmani", tags: ["深度分析"] },
  { id: "karpathy-software-changing", title: "软件正在再次改变", description: "Andrej Karpathy 关于 AI 如何改变软件开发的演讲。", url: "https://www.youtube.com/watch?v=LCEmiRjPEtQ", type: "video", author: "Andrej Karpathy", tags: ["演讲"] },
  { id: "vibe-coding-replit", title: "Vibe Coding 101 with Replit", description: "DeepLearning.AI 和 Replit 联合推出的入门课程。", url: "https://www.deeplearning.ai/short-courses/vibe-coding-101-with-replit/", type: "course", author: "DeepLearning.AI", tags: ["课程"] },
]

const SvgCode2 = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
const SvgBookOpen = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
const SvgArrowLeft = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
const SvgExternal = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
const SvgUser = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>

const st = {
  page: { minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--font-sans)" } as React.CSSProperties,
  header: { position: "sticky" as const, top: 0, zIndex: 50, borderBottom: "1px solid var(--border)", background: "hsl(222 47% 6% / 0.7)", backdropFilter: "blur(12px)" },
  headerInner: { maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" } as React.CSSProperties,
  main: { maxWidth: 1200, margin: "0 auto", padding: "64px 24px" } as React.CSSProperties,
  badge: { display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 9999, border: "1px solid hsl(187 100% 45% / 0.3)", background: "hsl(187 100% 45% / 0.05)", padding: "6px 16px", marginBottom: 16 } as React.CSSProperties,
  tab: (active: boolean) => ({ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 8, padding: "8px 16px", fontSize: 14, fontWeight: 500, cursor: "pointer", border: active ? "none" : "1px solid var(--border)", background: active ? "var(--primary)" : "var(--bg-card)", color: active ? "var(--bg)" : "var(--fg-muted)", transition: "all 0.2s" } as React.CSSProperties),
  card: { display: "flex", alignItems: "flex-start", gap: 20, borderRadius: "var(--radius)", border: "1px solid var(--border)", background: "var(--bg-card)", padding: 24, transition: "all 0.5s" } as React.CSSProperties,
}

export default function ResourcesPage() {
  const [activeType, setActiveType] = useState("all")
  const [resources, setResources] = useState<Resource[]>(fallbackResources)
  const sr = useScrollReveal()

  useEffect(() => { fetch(`${API}/resources`).then(r => r.json()).then(json => { if (json.success && Array.isArray(json.data)) setResources(json.data) }).catch(() => {}) }, [])

  const filtered = useMemo(() => activeType === "all" ? resources : resources.filter(r => r.type === activeType), [resources, activeType])
  const counts = useMemo(() => { const m: Record<string, number> = { all: resources.length }; for (const r of resources) m[r.type] = (m[r.type] || 0) + 1; return m }, [resources])

  return (
    <div style={st.page} className="grid-bg">
      <header style={st.header}>
        <div style={st.headerInner}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: "hsl(187 100% 45% / 0.1)", border: "1px solid hsl(187 100% 45% / 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}><SvgCode2 /></div><span style={{ fontSize: 18, fontWeight: 700 }}>{"代码指南"}</span></Link>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--fg-muted)" }}><SvgArrowLeft /><span>{"返回首页"}</span></Link>
        </div>
      </header>
      <main style={st.main}>
        <div style={{ marginBottom: 48 }}>
          <div style={st.badge}><span style={{ color: "var(--primary)" }}><SvgBookOpen /></span><span style={{ fontSize: 12, color: "var(--primary)", fontWeight: 500 }}>{"学习资源"}</span></div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, marginBottom: 16 }}>{"精选"}<span className="gradient-text">{" 学习资源"}</span></h1>
          <p style={{ fontSize: 18, color: "var(--fg-muted)", maxWidth: 640 }}>{"文章、视频、课程、文档 -- 经过筛选的高质量 AI 编程学习材料。"}</p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
          {typeFilters.map(f => (
            <button key={f.id} onClick={() => setActiveType(f.id)} style={st.tab(activeType === f.id)}>
              {f.label}<span style={{ fontSize: 12, opacity: 0.7 }}>{counts[f.id] || 0}</span>
            </button>
          ))}
        </div>
        <div ref={sr.ref} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((res, i) => {
            const tc = typeConfig[res.type] || typeConfig.article
            return (
              <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer" className="card-glow" style={{ ...st.card, opacity: sr.v ? 1 : 0, transform: sr.v ? "translateY(0)" : "translateY(20px)", transitionDelay: `${i * 60}ms` }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${tc.color}15`, border: `1px solid ${tc.color}30`, display: "flex", alignItems: "center", justifyContent: "center", color: tc.color, flexShrink: 0 }}><SvgBookOpen /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600 }}>{res.title}</h3>
                    <span style={{ color: "var(--fg-muted)", opacity: 0.4, flexShrink: 0, marginTop: 2 }}><SvgExternal /></span>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.6, marginTop: 8 }}>{res.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 4, border: `1px solid ${tc.color}30`, color: tc.color, background: `${tc.color}10` }}>{tc.label}</span>
                    {res.author && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--fg-muted)", opacity: 0.6 }}><SvgUser />{res.author}</span>}
                    {res.tags.slice(0, 3).map(tag => <span key={tag} style={{ fontSize: 10, color: "var(--fg-muted)", background: "var(--secondary)", padding: "2px 8px", borderRadius: 4 }}>{tag}</span>)}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </main>
    </div>
  )
}
