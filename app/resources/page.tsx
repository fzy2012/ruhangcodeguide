"use client"

import { useState, useEffect, useMemo } from "react"
import {
  ExternalLink,
  FileText,
  Video,
  GraduationCap,
  BookOpen,
  Mic,
  Filter,
  User,
} from "lucide-react"
import { getResources, type Resource } from "@/lib/api"

const typeConfig: Record<
  string,
  { label: string; icon: typeof FileText; color: string }
> = {
  article: { label: "文章", icon: FileText, color: "text-primary" },
  video: { label: "视频", icon: Video, color: "text-chart-3" },
  course: { label: "课程", icon: GraduationCap, color: "text-accent" },
  documentation: { label: "文档", icon: BookOpen, color: "text-chart-2" },
  tutorial: { label: "教程/播客", icon: Mic, color: "text-chart-5" },
}

const typeFilters = [
  { id: "all", label: "全部", icon: Filter },
  { id: "article", label: "文章", icon: FileText },
  { id: "video", label: "视频", icon: Video },
  { id: "course", label: "课程", icon: GraduationCap },
  { id: "documentation", label: "文档", icon: BookOpen },
  { id: "tutorial", label: "教程/播客", icon: Mic },
]

// Fallback resources
const fallbackResources: Resource[] = [
  { id: "end-of-programming", title: "编程的终结", description: "Tim O'Reilly 关于 AI 如何改变软件开发的深度分析。", url: "https://www.oreilly.com/radar/the-end-of-programming-as-we-know-it", type: "article", author: "Tim O'Reilly", tags: ["行业趋势"] },
  { id: "70-percent-problem", title: "70% 问题：AI 辅助编程的残酷真相", description: "Addy Osmani 揭示 AI 编程的局限性和真实效率。", url: "https://addyo.substack.com/p/the-70-problem-hard-truths-about", type: "article", author: "Addy Osmani", tags: ["深度分析"] },
  { id: "karpathy-software-changing", title: "软件正在再次改变", description: "Andrej Karpathy 关于 AI 如何改变软件开发的演讲。", url: "https://www.youtube.com/watch?v=LCEmiRjPEtQ", type: "video", author: "Andrej Karpathy", tags: ["演讲"] },
  { id: "vibe-coding-replit", title: "Vibe Coding 101 with Replit", description: "DeepLearning.AI 和 Replit 联合推出的 Vibe Coding 入门课程。", url: "https://www.deeplearning.ai/short-courses/vibe-coding-101-with-replit/", type: "course", author: "DeepLearning.AI", tags: ["课程"] },
]

export default function ResourcesPage() {
  const [activeType, setActiveType] = useState("all")
  const [resources, setResources] = useState<Resource[]>(fallbackResources)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getResources()
      .then((data) => {
        setResources(data)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const filtered = useMemo(
    () =>
      activeType === "all"
        ? resources
        : resources.filter((r) => r.type === activeType),
    [resources, activeType]
  )

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: resources.length }
    for (const r of resources) {
      map[r.type] = (map[r.type] || 0) + 1
    }
    return map
  }, [resources])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border">
        <div className="grid-bg absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-12">
          <span className="inline-block text-xs font-medium text-primary border border-primary/20 bg-primary/5 px-3 py-1 rounded-full mb-4">
            学习资源
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            精选学习资源
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl text-pretty">
            文章、视频、课程、文档 -- 经过筛选的高质量 AI 编程学习材料。
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Type filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {typeFilters.map((tf) => {
            const Icon = tf.icon
            const isActive = activeType === tf.id
            return (
              <button
                key={tf.id}
                onClick={() => setActiveType(tf.id)}
                className={`group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "border border-border bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tf.label}
                <span
                  className={`text-xs ${
                    isActive ? "text-primary-foreground/70" : "text-muted-foreground/60"
                  }`}
                >
                  {counts[tf.id] || 0}
                </span>
              </button>
            )
          })}
        </div>

        {/* Resources list */}
        <div className="flex flex-col gap-4">
          {filtered.map((resource, i) => (
            <ResourceCard key={resource.id} resource={resource} index={i} />
          ))}
        </div>

        {filtered.length === 0 && loaded && (
          <div className="text-center py-20 text-muted-foreground">
            该分类暂无资源
          </div>
        )}
      </div>
    </div>
  )
}

function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  const [visible, setVisible] = useState(false)
  const config = typeConfig[resource.type] || typeConfig.article

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 60)
    return () => clearTimeout(timer)
  }, [index])

  const TypeIcon = config.icon

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`card-glow group flex items-start gap-5 rounded-xl border border-border bg-card/50 p-6 transition-all ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transition: "opacity 0.5s ease-out, transform 0.5s ease-out" }}
    >
      {/* Type icon */}
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
        <TypeIcon className={`h-5 w-5 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {resource.title}
            </h3>
            {resource.title_en && resource.title_en !== resource.title && (
              <p className="text-xs text-muted-foreground/60 mt-0.5 line-clamp-1">
                {resource.title_en}
              </p>
            )}
          </div>
          <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors mt-1" />
        </div>

        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {resource.description}
        </p>

        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded border ${config.color} bg-secondary/30 border-border`}
          >
            {config.label}
          </span>
          {resource.author && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
              <User className="h-3 w-3" />
              {resource.author}
            </span>
          )}
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
}
