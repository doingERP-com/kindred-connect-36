import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, MapPin, Send, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    value: "+1 (234) 567-890",
    link: "tel:+12345678906",
  },
  {
    icon: MapPin,
    title: "Address",
    value: "8735 Dunwoody Place Ste 6, Atlanta, GA 30350",
  },
  {
    icon: Clock,
    title: "Business Hours",
    value: "Monday - Friday: 9AM - 6PM PST",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", company: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - DOINGERP | Get Expert ERP Consulting Help</title>
        <meta
          name="description"
          content="Contact DOINGERP for Oracle Cloud HCM consulting services. Get a free consultation and learn how we can transform your enterprise operations."
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
                  Get in <span className="gradient-text">Touch</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-up" style={{ animationDelay: "0.1s" }}>
                  Ready to transform your enterprise operations? Let's discuss how we can help you achieve your goals.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="pb-20 lg:pb-32">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Contact Form */}
                <div className="order-2 lg:order-1 animate-fade-up">
                  <div className="p-8 rounded-2xl glass-card">
                    <h2 className="font-heading text-2xl font-bold mb-6">Send us a message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="bg-secondary/50 border-border/50 focus:border-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="bg-secondary/50 border-border/50 focus:border-primary"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          name="company"
                          placeholder="Your Company"
                          value={formData.company}
                          onChange={handleChange}
                          className="bg-secondary/50 border-border/50 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us about your project or challenges..."
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="bg-secondary/50 border-border/50 focus:border-primary resize-none"
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="hero"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            Send Message
                            <Send size={18} />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="order-1 lg:order-2 space-y-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-4">Contact Information</h2>
                    <p className="text-muted-foreground">
                      Reach out to us through any of these channels. We typically respond within 24 hours.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {contactInfo.map((info) => (
                      <div
                        key={info.title}
                        className="flex items-start gap-4 p-4 rounded-xl bg-card/50 hover:bg-card/70 transition-colors"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          <info.icon size={22} />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground mb-1">{info.title}</h3>
                          {info.link ? (
                            <a
                              href={info.link}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-muted-foreground">{info.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Map Placeholder */}
                  <div className="h-64 rounded-2xl bg-card/50 border border-border/50 flex items-center justify-center">
                    <p className="text-muted-foreground">Map Integration Available</p>
                  </div>
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

export default Contact;
