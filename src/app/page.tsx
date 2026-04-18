import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaMapMarkerAlt, FaChevronRight, FaCar } from "react-icons/fa";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-primary via-secondary to-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/30 via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-20">
          <div className="mb-6">
            <span className="inline-block px-4 py-1 bg-gold/20 text-gold text-sm font-sans tracking-wider rounded-full">
              ESTABLISHED 1957
            </span>
          </div>
          
          <h1 className="font-display text-6xl md:text-8xl text-gold tracking-widest mb-4">
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
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-primary font-sans font-semibold rounded hover:bg-gold-dark transition-colors duration-200"
            >
              <FaChevronRight size={16} />
              2026 Show News
            </Link>
            <Link
              href="/photo-gallery"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gold text-gold font-sans font-semibold rounded hover:bg-gold hover:text-primary transition-colors duration-200"
            >
              <FaCar size={16} />
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* 2026 Show Announcement */}
      <section className="bg-secondary py-16 border-y border-gold/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-sans tracking-wider rounded mb-4">
                60TH ANNIVERSARY 2026
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-gold tracking-wider mb-4">
                THE ROADSTER SHOW
              </h2>
              <p className="text-text-muted font-body leading-relaxed mb-6">
                Join us for our world-renowned show marking the 60th Anniversary and the 44th time 
                held at the Fairplex in Pomona, California. This year, we welcome SoCal Speed Shop 
                to help bring you an even better Show and Swap experience.
              </p>
              <div className="flex flex-col gap-3 text-text-muted font-sans text-sm">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-gold" size={18} />
                  <span>Father Day Weekend: June 19 - 20, 2026</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-gold" size={18} />
                  <span>Fairplex, 1101 West McKinley Avenue, Pomona, CA</span>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/show-news"
                  className="inline-flex items-center gap-2 text-gold font-sans hover:underline"
                >
                  Full Show Details <FaChevronRight size={14} />
                </Link>
              </div>
            </div>
            
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-primary">
              <Image
                src="/original/Pictures/Show 2025/LA Roadster Flyer with Andys Art 2025.jpg"
                alt="LA Roadster Show Flyer"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl text-gold tracking-wider text-center mb-12">
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
                className="group p-6 bg-secondary rounded-lg border border-gold/10 hover:border-gold/30 hover:bg-gold/5 transition-all duration-300"
              >
                <h3 className="font-display text-lg text-gold tracking-wider mb-1 group-hover:translate-x-1 transition-transform duration-200">
                  {item.label}
                </h3>
                <p className="text-text-muted text-xs font-sans">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-12 bg-secondary border-y border-gold/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-lg overflow-hidden">
            <Image
              src="/original/Pictures/bent axles 2018r.jpg"
              alt="Bent Axles Car Show 2019"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="font-display text-2xl md:text-3xl text-gold tracking-wider">
                BENT AXLES CAR SHOW 2019
              </p>
              <p className="text-text-muted text-sm font-sans mt-1">A tradition of excellence since 1957</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
