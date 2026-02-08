import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "搜索 - 代码指南 | 入行 365",
  description: "在指南、工具和资源中快速搜索你需要的内容",
}

export default function SearchLayout({
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
