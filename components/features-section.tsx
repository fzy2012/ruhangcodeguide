"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import {
  BookOpen,
  Wrench,
  BookMarked,
  Search,
  Zap,
  Users,
} from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "系统化学习路径",
    description: "从 AI 编程概念到进阶技巧，6 大章节覆盖完整学习链路",
  },
  {
    icon: Wrench,
    title: "20+ 工具推荐",
    description: "编辑器、CLI、Web 应用、Agent 一站式工具对比与推荐",
  },
  {
    icon: BookMarked,
    title: "精选学习资源",
    description: "文章、视频、课程、文档，经过筛选的高质量学习材料",
  },
  {
    icon: Search,
    title: "全站搜索",
    description: "快速找到你需要的指南章节、工具或资源",
  },
  {
    icon: Zap,
    title: "提示词技巧",
    description: "学习编写高质量 Prompt，让 AI 更好地理解你的需求",
  },
  {
    icon: Users,
    title: "入行 365 社区",
    description: "加入中国领先的入行成长型社区，获取持续支持",
  },
]

export function FeaturesSection() {
  const sectionRef = useScrollReveal()

  return (
    <section className="relative px-6 py-24 md:py-32" ref={sectionRef}>
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-medium text-primary border border-primary/20 bg-primary/5 px-3 py-1 rounded-full mb-4">
            核心功能
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            你需要的，
            <span className="gradient-text">这里都有</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-pretty">
            从学习路径到实战工具，为你的 AI 编程之旅提供全方位支持
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number]
  index: number
}) {
  const ref = useScrollReveal()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 100}ms` }}
      className="card-glow group rounded-xl border border-border bg-card/50 p-6 transition-all"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
        <feature.icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-2">
        {feature.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </div>
  )
}
