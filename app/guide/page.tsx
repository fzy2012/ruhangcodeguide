"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

const API = "https://ruhangcodeguide.ruhang365.cn/api"

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(false)
  useEffect(() => { const el = ref.current; if (!el) return; const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold: 0.1 }); o.observe(el); return () => o.disconnect() }, [])
  return { ref, v }
}

const fallback = [
  { id: "introduction", title: "什么是 AI 编程", emoji: "\u{1F916}", order: 1, summary: "了解 AI 编程和 Vibe Coding 的概念，以及它们如何改变我们编写代码的方式。" },
  { id: "getting-started", title: "如何开始", emoji: "\u{1F680}", order: 2, summary: "根据你的技术背景，选择最适合的入门工具和学习路径。" },
  { id: "prompting", title: "提示词技巧", emoji: "\u{1F4AC}", order: 3, summary: "学习如何编写高质量的提示词，让 AI 更好地理解你的需求。" },
  { id: "project-setup", title: "项目架构", emoji: "\u{1F3D7}\uFE0F", order: 4, summary: "学习如何组织你的 AI 编程项目，包括前后端分离、代码规范等。" },
  { id: "debugging", title: "调试与问题解决", emoji: "\u{1F41B}", order: 5, summary: "当 AI 生成的代码出现问题时，如何有效地调试和修复。" },
  { id: "advanced", title: "进阶技巧", emoji: "\u26A1", order: 6, summary: "深入了解 MCP、A2A 等新技术，以及如何创建自己的 AI 编程代理。" },
]

const st = {
  page: { minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--font-sans)" } as React.CSSProperties,
  header: { position: "sticky" as const, top: 0, zIndex: 50, borderBottom: "1px solid var(--border)", background: "hsl(222 47% 6% / 0.7)", backdropFilter: "blur(12px)" },
  headerInner: { maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" } as React.CSSProperties,
  logo: { display: "flex", alignItems: "center", gap: 8 } as React.CSSProperties,
  logoIcon: { width: 32, height: 32, borderRadius: 8, background: "hsl(187 100% 45% / 0.1)", border: "1px solid hsl(187 100% 45% / 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" } as React.CSSProperties,
  back: { display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--fg-muted)" } as React.CSSProperties,
  main: { maxWidth: 960, margin: "0 auto", padding: "64px 24px" } as React.CSSProperties,
  badge: { display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 9999, border: "1px solid hsl(187 100% 45% / 0.3)", background: "hsl(187 100% 45% / 0.05)", padding: "6px 16px", marginBottom: 16 } as React.CSSProperties,
  card: { display: "flex", alignItems: "flex-start", gap: 24, padding: 24, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", transition: "all 0.5s" } as React.CSSProperties,
  icon: { width: 56, height: 56, borderRadius: 12, background: "hsl(187 100% 45% / 0.1)", border: "1px solid hsl(187 100% 45% / 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 } as React.CSSProperties,
}

const SvgCode2 = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
const SvgBookOpen = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
const SvgArrowLeft = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
const SvgArrowRight = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>

export default function GuidePage() {
  const [chapters, setChapters] = useState(fallback)
  const sr = useScrollReveal()

  useEffect(() => {
    fetch(`${API}/guide`).then(r => r.json()).then(json => {
      if (json.success && Array.isArray(json.data)) setChapters(json.data.sort((a: { order: number }, b: { order: number }) => a.order - b.order))
    }).catch(() => {})
  }, [])

  return (
    <div style={st.page} className="grid-bg">
      <header style={st.header}>
        <div style={st.headerInner}>
          <Link href="/" style={st.logo}><img src="https://ruhang365.cn/wp-content/uploads/2025/01/cropped-ai-ruhang365-.png" alt="入行 365" width={32} height={32} style={{ borderRadius: 8 }} /><span style={{ fontSize: 18, fontWeight: 700 }}>{"代码指南"}</span></Link>
          <Link href="/" style={st.back}><SvgArrowLeft /><span>{"返回首页"}</span></Link>
        </div>
      </header>
      <main style={st.main}>
        <div style={{ marginBottom: 48 }}>
          <div style={st.badge}><span style={{ color: "var(--primary)" }}><SvgBookOpen /></span><span style={{ fontSize: 12, color: "var(--primary)", fontWeight: 500 }}>{"完整指南"}</span></div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, marginBottom: 16 }}>{"AI 编程"}<span className="gradient-text">{" 学习路径"}</span></h1>
          <p style={{ fontSize: 18, color: "var(--fg-muted)", maxWidth: 640 }}>{"6 个章节，系统性地带你掌握 AI 编程和 Vibe Coding 的完整流程。"}</p>
        </div>
        <div ref={sr.ref} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {chapters.map((ch, i) => (
            <Link key={ch.id} href={`/guide/${ch.id}`} className="card-glow" style={{ ...st.card, opacity: sr.v ? 1 : 0, transform: sr.v ? "translateY(0)" : "translateY(20px)", transitionDelay: `${i * 80}ms` }}>
              <div style={st.icon}>{ch.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "hsl(187 100% 45% / 0.6)", marginBottom: 4 }}>{`Chapter ${String(ch.order || i + 1).padStart(2, "0")}`}</div>
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{ch.title}</h2>
                <p style={{ fontSize: 14, color: "var(--fg-muted)" }}>{ch.summary}</p>
              </div>
              <span style={{ color: "var(--fg-muted)", flexShrink: 0, marginTop: 4 }}><SvgArrowRight /></span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
