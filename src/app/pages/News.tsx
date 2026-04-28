import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function News() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.news-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const newsItems = [
    {
      date: 'June 15, 2026',
      category: 'Event',
      title: 'Father\'s Day Show Registration Now Open',
      excerpt: 'Early bird registration is now available for this year\'s premier roadster showcase at the Fairplex.',
      featured: true,
    },
    {
      date: 'May 28, 2026',
      category: 'Announcement',
      title: 'New Members Welcome Reception',
      excerpt: 'Join us for an exclusive evening celebrating our newest club members and their incredible builds.',
    },
    {
      date: 'May 10, 2026',
      category: 'Award',
      title: 'Member Wins Best in Show at Pomona',
      excerpt: 'Congratulations to club member Rick Johnson for his stunning 1932 Ford Roadster taking top honors.',
    },
    {
      date: 'April 22, 2026',
      category: 'Event',
      title: 'Spring Cruise Night Success',
      excerpt: 'Over 200 classics rolled out for our annual spring cruise through the San Gabriel Valley.',
    },
    {
      date: 'April 5, 2026',
      category: 'News',
      title: 'Club History Archive Now Online',
      excerpt: 'Explore five decades of memories with our newly digitized photo and document archive.',
    },
    {
      date: 'March 18, 2026',
      category: 'Tech',
      title: 'Carburetor Workshop Series Begins',
      excerpt: 'Join master mechanic Tom Williams for a hands-on series covering carburetor tuning and rebuild.',
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto" ref={sectionRef}>
        {/* Header */}
        <div className="mb-16">
          <div className="text-sm tracking-[0.3em] text-red-500 mb-4 font-light">
            STAY INFORMED
          </div>
          <h1 className="text-[clamp(3rem,10vw,7rem)] font-black leading-[0.9] tracking-tight mb-6">
            <div className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              LATEST NEWS
            </div>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Stay up to date with club events, member achievements, and automotive news
          </p>
        </div>

        {/* Featured Article */}
        {newsItems[0] && (
          <div className="news-card mb-12">
            <div className="relative p-12 rounded-3xl bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-500/30 backdrop-blur-sm overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,0,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-4 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                    FEATURED
                  </span>
                  <span className="text-gray-400 text-sm">{newsItems[0].date}</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 group-hover:text-red-400 transition-colors duration-300">
                  {newsItems[0].title}
                </h2>

                <p className="text-lg text-gray-300 mb-6 max-w-3xl">
                  {newsItems[0].excerpt}
                </p>

                <button className="flex items-center gap-2 text-red-500 font-semibold group-hover:gap-4 transition-all duration-300">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.slice(1).map((item, index) => (
            <div
              key={index}
              className="news-card group cursor-pointer"
            >
              <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-red-500/50 transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-500">{item.date}</span>
                </div>

                <div className="mb-3">
                  <span className="text-xs text-red-500 font-semibold tracking-wider uppercase">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors duration-300">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {item.excerpt}
                </p>

                <button className="flex items-center gap-2 text-red-500 text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                  Read More
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
