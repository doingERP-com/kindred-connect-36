import { Users, Award, Briefcase, Clock } from "lucide-react";

const stats = [
  { icon: Users, value: "200+", label: "Clients Served" },
  { icon: Award, value: "50+", label: "Oracle Certifications" },
  { icon: Briefcase, value: "500+", label: "Implementations" },
  { icon: Clock, value: "15+", label: "Years Experience" },
];

export function StatsSection() {
  return (
    <section className="py-16 lg:py-24 border-y border-border/50 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center space-y-3 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-2">
                <stat.icon size={24} />
              </div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
