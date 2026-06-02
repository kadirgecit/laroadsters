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
    <div ref={heroRef} className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-white text-5xl md:text-7xl font-black tracking-wide drop-shadow-2xl mb-4">
            Los Angeles Roadsters
          </h1>
          <p className="text-white/90 text-xl md:text-2xl font-medium tracking-widest drop-shadow-lg">
            60th Anniversary
          </p>
          <p className="text-white/80 text-lg md:text-xl mt-4 drop-shadow-md">
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