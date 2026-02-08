import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  title: "代码指南 - 入行 365 | AI 编程学习指南",
  description:
    "面向中国开发者的 AI 编程学习指南，从零基础到 Vibe Coding，掌握 AI 编程工具与技巧。入行 365 出品。",
  keywords: [
    "AI编程",
    "Vibe Coding",
    "Cursor",
    "AI开发",
    "入行365",
    "代码指南",
    "人工智能",
    "编程学习",
  ],
  authors: [{ name: "入行 365" }],
  openGraph: {
    title: "代码指南 - 入行 365",
    description: "面向中国开发者的 AI 编程学习指南",
    type: "website",
    locale: "zh_CN",
    url: "https://ruhangcodeguide.ruhang365.cn",
    siteName: "入行 365 代码指南",
  },
}

export const viewport: Viewport = {
  themeColor: "#00d4ff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
