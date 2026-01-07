import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { AIFeatureSection } from "@/components/home/AIFeatureSection";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>KairosFS | Oracle Fusion HCM Cloud specialists</title>
        <meta
          name="description"
          content="Expert Oracle Cloud HCM consulting with AI-enhanced delivery. We reduce deployment risk, accelerate timelines, and drive measurable business outcomes."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <AIFeatureSection />
          <StatsSection />
          <ServicesSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
