"use client"

import { useMemo } from "react"

/**
 * Simple Markdown-like renderer for guide content.
 * Handles headings, bold, inline code, code blocks, links, lists, and blockquotes.
 */
export function MarkdownContent({ content }: { content: string }) {
  const html = useMemo(() => renderMarkdown(content), [content])

  return (
    <div
      className="prose-custom"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function renderMarkdown(md: string): string {
  let html = md

  // Code blocks ``` ... ```
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_match, _lang, code) =>
      `<pre class="code-block"><code>${escapeHtml(code.trim())}</code></pre>`
  )

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="inline-code">$1</code>'
  )

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="md-link">$1</a>'
  )

  // Blockquotes
  html = html.replace(
    /^> (.+)$/gm,
    '<blockquote class="md-blockquote">$1</blockquote>'
  )

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li class="md-li">$1</li>')
  html = html.replace(
    /(<li class="md-li">.*<\/li>(\n|$))+/g,
    (match) => `<ul class="md-ul">${match}</ul>`
  )

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="md-oli">$1</li>')
  html = html.replace(
    /(<li class="md-oli">.*<\/li>(\n|$))+/g,
    (match) => `<ol class="md-ol">${match}</ol>`
  )

  // Paragraphs (lines that don't start with an HTML tag)
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ""
      if (trimmed.startsWith("<")) return trimmed
      return `<p class="md-p">${trimmed}</p>`
    })
    .join("\n")

  return html
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}
