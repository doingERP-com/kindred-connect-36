import { Brain, Users, Calendar } from "lucide-react";

const capabilities = [
  {
    icon: Brain,
    title: "Intelligent Problem Synthesis",
    description: "Uses RAG (Retrieval-Augmented Generation) to understand the nuances of payroll, supply chain, or HRIS glitches during a live call.",
  },
  {
    icon: Users,
    title: "Expert Routing & Orchestration",
    description: "Identifies the exact consultant or internal expert needed based on the problem's technical signature.",
  },
  {
    icon: Calendar,
    title: "Dynamic Calendar Sync",
    description: "Accesses the availability of an expert in real-time to bridge the gap between problem identification and resolution.",
  },
];

export function ServicesSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What can <span className="gradient-text">Lisa</span> do?
          </h2>
          <p className="text-muted-foreground text-lg">
            Lisa doesn't just "chat" — she orchestrates
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {capabilities.map((capability, index) => (
            <div
              key={capability.title}
              className="group p-6 lg:p-8 rounded-2xl glass-card hover:border-primary/50 transition-all duration-500 hover:glow-subtle animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl gradient-primary text-primary-foreground mb-6 group-hover:scale-110 transition-transform duration-300">
                <capability.icon size={28} />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3 text-foreground">
                {capability.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {capability.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
