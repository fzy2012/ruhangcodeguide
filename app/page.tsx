"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Sparkles,
  Terminal,
  BookOpen,
  Wrench,
  BookMarked,
  Search,
  Zap,
  Users,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from "lucide-react"

/* ─── Particle Canvas ─── */
function ParticleBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const raf = useRef(0)
  const mouse = useRef({ x: -1000, y: -1000 })

  interface P { x: number; y: number; vx: number; vy: number; s: number; o: number; h: number }

  const make = useCallback((w: number, h: number): P[] => {
    const n = Math.min(60, Math.floor((w * h) / 20000))
    return Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      s: Math.random() * 2 + 0.5, o: Math.random() * 0.5 + 0.1,
      h: 187 + Math.random() * 30,
    }))
  }, [])

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext("2d")
    if (!ctx) return
    let ps: P[] = []
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; ps = make(c.width, c.height) }
    resize()
    window.addEventListener("resize", resize)
    const onM = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener("mousemove", onM)
    const loop = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > c.width) p.vx *= -1
        if (p.y < 0 || p.y > c.height) p.vy *= -1
        const dx = mouse.current.x - p.x, dy = mouse.current.y - p.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 200) { const f = (200 - d) / 200; p.vx += (dx / d) * f * 0.02; p.vy += (dy / d) * f * 0.02 }
        p.vx *= 0.99; p.vy *= 0.99
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.h},100%,60%,${p.o})`; ctx.fill()
      }
      for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
        const a = ps[i], b = ps[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy)
        if (d < 150) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = `hsla(187,100%,50%,${0.15 * (1 - d / 150)})`; ctx.lineWidth = 0.5; ctx.stroke() }
      }
      raf.current = requestAnimationFrame(loop)
    }
    loop()
    return () => { window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onM); cancelAnimationFrame(raf.current) }
  }, [make])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
}

/* ─── Scroll Reveal Hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.add("scroll-hidden")
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.remove("scroll-hidden"); el.classList.add("scroll-visible"); obs.unobserve(el) } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ─── Nav ─── */
const navLinks = [
  { label: "指南", href: "/guide" },
  { label: "工具", href: "/tools" },
  { label: "资源", href: "/resources" },
  { label: "搜索", href: "/search" },
]

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", h, { passive: true })
    return () => window.removeEventListener("scroll", h)
  }, [])
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-border/50" : ""}`}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30 group-hover:bg-primary/20 transition-colors">
            <Terminal className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold text-foreground text-sm">{"代码指南"}</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50">{l.label}</Link>
          ))}
          <a href="https://ruhang365.cn" target="_blank" rel="noopener noreferrer" className="ml-3 flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
            {"入行 365"}<ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <button className="md:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden glass border-t border-border/50 px-6 py-4">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-sm text-muted-foreground hover:text-foreground border-b border-border/30">{l.label}</Link>
          ))}
          <a href="https://ruhang365.cn" target="_blank" rel="noopener noreferrer" className="block py-3 text-sm text-primary">{"入行 365"}</a>
        </div>
      )}
    </header>
  )
}

/* ─── Hero ─── */
const codeLines = [
  '> cursor "创建一个待办应用"',
  "正在分析需求...",
  "生成 TodoApp 组件 ...",
  "添加数据持久化 ...",
  "配置样式和动画 ...",
  "项目已就绪!",
]

function Hero() {
  const [line, setLine] = useState(0)
  const [text, setText] = useState("")
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    if (line >= codeLines.length) {
      const t = setTimeout(() => { setLine(0); setText(""); setTyping(true) }, 3000)
      return () => clearTimeout(t)
    }
    const src = codeLines[line]
    let ci = 0; setTyping(true)
    const iv = setInterval(() => {
      if (ci < src.length) { setText(src.slice(0, ci + 1)); ci++ }
      else { setTyping(false); clearInterval(iv); setTimeout(() => { setLine(p => p + 1); setText("") }, 800) }
    }, 40)
    return () => clearInterval(iv)
  }, [line])

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="grid-bg absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full animate-glow-pulse" style={{ background: "radial-gradient(circle, hsla(187,100%,45%,0.08) 0%, transparent 70%)" }} aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">{"入行 365 出品"}</span>
        </div>
        <h1 className="animate-fade-up text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl leading-tight text-balance">
          <span className="text-foreground">{"AI 编程"}</span><br />
          <span className="gradient-text glow-text">{"从入门到实战"}</span>
        </h1>
        <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty" style={{ animationDelay: "200ms" }}>
          {"掌握 Cursor、v0、Claude Code 等 AI 工具，学会提示词技巧，"}<br className="hidden sm:inline" />
          {"从零基础到 Vibe Coding，开启你的 AI 编程之旅。"}
        </p>
        <div className="animate-fade-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: "400ms" }}>
          <Link href="/guide" className="group flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20">
            {"开始学习"}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/tools" className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 px-6 py-3 text-sm font-medium text-foreground hover:border-primary/30 hover:bg-secondary/50 transition-all">
            <Terminal className="h-4 w-4" />{"探索工具"}
          </Link>
        </div>
        {/* Terminal */}
        <div className="animate-fade-up mx-auto mt-16 max-w-lg" style={{ animationDelay: "600ms" }}>
          <div className="overflow-hidden rounded-xl border border-border bg-card/80 shadow-2xl shadow-primary/5">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-chart-3/60" />
              <div className="h-3 w-3 rounded-full bg-primary/60" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">terminal</span>
            </div>
            <div className="px-4 py-4 font-mono text-xs sm:text-sm min-h-[180px]">
              {codeLines.slice(0, line).map((l, i) => (
                <div key={i} className={`mb-1 ${l.startsWith(">") ? "text-primary" : l.includes("...") ? "text-chart-3" : "text-muted-foreground"}`}>{l}</div>
              ))}
              {line < codeLines.length && (
                <div className={codeLines[line]?.startsWith(">") ? "text-primary" : "text-muted-foreground"}>
                  {text}{typing && <span className="inline-block w-2 h-4 ml-0.5 bg-primary/80 animate-pulse" />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
        <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
          <span className="text-xs">{"向下滚动"}</span>
          <div className="h-8 w-5 rounded-full border border-muted-foreground/30 flex items-start justify-center p-1">
            <div className="h-2 w-1 rounded-full bg-primary animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Features ─── */
const feats = [
  { icon: BookOpen, t: "系统化学习路径", d: "从 AI 编程概念到进阶技巧，6 大章节覆盖完整学习链路" },
  { icon: Wrench, t: "20+ 工具推荐", d: "编辑器、CLI、Web 应用、Agent 一站式工具对比与推荐" },
  { icon: BookMarked, t: "精选学习资源", d: "文章、视频、课程、文档，经过筛选的高质量学习材料" },
  { icon: Search, t: "全站搜索", d: "快速找到你需要的指南章节、工具或资源" },
  { icon: Zap, t: "提示词技巧", d: "学习编写高质量 Prompt，让 AI 更好地理解你的需求" },
  { icon: Users, t: "入行 365 社区", d: "加入中国领先的入行成长型社区，获取持续支持" },
]

function Features() {
  const ref = useReveal()
  return (
    <section className="relative px-6 py-24 md:py-32" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-medium text-primary border border-primary/20 bg-primary/5 px-3 py-1 rounded-full mb-4">{"核心功能"}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">{"你需要的，"}<span className="gradient-text">{"这里都有"}</span></h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-pretty">{"从学习路径到实战工具，为你的 AI 编程之旅提供全方位支持"}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {feats.map((f, i) => { const I = f.icon; return (
            <div key={f.t} className="card-glow group rounded-xl border border-border bg-card/50 p-6 transition-all" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <I className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{f.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
            </div>
          ) })}
        </div>
      </div>
    </section>
  )
}

/* ─── Guide Preview ─── */
const chapters = [
  { id: 1, title: "什么是 AI 编程？", desc: "了解 AI 编程的概念、发展和核心理念" },
  { id: 2, title: "AI 编程工具", desc: "Cursor、v0、Windsurf 等主流工具介绍" },
  { id: 3, title: "提示词工程", desc: "学会写出让 AI 精准理解的高质量 Prompt" },
  { id: 4, title: "Vibe Coding 实战", desc: "从需求到产品，完整的 AI 开发工作流" },
  { id: 5, title: "进阶技巧", desc: "调试、优化、团队协作的进阶方法" },
  { id: 6, title: "未来展望", desc: "AI 编程的发展趋势和职业规划" },
]

function GuideCards() {
  const ref = useReveal()
  return (
    <section className="relative px-6 py-24 md:py-32" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-medium text-primary border border-primary/20 bg-primary/5 px-3 py-1 rounded-full mb-4">{"学习路径"}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">{"6 大章节，"}<span className="gradient-text">{"系统学习"}</span></h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-pretty">{"从概念到实战，循序渐进掌握 AI 编程"}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((ch, i) => (
            <Link key={ch.id} href={`/guide/${ch.id}`} className="card-glow group rounded-xl border border-border bg-card/50 p-6 transition-all block" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-xs font-bold text-primary font-mono">{String(ch.id).padStart(2, "0")}</span>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{ch.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{ch.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                {"开始阅读"}<ChevronRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/guide" className="inline-flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4">
            {"查看完整指南"}<ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ─── */
function Cta() {
  const ref = useReveal()
  return (
    <section className="relative px-6 py-24 md:py-32" ref={ref}>
      <div className="relative mx-auto max-w-3xl text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full animate-glow-pulse" style={{ background: "radial-gradient(circle, hsla(187,100%,45%,0.06) 0%, transparent 70%)" }} aria-hidden="true" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">{"准备好开启"}<span className="gradient-text">{" AI 编程之旅"}</span>{"了吗？"}</h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-pretty">{"加入入行 365 社区，与志同道合的伙伴一起学习成长。从零基础到 Vibe Coding，我们陪你每一步。"}</p>
          <div className="mt-8">
            <a href="https://ruhang365.cn" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20">
              {"立即加入入行 365"}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─── */
const friendLinks = [
  { name: "入行 365", url: "https://ruhang365.cn" },
  { name: "入行知了", url: "https://rhzl.ruhang365.cn" },
  { name: "扫码直达", url: "https://smzdy.ruhang365.cn" },
  { name: "AI 技能库", url: "https://botskills.ruhang365.cn" },
]
const productLinks = [
  { name: "入行订阅", url: "https://sub.ruhang365.cn" },
  { name: "广告 PC", url: "https://adpc.ruhang365.cn" },
]

function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
                <Terminal className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-bold text-foreground text-sm">{"代码指南"}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{"入行 365 出品的 AI 编程学习指南，从零基础到 Vibe Coding。"}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">{"友情链接"}</h4>
            <ul className="space-y-2">
              {friendLinks.map(l => (
                <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">{l.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">{"产品矩阵"}</h4>
            <ul className="space-y-2">
              {productLinks.map(l => (
                <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">{l.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">{"快速导航"}</h4>
            <ul className="space-y-2">
              {navLinks.map(l => (
                <li key={l.href}><Link href={l.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">{"2017-2026 Ruhang365. All rights reserved."}</p>
          <p className="text-xs text-muted-foreground">{"Made with AI by 入行 365"}</p>
        </div>
      </div>
    </footer>
  )
}

/* ─── Page ─── */
export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-background">
      <ParticleBg />
      <Nav />
      <main>
        <Hero />
        <Features />
        <GuideCards />
        <Cta />
      </main>
      <SiteFooter />
    </div>
  )
}
