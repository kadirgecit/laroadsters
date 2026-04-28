import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Star, Calendar, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars = document.querySelectorAll('.about-char');

      gsap.from(chars, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1,
        },
        opacity: 0.2,
        scale: 0.3,
        stagger: 0.02,
      });

      gsap.from('.about-text', {
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
        },
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });

      gsap.from('.stat-card', {
        scrollTrigger: {
          trigger: '.stats-grid',
          start: 'top 75%',
        },
        y: 100,
        opacity: 0,
        rotateY: 45,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
      });

      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        y: -100,
      });

      const floatingElements = document.querySelectorAll('.floating-badge');
      floatingElements.forEach((el) => {
        gsap.to(el, {
          y: -20,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="about-char inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const stats = [
    { icon: Calendar, value: '1957', label: 'Founded', color: 'from-red-500 to-red-600' },
    { icon: Award, value: '60', label: 'Years Strong', color: 'from-blue-500 to-red-600' },
    { icon: Star, value: '44', label: 'Annual Shows', color: 'from-blue-500 to-cyan-600' },
    { icon: MapPin, value: 'Pomona', label: 'Fairplex, CA', color: 'from-yellow-500 to-red-600' },
  ];

  return (
    <div ref={sectionRef} className="relative py-40 px-4 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-3xl floating-badge" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl floating-badge" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Title */}
        <div className="mb-32">
          <h2 className="text-[clamp(2.5rem,8vw,7rem)] font-black leading-[0.9] tracking-tight mb-8">
            <div className="overflow-hidden text-white">
              LEGENDARY
            </div>
            <div className="overflow-hidden text-white" style={{ textShadow: '0 0 40px rgba(255,255,255,0.3)' }}>
              HERITAGE
            </div>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <div ref={textRef}>
            <div className="about-text space-y-6 text-lg text-gray-400 leading-relaxed">
              <p className="text-2xl text-white font-light">
                The Los Angeles Roadsters Car Club — established in 1957 and still going strong. We're celebrating our 60th Anniversary in 2026.
              </p>
              <p>
                For six decades, we've hosted the world's premier pre-war roadster show at the Fairplex in Pomona, California. Our 44th Annual Show & Swap brings together the finest classics on Father's Day Weekend.
              </p>
              <p>
                Only finished roadsters park in our Show area — no project cars, no exceptions. Every car that makes the cut represents the pinnacle of automotive craftsmanship and passion.
              </p>
              <div className="pt-6">
                <button className="px-8 py-4 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 font-semibold">
                  Discover Our Story
                </button>
              </div>
            </div>
          </div>

          <div ref={imageRef} className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-red-600/20 to-blue-900/20 rounded-2xl border border-red-500/20 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,0,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute inset-0 flex items-center justify-center text-6xl font-black text-white/10">
                1957
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card relative group"
              style={{ perspective: '1000px' }}
            >
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-red-500/50 transition-all duration-500 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                <stat.icon className="w-10 h-10 text-red-500 mb-4" />
                <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-500 tracking-wider uppercase">{stat.label}</div>

                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-red-500/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
