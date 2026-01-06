import { Clock, Target, Headphones } from "lucide-react";

const stats = [
  { 
    icon: Clock, 
    value: "90%", 
    label: "Reduction in Time-to-Expert",
    description: "Get connected to the right expert faster than ever"
  },
  { 
    icon: Target, 
    value: "100%", 
    label: "Manual Triage Eliminated",
    description: "No more 'wrong department' routing errors"
  },
  { 
    icon: Headphones, 
    value: "24/7", 
    label: "Availability",
    description: "Always-on support for high-stakes ERP environments"
  },
];

export function StatsSection() {
  return (
    <section className="py-16 lg:py-24 border-y border-border/50 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            The <span className="gradient-text">Results</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center space-y-3 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-2">
                <stat.icon size={24} />
              </div>
              <div className="font-heading text-4xl md:text-5xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-foreground">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
