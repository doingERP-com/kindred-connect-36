import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Calendar, Sparkles, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";


const BookAppointment = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Book an Appointment | KairosFS</title>
        <meta
          name="description"
          content="Schedule a free consultation with KairosFS. Pick a time that works for you and connect with our experts."
        />
        <link rel="canonical" href="/book-appointment" />
      </Helmet>

      <Navbar />

      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 lg:px-8 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Free Consultation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Book Your Appointment
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Choose a time that works best for you. Our team will connect with you to
              understand your needs and craft a tailored solution.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="container mx-auto px-4 lg:px-8 mb-12">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <b.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Calendar Embed */}
        <section className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 rounded-3xl blur-2xl opacity-60" />

              {/* Card */}
              <div className="relative rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden shadow-2xl">
                {/* Card header */}
                <div className="px-6 py-5 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">Select a Time Slot</h2>
                      <p className="text-xs text-muted-foreground">
                        Powered by Google Calendar · Instant confirmation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Live availability
                  </div>
                </div>

                {/* Iframe wrapper */}
                <div className="bg-white p-2 sm:p-4">
                  <div className="rounded-2xl overflow-hidden">
                    <iframe
                      src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ23nJGg9og_UEn5dDG-ZVD_dU1AS0ryWjYdUKxl-t_V008CUA0sG47B5uIzTuC1ub6OuwTbXg52?gv=true"
                      style={{ border: 0 }}
                      width="100%"
                      height="700"
                      frameBorder="0"
                      title="Book an appointment with KairosFS"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Help footer */}
            <div className="mt-10 text-center">
              <p className="text-muted-foreground mb-4">
                Having trouble booking? We're just a call away.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a href="tel:+12345678906">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Phone className="w-4 h-4" />
                    +1 (234) 567-890
                  </Button>
                </a>
                <Link to="/contact">
                  <Button variant="hero" size="lg">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BookAppointment;
