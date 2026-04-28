import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const categories = [
    {
      title: 'Classic Roadsters',
      subtitle: 'Timeless Elegance',
      desc: 'Open-top legends from the golden era of automotive design',
      year: '1920s-1960s'
    },
    {
      title: 'Hot Rods',
      subtitle: 'Raw Power',
      desc: 'Custom-built machines pushing performance boundaries',
      year: '1930s-1950s'
    },
    {
      title: 'Sports Cars',
      subtitle: 'European Precision',
      desc: 'Iconic speedsters that defined motorsport excellence',
      year: '1950s-1970s'
    },
    {
      title: 'Custom Builds',
      subtitle: 'Modern Artistry',
      desc: 'Contemporary interpretations of classic automotive culture',
      year: '2000s-Present'
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gallery-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });

      const items = document.querySelectorAll('.gallery-item');
      items.forEach((item, index) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
          },
          y: 100,
          opacity: 0,
          rotateX: -45,
          duration: 1,
          delay: index * 0.1,
          ease: 'power3.out',
        });

        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(item.querySelector('.gallery-overlay'), {
          opacity: 1,
          duration: 0.4,
        })
        .to(item.querySelector('.gallery-content'), {
          y: 0,
          opacity: 1,
          duration: 0.4,
        }, '-=0.2')
        .to(item.querySelector('.gallery-image'), {
          scale: 1.1,
          duration: 0.6,
        }, 0);

        item.addEventListener('mouseenter', () => hoverTl.play());
        item.addEventListener('mouseleave', () => hoverTl.reverse());
      });

      gsap.to('.floating-number', {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        stagger: 0.2,
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative py-40 px-4 bg-black overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,107,0,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,107,0,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="gallery-title mb-20">
          <div className="flex items-end justify-between flex-wrap gap-8">
            <div>
              <div className="text-sm tracking-[0.3em] text-red-500 mb-4 font-light">
                EXPLORE EXCELLENCE
              </div>
              <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-black leading-[0.9] tracking-tight">
                <div className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                  FEATURED<br />COLLECTION
                </div>
              </h2>
            </div>
            <button className="px-8 py-4 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 font-semibold flex items-center gap-2 group">
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="gallery-item relative h-[500px] rounded-2xl overflow-hidden cursor-pointer group"
              style={{ perspective: '1000px' }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {/* Background Image Placeholder */}
              <div className="gallery-image absolute inset-0 bg-gradient-to-br from-red-600/30 to-blue-900/30 scale-100 transition-transform duration-700" />

              {/* Overlay */}
              <div className="gallery-overlay absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-80" />

              {/* Large Number */}
              <div className="floating-number absolute top-8 right-8 text-[10rem] font-black text-white/5 leading-none">
                {(index + 1).toString().padStart(2, '0')}
              </div>

              {/* Content */}
              <div className="gallery-content absolute bottom-0 left-0 right-0 p-8 translate-y-8 opacity-0">
                <div className="text-sm text-red-500 mb-2 tracking-wider">{category.year}</div>
                <h3 className="text-4xl font-black text-white mb-2">{category.title}</h3>
                <div className="text-xl text-red-400 mb-4 font-light">{category.subtitle}</div>
                <p className="text-gray-300 mb-6 leading-relaxed">{category.desc}</p>
                <div className="flex items-center gap-2 text-white font-semibold">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>

              {/* Border Animation */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500/50 rounded-2xl transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-block p-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">Want to showcase your classic?</h3>
            <p className="text-gray-400 mb-6 max-w-2xl">
              Join our community and share your automotive masterpiece with thousands of enthusiasts
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300">
              Submit Your Car
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
