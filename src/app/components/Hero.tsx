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
    <div ref={heroRef} className="relative h-screen overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-[length:150%] md:bg-[length:100%]"
        style={{ backgroundImage: 'url(/hero-bg.jpg)', backgroundPosition: '50% 30%' }}
      />

      {/* Hero Text */}
      <div className="relative z-10 pt-24 flex flex-col items-center justify-start px-4">
        <style>{`
          @font-face {
            font-family: 'RAGE';
            src: url('/RAGE_1.TTF') format('truetype');
          }
          .rage-font {
            font-family: 'RAGE', sans-serif;
          }
        `}</style>
        <h1 className="text-white text-4xl md:text-6xl font-bold tracking-wider drop-shadow-lg">
          Los Angeles Roadsters
        </h1>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
      </div>
    </div>
  );
}