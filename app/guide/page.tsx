import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getGuide } from "@/lib/api"

export const metadata = {
  title: "学习指南 - 代码指南 | 入行 365",
  description: "系统化的 AI 编程学习路径，从入门到进阶的六大章节",
}

// Fallback guide data in case the API is unavailable
const fallbackGuide = [
  {
    id: "introduction",
    title: "什么是 AI 编程",
    emoji: "robot",
    summary: "了解 AI 编程和 Vibe Coding 的概念，以及它们如何改变我们编写代码的方式。",
    order: 1,
    content: "",
    subsections: [],
  },
  {
    id: "getting-started",
    title: "如何开始",
    emoji: "rocket",
    summary: "根据你的技术背景，选择最适合的入门工具和学习路径。",
    order: 2,
    content: "",
    subsections: [],
  },
  {
    id: "prompting",
    title: "提示词技巧",
    emoji: "speech_balloon",
    summary: "学习如何编写高质量的提示词，让 AI 更好地理解你的需求。",
    order: 3,
    content: "",
    subsections: [],
  },
  {
    id: "project-setup",
    title: "项目架构",
    emoji: "building_construction",
    summary: "学习如何组织你的 AI 编程项目，包括前后端分离、代码规范等。",
    order: 4,
    content: "",
    subsections: [],
  },
  {
    id: "debugging",
    title: "调试与问题解决",
    emoji: "bug",
    summary: "当 AI 生成的代码出现问题时，如何有效地调试和修复。",
    order: 5,
    content: "",
    subsections: [],
  },
  {
    id: "advanced",
    title: "进阶技巧",
    emoji: "zap",
    summary: "深入了解 MCP、A2A 等新技术，以及如何创建自己的 AI 编程代理。",
    order: 6,
    content: "",
    subsections: [],
  },
]

export default async function GuidePage() {
  let sections = fallbackGuide
  try {
    sections = await getGuide()
  } catch {
    // use fallback
  }

  const sortedSections = sections.sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border">
        <div className="grid-bg absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-6 pt-28 pb-12">
          <span className="inline-block text-xs font-medium text-primary border border-primary/20 bg-primary/5 px-3 py-1 rounded-full mb-4">
            学习路径
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            AI 编程指南
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl text-pretty">
            六大章节，系统化的学习路径，带你从零基础走向 AI 编程实战。
          </p>
        </div>
      </div>

      {/* Guide sections */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex flex-col gap-4">
          {sortedSections.map((section, i) => (
            <Link key={section.id} href={`/guide/${section.id}`}>
              <div className="card-glow group flex items-start gap-6 rounded-xl border border-border bg-card/50 p-6 transition-all cursor-pointer">
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <span className="font-mono text-lg font-bold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {section.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {section.summary}
                  </p>
                  {section.subsections && section.subsections.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {section.subsections.map((sub) => (
                        <span
                          key={sub.id}
                          className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded"
                        >
                          {sub.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
