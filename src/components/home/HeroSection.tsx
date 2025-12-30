import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium animate-fade-up">
            <Sparkles size={16} />
            Free AI-Powered ERP Support Available
          </div>

          {/* Heading */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Transform Your{" "}
            <span className="gradient-text">Enterprise Operations</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Expert Oracle Cloud HCM consulting with AI-enhanced delivery. We reduce deployment risk, accelerate timelines, and drive measurable business outcomes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/contact">
              <Button variant="hero" size="xl" className="group">
                Get Started
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/consultants">
              <Button variant="glass" size="xl">
                View Consultants
              </Button>
            </Link>
          </div>

          {/* Trust Indicator */}
          <p className="text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "0.4s" }}>
            Ask Lisa below about your ERP challenges — she's available 24/7
          </p>
        </div>
      </div>
    </section>
  );
}
