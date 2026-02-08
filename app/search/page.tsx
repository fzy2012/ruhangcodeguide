"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import {
  Search as SearchIcon,
  BookOpen,
  Wrench,
  BookMarked,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react"
import { search, type SearchResult } from "@/lib/api"

const typeIcons: Record<string, typeof BookOpen> = {
  guide: BookOpen,
  tool: Wrench,
  resource: BookMarked,
}

const typeLabels: Record<string, string> = {
  guide: "指南",
  tool: "工具",
  resource: "资源",
}

const typeColors: Record<string, string> = {
  guide: "text-primary bg-primary/10 border-primary/20",
  tool: "text-chart-3 bg-chart-3/10 border-chart-3/20",
  resource: "text-accent bg-accent/10 border-accent/20",
}

const suggestions = [
  "Cursor",
  "提示词",
  "Vibe Coding",
  "Claude Code",
  "调试",
  "MCP",
  "v0",
  "Bolt",
]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Keyboard shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === "Escape") {
        setQuery("")
        inputRef.current?.blur()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  const performSearch = useCallback(async (q: string) => {
    if (q.trim().length < 1) {
      setResults([])
      setHasSearched(false)
      return
    }
    setLoading(true)
    setHasSearched(true)
    try {
      const data = await search(q)
      setResults(data)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced search
  const handleInput = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => performSearch(value), 300)
  }

  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case "guide":
        return `/guide/${result.id}`
      case "tool":
        return result.url || `/tools`
      case "resource":
        return result.url || `/resources`
      default:
        return "/"
    }
  }

  const isExternal = (result: SearchResult) =>
    result.type === "tool" || result.type === "resource"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border">
        <div className="grid-bg absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-6 pt-28 pb-12">
          <span className="inline-block text-xs font-medium text-primary border border-primary/20 bg-primary/5 px-3 py-1 rounded-full mb-4">
            全站搜索
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            搜索
          </h1>
          <p className="mt-3 text-muted-foreground text-pretty">
            在指南、工具和资源中快速找到你需要的内容。
          </p>

          {/* Search input */}
          <div className="mt-8 relative">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-4 h-5 w-5 text-muted-foreground/50 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                placeholder="搜索指南、工具、资源..."
                value={query}
                onChange={(e) => handleInput(e.target.value)}
                className="w-full rounded-xl border border-border bg-card/80 pl-12 pr-12 py-4 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-base"
                aria-label="搜索内容"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("")
                    setResults([])
                    setHasSearched(false)
                    inputRef.current?.focus()
                  }}
                  className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="清除搜索"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Keyboard hint */}
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground/40">
              <kbd className="rounded border border-border bg-secondary/50 px-1.5 py-0.5 font-mono text-[10px]">
                /
              </kbd>
              <span>聚焦搜索</span>
              <kbd className="rounded border border-border bg-secondary/50 px-1.5 py-0.5 font-mono text-[10px]">
                ESC
              </kbd>
              <span>清除</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Suggestions */}
        {!hasSearched && (
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-4">
              热门搜索
            </h2>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setQuery(s)
                    performSearch(s)
                  }}
                  className="rounded-lg border border-border bg-card/50 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        )}

        {/* Results */}
        {hasSearched && !loading && results.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-4">
              找到 {results.length} 个结果
            </h2>
            <div className="flex flex-col gap-3">
              {results.map((result, i) => {
                const Icon = typeIcons[result.type] || BookOpen
                const label = typeLabels[result.type] || result.type
                const colorClass = typeColors[result.type] || typeColors.guide
                const link = getResultLink(result)
                const external = isExternal(result)

                const content = (
                  <div
                    className="card-glow group flex items-start gap-4 rounded-xl border border-border bg-card/50 p-5 transition-all cursor-pointer"
                    style={{
                      animationDelay: `${i * 50}ms`,
                    }}
                  >
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border ${colorClass} transition-colors`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${colorClass}`}
                        >
                          {label}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {result.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {result.snippet}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/30 group-hover:text-primary transition-colors mt-1" />
                  </div>
                )

                return external ? (
                  <a
                    key={result.id}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                ) : (
                  <Link key={result.id} href={link}>
                    {content}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* No results */}
        {hasSearched && !loading && results.length === 0 && (
          <div className="text-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/50 mx-auto mb-4">
              <SearchIcon className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground">
              {'没有找到与 "'}
              <span className="text-foreground font-medium">{query}</span>
              {'" 相关的结果'}
            </p>
            <p className="text-sm text-muted-foreground/60 mt-2">
              试试其他关键词，或浏览我们的指南和工具
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
