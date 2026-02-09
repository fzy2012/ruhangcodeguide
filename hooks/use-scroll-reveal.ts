"use client"

import { useEffect, useRef } from "react"

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("scroll-visible")
          el.classList.remove("scroll-hidden")
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    el.classList.add("scroll-hidden")
    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return ref
}
