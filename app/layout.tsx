import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "代码指南 - 入行 365",
  description: "AI 编程学习指南",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
