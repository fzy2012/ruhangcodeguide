"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

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
    function resize() { canvas!.width = window.innerWidth; canvas!.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)
    for (let i = 0; i < 80; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 2 + 0.5, o: Math.random() * 0.5 + 0.1 })
    }
    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas!.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas!.height) p.vy *= -1
        ctx!.beginPath(); ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(0, 212, 255, ${p.o})`; ctx!.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 150) {
            ctx!.beginPath(); ctx!.moveTo(particles[i].x, particles[i].y); ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - d / 150)})`; ctx!.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />
}

/* ─── Typing hook ─── */
function useTyping(texts: string[], speed = 80, pause = 2000) {
  const [display, setDisplay] = useState("")
  const [idx, setIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const current = texts[idx]
    const timer = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), pause)
        else setCharIdx(charIdx + 1)
      } else {
        setDisplay(current.slice(0, charIdx))
        if (charIdx === 0) { setDeleting(false); setIdx((idx + 1) % texts.length) }
        else setCharIdx(charIdx - 1)
      }
    }, deleting ? 40 : speed)
    return () => clearTimeout(timer)
  }, [charIdx, deleting, idx, texts, speed, pause])
  return display
}

/* ─── Scroll reveal ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

/* ─── Shared inline style helpers ─── */
const s = {
  maxW: { maxWidth: 1200, margin: "0 auto", padding: "0 24px" } as React.CSSProperties,
  maxW5: { maxWidth: 960, margin: "0 auto", padding: "0 24px" } as React.CSSProperties,
  maxW3: { maxWidth: 720, margin: "0 auto", padding: "0 24px" } as React.CSSProperties,
  card: { background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)" } as React.CSSProperties,
  badge: { display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 9999, border: "1px solid hsl(187 100% 45% / 0.3)", background: "hsl(187 100% 45% / 0.05)", padding: "6px 16px" } as React.CSSProperties,
  btnPrimary: { display: "inline-flex", alignItems: "center", gap: 8, borderRadius: "var(--radius)", background: "var(--primary)", color: "var(--bg)", padding: "12px 24px", fontSize: 14, fontWeight: 500, cursor: "pointer", border: "none", textDecoration: "none" } as React.CSSProperties,
  btnSecondary: { display: "inline-flex", alignItems: "center", gap: 8, borderRadius: "var(--radius)", background: "transparent", color: "var(--fg)", padding: "12px 24px", fontSize: 14, fontWeight: 500, border: "1px solid var(--border)", cursor: "pointer", textDecoration: "none" } as React.CSSProperties,
  sectionTitle: { fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "var(--fg)", textAlign: "center" as const, marginBottom: 16, textWrap: "balance" as const },
  sectionSub: { color: "var(--fg-muted)", textAlign: "center" as const, maxWidth: 560, margin: "0 auto 48px" },
  mutedText: { color: "var(--fg-muted)", fontSize: 14 },
  smallText: { color: "var(--fg-muted)", fontSize: 12 },
  icon: { width: 48, height: 48, borderRadius: 12, background: "hsl(187 100% 45% / 0.1)", border: "1px solid hsl(187 100% 45% / 0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } as React.CSSProperties,
}

/* ─── SVG Icons (no lucide dependency issues) ─── */
const Icons = {
  Code2: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>,
  BookOpen: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Wrench: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Sparkles: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  Terminal: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>,
  ChevronRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  ArrowRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  Menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
  X: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  ExternalLink: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>,
  Github: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
  Zap: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>,
  Users: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  BookMarked: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><polyline points="10 2 10 10 13 7 16 10 16 2"/></svg>,
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => { const h = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h) }, [])
  const links = [{ label: "指南", href: "/guide" }, { label: "工具", href: "/tools" }, { label: "资源", href: "/resources" }]
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, transition: "all 0.3s", borderBottom: scrolled ? "1px solid var(--border)" : "none", background: scrolled ? "hsl(222 47% 6% / 0.7)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none" }}>
      <div style={{ ...s.maxW, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "hsl(187 100% 45% / 0.1)", border: "1px solid hsl(187 100% 45% / 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}><Icons.Code2 /></div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)" }}>{"代码指南"}</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="nav-desktop">
          {links.map(l => <Link key={l.href} href={l.href} style={{ color: "var(--fg-muted)", fontSize: 14, transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--fg-muted)")}>{l.label}</Link>)}
          <Link href="/search" style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 9999, border: "1px solid var(--border)", background: "var(--secondary)", padding: "6px 16px", fontSize: 12, color: "var(--fg-muted)" }}>
            <Icons.Search /><span>{"搜索..."}</span>
            <kbd style={{ marginLeft: 8, borderRadius: 4, border: "1px solid var(--border)", background: "var(--bg)", padding: "2px 6px", fontSize: 10, fontFamily: "var(--font-mono)" }}>{"/"}</kbd>
          </Link>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", color: "var(--fg)", cursor: "pointer", padding: 4 }} className="nav-mobile" aria-label="Toggle menu">
          {mobileOpen ? <Icons.X /> : <Icons.Menu />}
        </button>
      </div>
      {mobileOpen && (
        <div className="nav-mobile" style={{ borderTop: "1px solid var(--border)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12, background: "hsl(222 47% 6% / 0.9)", backdropFilter: "blur(12px)" }}>
          {links.map(l => <Link key={l.href} href={l.href} style={{ color: "var(--fg-muted)", fontSize: 14 }} onClick={() => setMobileOpen(false)}>{l.label}</Link>)}
          <Link href="/search" style={{ color: "var(--fg-muted)", fontSize: 14 }} onClick={() => setMobileOpen(false)}>{"搜索"}</Link>
        </div>
      )}
      <style>{`
        @media (max-width: 768px) { .nav-desktop { display: none !important; } }
        @media (min-width: 769px) { .nav-mobile { display: none !important; } }
      `}</style>
    </nav>
  )
}

/* ─── Hero ─── */
function HeroSection() {
  const typed = useTyping(["用 AI 写出你的第一行代码", "让 Cursor 帮你自动补全", "从 Vibe Coding 开始创造", "AI 编程，入行从这里开始"])
  return (
    <section className="grid-bg" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="animate-glow-pulse" style={{ position: "absolute", top: "25%", left: "25%", width: 384, height: 384, borderRadius: "50%", background: "hsl(187 100% 45% / 0.05)", filter: "blur(120px)" }} />
      <div className="animate-glow-pulse" style={{ position: "absolute", bottom: "25%", right: "25%", width: 320, height: 320, borderRadius: "50%", background: "hsl(199 89% 48% / 0.05)", filter: "blur(100px)", animationDelay: "2s" }} />
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <div className="animate-fade-up" style={s.badge}>
          <span style={{ color: "var(--primary)" }}><Icons.Sparkles /></span>
          <span style={{ fontSize: 12, color: "var(--primary)", fontWeight: 500 }}>{"入行 365 出品"}</span>
        </div>
        <h1 className="animate-fade-up" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 700, marginTop: 32, marginBottom: 24, lineHeight: 1.1, animationDelay: "0.1s" }}>
          <span className="gradient-text">{"AI 编程"}</span><br />
          <span style={{ color: "var(--fg)" }}>{"学习指南"}</span>
        </h1>
        <p className="animate-fade-up" style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "var(--fg-muted)", marginBottom: 16, maxWidth: 640, margin: "0 auto 16px", animationDelay: "0.2s" }}>
          {"从零基础到独立开发，掌握 Vibe Coding 的完整路径。"}<br />{"用 AI 把你的想法变成现实。"}
        </p>
        <div className="animate-fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: "var(--radius)", border: "1px solid var(--border)", background: "hsl(222 47% 6% / 0.8)", padding: "12px 20px", fontFamily: "var(--font-mono)", fontSize: 14, marginBottom: 40, animationDelay: "0.3s" }}>
          <span style={{ color: "var(--primary)" }}><Icons.Terminal /></span>
          <span style={{ color: "hsl(187 100% 45% / 0.7)" }}>{">"}</span>
          <span style={{ color: "var(--fg)" }}>{typed}</span>
          <span className="animate-pulse" style={{ color: "var(--primary)" }}>{"_"}</span>
        </div>
        <div className="animate-fade-up" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 16, animationDelay: "0.4s" }}>
          <Link href="/guide" style={s.btnPrimary}><Icons.BookOpen />{"开始阅读"}</Link>
          <Link href="/tools" style={s.btnSecondary}><Icons.Wrench />{"工具推荐"}</Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Features ─── */
const features = [
  { icon: Icons.BookOpen, title: "6 章系统指南", desc: "从入门到进阶，覆盖 AI 编程完整流程" },
  { icon: Icons.Wrench, title: "22+ 精选工具", desc: "编辑器、CLI、Web 应用一网打尽" },
  { icon: Icons.BookMarked, title: "15+ 学习资源", desc: "精选文章、视频、课程和文档" },
  { icon: Icons.Search, title: "全文搜索", desc: "快速找到你需要的任何内容" },
  { icon: Icons.Zap, title: "实战导向", desc: "提示词技巧、项目架构、调试方法" },
  { icon: Icons.Users, title: "入行 365 社区", desc: "加入学习社区，与同行者交流成长" },
]

function FeaturesSection() {
  const sr = useScrollReveal()
  return (
    <section style={{ padding: "96px 24px" }}>
      <div ref={sr.ref} style={{ ...s.maxW, transition: "all 0.7s", opacity: sr.visible ? 1 : 0, transform: sr.visible ? "translateY(0)" : "translateY(32px)" }}>
        <h2 style={s.sectionTitle}>{"为什么选择"}<span className="gradient-text">{" 代码指南"}</span></h2>
        <p style={s.sectionSub}>{"入行 365 团队精心整理，让你在 AI 编程的世界少走弯路"}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="card-glow" style={{ ...s.card, padding: 24, transition: "all 0.5s", opacity: sr.visible ? 1 : 0, transform: sr.visible ? "translateY(0)" : "translateY(20px)", transitionDelay: `${i * 100}ms` }}>
                <div style={{ ...s.icon, marginBottom: 16, color: "var(--primary)" }}><Icon /></div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--fg)", marginBottom: 8 }}>{f.title}</h3>
                <p style={s.mutedText}>{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Guide Chapters ─── */
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
    <section style={{ padding: "96px 24px" }}>
      <div ref={sr.ref} style={{ ...s.maxW5, transition: "all 0.7s", opacity: sr.visible ? 1 : 0, transform: sr.visible ? "translateY(0)" : "translateY(32px)" }}>
        <h2 style={s.sectionTitle}>{"指南"}<span className="gradient-text">{" 目录"}</span></h2>
        <p style={s.sectionSub}>{"6 个章节，从零到一带你入门 AI 编程"}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {chapters.map((ch, i) => (
            <Link key={ch.id} href={`/guide/${ch.id}`} className="card-glow" style={{ ...s.card, display: "flex", alignItems: "center", gap: 20, padding: 20, opacity: sr.visible ? 1 : 0, transform: sr.visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s", transitionDelay: `${i * 80}ms` }}>
              <div style={{ ...s.icon, fontSize: 24 }}>{ch.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 600, color: "var(--fg)", marginBottom: 4 }}>{`第 ${i + 1} 章 \u00B7 ${ch.title}`}</h3>
                <p style={s.mutedText}>{ch.summary}</p>
              </div>
              <span style={{ color: "var(--fg-muted)", flexShrink: 0 }}><Icons.ChevronRight /></span>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link href="/guide" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--primary)", fontSize: 14, fontWeight: 500 }}>
            {"查看完整指南"}<Icons.ArrowRight />
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
    <section style={{ padding: "96px 24px" }}>
      <div ref={sr.ref} style={{ ...s.maxW3, textAlign: "center", transition: "all 0.7s", opacity: sr.visible ? 1 : 0, transform: sr.visible ? "translateY(0)" : "translateY(32px)" }}>
        <div className="animate-border-glow" style={{ borderRadius: 16, border: "1px solid hsl(187 100% 45% / 0.2)", background: "hsl(222 47% 6% / 0.3)", padding: 48 }}>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "var(--fg)", marginBottom: 16 }}>{"准备好开始了吗？"}</h2>
          <p style={{ color: "var(--fg-muted)", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>{"AI 正在改变编程的未来，现在是最好的入场时机。"}</p>
          <Link href="/guide/introduction" style={s.btnPrimary}>{"从第一章开始"}<Icons.ArrowRight /></Link>
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
    <footer style={{ borderTop: "1px solid var(--border)", background: "hsl(222 47% 6% / 0.3)", padding: "64px 24px" }}>
      <div style={s.maxW}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "hsl(187 100% 45% / 0.1)", border: "1px solid hsl(187 100% 45% / 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}><Icons.Code2 /></div>
              <span style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)" }}>{"代码指南"}</span>
            </div>
            <p style={{ ...s.mutedText, lineHeight: 1.6 }}>{"入行 365 出品的 AI 编程学习指南，帮助你从零基础到独立开发，掌握 Vibe Coding 的完整路径。"}</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, color: "var(--fg)", marginBottom: 16 }}>{"快速链接"}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ name: "指南", href: "/guide" }, { name: "工具", href: "/tools" }, { name: "资源", href: "/resources" }, { name: "搜索", href: "/search" }].map(l => (
                <Link key={l.href} href={l.href} style={s.mutedText}>{l.name}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, color: "var(--fg)", marginBottom: 16 }}>{"友情链接"}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sisterSites.map(si => (
                <a key={si.url} href={si.url} target="_blank" rel="noopener noreferrer" style={{ ...s.mutedText, display: "flex", alignItems: "center", gap: 6 }}>
                  {si.name}<Icons.ExternalLink />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 32, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <p style={s.smallText}>{"\u00A9 2017-2026 入行 365. All rights reserved."}</p>
          <a href="https://github.com/fzy2012/ruhangcodeguide" target="_blank" rel="noopener noreferrer" style={{ color: "var(--fg-muted)" }} aria-label="GitHub"><Icons.Github /></a>
        </div>
      </div>
    </footer>
  )
}

/* ─── Main ─── */
export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative" }}>
      <ParticleCanvas />
      <Navbar />
      <main style={{ position: "relative", zIndex: 10 }}>
        <HeroSection />
        <FeaturesSection />
        <GuidePreview />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
