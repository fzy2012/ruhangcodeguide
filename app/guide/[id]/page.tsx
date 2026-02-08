import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getGuide, getGuideSection } from "@/lib/api"
import { GuideContentClient } from "./guide-content-client"

// Fallback data
const fallbackSections = [
  { id: "introduction", title: "什么是 AI 编程", order: 1 },
  { id: "getting-started", title: "如何开始", order: 2 },
  { id: "prompting", title: "提示词技巧", order: 3 },
  { id: "project-setup", title: "项目架构", order: 4 },
  { id: "debugging", title: "调试与问题解决", order: 5 },
  { id: "advanced", title: "进阶技巧", order: 6 },
]

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  try {
    const section = await getGuideSection(id)
    return {
      title: `${section.title} - 代码指南 | 入行 365`,
      description: section.summary,
    }
  } catch {
    return {
      title: "指南章节 - 代码指南 | 入行 365",
    }
  }
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let section = null
  let allSections = fallbackSections

  try {
    const [sectionData, guideData] = await Promise.all([
      getGuideSection(id),
      getGuide(),
    ])
    section = sectionData
    allSections = guideData
      .sort((a, b) => a.order - b.order)
      .map((s) => ({ id: s.id, title: s.title, order: s.order }))
  } catch {
    // use fallback
  }

  const currentIndex = allSections.findIndex((s) => s.id === id)
  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null
  const nextSection =
    currentIndex < allSections.length - 1
      ? allSections[currentIndex + 1]
      : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border">
        <div className="grid-bg absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-6 pt-28 pb-12">
          <Link
            href="/guide"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            返回指南列表
          </Link>

          {section ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-sm text-primary/60">
                  {String(section.order).padStart(2, "0")}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                {section.title}
              </h1>
              <p className="mt-3 text-muted-foreground max-w-xl text-pretty">
                {section.summary}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-foreground">加载中...</h1>
              <p className="mt-3 text-muted-foreground">
                正在加载指南内容，请稍候。如果后端暂未部署，内容可能无法显示。
              </p>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        {section ? (
          <GuideContentClient
            content={section.content}
            subsections={section.subsections}
          />
        ) : (
          <div className="rounded-xl border border-border bg-card/50 p-8 text-center">
            <p className="text-muted-foreground">
              该章节内容暂时无法加载。请确认后端 API 已部署到 ruhangcodeguide.ruhang365.cn。
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-16 flex items-center justify-between gap-4">
          {prevSection ? (
            <Link
              href={`/guide/${prevSection.id}`}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card/50 px-5 py-4 hover:border-primary/30 transition-all flex-1"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <div>
                <div className="text-xs text-muted-foreground">上一章</div>
                <div className="text-sm font-medium text-foreground">
                  {prevSection.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextSection ? (
            <Link
              href={`/guide/${nextSection.id}`}
              className="group flex items-center justify-end gap-3 rounded-xl border border-border bg-card/50 px-5 py-4 hover:border-primary/30 transition-all flex-1 text-right"
            >
              <div>
                <div className="text-xs text-muted-foreground">下一章</div>
                <div className="text-sm font-medium text-foreground">
                  {nextSection.title}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  )
}
