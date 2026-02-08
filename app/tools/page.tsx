"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ExternalLink, Wrench, Terminal, Globe, Bot, Puzzle, Filter, Code2, ArrowLeft } from "lucide-react"

const API = "https://ruhangcodeguide.ruhang365.cn/api"

interface Tool { id: string; name: string; name_en?: string; description: string; url: string; category: string; is_free: boolean; tags: string[] }

const categories = [
  { id: "all", label: "全部", icon: Filter },
  { id: "editor", label: "编辑器", icon: Wrench },
  { id: "cli", label: "命令行", icon: Terminal },
  { id: "webapp", label: "Web 应用", icon: Globe },
  { id: "agent", label: "后台代理", icon: Bot },
  { id: "helper", label: "辅助工具", icon: Puzzle },
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

export default function ToolsPage() {
  const [active, setActive] = useState("all")
  const [tools, setTools] = useState<Tool[]>(fallbackTools)

  useEffect(() => {
    fetch(`${API}/tools`)
      .then((r) => r.json())
      .then((json) => { if (json.success && Array.isArray(json.data)) setTools(json.data) })
      .catch(() => {})
  }, [])

  const filtered = useMemo(() => active === "all" ? tools : tools.filter((t) => t.category === active), [tools, active])
  const counts = useMemo(() => {
    const m: Record<string, number> = { all: tools.length }
    for (const t of tools) m[t.category] = (m[t.category] || 0) + 1
    return m
  }, [tools])

  return (
    <div className="min-h-screen bg-background grid-bg">
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/30">
              <Code2 className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">{"代码指南"}</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {"返回首页"}
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-4">
            <Wrench className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-primary font-medium">{"AI 工具库"}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            {"AI 编程"}
            <span className="gradient-text">{" 工具推荐"}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
            {`精选 ${tools.length}+ 款 AI 编程工具，涵盖编辑器、CLI、Web 应用等多个类别。`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = active === cat.id
            return (
              <button key={cat.id} onClick={() => setActive(cat.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border border-border bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"}`}>
                <Icon className="h-4 w-4" />
                {cat.label}
                <span className={`text-xs ${isActive ? "text-primary-foreground/70" : "text-muted-foreground/60"}`}>{counts[cat.id] || 0}</span>
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tool) => (
            <a key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer"
              className="card-glow group flex flex-col rounded-xl border border-border bg-card/50 p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <span className="font-mono text-sm font-bold text-primary">{tool.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{tool.name}</h3>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">{tool.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {tool.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${tool.is_free ? "bg-chart-3/10 text-chart-3 border border-chart-3/20" : "bg-accent/10 text-accent border border-accent/20"}`}>
                  {tool.is_free ? "免费" : "付费"}
                </span>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}
