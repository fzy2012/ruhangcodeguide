import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI 工具推荐 - 代码指南 | 入行 365",
  description: "精选 20+ 款 AI 编程工具推荐，涵盖编辑器、CLI、Web 应用、Agent 等类别",
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
