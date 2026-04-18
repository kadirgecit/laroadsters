"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Show News",
    href: "/show-news",
  },
  {
    label: "Swap Meet",
    href: "/swap-meet",
  },
  {
    label: "Exhibitors",
    href: "/exhibitors",
  },
  {
    label: "Show Program",
    href: "/show-program",
  },
  {
    label: "About Us",
    href: "/about-us",
  },
  {
    label: "Member News",
    href: "/member-news",
  },
  {
    label: "Photo Gallery",
    href: "/photo-gallery",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center">
              <span className="font-display text-primary text-xl tracking-wider">LAR</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-display text-gold text-2xl tracking-widest">LA ROADSTERS</div>
              <div className="text-text-muted text-xs tracking-wider">EST. 1957</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-sans text-text-muted hover:text-gold transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gold"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-secondary border-t border-gold/20">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-sans text-text hover:bg-gold/10 hover:text-gold rounded transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
