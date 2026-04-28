import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Filter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function PhotoGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gallery-grid-item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.05,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const filters = ['All', 'Roadsters', 'Hot Rods', 'Sports Cars', 'Events', 'Members'];

  const galleries = [
    { category: 'Events', title: 'Father\'s Day Show 2025', count: 250 },
    { category: 'Roadsters', title: '1932 Ford Collection', count: 45 },
    { category: 'Hot Rods', title: 'Traditional Builds', count: 67 },
    { category: 'Sports Cars', title: 'European Classics', count: 38 },
    { category: 'Events', title: 'Spring Cruise Night', count: 120 },
    { category: 'Members', title: 'Member Spotlights', count: 89 },
    { category: 'Roadsters', title: 'Vintage Roadsters', count: 54 },
    { category: 'Hot Rods', title: 'Custom Builds', count: 72 },
    { category: 'Events', title: 'Swap Meet 2025', count: 95 },
    { category: 'Members', title: 'Workshop Sessions', count: 43 },
    { category: 'Sports Cars', title: 'British Invasion', count: 31 },
    { category: 'Roadsters', title: 'T-Bucket Collection', count: 28 },
  ];

  const filteredGalleries = activeFilter === 'all'
    ? galleries
    : galleries.filter(g => g.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto" ref={sectionRef}>
        {/* Header */}
        <div className="mb-16">
          <div className="text-sm tracking-[0.3em] text-red-500 mb-4 font-light">
            VISUAL ARCHIVE
          </div>
          <h1 className="text-[clamp(3rem,10vw,7rem)] font-black leading-[0.9] tracking-tight mb-6">
            <div className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              PHOTO GALLERY
            </div>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Explore thousands of photos showcasing our events, member builds, and automotive excellence
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-12 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-400">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-semibold">Filter:</span>
          </div>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter.toLowerCase())}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeFilter === filter.toLowerCase()
                  ? 'bg-red-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleries.map((gallery, index) => (
            <div
              key={index}
              className="gallery-grid-item group cursor-pointer"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-red-600/20 to-blue-900/20 border border-white/10 hover:border-red-500/50 transition-all duration-500">
                {/* Placeholder Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 to-blue-900/30" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                  {gallery.count} Photos
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-sm text-red-500 mb-2 font-semibold tracking-wider uppercase">
                    {gallery.category}
                  </div>
                  <h3 className="text-2xl font-black text-white group-hover:text-red-400 transition-colors duration-300">
                    {gallery.title}
                  </h3>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,0,0.3),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 p-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-black text-red-500 mb-2">44</div>
              <div className="text-gray-400">Shows Documented</div>
            </div>
            <div>
              <div className="text-5xl font-black text-red-500 mb-2">60</div>
              <div className="text-gray-400">Years of Photos</div>
            </div>
            <div>
              <div className="text-5xl font-black text-red-500 mb-2">1936</div>
              <div className="text-gray-400">Oldest Car Featured</div>
            </div>
            <div>
              <div className="text-5xl font-black text-red-500 mb-2">Pomona</div>
              <div className="text-gray-400">Fairplex Location</div>
            </div>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Share Your Photos</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Contribute to our visual archive by submitting your event and build photos
          </p>
          <button className="px-10 py-4 bg-red-600 text-white font-semibold rounded-full hover:bg-red-500 transition-colors duration-300">
            Submit Photos
          </button>
        </div>
      </div>
    </div>
  );
}
