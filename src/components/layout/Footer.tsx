import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import kairosLogo from "@/assets/kairosfs-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img src={kairosLogo} alt="KairosFS" className="h-12 w-auto" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Expert Oracle Cloud HCM consulting with AI-enhanced delivery. We reduce deployment risk and accelerate timelines.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-foreground">Quick Links</h4>
            <div className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Consultants", path: "/consultants" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-foreground">Services</h4>
            <div className="space-y-2">
              {[
                "Oracle Cloud HCM",
                "System Optimization",
                "AI & Analytics",
                "Managed Services",
              ].map((service) => (
                <p
                  key={service}
                  className="text-sm text-muted-foreground"
                >
                  {service}
                </p>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-foreground">Contact</h4>
            <div className="space-y-3">
              <a
                href="mailto:info@kairosfs.com"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <Mail size={16} className="text-primary" />
                info@kairosfs.com
              </a>
              <a
                href="tel:+18447342790"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <Phone size={16} className="text-primary" />
                +1 844-734-2790
              </a>
              <p className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin size={16} className="text-primary mt-0.5" />
                123 Business Ave, Suite 500<br />San Francisco, CA 94102
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} KairosFS. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
