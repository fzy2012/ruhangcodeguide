"use client"

import { MarkdownContent } from "@/components/markdown-content"

interface Subsection {
  id: string
  title: string
  content: string
}

export function GuideContentClient({
  content,
  subsections,
}: {
  content: string
  subsections: Subsection[]
}) {
  return (
    <article className="guide-article">
      {/* Main content */}
      <div className="rounded-xl border border-border bg-card/50 p-6 sm:p-8">
        <MarkdownContent content={content} />
      </div>

      {/* Subsections */}
      {subsections && subsections.length > 0 && (
        <div className="mt-8 flex flex-col gap-6">
          {subsections.map((sub) => (
            <div
              key={sub.id}
              id={sub.id}
              className="rounded-xl border border-border bg-card/30 p-6 sm:p-8 scroll-mt-24"
            >
              <h2 className="text-xl font-bold text-foreground mb-4 pb-3 border-b border-border">
                {sub.title}
              </h2>
              <MarkdownContent content={sub.content} />
            </div>
          ))}
        </div>
      )}

      {/* Markdown styles */}
      <style jsx global>{`
        .guide-article .md-h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .guide-article .md-h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .guide-article .md-h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .guide-article .md-p {
          color: hsl(var(--muted-foreground));
          line-height: 1.7;
          margin-bottom: 0.75rem;
          font-size: 0.9375rem;
        }
        .guide-article .md-link {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .guide-article .md-link:hover {
          opacity: 0.8;
        }
        .guide-article .md-blockquote {
          border-left: 3px solid hsl(var(--primary) / 0.4);
          padding-left: 1rem;
          color: hsl(var(--muted-foreground));
          font-style: italic;
          margin: 1rem 0;
        }
        .guide-article .md-ul,
        .guide-article .md-ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }
        .guide-article .md-li,
        .guide-article .md-oli {
          color: hsl(var(--muted-foreground));
          line-height: 1.7;
          margin-bottom: 0.25rem;
          font-size: 0.9375rem;
        }
        .guide-article .md-ul {
          list-style-type: disc;
        }
        .guide-article .md-ol {
          list-style-type: decimal;
        }
        .guide-article .inline-code {
          background: hsl(var(--secondary));
          color: hsl(var(--primary));
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.85em;
        }
        .guide-article .code-block {
          background: hsl(222 47% 4%);
          border: 1px solid hsl(var(--border));
          border-radius: 0.75rem;
          padding: 1rem 1.25rem;
          overflow-x: auto;
          margin: 1rem 0;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          line-height: 1.6;
          color: hsl(var(--foreground));
        }
        .guide-article strong {
          color: hsl(var(--foreground));
          font-weight: 600;
        }
      `}</style>
    </article>
  )
}
