"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

const API = "https://ruhangcodeguide.ruhang365.cn/api"

const chapters = [
  { id: "introduction", title: "什么是 AI 编程", order: 1 },
  { id: "getting-started", title: "如何开始", order: 2 },
  { id: "prompting", title: "提示词技巧", order: 3 },
  { id: "project-setup", title: "项目架构", order: 4 },
  { id: "debugging", title: "调试与问题解决", order: 5 },
  { id: "advanced", title: "进阶技巧", order: 6 },
]

function escapeHtml(t: string) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") }
function renderMd(md: string) {
  let h = md
  h = h.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _l, c) => `<pre style="background:hsl(222 47% 4%);border:1px solid var(--border);border-radius:12px;padding:16px 20px;overflow-x:auto;margin:16px 0;font-family:var(--font-mono);font-size:0.85rem;line-height:1.6;color:var(--fg)"><code>${escapeHtml(c.trim())}</code></pre>`)
  h = h.replace(/`([^`]+)`/g, '<code style="background:var(--secondary);color:var(--primary);padding:1px 6px;border-radius:4px;font-family:var(--font-mono);font-size:0.85em">$1</code>')
  h = h.replace(/^### (.+)$/gm, '<h3 style="font-size:1.1rem;font-weight:600;color:var(--fg);margin:20px 0 8px">$1</h3>')
  h = h.replace(/^## (.+)$/gm, '<h2 style="font-size:1.25rem;font-weight:600;color:var(--fg);margin:24px 0 8px">$1</h2>')
  h = h.replace(/^# (.+)$/gm, '<h1 style="font-size:1.5rem;font-weight:700;color:var(--fg);margin:24px 0 12px">$1</h1>')
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--fg);font-weight:600">$1</strong>')
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--primary);text-decoration:underline;text-underline-offset:2px">$1</a>')
  h = h.replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid hsl(187 100% 45% / 0.4);padding-left:16px;color:var(--fg-muted);font-style:italic;margin:16px 0">$1</blockquote>')
  h = h.replace(/^- (.+)$/gm, '<li style="color:var(--fg-muted);line-height:1.7;margin-bottom:4px;font-size:0.9375rem;margin-left:20px;list-style:disc">$1</li>')
  h = h.replace(/^\d+\. (.+)$/gm, '<li style="color:var(--fg-muted);line-height:1.7;margin-bottom:4px;font-size:0.9375rem;margin-left:20px;list-style:decimal">$1</li>')
  h = h.split("\n\n").map(b => { const t = b.trim(); if (!t || t.startsWith("<")) return t; return `<p style="color:var(--fg-muted);line-height:1.7;margin-bottom:12px;font-size:0.9375rem">${t}</p>` }).join("\n")
  return h
}

interface Section { id: string; title: string; summary: string; content: string; order: number; subsections: { id: string; title: string; content: string }[] }

const SvgCode2 = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
const SvgArrowLeft = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
const SvgArrowRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
const SvgLoader = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>

const st = {
  page: { minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--font-sans)" } as React.CSSProperties,
  header: { position: "sticky" as const, top: 0, zIndex: 50, borderBottom: "1px solid var(--border)", background: "hsl(222 47% 6% / 0.7)", backdropFilter: "blur(12px)" },
  headerInner: { maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" } as React.CSSProperties,
  main: { maxWidth: 800, margin: "0 auto", padding: "48px 24px" } as React.CSSProperties,
  content: { borderRadius: "var(--radius)", border: "1px solid var(--border)", background: "var(--bg-card)", padding: "24px 32px" } as React.CSSProperties,
  navRow: { marginTop: 64, display: "flex", justifyContent: "space-between", gap: 16 } as React.CSSProperties,
  navBtn: { display: "flex", alignItems: "center", gap: 12, flex: 1, borderRadius: "var(--radius)", border: "1px solid var(--border)", background: "var(--bg-card)", padding: "16px 20px", transition: "all 0.3s" } as React.CSSProperties,
}

export default function GuideDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [section, setSection] = useState<Section | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/guide/${id}`).then(r => r.json()).then(json => { if (json.success && json.data) setSection(json.data) }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const idx = chapters.findIndex(c => c.id === id)
  const prev = idx > 0 ? chapters[idx - 1] : null
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null
  const title = section?.title || chapters.find(c => c.id === id)?.title || "章节"

  return (
    <div style={st.page} className="grid-bg">
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <header style={st.header}>
        <div style={st.headerInner}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: "hsl(187 100% 45% / 0.1)", border: "1px solid hsl(187 100% 45% / 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}><SvgCode2 /></div><span style={{ fontSize: 18, fontWeight: 700 }}>{"代码指南"}</span></Link>
          <Link href="/guide" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--fg-muted)" }}><SvgArrowLeft /><span>{"返回目录"}</span></Link>
        </div>
      </header>
      <main style={st.main}>
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "hsl(187 100% 45% / 0.6)" }}>{`Chapter ${String(section?.order || idx + 1).padStart(2, "0")}`}</span>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, marginTop: 8 }}>{title}</h1>
          {section?.summary && <p style={{ color: "var(--fg-muted)", marginTop: 12 }}>{section.summary}</p>}
        </div>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0", color: "var(--primary)" }}><SvgLoader /></div>
        ) : section ? (
          <div>
            <div style={st.content} dangerouslySetInnerHTML={{ __html: renderMd(section.content) }} />
            {section.subsections?.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 32 }}>
                {section.subsections.map(sub => (
                  <div key={sub.id} style={{ ...st.content, background: "hsl(222 47% 5%)" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>{sub.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: renderMd(sub.content) }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ ...st.content, textAlign: "center" }}><p style={{ color: "var(--fg-muted)" }}>{"该章节内容暂时无法加载，请确认后端 API 已部署。"}</p></div>
        )}
        <div style={st.navRow}>
          {prev ? (
            <Link href={`/guide/${prev.id}`} className="card-glow" style={st.navBtn}><SvgArrowLeft /><div><div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{"上一章"}</div><div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{prev.title}</div></div></Link>
          ) : <div />}
          {next ? (
            <Link href={`/guide/${next.id}`} className="card-glow" style={{ ...st.navBtn, justifyContent: "flex-end", textAlign: "right" }}><div><div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{"下一章"}</div><div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{next.title}</div></div><SvgArrowRight /></Link>
          ) : <div />}
        </div>
      </main>
    </div>
  )
}
