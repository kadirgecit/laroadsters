import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Sponsor {
  name: string;
  logo: string;
  url: string;
}

export function News() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // TODO: Add sponsors here
  const sponsors: Sponsor[] = [
    // Example format:
    // { name: 'SoCal Speed Shop', logo: '/sponsors/socal-speed-shop.png', url: 'https://example.com' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.news-section', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto" ref={sectionRef}>
        {/* Header */}
        <div className="news-section mb-16">
          <div className="text-sm tracking-[0.3em] text-red-500 mb-4 font-light">
            44TH ANNIVERSARY
          </div>
          <h1 className="text-[clamp(3rem,10vw,7rem)] font-black leading-[0.9] tracking-tight mb-6">
            <div className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              SHOW NEWS
            </div>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            44th Annual Roadster Show & Swap — Father's Day Weekend, June 19-20, 2026
          </p>
        </div>

        {/* PDF Flyer */}
        <div className="news-section mb-20">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">44th Anniversary Flyer</h2>
              <a
                href="/44th-Anniversary.pdf"
                download
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-500 transition-colors duration-300"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </div>
            
            {/* Embedded PDF Viewer */}
            <div className="w-full h-[600px] rounded-xl overflow-hidden border border-white/10 bg-white/5">
              <iframe
                src="/44th-Anniversary.pdf"
                className="w-full h-full"
                title="44th Anniversary Flyer"
              />
            </div>
          </div>
        </div>

        {/* Sponsors Section */}
        <div className="news-section">
          <div className="text-center mb-12">
            <div className="text-sm tracking-[0.3em] text-red-500 mb-4 font-light">
              THANK YOU
            </div>
            <h2 className="text-4xl font-black text-white mb-4">Our Sponsors</h2>
            <p className="text-gray-400">
              Supporting the 44th Annual Roadster Show & Swap
            </p>
          </div>

          {sponsors.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sponsors.map((sponsor, index) => (
                <a
                  key={index}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-red-500/50 transition-all duration-500 flex items-center justify-center aspect-[4/3]">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">
                      {sponsor.name}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-gray-400">Sponsors coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}