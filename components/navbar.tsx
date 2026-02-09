"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Search } from "lucide-react"

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/guide", label: "指南" },
  { href: "/tools", label: "工具" },
  { href: "/resources", label: "资源" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30 group-hover:border-primary/60 transition-colors">
            <span className="text-sm font-bold text-primary font-mono">
              {"</>"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground leading-none">
              代码指南
            </span>
            <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
              {"by 入行 365"}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/search"
            className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/30 transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            <span>搜索...</span>
            <kbd className="ml-2 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">
              /
            </kbd>
          </Link>
          <a
            href="https://ruhang365.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            加入入行 365
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-border animate-fade-in">
          <div className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/search"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-muted-foreground"
              >
                <Search className="h-4 w-4" />
                搜索
              </Link>
              <a
                href="https://ruhang365.cn"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-primary px-4 py-2.5 text-sm text-center font-medium text-primary-foreground"
              >
                加入入行 365
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
