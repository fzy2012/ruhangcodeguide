"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"

const API = "https://ruhangcodeguide.ruhang365.cn/api"
interface Tool { id: string; name: string; description: string; url: string; category: string; is_free: boolean; tags: string[] }

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(false)
  useEffect(() => { const el = ref.current; if (!el) return; const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold: 0.1 }); o.observe(el); return () => o.disconnect() }, [])
  return { ref, v }
}

const categories = [
  { id: "all", label: "全部" }, { id: "editor", label: "编辑器" }, { id: "cli", label: "命令行" },
  { id: "webapp", label: "Web 应用" }, { id: "agent", label: "后台代理" }, { id: "helper", label: "辅助工具" },
]

const fallbackTools: Tool[] = [
  { id: "cursor", name: "Cursor", description: "最流行的 AI 编程编辑器，基于 VS Code，内置强大的 AI 助手和 Agent 模式。", url: "https://cursor.com", category: "editor", is_free: false, tags: ["编辑器", "AI助手", "推荐"] },
  { id: "windsurf", name: "Windsurf", description: "Codeium 出品的免费 AI 编辑器，功能类似 Cursor。", url: "https://windsurf.com", category: "editor", is_free: true, tags: ["编辑器", "免费"] },
  { id: "vscode-copilot", name: "VS Code + Copilot", description: "微软官方方案，Copilot Agent 模式正在快速迭代中。", url: "https://code.visualstudio.com/docs/copilot/setup", category: "editor", is_free: false, tags: ["编辑器", "微软"] },
  { id: "claude-code", name: "Claude Code", description: "Anthropic 官方命令行工具，强大但成本较高。", url: "https://github.com/anthropics/claude-code", category: "cli", is_free: false, tags: ["CLI", "高级"] },
  { id: "aider", name: "aider", description: "开源 CLI 工具，支持多种 LLM，社区活跃。", url: "https://aider.chat/", category: "cli", is_free: true, tags: ["CLI", "开源"] },
  { id: "bolt", name: "Bolt", description: "StackBlitz 出品的可视化 AI 编程平台。", url: "https://bolt.new", category: "webapp", is_free: true, tags: ["Web应用", "推荐"] },
  { id: "v0", name: "v0", description: "Vercel 出品，擅长生成 React/Next.js 组件。", url: "https://v0.dev", category: "webapp", is_free: true, tags: ["Web应用", "React"] },
  { id: "devin", name: "Devin", description: "号称第一个 AI 软件工程师。", url: "https://devin.ai", category: "agent", is_free: false, tags: ["Agent"] },
  { id: "repomix", name: "repomix", description: "将整个代码仓库打包成适合 AI 阅读的格式。", url: "https://repomix.com/", category: "helper", is_free: true, tags: ["辅助工具"] },
]

const SvgCode2 = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
const SvgWrench = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
const SvgArrowLeft = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
const SvgExternal = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>

const st = {
  page: { minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--font-sans)" } as React.CSSProperties,
  header: { position: "sticky" as const, top: 0, zIndex: 50, borderBottom: "1px solid var(--border)", background: "hsl(222 47% 6% / 0.7)", backdropFilter: "blur(12px)" },
  headerInner: { maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" } as React.CSSProperties,
  main: { maxWidth: 1200, margin: "0 auto", padding: "64px 24px" } as React.CSSProperties,
  badge: { display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 9999, border: "1px solid hsl(187 100% 45% / 0.3)", background: "hsl(187 100% 45% / 0.05)", padding: "6px 16px", marginBottom: 16 } as React.CSSProperties,
  tab: (active: boolean) => ({ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 8, padding: "8px 16px", fontSize: 14, fontWeight: 500, cursor: "pointer", border: active ? "none" : "1px solid var(--border)", background: active ? "var(--primary)" : "var(--bg-card)", color: active ? "var(--bg)" : "var(--fg-muted)", transition: "all 0.2s" } as React.CSSProperties),
  card: { display: "flex", flexDirection: "column" as const, borderRadius: "var(--radius)", border: "1px solid var(--border)", background: "var(--bg-card)", padding: 24, transition: "all 0.5s" } as React.CSSProperties,
  tag: { fontSize: 10, color: "var(--fg-muted)", background: "var(--secondary)", padding: "2px 8px", borderRadius: 4 } as React.CSSProperties,
}

export default function ToolsPage() {
  const [active, setActive] = useState("all")
  const [tools, setTools] = useState<Tool[]>(fallbackTools)
  const sr = useScrollReveal()

  useEffect(() => { fetch(`${API}/tools`).then(r => r.json()).then(json => { if (json.success && Array.isArray(json.data)) setTools(json.data) }).catch(() => {}) }, [])

  const filtered = useMemo(() => active === "all" ? tools : tools.filter(t => t.category === active), [tools, active])
  const counts = useMemo(() => { const m: Record<string, number> = { all: tools.length }; for (const t of tools) m[t.category] = (m[t.category] || 0) + 1; return m }, [tools])

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
          <div style={st.badge}><span style={{ color: "var(--primary)" }}><SvgWrench /></span><span style={{ fontSize: 12, color: "var(--primary)", fontWeight: 500 }}>{"AI 工具库"}</span></div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, marginBottom: 16 }}>{"AI 编程"}<span className="gradient-text">{" 工具推荐"}</span></h1>
          <p style={{ fontSize: 18, color: "var(--fg-muted)", maxWidth: 640 }}>{`精选 ${tools.length}+ 款 AI 编程工具，涵盖编辑器、CLI、Web 应用等多个类别。`}</p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
          {categories.map(c => (
            <button key={c.id} onClick={() => setActive(c.id)} style={st.tab(active === c.id)}>
              {c.label}<span style={{ fontSize: 12, opacity: 0.7 }}>{counts[c.id] || 0}</span>
            </button>
          ))}
        </div>
        <div ref={sr.ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {filtered.map((tool, i) => (
            <a key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer" className="card-glow" style={{ ...st.card, opacity: sr.v ? 1 : 0, transform: sr.v ? "translateY(0)" : "translateY(20px)", transitionDelay: `${i * 60}ms` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "hsl(187 100% 45% / 0.1)", border: "1px solid hsl(187 100% 45% / 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: "var(--primary)" }}>{tool.name.charAt(0)}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 600 }}>{tool.name}</h3>
                </div>
                <span style={{ color: "var(--fg-muted)", opacity: 0.4, flexShrink: 0 }}><SvgExternal /></span>
              </div>
              <p style={{ fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.6, flex: 1, marginBottom: 16 }}>{tool.description}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{tool.tags.slice(0, 3).map(tag => <span key={tag} style={st.tag}>{tag}</span>)}</div>
                <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 4, border: "1px solid", borderColor: tool.is_free ? "hsl(142 76% 36% / 0.3)" : "hsl(199 89% 48% / 0.3)", color: tool.is_free ? "hsl(142 76% 36%)" : "hsl(199 89% 48%)", background: tool.is_free ? "hsl(142 76% 36% / 0.1)" : "hsl(199 89% 48% / 0.1)" }}>{tool.is_free ? "免费" : "付费"}</span>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}
