import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, ArrowUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-section', {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={footerRef} className="relative bg-black border-t border-white/10 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,107,0,0.05),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="footer-section lg:col-span-2">
            <h3 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
              LOS ANGELES<br />ROADSTERS
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              Celebrating 60 years of automotive excellence. The world's premier pre-war roadster club, hosting our 44th Annual Show & Swap at Fairplex, Pomona.
            </p>
            <div className="text-sm text-gray-600">
              Established 1957 · 60th Anniversary 2026 · Pomona, California
            </div>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h4 className="text-lg font-bold text-white mb-6 tracking-wider">CONTACT</h4>
            <div className="space-y-4">
              <a href="mailto:1932lar@gmail.com" className="flex items-center gap-3 text-gray-400 hover:text-red-500 transition-colors duration-300 group">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-red-500/20 transition-colors duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <span>1932lar@gmail.com</span>
              </a>
              <a href="tel:5551234567" className="flex items-center gap-3 text-gray-400 hover:text-red-500 transition-colors duration-300 group">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-red-500/20 transition-colors duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <span>(555) 123-4567</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Fairplex, Pomona, CA</span>
              </div>
            </div>
          </div>

          {/* Social Section */}
          <div className="footer-section">
            <h4 className="text-lg font-bold text-white mb-6 tracking-wider">FOLLOW US</h4>
            <div className="flex gap-3">
              <button className="w-12 h-12 bg-white/5 hover:bg-red-500 rounded-full flex items-center justify-center border border-white/10 hover:border-red-500 transition-all duration-300 group">
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
              </button>
              <button className="w-12 h-12 bg-white/5 hover:bg-red-500 rounded-full flex items-center justify-center border border-white/10 hover:border-red-500 transition-all duration-300 group">
                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
              </button>
              <button className="w-12 h-12 bg-white/5 hover:bg-red-500 rounded-full flex items-center justify-center border border-white/10 hover:border-red-500 transition-all duration-300 group">
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
              </button>
            </div>
            <div className="mt-8">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors duration-300 group"
              >
                <span className="text-sm font-semibold tracking-wider">BACK TO TOP</span>
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center group-hover:bg-red-500/30 transition-colors duration-300">
                  <ArrowUp className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="footer-section mb-16 p-8 rounded-2xl bg-gradient-to-br from-red-600/10 to-red-900/10 border border-red-500/20">
          <div className="max-w-2xl">
            <h4 className="text-2xl font-bold text-white mb-3">Stay Updated</h4>
            <p className="text-gray-400 mb-6">Get the latest news, event updates, and exclusive content delivered to your inbox.</p>
            <div className="flex gap-3 flex-wrap">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-[250px] px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500 transition-colors duration-300"
              />
              <button className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-section pt-8 border-t border-white/10 flex flex-wrap justify-between items-center gap-6">
          <div className="text-sm text-gray-600">
            &copy; 2026 Los Angeles Roadsters. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-red-500 transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-red-500 transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-red-500 transition-colors duration-300">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
