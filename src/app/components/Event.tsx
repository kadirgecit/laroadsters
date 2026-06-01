import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
        <div className="text-center mb-20">
          <div className="event-title">
            <h2 className="text-[clamp(3rem,10vw,8rem)] font-black leading-[0.9] tracking-tight mb-8">
              <div className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                60th Anniversary
              </div>
            </h2>
            <h3 className="text-[clamp(1.5rem,5vw,4rem)] font-bold text-white mb-8">
              Los Angeles Roadsters Show and Swap
            </h3>
            <p className="text-2xl md:text-3xl text-red-500 font-semibold mb-8">
              Father's Day Weekend - June 19-20, 2026
            </p>
            <div className="text-xl md:text-2xl text-gray-300 space-y-2">
              <p>7:00 am – 4:00 pm</p>
              <p>Fairplex in Pomona</p>
              <p>1101 W. McKinley Avenue</p>
              <p>Pomona, California</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
