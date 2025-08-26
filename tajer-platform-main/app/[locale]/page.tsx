import Hero from "@/components/home/hero";

import FeaturedCategories from "@/components/home/featured-categories";
import SpecialOffers from "@/components/home/special-offers";
import HowItWorks from "@/components/home/how-it-works";
import Testimonials from "@/components/home/testimonials";
import CallToAction from "@/components/home/call-to-action";

export default function Home() {
  fetch("https://tajer-backend.tajerplatform.workers.dev/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      commercialName: "",
      phone: "",
      email: null,
      passwordHash: "",
      city: "",
      area: "",
      locationDetails: null,
      businessType: "",
      referredByRepId: null,
      referralCode: null,
    }),
  });

  return (
    <div className="container mx-auto">
      <div className="  flex justify-center items-center p-4">
        <Hero />
      </div>
      <FeaturedCategories />
      <SpecialOffers />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </div>
  );
}
