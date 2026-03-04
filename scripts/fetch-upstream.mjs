#!/usr/bin/env node
/**
 * fetch-upstream.mjs
 *
 * 从上游仓库拉取内容，转换为本项目的 YAML 格式。
 * 运行方式：node scripts/fetch-upstream.mjs
 * 依赖：js-yaml（已在 devDependencies 中）
 */

import { writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"
import yaml from "js-yaml"

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = resolve(__dirname, "../backend/app/data")

const UPSTREAM = "2025Emma/vibe-coding-cn"
const RAW_BASE = `https://raw.githubusercontent.com/${UPSTREAM}/main`
const API_BASE = `https://api.github.com/repos/${UPSTREAM}/contents`

// 跳过这些文件名
const SKIP_FILES = new Set(["index.md", "README.md", "readme.md"])

// 上游目录 → 指南章节的映射
const GUIDE_SECTIONS = [
  {
    id: "methodology",
    title: "方法论与原则",
    emoji: "📐",
    summary: "AI 辅助编程的核心方法论，帮助你建立系统化的编程思维。",
    path: "i18n/zh/documents/Methodology and Principles",
  },
  {
    id: "templates",
    title: "模板与资源",
    emoji: "📋",
    summary: "可复用的代码架构模板、工具集与书单推荐。",
    path: "i18n/zh/documents/Templates and Resources",
  },
  {
    id: "coding-prompts",
    title: "编程提示词",
    emoji: "💬",
    summary: "精选的 AI 编程提示词，覆盖架构设计、代码质量、任务分解等场景。",
    path: "i18n/zh/prompts/coding_prompts",
  },
]

// ─── 工具函数 ────────────────────────────────────────────────────────────────

/** 用 curl 发 GET 请求，返回字符串响应体（兼容沙箱环境） */
function curlGet(url, extraHeaders = []) {
  const headerArgs = [
    `-H "User-Agent: ruhangcodeguide-sync/1.0"`,
    ...extraHeaders.map((h) => `-H "${h}"`),
  ].join(" ")
  const cmd = `curl -sL --max-time 30 ${headerArgs} "${url}"`
  return execSync(cmd, { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 })
}

function apiGet(path) {
  const headers = ["Accept: application/vnd.github.v3+json"]
  if (process.env.GITHUB_TOKEN) {
    headers.push(`Authorization: Bearer ${process.env.GITHUB_TOKEN}`)
  }
  const encoded = path
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/")
  const body = curlGet(`${API_BASE}/${encoded}`, headers)
  return JSON.parse(body)
}

function fetchRaw(repoPath) {
  const encoded = repoPath
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/")
  return curlGet(`${RAW_BASE}/${encoded}`)
}

/** 从文件名生成稳定的 kebab-case ID */
function toId(filename) {
  return (
    filename
      .replace(/\.md$/, "")
      // 去掉 (1,1)_ 形式的前缀
      .replace(/^\(\d+,\d+\)[_\s]*/, "")
      // 去掉开头的 # { 等特殊符号
      .replace(/^[#{\s_]+/, "")
      // 将非字母数字（包括中文）转为连字符
      .replace(/[^\w\u4e00-\u9fff]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase()
      .slice(0, 60)
  )
}

/** 从 markdown 内容提取标题（第一个 # 行） */
function extractTitle(content, fallbackFilename) {
  const m = content.match(/^#{1,3}\s+(.+)/m)
  if (m) {
    return m[1]
      .replace(/[*_`]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 100)
  }
  // 用文件名做 fallback
  return fallbackFilename
    .replace(/\.md$/, "")
    .replace(/^\(\d+,\d+\)[_\s]*/, "")
    .replace(/[_-]+/g, " ")
    .trim()
    .slice(0, 100)
}

/** 提取第一段非标题文字作为摘要 */
function extractSummary(content) {
  const lines = content.split("\n")
  for (const line of lines) {
    const t = line.trim()
    if (t && !t.startsWith("#") && !t.startsWith("---") && !t.startsWith("```") && t.length > 15) {
      return t
        .replace(/[*_`[\]()]/g, "")
        .slice(0, 120)
        .trim()
    }
  }
  return ""
}

// ─── 核心逻辑 ────────────────────────────────────────────────────────────────

function listMdFiles(dirPath) {
  const items = apiGet(dirPath)
  return items.filter(
    (item) => item.type === "file" && item.name.endsWith(".md") && !SKIP_FILES.has(item.name)
  )
}

function buildSection(meta, order) {
  console.log(`\n  [${meta.title}]`)
  const files = listMdFiles(meta.path)
  const subsections = []

  for (const file of files) {
    console.log(`    ← ${file.name}`)
    const content = fetchRaw(`${meta.path}/${file.name}`)
    subsections.push({
      id: toId(file.name),
      title: extractTitle(content, file.name),
      content: content.trim(),
    })
  }

  return {
    id: meta.id,
    title: meta.title,
    emoji: meta.emoji,
    order,
    summary: meta.summary,
    content: "",
    subsections,
  }
}

function main() {
  console.log("Fetching upstream content from", UPSTREAM)

  const guide = []
  for (let i = 0; i < GUIDE_SECTIONS.length; i++) {
    const section = buildSection(GUIDE_SECTIONS[i], i + 1)
    guide.push(section)
    console.log(`    ✓ ${section.subsections.length} subsections`)
  }

  writeFileSync(
    resolve(dataDir, "guide.yaml"),
    yaml.dump(guide, { lineWidth: 2000, indent: 2, quotingType: '"' }),
    "utf-8"
  )

  const total = guide.reduce((n, s) => n + s.subsections.length, 0)
  console.log(`\n✓ guide.yaml updated — ${guide.length} sections, ${total} subsections`)
}

try {
  main()
} catch (err) {
  console.error("\nfetch-upstream failed:", err.message)
  process.exit(1)
}
