import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Instagram,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <img 
                src={logo} 
                alt="AE&SC Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
            <h3 className="text-2xl font-heading font-bold mb-4">
              Stay Updated on Africa's Energy Transition
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Get the latest insights, reports, and updates on sustainable energy initiatives across Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button variant="secondary" className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={logo} 
                alt="AE&SC Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="font-heading font-bold text-lg">AE&SC</span>
            </div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Accelerating Africa's energy transition and sustainability journey through 
              innovation, partnerships, and strategic initiatives.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-primary-foreground/80 hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/initiatives" className="text-primary-foreground/80 hover:text-secondary transition-colors">Our Initiatives</Link></li>
              <li><Link to="/strategic-focus" className="text-primary-foreground/80 hover:text-secondary transition-colors">Strategic Focus</Link></li>
              <li><Link to="/partnerships" className="text-primary-foreground/80 hover:text-secondary transition-colors">Partnerships</Link></li>
              <li><Link to="/resources" className="text-primary-foreground/80 hover:text-secondary transition-colors">Resources</Link></li>
              <li><Link to="/forum" className="text-primary-foreground/80 hover:text-secondary transition-colors">Community Forum</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Focus Areas</h4>
            <ul className="space-y-3">
              <li className="text-primary-foreground/80">Clean Energy Deployment</li>
              <li className="text-primary-foreground/80">Energy Access Programs</li>
              <li className="text-primary-foreground/80">Capacity Building</li>
              <li className="text-primary-foreground/80">Research & Development</li>
              <li className="text-primary-foreground/80">Climate Advocacy</li>
              <li className="text-primary-foreground/80">Technology Innovation</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                <div className="text-primary-foreground/80">
                  <p>Lagos, Nigeria</p>
                  <p>Serving all of Africa</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary flex-shrink-0" />
                <a href="mailto:info@aesc.org" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  info@aesc.org
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary flex-shrink-0" />
                <a href="tel:+234123456789" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  +234 123 456 789
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © 2024 African Energy & Sustainability Consortium. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors">Privacy Policy</a>
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors">Terms of Service</a>
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;