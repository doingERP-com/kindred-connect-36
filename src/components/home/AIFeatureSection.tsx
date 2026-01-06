import { MessageCircle, ArrowRight } from "lucide-react";

export function AIFeatureSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Transform support from{" "}
              <span className="gradient-text">tickets to conversations</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Traditional ERP support is buried in slow email chains and misclassified tickets
            </p>
          </div>

          <div className="p-8 lg:p-12 rounded-3xl glass-card border-primary/20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            
            <div className="relative flex flex-col lg:flex-row items-center gap-8">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center glow-primary">
                  <MessageCircle size={40} className="text-primary-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="text-center lg:text-left space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  Agentic AI Layer
                </div>
                <h3 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
                  Lisa sits atop your HCM/ERP stack
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Lisa is an agentic layer that provides you with a voice interface that understands complex technical problems and takes immediate action. No more waiting, no more misrouted tickets.
                </p>
                <p className="text-primary text-sm font-medium flex items-center gap-2 justify-center lg:justify-start">
                  Try Lisa now using the chat bar below
                  <ArrowRight size={16} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
