// import MarketingLayout from "../layouts/MarketingLayout";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import LogoBanner from "../components/landing/LogoBanner";
import Testimonials from "../components/landing/Testimonials";
import CtaBanner from "../components/landing/CtaBanner";
import ScreensShowcase from "../components/landing/ScreensShowcase";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ScreensShowcase/>
      <HowItWorks />
      <LogoBanner />
      <Testimonials />
      <CtaBanner/>
   </>
  );
}


