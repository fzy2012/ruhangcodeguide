"use client"

import { useState, useEffect, useMemo } from "react"
import { ExternalLink, Wrench, Terminal, Globe, Bot, Puzzle, Filter } from "lucide-react"
import { getTools, type Tool } from "@/lib/api"

const categories = [
  { id: "all", label: "全部", icon: Filter },
  { id: "editor", label: "编辑器", icon: Wrench },
  { id: "cli", label: "命令行", icon: Terminal },
  { id: "webapp", label: "Web 应用", icon: Globe },
  { id: "agent", label: "后台代理", icon: Bot },
  { id: "helper", label: "辅助工具", icon: Puzzle },
]

// Fallback tools data
const fallbackTools: Tool[] = [
  { id: "cursor", name: "Cursor", description: "最流行的 AI 编程编辑器，基于 VS Code，内置强大的 AI 助手和 Agent 模式。", url: "https://cursor.com", category: "editor", is_free: false, tags: ["编辑器", "AI助手", "推荐"] },
  { id: "windsurf", name: "Windsurf", description: "Codeium 出品的免费 AI 编辑器，功能类似 Cursor，适合预算有限的开发者。", url: "https://windsurf.com", category: "editor", is_free: true, tags: ["编辑器", "免费"] },
  { id: "vscode-copilot", name: "VS Code + GitHub Copilot", description: "微软官方方案，Copilot Agent 模式正在快速迭代中。", url: "https://code.visualstudio.com/docs/copilot/setup", category: "editor", is_free: false, tags: ["编辑器", "微软"] },
  { id: "claude-code", name: "Claude Code", description: "Anthropic 官方命令行工具，强大但成本较高。", url: "https://github.com/anthropics/claude-code", category: "cli", is_free: false, tags: ["CLI", "高级"] },
  { id: "aider", name: "aider", description: "开源 CLI 工具，支持多种 LLM，社区活跃。", url: "https://aider.chat/", category: "cli", is_free: true, tags: ["CLI", "开源", "推荐"] },
  { id: "bolt", name: "Bolt", description: "StackBlitz 出品的可视化 AI 编程平台，适合快速原型开发。", url: "https://bolt.new", category: "webapp", is_free: true, tags: ["Web应用", "推荐"] },
  { id: "v0", name: "v0", description: "Vercel 出品，擅长生成 React/Next.js 组件，设计感出色。", url: "https://v0.dev", category: "webapp", is_free: true, tags: ["Web应用", "React", "推荐"] },
  { id: "devin", name: "Devin", description: "号称第一个 AI 软件工程师，可自主完成复杂任务。", url: "https://devin.ai", category: "agent", is_free: false, tags: ["Agent", "高级"] },
  { id: "repomix", name: "repomix", description: "将整个代码仓库打包成适合 AI 阅读的格式。", url: "https://repomix.com/", category: "helper", is_free: true, tags: ["辅助工具", "开源"] },
]

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [tools, setTools] = useState<Tool[]>(fallbackTools)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getTools()
      .then((data) => {
        setTools(data)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? tools
        : tools.filter((t) => t.category === activeCategory),
    [tools, activeCategory]
  )

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: tools.length }
    for (const t of tools) {
      map[t.category] = (map[t.category] || 0) + 1
    }
    return map
  }, [tools])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border">
        <div className="grid-bg absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-12">
          <span className="inline-block text-xs font-medium text-primary border border-primary/20 bg-primary/5 px-3 py-1 rounded-full mb-4">
            AI 工具库
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            AI 编程工具推荐
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl text-pretty">
            精选 {tools.length}+ 款 AI 编程工具，涵盖编辑器、CLI、Web 应用、Agent 等多个类别。
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "border border-border bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
                <span
                  className={`text-xs ${
                    isActive ? "text-primary-foreground/70" : "text-muted-foreground/60"
                  }`}
                >
                  {counts[cat.id] || 0}
                </span>
              </button>
            )
          })}
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>

        {filtered.length === 0 && loaded && (
          <div className="text-center py-20 text-muted-foreground">
            该分类暂无工具
          </div>
        )}
      </div>
    </div>
  )
}

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 60)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`card-glow group relative flex flex-col rounded-xl border border-border bg-card/50 p-6 transition-all ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transition: "opacity 0.5s ease-out, transform 0.5s ease-out" }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
            <span className="font-mono text-sm font-bold text-primary">
              {tool.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {tool.name}
            </h3>
            {tool.name_en && tool.name_en !== tool.name && (
              <p className="text-xs text-muted-foreground/60 truncate">
                {tool.name_en}
              </p>
            )}
          </div>
        </div>
        <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors" />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
        {tool.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded ${
            tool.is_free
              ? "bg-chart-3/10 text-chart-3 border border-chart-3/20"
              : "bg-accent/10 text-accent border border-accent/20"
          }`}
        >
          {tool.is_free ? "免费" : "付费"}
        </span>
      </div>
    </a>
  )
}
