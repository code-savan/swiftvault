import { currentUserId } from '@/app/lib/clerk/server'
import { redirect } from 'next/navigation'
import { HeroSection } from '@/app/components/blocks/hero-section'
import { ServicesSection } from '@/app/components/blocks/services-section'
import { WalletStorySection } from '@/app/components/blocks/wallet-story-section'
import { MetricsSection } from '@/app/components/blocks/metrics-section'
import { FeaturesSection } from '@/app/components/blocks/features-section'
import { MoatSection } from '@/app/components/blocks/moat-section'
import { TestimonialsSection } from '@/app/components/blocks/testimonials-section'
import { RoadmapSection } from '@/app/components/blocks/roadmap-section'
import { PricingSection } from '@/app/components/blocks/pricing-section'
import { FaqSection } from '@/app/components/blocks/faq-section'
import { CtaSection } from '@/app/components/blocks/cta-section'
import { FooterSection } from '@/app/components/blocks/footer-section'

export default async function LandingPage() {
  const userId = await currentUserId()

  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#f7f8f4]">
      <HeroSection />
      <ServicesSection />
      <WalletStorySection />
      <MetricsSection />
      <FeaturesSection />
      <MoatSection />
      <TestimonialsSection />
      <RoadmapSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <FooterSection />
    </div>
  )
}
