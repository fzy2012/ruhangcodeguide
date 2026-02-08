import Link from "next/link"

const friendLinks = [
  { label: "入行 365", href: "https://ruhang365.cn" },
  { label: "入行助理", href: "https://rhzl.ruhang365.cn" },
  { label: "扫码助手", href: "https://smzdy.ruhang365.cn" },
  { label: "入行订阅", href: "https://sub.ruhang365.cn" },
  { label: "广告 PC", href: "https://adpc.ruhang365.cn" },
  { label: "AI 技能库", href: "https://botskills.ruhang365.cn" },
]

const siteLinks = [
  { label: "指南", href: "/guide" },
  { label: "工具", href: "/tools" },
  { label: "资源", href: "/resources" },
  { label: "搜索", href: "/search" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
                <span className="text-sm font-bold text-primary font-mono">
                  {"</>"}
                </span>
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">代码指南</div>
                <div className="text-[10px] text-muted-foreground">
                  {"by 入行 365"}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              面向中国开发者的 AI 编程学习指南，从零基础到 Vibe Coding。
            </p>
          </div>

          {/* Site links */}
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
              导航
            </h3>
            <ul className="flex flex-col gap-2">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Friend links */}
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
              入行 365 产品
            </h3>
            <ul className="flex flex-col gap-2">
              {friendLinks.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More links */}
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
              更多
            </h3>
            <ul className="flex flex-col gap-2">
              {friendLinks.slice(4).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="mailto:ruhang365service@ruhang365.com"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  联系我们
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {"2017-2025 Ruhang365. All rights reserved."}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://ruhang365.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              入行 365
            </a>
            <span className="text-muted-foreground/30">|</span>
            <span className="text-xs text-muted-foreground">
              {"沪ICP备2024058271号-1"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
