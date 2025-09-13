import Hero from "@/components/home/hero";

import FeaturedCategories from "@/components/home/featured-categories";
import SpecialOffers from "@/components/home/special-offers";
import HowItWorks from "@/components/home/how-it-works";
import Testimonials from "@/components/home/testimonials";
import CallToAction from "@/components/home/call-to-action";
import SpecialProducts from "@/components/home/special-products";
export default function Home() {

  return (
    <div className="container mx-auto">
      <div className="  flex justify-center items-center p-4">
        <Hero />
      </div>
      <FeaturedCategories />
      <SpecialOffers />
      <SpecialProducts/>
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </div>
  );
}
