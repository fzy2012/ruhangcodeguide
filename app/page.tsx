"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import {
  BookOpen,
  Wrench,
  BookMarked,
  Search,
  Zap,
  Users,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  Terminal,
  Sparkles,
  Code2,
  ExternalLink,
  Github,
} from "lucide-react"

/* ─── Particle Canvas ─── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = []

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5,
        o: Math.random() * 0.5 + 0.1,
      })
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas!.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas!.height) p.vy *= -1
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(0, 212, 255, ${p.o})`
        ctx!.fill()
      }
      // connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 150) {
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - d / 150)})`
            ctx!.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
}

/* ─── Typing animation ─── */
function useTyping(texts: string[], speed = 80, pause = 2000) {
  const [display, setDisplay] = useState("")
  const [idx, setIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = texts[idx]
    const timer = setTimeout(
      () => {
        if (!deleting) {
          setDisplay(current.slice(0, charIdx + 1))
          if (charIdx + 1 === current.length) {
            setTimeout(() => setDeleting(true), pause)
          } else {
            setCharIdx(charIdx + 1)
          }
        } else {
          setDisplay(current.slice(0, charIdx))
          if (charIdx === 0) {
            setDeleting(false)
            setIdx((idx + 1) % texts.length)
          } else {
            setCharIdx(charIdx - 1)
          }
        }
      },
      deleting ? 40 : speed
    )
    return () => clearTimeout(timer)
  }, [charIdx, deleting, idx, texts, speed, pause])

  return display
}

/* ─── Scroll reveal hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return { ref, visible }
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  const links = [
    { label: "指南", href: "/guide" },
    { label: "工具", href: "/tools" },
    { label: "资源", href: "/resources" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 group-hover:border-primary/60 transition-colors">
            <Code2 className="w-4 h-4 text-primary" />
          </div>
          <span className="text-lg font-bold text-foreground">
            {"代码指南"}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/search"
            className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs text-muted-foreground hover:border-primary/40 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{"搜索..."}</span>
            <kbd className="ml-2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono">
              {"/"}
            </kbd>
          </Link>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass border-t border-border px-6 py-4 space-y-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/search"
            className="block text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {"搜索"}
          </Link>
        </div>
      )}
    </nav>
  )
}

/* ─── Hero ─── */
function HeroSection() {
  const typed = useTyping([
    "用 AI 写出你的第一行代码",
    "让 Cursor 帮你自动补全",
    "从 Vibe Coding 开始创造",
    "AI 编程，入行从这里开始",
  ])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 grid-bg">
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-glow-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[100px] animate-glow-pulse"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-8 animate-fade-up">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs text-primary font-medium">
            {"入行 365 出品"}
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-up text-balance" style={{ animationDelay: "0.1s" }}>
          <span className="gradient-text">{"AI 编程"}</span>
          <br />
          <span className="text-foreground">{"学习指南"}</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-4 animate-fade-up max-w-2xl mx-auto text-pretty" style={{ animationDelay: "0.2s" }}>
          {"从零基础到独立开发，掌握 Vibe Coding 的完整路径。"}
          <br />
          {"用 AI 把你的想法变成现实。"}
        </p>

        {/* Terminal typing */}
        <div
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/80 px-5 py-3 mb-10 font-mono text-sm animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Terminal className="w-4 h-4 text-primary shrink-0" />
          <span className="text-primary/70">{">"}</span>
          <span className="text-foreground">{typed}</span>
          <span className="text-primary animate-pulse">{"_"}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <Link
            href="/guide"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <BookOpen className="w-4 h-4" />
            {"开始阅读"}
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-6 py-3 text-sm font-medium text-foreground hover:border-primary/40 transition-colors"
          >
            <Wrench className="w-4 h-4" />
            {"工具推荐"}
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Features ─── */
const features = [
  { icon: BookOpen, title: "6 章系统指南", desc: "从入门到进阶，覆盖 AI 编程完整流程" },
  { icon: Wrench, title: "22+ 精选工具", desc: "编辑器、CLI、Web 应用一网打尽" },
  { icon: BookMarked, title: "15+ 学习资源", desc: "精选文章、视频、课程和文档" },
  { icon: Search, title: "全文搜索", desc: "快速找到你需要的任何内容" },
  { icon: Zap, title: "实战导向", desc: "提示词技巧、项目架构、调试方法" },
  { icon: Users, title: "入行 365 社区", desc: "加入学习社区，与同行者交流成长" },
]

function FeaturesSection() {
  const sr = useScrollReveal()
  return (
    <section className="relative py-24 px-6">
      <div ref={sr.ref} className={`max-w-6xl mx-auto transition-all duration-700 ${sr.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-balance">
            {"为什么选择"}
            <span className="gradient-text">{" 代码指南"}</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-pretty">
            {"入行 365 团队精心整理，让你在 AI 编程的世界少走弯路"}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="card-glow rounded-xl border border-border bg-card/50 p-6 transition-all duration-500"
                style={{ animationDelay: `${i * 0.1}s`, opacity: sr.visible ? 1 : 0, transform: sr.visible ? "translateY(0)" : "translateY(20px)", transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Guide chapters ─── */
const chapters = [
  { id: "introduction", emoji: "\u{1F916}", title: "什么是 AI 编程", summary: "了解 AI 编程和 Vibe Coding 的概念" },
  { id: "getting-started", emoji: "\u{1F680}", title: "如何开始", summary: "选择最适合的入门工具和学习路径" },
  { id: "prompting", emoji: "\u{1F4AC}", title: "提示词技巧", summary: "编写高质量提示词的最佳实践" },
  { id: "project-setup", emoji: "\u{1F3D7}\uFE0F", title: "项目架构", summary: "如何组织前后端分离的项目" },
  { id: "debugging", emoji: "\u{1F41B}", title: "调试与问题解决", summary: "有效地调试 AI 生成的代码" },
  { id: "advanced", emoji: "\u26A1", title: "进阶技巧", summary: "MCP、A2A 等新技术和 AI Agent" },
]

function GuidePreview() {
  const sr = useScrollReveal()
  return (
    <section className="relative py-24 px-6">
      <div ref={sr.ref} className={`max-w-5xl mx-auto transition-all duration-700 ${sr.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-balance">
            {"指南"}
            <span className="gradient-text">{" 目录"}</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-pretty">
            {"6 个章节，从零到一带你入门 AI 编程"}
          </p>
        </div>
        <div className="space-y-4">
          {chapters.map((ch, i) => (
            <Link
              key={ch.id}
              href={`/guide/${ch.id}`}
              className="card-glow flex items-center gap-5 rounded-xl border border-border bg-card/50 p-5 group transition-all duration-500"
              style={{ opacity: sr.visible ? 1 : 0, transform: sr.visible ? "translateY(0)" : "translateY(20px)", transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 text-2xl shrink-0">
                {ch.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {`第 ${i + 1} 章 · ${ch.title}`}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">{ch.summary}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/guide"
            className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
          >
            {"查看完整指南"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ─── */
function CtaSection() {
  const sr = useScrollReveal()
  return (
    <section className="relative py-24 px-6">
      <div ref={sr.ref} className={`max-w-3xl mx-auto text-center transition-all duration-700 ${sr.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="rounded-2xl border border-primary/20 bg-card/30 p-12 animate-border-glow">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-balance">
            {"准备好开始了吗？"}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-pretty">
            {"AI 正在改变编程的未来，现在是最好的入场时机。"}
          </p>
          <Link
            href="/guide/introduction"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            {"从第一章开始"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─── */
const sisterSites = [
  { name: "入行 365", url: "https://ruhang365.cn" },
  { name: "入行助理", url: "https://rhzl.ruhang365.cn" },
  { name: "扫码助手", url: "https://smzdy.ruhang365.cn" },
  { name: "订阅管理", url: "https://sub.ruhang365.cn" },
  { name: "广告查询", url: "https://adpc.ruhang365.cn" },
  { name: "AI 技能库", url: "https://botskills.ruhang365.cn" },
]

function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/30">
                <Code2 className="w-4 h-4 text-primary" />
              </div>
              <span className="text-lg font-bold text-foreground">{"代码指南"}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {"入行 365 出品的 AI 编程学习指南，帮助你从零基础到独立开发，掌握 Vibe Coding 的完整路径。"}
            </p>
          </div>
          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{"快速链接"}</h4>
            <div className="space-y-2">
              {[
                { name: "指南", href: "/guide" },
                { name: "工具", href: "/tools" },
                { name: "资源", href: "/resources" },
                { name: "搜索", href: "/search" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </div>
          {/* Sister sites */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{"友情链接"}</h4>
            <div className="space-y-2">
              {sisterSites.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {s.name}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {"\u00A9 2017-2026 入行 365. All rights reserved."}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/fzy2012/ruhangcodeguide"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── Main Page ─── */
export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleCanvas />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <GuidePreview />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
