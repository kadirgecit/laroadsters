import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Heart, Users, Wrench } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function AboutUs() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-section', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const values = [
    {
      icon: Heart,
      title: 'Passion',
      desc: 'A shared love for automotive history and craftsmanship drives everything we do.',
    },
    {
      icon: Users,
      title: 'Community',
      desc: 'Building lasting friendships through our mutual appreciation of classic cars.',
    },
    {
      icon: Award,
      title: 'Excellence',
      desc: 'Celebrating the highest standards in restoration and custom builds.',
    },
    {
      icon: Wrench,
      title: 'Preservation',
      desc: 'Keeping automotive heritage alive for future generations to enjoy.',
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto" ref={sectionRef}>
        {/* Header */}
        <div className="mb-20 text-center">
          <div className="text-sm tracking-[0.3em] text-red-500 mb-4 font-light">
            ESTABLISHED 1967
          </div>
          <h1 className="text-[clamp(3rem,10vw,7rem)] font-black leading-[0.9] tracking-tight mb-6">
            <div className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              ABOUT US
            </div>
          </h1>
        </div>

        {/* Story Section */}
        <div className="about-section mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                <p>
                  The Los Angeles Roadsters was founded in 1967 by a group of passionate automotive
                  enthusiasts who shared a vision: to preserve and celebrate the classic roadster
                  culture that defined Southern California's automotive heritage.
                </p>
                <p>
                  What began as informal weekend gatherings has grown into one of the most
                  respected automotive clubs in the nation. For over five decades, we've been
                  the gold standard for roadster preservation, restoration, and celebration.
                </p>
                <p>
                  Our annual Father's Day Roadster Show at the Fairplex in Pomona has become
                  a pilgrimage for automotive enthusiasts nationwide, showcasing the finest
                  examples of classic roadsters, hot rods, and sports cars.
                </p>
              </div>
            </div>

            <div className="aspect-[4/3] bg-gradient-to-br from-red-600/20 to-blue-900/20 rounded-2xl border border-red-500/20 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-center text-9xl font-black text-white/5">
                1967
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,0,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="about-section mb-20">
          <h2 className="text-4xl font-black text-white mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-red-500/50 transition-all duration-500 group"
              >
                <value.icon className="w-12 h-12 text-red-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="about-section">
          <div className="p-12 md:p-16 rounded-3xl bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-500/30 backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-xl text-gray-300 text-center max-w-4xl mx-auto leading-relaxed mb-8">
              To preserve automotive heritage, foster community among enthusiasts, and celebrate
              the artistry and craftsmanship of classic roadsters, hot rods, and sports cars
              through education, events, and fellowship.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-5xl font-black text-red-500 mb-2">5000+</div>
                <div className="text-gray-400">Members Strong</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-red-500 mb-2">50+</div>
                <div className="text-gray-400">Years of Excellence</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-red-500 mb-2">100K+</div>
                <div className="text-gray-400">Annual Visitors</div>
              </div>
            </div>
          </div>
        </div>

        {/* Join CTA */}
        <div className="about-section mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join Our Family?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Become part of a legendary community that shares your passion for automotive excellence
          </p>
          <button className="px-10 py-4 bg-red-600 text-white font-semibold rounded-full hover:bg-red-500 transition-colors duration-300">
            Become a Member
          </button>
        </div>
      </div>
    </div>
  );
}
