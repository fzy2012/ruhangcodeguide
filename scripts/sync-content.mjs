#!/usr/bin/env node
/**
 * 构建前同步脚本：将 backend/app/data/*.yaml 自动转换为 lib/*-data.ts
 *
 * 运行方式：node scripts/sync-content.mjs
 * 自动触发：pnpm build（通过 prebuild 钩子）
 */

import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import yaml from "js-yaml"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")
const dataDir = resolve(root, "backend/app/data")
const libDir = resolve(root, "lib")

function readYaml(file) {
  const content = readFileSync(resolve(dataDir, file), "utf-8")
  return yaml.load(content) ?? []
}

function jsonValue(v) {
  return JSON.stringify(v, null, 2).replace(/^/gm, "  ").trimStart()
}

// ── tools ──────────────────────────────────────────────────────────────
function syncTools() {
  const tools = readYaml("tools.yaml")
  const items = tools
    .map(
      (t) => `  {
    id: ${JSON.stringify(t.id)},
    name: ${JSON.stringify(t.name)},
    description: ${JSON.stringify(t.description)},
    url: ${JSON.stringify(t.url)},
    category: ${JSON.stringify(t.category)},
    is_free: ${t.is_free},
    tags: ${JSON.stringify(t.tags)},
  }`
    )
    .join(",\n")

  const output = `// AUTO-GENERATED — do not edit directly. Edit backend/app/data/tools.yaml instead.
export interface Tool {
  id: string
  name: string
  description: string
  url: string
  category: string
  is_free: boolean
  tags: string[]
}

export const toolsData: Tool[] = [
${items},
]
`
  writeFileSync(resolve(libDir, "tools-data.ts"), output)
  console.log(`✓ tools-data.ts  (${tools.length} tools)`)
}

// ── resources ──────────────────────────────────────────────────────────
function syncResources() {
  const resources = readYaml("resources.yaml")
  const items = resources
    .map(
      (r) => `  {
    id: ${JSON.stringify(r.id)},
    title: ${JSON.stringify(r.title)},
    description: ${JSON.stringify(r.description)},
    url: ${JSON.stringify(r.url)},
    type: ${JSON.stringify(r.type)},
    author: ${JSON.stringify(r.author ?? null)},
    tags: ${JSON.stringify(r.tags)},
  }`
    )
    .join(",\n")

  const output = `// AUTO-GENERATED — do not edit directly. Edit backend/app/data/resources.yaml instead.
export interface Resource {
  id: string
  title: string
  description: string
  url: string
  type: string
  author?: string | null
  tags: string[]
}

export const resourcesData: Resource[] = [
${items},
]
`
  writeFileSync(resolve(libDir, "resources-data.ts"), output)
  console.log(`✓ resources-data.ts  (${resources.length} resources)`)
}

// ── guide ──────────────────────────────────────────────────────────────
function syncGuide() {
  const sections = readYaml("guide.yaml")

  function renderSubsections(subsections) {
    if (!subsections?.length) return "[]"
    const items = subsections
      .map(
        (s) => `      {
        id: ${JSON.stringify(s.id)},
        title: ${JSON.stringify(s.title)},
        content: ${JSON.stringify(s.content ?? "")},
      }`
      )
      .join(",\n")
    return `[\n${items},\n    ]`
  }

  function renderKeyPoints(kp) {
    if (!kp?.length) return "[]"
    return JSON.stringify(kp)
  }

  const items = sections
    .map(
      (s) => `  {
    id: ${JSON.stringify(s.id)},
    title: ${JSON.stringify(s.title)},
    summary: ${JSON.stringify(s.summary ?? "")},
    order: ${s.order ?? 0},
    key_points: ${renderKeyPoints(s.key_points)},
    subsections: ${renderSubsections(s.subsections)},
  }`
    )
    .join(",\n")

  const output = `// AUTO-GENERATED — do not edit directly. Edit backend/app/data/guide.yaml instead.
export interface GuideSubsection {
  id: string
  title: string
  content: string
}

export interface GuideSection {
  id: string
  title: string
  summary: string
  order: number
  key_points: string[]
  subsections: GuideSubsection[]
}

export const guideData: GuideSection[] = [
${items},
]
`
  writeFileSync(resolve(libDir, "guide-data.ts"), output)
  console.log(`✓ guide-data.ts  (${sections.length} sections)`)
}

// ── run ────────────────────────────────────────────────────────────────
try {
  syncTools()
  syncResources()
  syncGuide()
  console.log("Content sync complete.")
} catch (err) {
  console.error("sync-content failed:", err.message)
  process.exit(1)
}
