import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Wrench, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function MemberNews() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.member-card', {
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

  const memberUpdates = [
    {
      icon: Trophy,
      date: 'May 28, 2026',
      member: 'Rick Johnson',
      title: 'Best in Show Winner',
      content: 'Rick\'s immaculate 1932 Ford Roadster took home Best in Show at the Grand National Roadster Show. The build features a custom-built flathead V8 and stunning candy apple red finish.',
      highlight: true,
    },
    {
      icon: Wrench,
      date: 'May 15, 2026',
      member: 'Sarah Martinez',
      title: 'Restoration Complete',
      content: 'After three years of meticulous work, Sarah has completed the restoration of her father\'s 1929 Model A Roadster. The car will debut at our Father\'s Day show.',
    },
    {
      icon: Calendar,
      date: 'May 10, 2026',
      member: 'Tom Williams',
      title: 'Tech Session Success',
      content: 'Tom hosted an incredible carburetor rebuild workshop at his shop. Over 30 members attended and learned valuable tuning techniques.',
    },
    {
      icon: Trophy,
      date: 'April 28, 2026',
      member: 'Mike Peterson',
      title: 'Magazine Feature',
      content: 'Mike\'s custom 1934 Ford Coupe was featured in Hot Rod Magazine\'s May issue. The article highlights his innovative chassis modifications.',
    },
    {
      icon: Wrench,
      date: 'April 20, 2026',
      member: 'Linda Chen',
      title: 'New Build Reveal',
      content: 'Linda unveiled her latest project: a traditional hot rod built from a 1923 T-Bucket with modern performance upgrades while maintaining period-correct aesthetics.',
    },
    {
      icon: Calendar,
      date: 'April 5, 2026',
      member: 'Dave Anderson',
      title: 'Cruise Night Host',
      content: 'Dave organized our spring cruise night through the San Gabriel Valley. Over 200 classics participated in this memorable evening run.',
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto" ref={sectionRef}>
        {/* Header */}
        <div className="mb-16">
          <div className="text-sm tracking-[0.3em] text-red-500 mb-4 font-light">
            MEMBER SPOTLIGHT
          </div>
          <h1 className="text-[clamp(3rem,10vw,7rem)] font-black leading-[0.9] tracking-tight mb-6">
            <div className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              MEMBER NEWS
            </div>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Celebrating the achievements, builds, and stories of our incredible community
          </p>
        </div>

        {/* Featured Member */}
        {memberUpdates[0] && (
          <div className="member-card mb-12">
            <div className="relative p-12 md:p-16 rounded-3xl bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-500/30 backdrop-blur-sm overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,0,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                    {React.createElement(memberUpdates[0].icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">{memberUpdates[0].date}</div>
                    <div className="text-2xl font-bold text-white">{memberUpdates[0].member}</div>
                  </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  {memberUpdates[0].title}
                </h2>

                <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">
                  {memberUpdates[0].content}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Member Updates Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {memberUpdates.slice(1).map((update, index) => (
            <div
              key={index}
              className="member-card group cursor-pointer"
            >
              <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-red-500/50 transition-all duration-500">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/30 transition-colors duration-300">
                    <update.icon className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">{update.date}</div>
                    <div className="text-lg font-bold text-white">{update.member}</div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors duration-300">
                  {update.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {update.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Submit CTA */}
        <div className="member-card mt-20">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Share Your Story</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Have a build update, achievement, or event to share with the community? We'd love to feature your story!
            </p>
            <button className="px-10 py-4 bg-red-600 text-white font-semibold rounded-full hover:bg-red-500 transition-colors duration-300">
              Submit Your News
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
