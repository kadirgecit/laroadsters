import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, Clock, DollarSign, Package, Users } from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export function SwapMeet() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.swap-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto" ref={sectionRef}>
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="text-sm tracking-[0.3em] text-red-500 mb-4 font-light">
            BUY • SELL • TRADE
          </div>
          <h1 className="text-[clamp(3rem,10vw,7rem)] font-black leading-[0.9] tracking-tight mb-6">
            <div className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              SWAP MEET
            </div>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            The ultimate marketplace for vintage auto parts, accessories, and automotive treasures
          </p>
        </div>

        {/* Hero Section */}
        <div className="swap-card mb-20">
          <div className="relative p-12 md:p-16 rounded-3xl bg-gradient-to-br from-red-600/20 to-blue-900/20 border border-red-500/30 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }} />
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Next Swap Meet
              </h2>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="text-sm text-gray-400">Date</div>
                  <div className="text-xl font-bold text-white">Saturday, June 14, 2026</div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="text-sm text-gray-400">Hours</div>
                  <div className="text-xl font-bold text-white">6:00 AM - 2:00 PM</div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="text-sm text-gray-400">Location</div>
                  <div className="text-xl font-bold text-white">Fairplex, Pomona CA</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center flex-wrap">
                <MagneticButton
                  className="px-10 py-4 bg-red-600 text-white font-semibold rounded-full hover:bg-red-500 transition-colors duration-300"
                  strength={0.4}
                >
                  Reserve Vendor Space
                </MagneticButton>
                <MagneticButton
                  className="px-10 py-4 border border-white/30 text-white font-semibold rounded-full hover:border-red-500 transition-colors duration-300"
                  strength={0.4}
                >
                  Buyer Information
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <div className="swap-card p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-red-500/50 transition-all duration-500">
            <Package className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">What You'll Find</h3>
            <p className="text-gray-400 leading-relaxed">
              Vintage parts, complete engines, body panels, chrome, upholstery, wheels, tires, and everything automotive.
            </p>
          </div>

          <div className="swap-card p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-red-500/50 transition-all duration-500">
            <DollarSign className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Vendor Pricing</h3>
            <ul className="text-gray-400 space-y-2">
              <li>• Single Space: $50</li>
              <li>• Double Space: $90</li>
              <li>• Premium Corner: $75</li>
              <li>• Early Entry: $25 extra</li>
            </ul>
          </div>

          <div className="swap-card p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-red-500/50 transition-all duration-500">
            <Users className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Admission</h3>
            <ul className="text-gray-400 space-y-2">
              <li>• General: $10</li>
              <li>• LAR Members: $5</li>
              <li>• Kids Under 12: Free</li>
              <li>• Early Bird (5 AM): $20</li>
            </ul>
          </div>
        </div>

        {/* Vendor Info */}
        <div className="swap-card">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-6">Vendor Information</h2>

            <div className="grid md:grid-cols-2 gap-8 text-gray-400">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Setup & Rules</h3>
                <ul className="space-y-2 leading-relaxed">
                  <li>• Vendor setup begins at 4:00 AM</li>
                  <li>• All vehicles must be unloaded by 6:00 AM</li>
                  <li>• 20x20 ft spaces include one parking pass</li>
                  <li>• Tables and canopies permitted</li>
                  <li>• No early pack-up before 1:00 PM</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">What to Bring</h3>
                <ul className="space-y-2 leading-relaxed">
                  <li>• Tables and display equipment</li>
                  <li>• Canopy or shade structure</li>
                  <li>• Cash for change</li>
                  <li>• Business cards</li>
                  <li>• Proper identification</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-gray-400 mb-4">
                <strong className="text-white">Contact for Reservations:</strong> Email us at{' '}
                <a href="mailto:1932lar@gmail.com" className="text-red-500 hover:text-red-400 transition-colors duration-300">
                  1932lar@gmail.com
                </a>
              </p>
              <p className="text-sm text-gray-500">
                Spaces are limited and fill up quickly. Reserve early to guarantee your spot!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
