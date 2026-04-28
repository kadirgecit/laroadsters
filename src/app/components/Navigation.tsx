import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { MagneticButton } from './MagneticButton';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    if (isOpen) {
      gsap.to('.mobile-menu', {
        x: 0,
        duration: 0.5,
        ease: 'power3.out',
      });
      gsap.from('.mobile-nav-item', {
        x: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        delay: 0.2,
        ease: 'power3.out',
      });
    } else {
      gsap.to('.mobile-menu', {
        x: '100%',
        duration: 0.4,
        ease: 'power3.in',
      });
    }
  }, [isOpen]);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/news', label: 'News' },
    { path: '/swap-meet', label: 'Swap Meet' },
    { path: '/about', label: 'About Us' },
    { path: '/member-news', label: 'Member News' },
    { path: '/gallery', label: 'Photo Gallery' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/90 backdrop-blur-lg border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="group">
              <div className="text-2xl font-black">
                <span className="text-white group-hover:text-red-500 transition-colors duration-300">
                  LA
                </span>
                <span className="text-red-500"> ROADSTERS</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300 rounded-full ${
                    location.pathname === item.path
                      ? 'text-red-500 bg-red-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <MagneticButton
                className="px-6 py-3 bg-red-600 text-white text-sm font-semibold rounded-full hover:bg-red-500 transition-colors duration-300"
                strength={0.3}
              >
                Register Now
              </MagneticButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-12 h-12 flex items-center justify-center text-white hover:text-red-500 transition-colors duration-300"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className="mobile-menu fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-black/95 backdrop-blur-xl z-40 lg:hidden translate-x-full border-l border-white/10"
      >
        <div className="flex flex-col h-full pt-24 px-8">
          <div className="flex-1">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-item block py-4 text-2xl font-bold border-b border-white/10 transition-colors duration-300 ${
                  location.pathname === item.path
                    ? 'text-red-500'
                    : 'text-white hover:text-red-500'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pb-8">
            <button className="w-full px-6 py-4 bg-red-600 text-white font-semibold rounded-full hover:bg-red-500 transition-colors duration-300">
              Register Now
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
