import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Instagram, Facebook, Twitter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-section', {
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

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto" ref={sectionRef}>
        {/* Header */}
        <div className="mb-20 text-center">
          <div className="text-sm tracking-[0.3em] text-red-500 mb-4 font-light">
            GET IN TOUCH
          </div>
          <h1 className="text-[clamp(3rem,10vw,7rem)] font-black leading-[0.9] tracking-tight mb-6">
            <div className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              CONTACT US
            </div>
          </h1>
        </div>

        {/* Contact Info */}
        <div className="contact-section max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            We'd Love to Hear From You
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed mb-12">
            Have questions about the club, membership, or upcoming events? Reach out to us through email or follow us on social media.
          </p>

          <div className="flex flex-col items-center gap-8">
            {/* Email */}
            <a 
              href="mailto:1932lar@gmail.com" 
              className="flex items-center gap-4 text-gray-400 hover:text-red-500 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center text-red-500 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-xl">1932lar@gmail.com</span>
            </a>

            {/* Social Media */}
            <div className="flex items-center gap-6">
              <a 
                href="https://www.instagram.com/laroadsters1957/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-red-500 hover:border-red-500 transition-all duration-300"
              >
                <Instagram className="w-6 h-6 text-gray-400 group-hover:text-white" />
              </a>
              <a 
                href="https://www.facebook.com/LARoadsterShow/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-red-500 hover:border-red-500 transition-all duration-300"
              >
                <Facebook className="w-6 h-6 text-gray-400 group-hover:text-white" />
              </a>
              <a 
                href="https://twitter.com/LARoadsters" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-red-500 hover:border-red-500 transition-all duration-300"
              >
                <Twitter className="w-6 h-6 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}