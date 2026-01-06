import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Heading */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-up">
            Stop losing productivity to{" "}
            <span className="gradient-text">technical friction</span>
          </h1>

          {/* Meet Lisa */}
          <div className="space-y-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
              Meet Lisa
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Lisa is your 24/7 AI Agent that diagnoses complex ERP & HCM challenges and provides immediate expert intervention.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/contact">
              <Button variant="hero" size="xl" className="group">
                Schedule a Demo
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="tel:+18447342790">
              <Button variant="glass" size="xl" className="gap-2">
                <Phone size={18} />
                Call +1 844-734-2790 to see Lisa in Action
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
