"use client"

import { ParticleField } from "@/components/particle-field"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { GuidePreview } from "@/components/guide-preview"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  console.log("[v0] HomePage rendering")
  return (
    <div className="relative min-h-screen bg-background">
      <ParticleField />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <GuidePreview />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
