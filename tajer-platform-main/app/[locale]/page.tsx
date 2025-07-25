import Hero from "@/components/home/hero"

import FeaturedCategories from "@/components/home/featured-categories"
import SpecialOffers from "@/components/home/special-offers"
import HowItWorks from "@/components/home/how-it-works"
import Testimonials from "@/components/home/testimonials"
import CallToAction from "@/components/home/call-to-action"

export default function Home() {
  return (
    <div className="container mx-auto">
      <Hero />
      <FeaturedCategories />
      <SpecialOffers />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </div>
  )
}
