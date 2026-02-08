"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, ArrowRight, ArrowLeft, Code2 } from "lucide-react"

const API = "https://ruhangcodeguide.ruhang365.cn/api"

const fallback = [
  { id: "introduction", title: "什么是 AI 编程", emoji: "\u{1F916}", order: 1, summary: "了解 AI 编程和 Vibe Coding 的概念，以及它们如何改变我们编写代码的方式。" },
  { id: "getting-started", title: "如何开始", emoji: "\u{1F680}", order: 2, summary: "根据你的技术背景，选择最适合的入门工具和学习路径。" },
  { id: "prompting", title: "提示词技巧", emoji: "\u{1F4AC}", order: 3, summary: "学习如何编写高质量的提示词，让 AI 更好地理解你的需求。" },
  { id: "project-setup", title: "项目架构", emoji: "\u{1F3D7}\uFE0F", order: 4, summary: "学习如何组织你的 AI 编程项目，包括前后端分离、代码规范等。" },
  { id: "debugging", title: "调试与问题解决", emoji: "\u{1F41B}", order: 5, summary: "当 AI 生成的代码出现问题时，如何有效地调试和修复。" },
  { id: "advanced", title: "进阶技巧", emoji: "\u26A1", order: 6, summary: "深入了解 MCP、A2A 等新技术，以及如何创建自己的 AI 编程代理。" },
]

export default function GuidePage() {
  const [chapters, setChapters] = useState(fallback)

  useEffect(() => {
    fetch(`${API}/guide`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setChapters(json.data.sort((a: { order: number }, b: { order: number }) => a.order - b.order))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-background grid-bg">
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
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

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm text-primary font-medium">{"完整指南"}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            {"AI 编程"}
            <span className="gradient-text">{" 学习路径"}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
            {"6 个章节，系统性地带你掌握 AI 编程和 Vibe Coding 的完整流程。"}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {chapters.map((ch, i) => (
            <Link key={ch.id} href={`/guide/${ch.id}`}>
              <div className="card-glow group flex items-start gap-6 rounded-xl border border-border bg-card/50 p-6">
                <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-3xl">
                  {ch.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-primary font-mono mb-1">{`Chapter ${String(ch.order || i + 1).padStart(2, "0")}`}</div>
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{ch.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{ch.summary}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
