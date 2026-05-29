import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, Clock, Sparkles } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export function Event() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'top 20%',
          scrub: 1,
        },
      });

      tl.from('.event-title', {
        y: 200,
        opacity: 0,
        rotateX: -45,
      })
      .from('.event-detail', {
        x: -100,
        opacity: 0,
        stagger: 0.1,
      }, '-=0.5')
      .from('.event-card', {
        scale: 0.8,
        opacity: 0,
        rotateY: 45,
      }, '-=0.5');

      gsap.to(cardRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        y: -80,
      });

      const features = document.querySelectorAll('.feature-item');
      features.forEach((feature) => {
        gsap.from(feature, {
          scrollTrigger: {
            trigger: feature,
            start: 'top 85%',
          },
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        });
      });

      gsap.to('.pulse-ring', {
        scale: 1.5,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: 'power2.out',
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative py-40 px-4 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,107,0,0.1),transparent_50%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title Section */}
        <div className="text-center mb-20" style={{ perspective: '1000px' }}>
          <div className="event-title inline-block">
            <div className="text-sm tracking-[0.3em] text-red-500 mb-4 font-light">
              THE PREMIER EVENT
            </div>
            <h2 className="text-[clamp(2.5rem,8vw,7rem)] font-black leading-[0.9] tracking-tight mb-6">
              <div className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                ANNUAL ROADSTER SHOW
              </div>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The world's premier classic roadster show — 44th Annual at Fairplex Pomona
            </p>
          </div>
        </div>

        {/* Main Event Card */}
        <div ref={cardRef} className="event-card max-w-5xl mx-auto mb-32">
          <div className="relative p-12 md:p-16 rounded-3xl bg-gradient-to-br from-red-600 to-red-800 overflow-hidden group">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }} />
            </div>

            {/* Pulse Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-2 border-white/20 pulse-ring" />

            <div className="relative z-10">
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="event-detail flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/70 mb-1">Date</div>
                    <div className="text-xl font-bold text-white">June 19-20, 2026</div>
                  </div>
                </div>

                <div className="event-detail flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/70 mb-1">Location</div>
                    <div className="text-xl font-bold text-white">Fairplex, 1101 W McKinley, Pomona</div>
                  </div>
                </div>

                <div className="event-detail flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/70 mb-1">Hours</div>
                    <div className="text-xl font-bold text-white">7am - 4pm Daily</div>
                  </div>
                </div>
              </div>

              <div className="text-center flex flex-wrap justify-center gap-4">
                <a
                  href="/flyer.pdf"
                  download
                  className="px-8 py-5 bg-white text-red-600 font-bold rounded-full hover:shadow-2xl transition-all duration-300 text-lg inline-block"
                >
                  Download Flyer (PDF)
                </a>
                <a
                  href="/news"
                  className="px-8 py-5 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-red-600 transition-all duration-300 text-lg inline-block"
                >
                  Show News
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
