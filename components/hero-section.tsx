"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles, Terminal } from "lucide-react"

const codeLines = [
  '> cursor "创建一个待办应用"',
  "正在分析需求...",
  "生成 TodoApp 组件 ✓",
  "添加数据持久化 ✓",
  "配置样式和动画 ✓",
  "项目已就绪！",
]

export function HeroSection() {
  const [currentLine, setCurrentLine] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (currentLine >= codeLines.length) {
      const timeout = setTimeout(() => {
        setCurrentLine(0)
        setDisplayText("")
        setIsTyping(true)
      }, 3000)
      return () => clearTimeout(timeout)
    }

    const line = codeLines[currentLine]
    let charIndex = 0
    setIsTyping(true)

    const interval = setInterval(() => {
      if (charIndex < line.length) {
        setDisplayText(line.slice(0, charIndex + 1))
        charIndex++
      } else {
        setIsTyping(false)
        clearInterval(interval)
        setTimeout(() => {
          setCurrentLine((prev) => prev + 1)
          setDisplayText("")
        }, 800)
      }
    }, 40)

    return () => clearInterval(interval)
  }, [currentLine])

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Grid overlay */}
      <div className="grid-bg absolute inset-0 opacity-30" aria-hidden="true" />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full animate-glow-pulse"
        style={{
          background:
            "radial-gradient(circle, hsla(187, 100%, 45%, 0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">
            入行 365 出品
          </span>
        </div>

        {/* Main heading */}
        <h1 className="animate-fade-up text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl leading-tight text-balance">
          <span className="text-foreground">AI 编程</span>
          <br />
          <span className="gradient-text glow-text">从入门到实战</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty delay-200" style={{ animationDelay: "200ms" }}>
          掌握 Cursor、v0、Claude Code 等 AI 工具，学会提示词技巧，
          <br className="hidden sm:inline" />
          从零基础到 Vibe Coding，开启你的 AI 编程之旅。
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animationDelay: "400ms" }}
        >
          <Link
            href="/guide"
            className="group flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
          >
            开始学习
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/tools"
            className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 px-6 py-3 text-sm font-medium text-foreground hover:border-primary/30 hover:bg-secondary/50 transition-all"
          >
            <Terminal className="h-4 w-4" />
            探索工具
          </Link>
        </div>

        {/* Terminal preview */}
        <div
          className="animate-fade-up mx-auto mt-16 max-w-lg"
          style={{ animationDelay: "600ms" }}
        >
          <div className="overflow-hidden rounded-xl border border-border bg-card/80 shadow-2xl shadow-primary/5">
            {/* Terminal title bar */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-chart-3/60" />
              <div className="h-3 w-3 rounded-full bg-primary/60" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">
                terminal
              </span>
            </div>
            {/* Terminal content */}
            <div className="px-4 py-4 font-mono text-xs sm:text-sm min-h-[180px]">
              {codeLines.slice(0, currentLine).map((line, i) => (
                <div
                  key={i}
                  className={`mb-1 ${
                    line.startsWith(">")
                      ? "text-primary"
                      : line.includes("✓")
                        ? "text-chart-3"
                        : "text-muted-foreground"
                  }`}
                >
                  {line}
                </div>
              ))}
              {currentLine < codeLines.length && (
                <div
                  className={`${
                    codeLines[currentLine]?.startsWith(">")
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {displayText}
                  {isTyping && (
                    <span className="inline-block w-2 h-4 ml-0.5 bg-primary/80 animate-pulse" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
        <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
          <span className="text-xs">向下滚动</span>
          <div className="h-8 w-5 rounded-full border border-muted-foreground/30 flex items-start justify-center p-1">
            <div className="h-2 w-1 rounded-full bg-primary animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}
