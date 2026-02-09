"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const chapters = [
  {
    id: "introduction",
    order: "01",
    title: "什么是 AI 编程",
    summary: "了解 AI 编程和 Vibe Coding 的概念",
    color: "from-primary/20 to-primary/5",
  },
  {
    id: "getting-started",
    order: "02",
    title: "如何开始",
    summary: "根据你的背景选择最适合的工具",
    color: "from-accent/20 to-accent/5",
  },
  {
    id: "prompting",
    order: "03",
    title: "提示词技巧",
    summary: "编写高质量 Prompt 的最佳实践",
    color: "from-chart-3/20 to-chart-3/5",
  },
  {
    id: "project-setup",
    order: "04",
    title: "项目架构",
    summary: "前后端分离与代码规范",
    color: "from-primary/20 to-primary/5",
  },
  {
    id: "debugging",
    order: "05",
    title: "调试与问题解决",
    summary: "高效调试 AI 生成代码的方法",
    color: "from-accent/20 to-accent/5",
  },
  {
    id: "advanced",
    order: "06",
    title: "进阶技巧",
    summary: "MCP、A2A 与自定义 Agent",
    color: "from-chart-3/20 to-chart-3/5",
  },
]

export function GuidePreview() {
  const sectionRef = useScrollReveal()

  return (
    <section className="relative px-6 py-24 md:py-32" ref={sectionRef}>
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, hsla(187, 100%, 45%, 0.05) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-xs font-medium text-primary border border-primary/20 bg-primary/5 px-3 py-1 rounded-full mb-4">
              学习路径
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
              六章指南，
              <span className="gradient-text">从零到一</span>
            </h2>
          </div>
          <Link
            href="/guide"
            className="group flex items-center gap-2 text-sm text-primary hover:underline"
          >
            查看完整指南
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Chapter cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((ch, i) => (
            <ChapterCard key={ch.id} chapter={ch} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ChapterCard({
  chapter,
  index,
}: {
  chapter: (typeof chapters)[number]
  index: number
}) {
  const ref = useScrollReveal()

  return (
    <Link href={`/guide/${chapter.id}`}>
      <div
        ref={ref}
        style={{ transitionDelay: `${index * 80}ms` }}
        className="card-glow group relative overflow-hidden rounded-xl border border-border bg-card/50 p-6 transition-all cursor-pointer"
      >
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${chapter.color} opacity-0 group-hover:opacity-100 transition-opacity`}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <span className="font-mono text-xs text-primary/60">
            {chapter.order}
          </span>
          <h3 className="mt-2 text-base font-semibold text-foreground">
            {chapter.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {chapter.summary}
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <span>阅读章节</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </Link>
  )
}
