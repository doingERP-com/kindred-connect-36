import { Cloud, Settings, Brain, Headphones } from "lucide-react";

const services = [
  {
    icon: Cloud,
    title: "Oracle Cloud HCM Implementation",
    description: "End-to-end deployment of Oracle Cloud HCM modules tailored to your organization's needs.",
  },
  {
    icon: Settings,
    title: "System Optimization",
    description: "Maximize your existing ERP investment with performance tuning and process improvements.",
  },
  {
    icon: Brain,
    title: "AI & Analytics Integration",
    description: "Enhance decision-making with advanced analytics and AI-powered insights.",
  },
  {
    icon: Headphones,
    title: "Managed Services",
    description: "Ongoing support and maintenance to keep your systems running at peak performance.",
  },
];

export function ServicesSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Comprehensive ERP consulting to transform your enterprise operations
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group p-6 lg:p-8 rounded-2xl glass-card hover:border-primary/50 transition-all duration-500 hover:glow-subtle animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl gradient-primary text-primary-foreground mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon size={28} />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3 text-foreground">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
