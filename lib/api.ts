const API_BASE = "https://ruhangcodeguide.ruhang365.cn/api"

export interface GuideSection {
  id: string
  title: string
  emoji?: string
  summary: string
  content: string
  subsections: { id: string; title: string; content: string }[]
  order: number
}

export interface Tool {
  id: string
  name: string
  name_en?: string
  description: string
  url: string
  category: string
  is_free: boolean
  tags: string[]
}

export interface Resource {
  id: string
  title: string
  title_en?: string
  description: string
  url: string
  type: string
  author?: string
  tags: string[]
}

export interface SearchResult {
  type: string
  id: string
  title: string
  snippet: string
  url?: string
}

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  const isServer = typeof window === "undefined"
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...(isServer ? { next: { revalidate: 300 } } : {}),
    cache: isServer ? undefined : "no-store",
  })
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  const json: ApiResponse<T> = await res.json()
  if (!json.success) {
    throw new Error(json.message)
  }
  return json.data
}

export async function getGuide(): Promise<GuideSection[]> {
  return fetchApi<GuideSection[]>("/guide")
}

export async function getGuideSection(id: string): Promise<GuideSection> {
  return fetchApi<GuideSection>(`/guide/${id}`)
}

export async function getTools(category?: string): Promise<Tool[]> {
  const query = category ? `?category=${category}` : ""
  return fetchApi<Tool[]>(`/tools${query}`)
}

export async function getResources(type?: string): Promise<Resource[]> {
  const query = type ? `?type=${type}` : ""
  return fetchApi<Resource[]>(`/resources${query}`)
}

export async function search(q: string): Promise<SearchResult[]> {
  return fetchApi<SearchResult[]>(`/search?q=${encodeURIComponent(q)}`)
}
