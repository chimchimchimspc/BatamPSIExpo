"use client";
import { useAuth } from "./context/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SplashScreen from "./components/ui/SplashScreen";
import HeroSection from "./components/sections/HeroSection";
import FeaturesSection from "./components/sections/FeaturesSection";
import JobPreviewSection from "./components/sections/JobPreviewSection";
import PassportPreviewSection from "./components/sections/PassportPreviewSection";
import BadgesPreviewSection from "./components/sections/BadgesPreviewSection";
import CTASection from "./components/sections/CTASection";
import FadeInSection from "./components/ui/FadeInSection";
import LoggedInHome from "./components/sections/LoggedInHome";

export default function HomePage() {
  const { user } = useAuth();

  if (user) {
    return (
      <>
        <SplashScreen />
        <Header />
        <main>
          <LoggedInHome />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SplashScreen />
      <Header />
      <main>
        <HeroSection />
        <FadeInSection delay={0}>
          <FeaturesSection />
        </FadeInSection>
        <FadeInSection delay={50}>
          <JobPreviewSection />
        </FadeInSection>
        <FadeInSection delay={0}>
          <PassportPreviewSection />
        </FadeInSection>
        <FadeInSection delay={50}>
          <BadgesPreviewSection />
        </FadeInSection>
        <FadeInSection delay={0}>
          <CTASection />
        </FadeInSection>
      </main>
      <Footer />
    </>
  );
}
