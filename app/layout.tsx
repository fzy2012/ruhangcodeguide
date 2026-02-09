import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  title: "代码指南 - 入行 365 | AI 编程学习平台",
  description:
    "入行 365 出品的 AI 编程学习指南，帮助你从零开始掌握 Vibe Coding，成为 AI 时代的开发者。",
  icons: { icon: "/logo-square.png", apple: "/logo-square.png" },
  openGraph: {
    title: "代码指南 - 入行 365",
    description: "从零基础到独立开发，掌握 AI 编程的完整路径",
    images: ["/logo-banner.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${jetbrains.variable}`}>
      <body style={{ fontFamily: "var(--font-sans)" }}>
        {children}
      </body>
    </html>
  )
}
