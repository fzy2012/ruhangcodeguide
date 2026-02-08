"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Code2, Loader2 } from "lucide-react"

const API = "https://ruhangcodeguide.ruhang365.cn/api"

const chapters = [
  { id: "introduction", title: "什么是 AI 编程", order: 1 },
  { id: "getting-started", title: "如何开始", order: 2 },
  { id: "prompting", title: "提示词技巧", order: 3 },
  { id: "project-setup", title: "项目架构", order: 4 },
  { id: "debugging", title: "调试与问题解决", order: 5 },
  { id: "advanced", title: "进阶技巧", order: 6 },
]

/* Inline markdown renderer */
function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function renderMd(md: string) {
  let h = md
  h = h.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _l, c) => `<pre class="code-block"><code>${escapeHtml(c.trim())}</code></pre>`)
  h = h.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
  h = h.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
  h = h.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
  h = h.replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
  h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="md-link">$1</a>')
  h = h.replace(/^> (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>')
  h = h.replace(/^- (.+)$/gm, '<li class="md-li">$1</li>')
  h = h.replace(/(<li class="md-li">.*<\/li>(\n|$))+/g, (m) => `<ul class="md-ul">${m}</ul>`)
  h = h.replace(/^\d+\. (.+)$/gm, '<li class="md-oli">$1</li>')
  h = h.replace(/(<li class="md-oli">.*<\/li>(\n|$))+/g, (m) => `<ol class="md-ol">${m}</ol>`)
  h = h.split("\n\n").map((b) => { const t = b.trim(); if (!t) return ""; if (t.startsWith("<")) return t; return `<p class="md-p">${t}</p>` }).join("\n")
  return h
}

interface Section {
  id: string
  title: string
  summary: string
  content: string
  order: number
  subsections: { id: string; title: string; content: string }[]
}

export default function GuideDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [section, setSection] = useState<Section | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/guide/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) setSection(json.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const currentIdx = chapters.findIndex((c) => c.id === id)
  const prev = currentIdx > 0 ? chapters[currentIdx - 1] : null
  const next = currentIdx < chapters.length - 1 ? chapters[currentIdx + 1] : null
  const title = section?.title || chapters.find((c) => c.id === id)?.title || "章节"

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Header */}
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/30">
              <Code2 className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">{"代码指南"}</span>
          </Link>
          <Link href="/guide" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {"返回目录"}
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-10">
          <span className="font-mono text-sm text-primary/60 block mb-2">
            {`Chapter ${String((section?.order || currentIdx + 1)).padStart(2, "0")}`}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">{title}</h1>
          {section?.summary && (
            <p className="mt-3 text-muted-foreground text-pretty">{section.summary}</p>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        ) : section ? (
          <article className="guide-article">
            <div className="rounded-xl border border-border bg-card/50 p-6 sm:p-8">
              <div dangerouslySetInnerHTML={{ __html: renderMd(section.content) }} />
            </div>
            {section.subsections?.length > 0 && (
              <div className="mt-8 flex flex-col gap-6">
                {section.subsections.map((sub) => (
                  <div key={sub.id} className="rounded-xl border border-border bg-card/30 p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-foreground mb-4 pb-3 border-b border-border">{sub.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: renderMd(sub.content) }} />
                  </div>
                ))}
              </div>
            )}
          </article>
        ) : (
          <div className="rounded-xl border border-border bg-card/50 p-8 text-center">
            <p className="text-muted-foreground">{"该章节内容暂时无法加载。请确认后端 API 已部署。"}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-16 flex items-center justify-between gap-4">
          {prev ? (
            <Link href={`/guide/${prev.id}`} className="group flex items-center gap-3 rounded-xl border border-border bg-card/50 px-5 py-4 hover:border-primary/30 transition-all flex-1">
              <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <div>
                <div className="text-xs text-muted-foreground">{"上一章"}</div>
                <div className="text-sm font-medium text-foreground">{prev.title}</div>
              </div>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/guide/${next.id}`} className="group flex items-center justify-end gap-3 rounded-xl border border-border bg-card/50 px-5 py-4 hover:border-primary/30 transition-all flex-1 text-right">
              <div>
                <div className="text-xs text-muted-foreground">{"下一章"}</div>
                <div className="text-sm font-medium text-foreground">{next.title}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          ) : <div />}
        </div>
      </main>

      {/* Markdown styles */}
      <style jsx global>{`
        .guide-article .md-h1 { font-size: 1.5rem; font-weight: 700; color: hsl(var(--foreground)); margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .guide-article .md-h2 { font-size: 1.25rem; font-weight: 600; color: hsl(var(--foreground)); margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .guide-article .md-h3 { font-size: 1.1rem; font-weight: 600; color: hsl(var(--foreground)); margin-top: 1.25rem; margin-bottom: 0.5rem; }
        .guide-article .md-p { color: hsl(var(--muted-foreground)); line-height: 1.7; margin-bottom: 0.75rem; font-size: 0.9375rem; }
        .guide-article .md-link { color: hsl(var(--primary)); text-decoration: underline; text-underline-offset: 2px; }
        .guide-article .md-blockquote { border-left: 3px solid hsl(var(--primary) / 0.4); padding-left: 1rem; color: hsl(var(--muted-foreground)); font-style: italic; margin: 1rem 0; }
        .guide-article .md-ul, .guide-article .md-ol { margin: 0.75rem 0; padding-left: 1.5rem; }
        .guide-article .md-li, .guide-article .md-oli { color: hsl(var(--muted-foreground)); line-height: 1.7; margin-bottom: 0.25rem; font-size: 0.9375rem; }
        .guide-article .md-ul { list-style-type: disc; }
        .guide-article .md-ol { list-style-type: decimal; }
        .guide-article .inline-code { background: hsl(var(--secondary)); color: hsl(var(--primary)); padding: 0.125rem 0.375rem; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em; }
        .guide-article .code-block { background: hsl(222 47% 4%); border: 1px solid hsl(var(--border)); border-radius: 0.75rem; padding: 1rem 1.25rem; overflow-x: auto; margin: 1rem 0; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6; color: hsl(var(--foreground)); }
        .guide-article strong { color: hsl(var(--foreground)); font-weight: 600; }
      `}</style>
    </div>
  )
}
