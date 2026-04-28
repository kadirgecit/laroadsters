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
              The most anticipated automotive celebration on the West Coast
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
                    <div className="text-xl font-bold text-white">Father's Day Weekend</div>
                  </div>
                </div>

                <div className="event-detail flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/70 mb-1">Location</div>
                    <div className="text-xl font-bold text-white">Fairplex, Pomona</div>
                  </div>
                </div>

                <div className="event-detail flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/70 mb-1">When</div>
                    <div className="text-xl font-bold text-white">Every June</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <MagneticButton
                  className="px-12 py-5 bg-white text-red-600 font-bold rounded-full hover:shadow-2xl transition-all duration-300 text-lg"
                  strength={0.5}
                >
                  Register Now
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Legendary Showcases', desc: 'Over 500 pristine classics on display' },
            { title: 'National Recognition', desc: 'Attracting enthusiasts from across America' },
            { title: 'Award Ceremonies', desc: 'Celebrating excellence in automotive craftsmanship' },
          ].map((feature, index) => (
            <div
              key={index}
              className="feature-item relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-red-500/50 transition-all duration-500 group overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <Sparkles className="w-5 h-5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
