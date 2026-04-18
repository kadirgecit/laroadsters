import Link from "next/link";
import Image from "next/image";
import { FaChevronRight, FaCar } from "react-icons/fa";

export default function HomePage() {
  return (
    <div>
      {/* Full Screen Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="LA Roadsters"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.7)' }} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-1 text-xs font-sans tracking-widest rounded-full"
              style={{ backgroundColor: '#125787', color: 'white' }}>
              ESTABLISHED 1957 - LOS ANGELES
            </span>
          </div>
          
          <h1 className="font-display text-6xl md:text-8xl mb-4 tracking-widest" style={{ color: '#e83a23' }}>
            LA ROADSTERS
          </h1>
          
          <p className="text-text text-xl md:text-2xl font-body mb-8 max-w-2xl mx-auto">
            Hot Rods of Southern California
          </p>
          
          <p className="text-text-muted font-body text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            The Los Angeles Roadsters Car Club was established in 1957 and remains active today. 
            The club is well known for their beautiful 1936 and older roadsters and their 
            club uniform of red shirts and white pants.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/show-news"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-sans font-semibold rounded transition-colors duration-200"
              style={{ backgroundColor: '#e83a23', color: 'white' }}
            >
              <FaChevronRight size={16} />
              2026 Show News
            </Link>
            <Link
              href="/photo-gallery"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 font-sans font-semibold rounded transition-colors duration-200"
              style={{ borderColor: '#125787', color: '#125787' }}
            >
              <FaCar size={16} />
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* 2026 Show Announcement */}
      <section className="py-16 border-y-4" style={{ borderColor: '#125787', backgroundColor: '#111111' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-sans tracking-wider rounded mb-4"
                style={{ backgroundColor: '#e83a23', color: 'white' }}>
                60TH ANNIVERSARY 2026
              </span>
              <h2 className="font-display text-4xl md:text-5xl mb-4 tracking-wider" style={{ color: '#125787' }}>
                THE ROADSTER SHOW
              </h2>
              <p className="text-text-muted font-body leading-relaxed mb-6">
                Join us for our world-renowned show marking the 60th Anniversary and the 44th time 
                held at the Fairplex in Pomona, California. This year, we welcome SoCal Speed Shop 
                to help bring you an even better Show and Swap experience.
              </p>
              <div className="flex flex-col gap-3 text-text-muted font-sans text-sm">
                <div className="flex items-center gap-3">
                  <span style={{ color: '#e83a23' }}>Father Day Weekend: June 19 - 20, 2026</span>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ color: '#e83a23' }}>Fairplex, 1101 West McKinley Avenue, Pomona, CA</span>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/show-news"
                  className="inline-flex items-center gap-2 font-sans hover:underline"
                  style={{ color: '#e83a23' }}
                >
                  Full Show Details <FaChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl tracking-wider text-center mb-12" style={{ color: '#125787' }}>
            EXPLORE OUR SITE
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: "/about-us", label: "About Us", desc: "History of the Club" },
              { href: "/swap-meet", label: "Swap Meet", desc: "Info & Registration" },
              { href: "/exhibitors", label: "Exhibitors", desc: "Commercial Space" },
              { href: "/show-program", label: "Show Program", desc: "Advertising" },
              { href: "/member-news", label: "Member News", desc: "Events & Documents" },
              { href: "/photo-gallery", label: "Photo Gallery", desc: "Car Photos" },
              { href: "/contact", label: "Contact Us", desc: "Get in Touch" },
              { href: "/show-news", label: "Show News", desc: "Latest Updates" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group p-6 rounded border-2 transition-all duration-300"
                style={{ 
                  borderColor: '#125787',
                  backgroundColor: '#111111',
                }}
              >
                <h3 className="font-display text-lg tracking-wider mb-1" style={{ color: '#125787' }}>
                  {item.label}
                </h3>
                <p className="text-text-muted text-xs font-sans">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
