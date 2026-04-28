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
                  <div className="text-xl font-bold text-white">June 19-20, 2026</div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="text-sm text-gray-400">Move-In (Thu)</div>
                  <div className="text-xl font-bold text-white">June 18, 7am-4pm</div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="text-sm text-gray-400">Enter Gate</div>
                  <div className="text-xl font-bold text-white">Gate #15 (Arrow Hwy)</div>
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
            <DollarSign className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Swap Space Pricing</h3>
            <ul className="text-gray-400 space-y-2">
              <li>• Regular Space (25' x 20'): $125</li>
              <li>• Corner Space: $150</li>
              <li>• Each space = 3 Fairplex parking spots</li>
              <li>• Pre-register by mail or phone</li>
              <li>• Contact: Ken Butler (805) 390-5187</li>
            </ul>
          </div>

          <div className="swap-card p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-red-500/50 transition-all duration-500">
            <Users className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Show Admission</h3>
            <ul className="text-gray-400 space-y-2">
              <li>• Adults: $25/person/day</li>
              <li>• Military (ID): $10</li>
              <li>• Children under 12: Free</li>
              <li>• 2-Day Pass: $45</li>
              <li>• Cash, debit & credit accepted</li>
            </ul>
          </div>

          <div className="swap-card p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-red-500/50 transition-all duration-500">
            <Package className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Items for Sale</h3>
            <ul className="text-gray-400 space-y-2">
              <li>• Car parts only</li>
              <li>• Car-related items</li>
              <li>• No general merchandise</li>
              <li>• Contact Ken Butler for info</li>
              <li>• 36fordken@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* Vendor Info */}
        <div className="swap-card">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-6">Vendor Information</h2>

            <div className="grid md:grid-cols-2 gap-8 text-gray-400">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Swap Meet Move-In</h3>
                <ul className="space-y-2 leading-relaxed">
                  <li>• Thursday June 18: Vendor move-in 7am-4pm</li>
                  <li>• Enter Gate #15 off Arrow Highway</li>
                  <li>• Spaces 25' x 20' (3 Fairplex spots)</li>
                  <li>• No early pack-up before 1:00 PM Sunday</li>
                  <li>• Contact: Ken Butler (805) 390-5187</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Commercial Vendors</h3>
                <ul className="space-y-2 leading-relaxed">
                  <li>• Thursday June 18: Move-in 7am-4pm</li>
                  <li>• Enter Gate #1</li>
                  <li>• All vehicles must be off ramp by 10am</li>
                  <li>• Contact: Rich Cohn (818) 402-8145</li>
                  <li>• Exhibitor inquiries welcome</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-gray-400 mb-4">
                <strong className="text-white">Swap Meet Contact:</strong>{' '}
                <a href="mailto:36fordken@gmail.com" className="text-red-500 hover:text-red-400 transition-colors duration-300">
                  36fordken@gmail.com
                </a>{' '}
                or Ken Butler (805) 390-5187
              </p>
              <p className="text-gray-400 mb-4">
                <strong className="text-white">Exhibitor Contact:</strong>{' '}
                <a href="mailto:1932lar@gmail.com" className="text-red-500 hover:text-red-400 transition-colors duration-300">
                  1932lar@gmail.com
                </a>{' '}
                or Rich Cohn (818) 402-8145
              </p>
              <p className="text-sm text-gray-500">
                Show Chairman: Dave Meissen (916) 220-0514
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
