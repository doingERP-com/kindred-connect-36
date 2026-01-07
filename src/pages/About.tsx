import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Target, Eye, Users, Award, CheckCircle } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We deliver the highest quality solutions with meticulous attention to detail.",
  },
  {
    icon: Users,
    title: "Partnership",
    description: "We work alongside our clients as true partners, not just vendors.",
  },
  {
    icon: Award,
    title: "Innovation",
    description: "We continuously evolve our methods to leverage cutting-edge technologies.",
  },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - KairosFS | Oracle Cloud HCM Experts</title>
        <meta
          name="description"
          content="Learn about KairosFS's mission to transform enterprise operations through expert Oracle Cloud HCM consulting and AI-enhanced delivery."
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
                  About <span className="gradient-text">KairosFS</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-up" style={{ animationDelay: "0.1s" }}>
                  We are a team of passionate Oracle Cloud HCM specialists dedicated to transforming how enterprises manage their most valuable asset—their people.
                </p>
              </div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="py-16 lg:py-24 bg-card/30 border-y border-border/50">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                {/* Mission */}
                <div className="space-y-6 animate-fade-up">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl gradient-primary text-primary-foreground">
                    <Target size={28} />
                  </div>
                  <h2 className="font-heading text-2xl lg:text-3xl font-bold">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To empower organizations with cutting-edge Oracle Cloud HCM solutions that streamline operations, enhance employee experiences, and drive sustainable business growth. We believe technology should work for people, not the other way around.
                  </p>
                </div>

                {/* Vision */}
                <div className="space-y-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl gradient-primary text-primary-foreground">
                    <Eye size={28} />
                  </div>
                  <h2 className="font-heading text-2xl lg:text-3xl font-bold">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To be the most trusted Oracle Cloud HCM consulting partner globally, known for our innovative AI-enhanced solutions, exceptional client outcomes, and the transformative impact we create for every organization we serve.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="py-20 lg:py-32">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center mb-16">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                  Our <span className="gradient-text">Values</span>
                </h2>
                <p className="text-muted-foreground text-lg">
                  The principles that guide everything we do
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {values.map((value, index) => (
                  <div
                    key={value.title}
                    className="p-8 rounded-2xl glass-card text-center hover:border-primary/50 transition-all duration-500 animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6">
                      <value.icon size={28} />
                    </div>
                    <h3 className="font-heading text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="py-16 lg:py-24 bg-card/30 border-t border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">
                  Why Choose <span className="gradient-text">Us</span>
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    "15+ years of Oracle Cloud expertise",
                    "200+ successful client implementations",
                    "AI-enhanced delivery methodology",
                    "24/7 support with Lisa AI assistant",
                    "Certified Oracle Cloud specialists",
                    "Proven track record of on-time delivery",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 p-4 rounded-xl bg-card/50 animate-fade-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <CheckCircle className="text-primary flex-shrink-0" size={20} />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default About;
