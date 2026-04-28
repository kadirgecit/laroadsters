import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from './MagneticButton';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars = document.querySelectorAll('.char');

      gsap.set(chars, {
        opacity: 0,
        y: 100,
        rotateX: -90,
      });

      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' }
      });

      tl.to(chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1.2,
        stagger: {
          each: 0.03,
          from: 'start',
        },
      })
      .from('.hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 1,
      }, '-=0.5')
      .from('.hero-cta', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
      }, '-=0.5')
      .from('.scroll-indicator', {
        opacity: 0,
        y: -20,
        duration: 0.6,
      }, '-=0.3');

      gsap.to('.parallax-layer-1', {
        y: 300,
        scale: 1.1,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('.parallax-layer-2', {
        y: 150,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(overlayRef.current, {
        opacity: 1,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('.hero-grid', {
        opacity: 0.3,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="char inline-block" style={{ perspective: '1000px' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div ref={heroRef} className="relative h-screen overflow-hidden bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero-bg.png)' }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <div ref={titleRef} className="text-center mb-8">
          <div className="text-sm tracking-[0.3em] text-red-500 mb-6 font-light">
            ESTABLISHED 1967
          </div>

          <h1 className="text-[clamp(3rem,12vw,11rem)] font-black leading-[0.9] mb-4 tracking-tight">
            <div className="overflow-hidden">
              {splitText('LOS ANGELES')}
            </div>
            <div className="overflow-hidden bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent">
              {splitText('ROADSTERS')}
            </div>
          </h1>

          <p className="hero-subtitle text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-light tracking-wide">
            Five decades of automotive excellence.<br />
            Where legends are preserved and passion ignites.
          </p>

          <div className="flex gap-6 justify-center flex-wrap">
            <MagneticButton
              className="hero-cta relative px-8 py-4 bg-red-600 text-white font-semibold rounded-full overflow-hidden group"
              strength={0.4}
            >
              <span className="relative z-10">Join the Club</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </MagneticButton>

            <MagneticButton
              className="hero-cta relative px-8 py-4 border border-white/20 text-white font-semibold rounded-full backdrop-blur-sm hover:border-red-500/50 transition-colors duration-300"
              strength={0.4}
            >
              Explore Gallery
            </MagneticButton>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator absolute bottom-12">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-500 tracking-wider">SCROLL</span>
            <div className="w-px h-16 bg-gradient-to-b from-red-500 to-transparent animate-pulse" />
            <ChevronDown className="w-4 h-4 text-red-500 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] pointer-events-none" />
    </div>
  );
}
