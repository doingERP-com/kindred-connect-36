import { MessageCircle } from "lucide-react";

export function AIFeatureSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
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
                  Free Feature
                </div>
                <h3 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
                  Meet Lisa, Your AI ERP Expert
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Having ERP issues? Lisa is available 24/7 to help troubleshoot problems, answer questions about Oracle Cloud HCM, and guide you through solutions—completely free. No forms, no waiting, instant expert help.
                </p>
                <p className="text-primary text-sm font-medium">
                  Use the chat bar at the bottom of the page to get started
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
