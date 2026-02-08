"use client"

import { ParticleField } from "@/components/particle-field"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesGrid } from "@/components/features-grid"
import { GuidePreview } from "@/components/guide-preview"
import { CallToAction } from "@/components/call-to-action"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-background">
      <ParticleField />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesGrid />
        <GuidePreview />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
