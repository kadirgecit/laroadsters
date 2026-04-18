import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Show News", href: "/show-news" },
  { label: "Swap Meet", href: "/swap-meet" },
  { label: "Exhibitors", href: "/exhibitors" },
  { label: "Show Program", href: "/show-program" },
  { label: "About Us", href: "/about-us" },
  { label: "Member News", href: "/member-news" },
  { label: "Photo Gallery", href: "/photo-gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-gold/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
                <span className="font-display text-primary text-sm tracking-wider">LAR</span>
              </div>
              <div>
                <div className="font-display text-gold text-xl tracking-widest">LA ROADSTERS</div>
                <div className="text-text-muted text-xs tracking-wider">EST. 1957</div>
              </div>
            </div>
            <p className="text-text-muted text-sm font-body leading-relaxed">
              The Los Angeles Roadsters Car Club was established in 1957 and remains active today. 
              World-renowned for their beautiful 1936 and older roadsters and signature red shirts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-gold text-lg tracking-wider mb-4">QUICK LINKS</h3>
            <nav className="grid grid-cols-2 gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-muted text-sm font-sans hover:text-gold transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-display text-gold text-lg tracking-wider mb-4">CONNECT</h3>
            <p className="text-text-muted text-sm font-sans mb-4">
              Email:{" "}
              <a href="mailto:1932lar@gmail.com" className="text-gold hover:underline">
                1932lar@gmail.com
              </a>
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-primary transition-colors duration-200"
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-primary transition-colors duration-200"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-primary transition-colors duration-200"
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-8 pt-8 text-center">
          <p className="text-text-muted text-xs font-sans">
            &copy; {new Date().getFullYear()} Los Angeles Roadsters Car Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
