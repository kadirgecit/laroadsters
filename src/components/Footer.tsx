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
    <footer className="bg-secondary border-t-4" style={{ borderColor: '#e83a23' }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded flex items-center justify-center" style={{ backgroundColor: '#e83a23' }}>
                <span className="font-display text-white text-sm tracking-wider">LAR</span>
              </div>
              <div>
                <div className="font-display text-lg tracking-widest" style={{ color: '#125787' }}>LA ROADSTERS</div>
                <div className="text-text-muted text-xs tracking-wider font-sans">Los Angeles, California</div>
              </div>
            </div>
            <p className="text-text-muted text-sm font-body leading-relaxed">
              The Los Angeles Roadsters Car Club was established in 1957 and remains active today. 
              World-renowned for their beautiful 1936 and older roadsters.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm tracking-widest mb-4" style={{ color: '#e83a23' }}>QUICK LINKS</h3>
            <nav className="grid grid-cols-2 gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-muted text-sm font-sans hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-display text-sm tracking-widest mb-4" style={{ color: '#e83a23' }}>CONNECT</h3>
            <p className="text-text-muted text-sm font-sans mb-4">
              Email:{" "}
              <a href="mailto:1932lar@gmail.com" className="hover:underline" style={{ color: '#125787' }}>
                1932lar@gmail.com
              </a>
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded flex items-center justify-center transition-colors duration-200"
                style={{ backgroundColor: '#125787', color: 'white' }}
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded flex items-center justify-center transition-colors duration-200"
                style={{ backgroundColor: '#125787', color: 'white' }}
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded flex items-center justify-center transition-colors duration-200"
                style={{ backgroundColor: '#125787', color: 'white' }}
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-text-muted text-xs font-sans">
            &copy; {new Date().getFullYear()} Los Angeles Roadsters Car Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
