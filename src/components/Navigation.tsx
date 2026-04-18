"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

const navItems = [
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

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded flex items-center justify-center" style={{ backgroundColor: '#e83a23' }}>
                <span className="font-display text-white text-lg tracking-wider">LAR</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-display text-lg tracking-widest text-white">LA ROADSTERS</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-sm font-sans text-white/80 hover:text-white transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 pt-20 bg-black/90 backdrop-blur-sm">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-lg font-sans text-white hover:text-white rounded transition-colors duration-200 border-b border-white/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
