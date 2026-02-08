"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { ArrowRight } from "lucide-react"

export function CallToAction() {
  const ref = useScrollReveal()

  return (
    <section className="relative px-6 py-24 md:py-32" ref={ref}>
      <div className="relative mx-auto max-w-3xl text-center">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full animate-glow-pulse"
          style={{
            background:
              "radial-gradient(circle, hsla(187, 100%, 45%, 0.06) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            {"准备好开启"}
            <span className="gradient-text">{" AI 编程之旅"}</span>
            {"了吗？"}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-pretty">
            {"加入入行 365 社区，与志同道合的伙伴一起学习成长。从零基础到 Vibe Coding，我们陪你每一步。"}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://ruhang365.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              {"立即加入入行 365"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
