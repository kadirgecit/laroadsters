import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-content', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-[120vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 py-32">
        <div className="text-center">
          <h1 className="text-[clamp(3rem,10vw,8rem)] font-black leading-[0.9] tracking-tight mb-4">
            <div className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
              Los Angeles Roadsters
            </div>
          </h1>
          <p className="text-[clamp(1.5rem,5vw,3rem)] font-bold text-white mb-4">
            60th Anniversary
          </p>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg">
            Father's Day Weekend • June 19-20, 2026
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/70 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}