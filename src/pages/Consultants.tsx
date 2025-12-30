import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Linkedin, Mail, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const consultants = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior Oracle HCM Consultant",
    expertise: ["Core HR", "Payroll", "Benefits"],
    certifications: 8,
    yearsExp: 12,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Lead Implementation Architect",
    expertise: ["Talent Management", "Learning", "Recruiting"],
    certifications: 10,
    yearsExp: 15,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "AI & Analytics Specialist",
    expertise: ["AI Integration", "Analytics", "Reporting"],
    certifications: 6,
    yearsExp: 8,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Technical Architect",
    expertise: ["Integration", "Security", "Performance"],
    certifications: 12,
    yearsExp: 18,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Change Management Lead",
    expertise: ["User Adoption", "Training", "Communication"],
    certifications: 5,
    yearsExp: 10,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=face",
  },
  {
    id: 6,
    name: "James Park",
    role: "Oracle HCM Specialist",
    expertise: ["Workforce Management", "Time & Labor", "Absence"],
    certifications: 7,
    yearsExp: 9,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
  },
];

const Consultants = () => {
  return (
    <>
      <Helmet>
        <title>Our Consultants - DOINGERP | Expert Oracle Cloud HCM Team</title>
        <meta
          name="description"
          content="Meet our team of certified Oracle Cloud HCM consultants with decades of combined experience in enterprise implementations."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24">
          {/* Hero Section */}
          <section className="py-20 lg:py-32">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold animate-fade-up">
                  Our <span className="gradient-text">Consultants</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-up" style={{ animationDelay: "0.1s" }}>
                  Meet our team of certified Oracle Cloud HCM experts ready to transform your enterprise operations.
                </p>
              </div>
            </div>
          </section>

          {/* Consultants Grid */}
          <section className="pb-20 lg:pb-32">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {consultants.map((consultant, index) => (
                  <div
                    key={consultant.id}
                    className="group p-6 rounded-2xl glass-card hover:border-primary/50 transition-all duration-500 hover:glow-subtle animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Image */}
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300">
                        <img
                          src={consultant.image}
                          alt={consultant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        <Award size={12} />
                        {consultant.certifications} Certs
                      </div>
                    </div>

                    {/* Info */}
                    <div className="text-center space-y-3">
                      <h3 className="font-heading text-xl font-semibold text-foreground">
                        {consultant.name}
                      </h3>
                      <p className="text-primary text-sm font-medium">
                        {consultant.role}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {consultant.yearsExp} years experience
                      </p>

                      {/* Expertise Tags */}
                      <div className="flex flex-wrap justify-center gap-2 pt-2">
                        {consultant.expertise.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex justify-center gap-3 pt-4">
                        <Button variant="ghost" size="icon" className="hover:text-primary">
                          <Linkedin size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:text-primary">
                          <Mail size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Consultants;
