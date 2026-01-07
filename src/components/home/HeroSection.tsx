import { Button } from "@/components/ui/button";
import { Phone, ChevronDown, Sparkles, Cpu, Zap, MessageCircle } from "lucide-react";

export function HeroSection() {
  const scrollToChat = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* AI Grid Pattern Background */}
      <div className="absolute inset-0 ai-grid-pattern" />
      <div className="absolute inset-0 ai-dots-pattern opacity-50" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/6 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      {/* Floating AI Icons */}
      <div className="absolute top-32 left-20 animate-float opacity-30">
        <Cpu size={32} className="text-primary" />
      </div>
      <div className="absolute top-48 right-32 animate-float opacity-30" style={{ animationDelay: "2s" }}>
        <Sparkles size={28} className="text-primary" />
      </div>
      <div className="absolute bottom-48 left-32 animate-float opacity-30" style={{ animationDelay: "1s" }}>
        <Zap size={24} className="text-primary" />
      </div>

      {/* Neural Network Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(5 91% 52%)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(5 91% 52%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="10%" y1="20%" x2="40%" y2="50%" stroke="url(#lineGradient)" strokeWidth="1" />
        <line x1="90%" y1="30%" x2="60%" y2="60%" stroke="url(#lineGradient)" strokeWidth="1" />
        <line x1="20%" y1="80%" x2="50%" y2="50%" stroke="url(#lineGradient)" strokeWidth="1" />
        <line x1="80%" y1="85%" x2="55%" y2="55%" stroke="url(#lineGradient)" strokeWidth="1" />
      </svg>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-fade-up">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered ERP Support</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-up">
            What's stopping you from{" "}
            <span className="gradient-text">doing more</span>
          </h1>

          {/* Meet Lisa */}
          <div className="space-y-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
              Meet Lisa
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Lisa is your 24/7 AI Agent that diagnoses complex Marketing, Financial, Supply Chain, HCM process challenges and augments, assists you with immediate expert intervention.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <Button 
              variant="hero" 
              size="xl" 
              className="group gap-2"
              onClick={() => {
                scrollToChat();
                // Dispatch custom event to trigger glow
                window.dispatchEvent(new CustomEvent('triggerLisaGlow'));
              }}
            >
              <MessageCircle size={20} />
              Chat & Talk with Lisa
            </Button>
            <a href="tel:+18447342790">
              <Button variant="glass" size="xl" className="gap-2">
                <Phone size={18} />
                Call +1 844-734-2790
              </Button>
            </a>
          </div>

          {/* Scroll Indicator pointing to chat */}
          <div className="pt-8 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <button 
              onClick={() => {
                scrollToChat();
                window.dispatchEvent(new CustomEvent('triggerLisaGlow'));
              }}
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors mx-auto group"
            >
              <span className="text-sm font-medium">Chat & Talk with Lisa</span>
              <div className="relative">
                <ChevronDown size={24} className="animate-bounce-subtle" />
                <div className="absolute inset-0 animate-pulse-ring">
                  <ChevronDown size={24} className="text-primary opacity-50" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
