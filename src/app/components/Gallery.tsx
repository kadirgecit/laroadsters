import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Member data with photos and stories
const members = [
  {
    id: 1,
    name: 'John Buck',
    car: '32 Ford Roadster',
    story: 'John has been a dedicated member of Los Angeles Roadsters since 1985. His beloved 32 Ford Roadster has won multiple awards at the Grand National Roadster Show. Building hot rods runs in his family - his grandfather built customs in the 1940s.',
    images: [
      '/assets/gallery/Club-cars/BUCKRDSTER3.jpg',
    ],
  },
  {
    id: 2,
    name: 'Butler',
    car: '34 Ford Coupe',
    story: 'A passionate hot rodder for over 40 years, Butler brings his beautifully crafted 34 Ford Coupe to every show. His attention to detail and traditional hot rod aesthetics make him a standout at our events.',
    images: [
      '/assets/gallery/Club-cars/BUTLER1.jpg',
    ],
  },
  {
    id: 3,
    name: 'George Cohn',
    car: '32 Ford Roadster',
    story: 'George Cohn is a founding member whose dedication to the club spans over five decades. His show-winning 32 Ford Roadster represents the pinnacle of traditional hot rodding craftsmanship.',
    images: [
      '/assets/gallery/Club-cars/COHN6.jpg',
    ],
  },
  {
    id: 4,
    name: 'Jim Gammell',
    car: '32 Ford Roadster',
    story: 'Jim\'s stunning purple 32 Ford Roadster turns heads wherever it goes. A master fabricator, Jim built most of his hot rod himself, including the custom chassis and body modifications.',
    images: [
      '/assets/gallery/Club-cars/gammell_car copy.jpg',
    ],
  },
  {
    id: 5,
    name: 'John Jordan',
    car: '32 Ford Roadster',
    story: 'John Jordan continues the tradition of building authentic hot rods. His patience and dedication to period-correct details have earned him recognition at shows across the country.',
    images: [
      '/assets/gallery/Club-cars/jordan copy.JPG',
    ],
  },
  {
    id: 6,
    name: 'John Kreb',
    car: '33 Ford Roadster',
    story: 'With over 35 years in the hobby, John Kreb\'s 33 Ford Roadster is a testament to classic hot rodding. He\'s been a consistent presence at our annual shows, always willing to share his knowledge with newcomers.',
    images: [
      '/assets/gallery/Club-cars/kreb_carJT copy.jpg',
    ],
  },
  {
    id: 7,
    name: 'Mike Scritchfield',
    car: '32 Ford Roadster',
    story: 'Mike Scritchfield\'s roadster represents decades of hot rodding passion. A master mechanic, he maintains his cars to show-quality standards while driving them to events as intended.',
    images: [
      '/assets/gallery/Club-cars/Scritchfield_Roadster copy.jpg',
    ],
  },
  {
    id: 8,
    name: 'Joe Simeone',
    car: '34 Ford Roadster',
    story: 'Joe Simeone brings his award-winning 34 Ford Roadster to our shows. Known for his meticulous craftsmanship, every nut and bolt on his roadster is finished to the highest standards.',
    images: [
      '/assets/gallery/Club-cars/simeone_car1 copy.JPG',
    ],
  },
  {
    id: 9,
    name: 'Bob Tann',
    car: '33 Ford Cabriolet',
    story: 'Bob Tann\'s 33 Ford Cabriolet is a beautiful example of California custom styling. He\'s been part of the LA Roadsters family for over 25 years, always ready to help with club events.',
    images: [
      '/assets/gallery/Club-cars/tann cabby copy.jpg',
    ],
  },
  {
    id: 10,
    name: 'Bob Tann',
    car: '32 Ford Roadster',
    story: 'Bob Tann\'s second creation - a stunning 32 Ford Roadster. This car showcases his evolution as a builder, featuring modern performance while maintaining classic styling.',
    images: [
      '/assets/gallery/Club-cars/tann topdown copy.jpg',
    ],
  },
  {
    id: 11,
    name: 'Steve Winson',
    car: '32 Ford Roadster',
    story: 'Steve Winson\'s 32 Ford Roadster exemplifies the Southern California hot rod style. With its flawless paint and chrome, it\'s a perennial favorite at our annual shows.',
    images: [
      '/assets/gallery/Club-cars/winson copy.JPG',
    ],
  },
];

export function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedMember, setSelectedMember] = useState<typeof members[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gallery-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });

      gsap.from('.member-card', {
        scrollTrigger: {
          trigger: '.member-grid',
          start: 'top 70%',
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeGallery();
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [selectedMember]);

  const openMember = (member: typeof members[0]) => {
    setSelectedMember(member);
    setCurrentImageIndex(0);
  };

  const closeGallery = () => {
    setSelectedMember(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (!selectedMember) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedMember.images.length);
  };

  const prevImage = () => {
    if (!selectedMember) return;
    setCurrentImageIndex((prev) => (prev - 1 + selectedMember.images.length) % selectedMember.images.length);
  };

  return (
    <div ref={sectionRef} className="relative py-40 px-4 bg-black overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="gallery-title mb-20">
          <div className="flex items-end justify-between flex-wrap gap-8">
            <div>
              <div className="text-sm tracking-[0.3em] text-red-500 mb-4 font-light">
                COMMUNITY SPOTLIGHT
              </div>
              <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-black leading-[0.9] tracking-tight">
                <div className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                  OUR<br />MEMBERS
                </div>
              </h2>
            </div>
            <a href="/member-news" className="px-8 py-4 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 font-semibold flex items-center gap-2 group">
              View Member News
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>

        {/* Member Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 member-grid">
          {members.map((member, index) => (
            <div
              key={member.id}
              onClick={() => openMember(member)}
              className="member-card group cursor-pointer"
            >
              <div className="relative h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-red-600/20 to-blue-900/20 border border-white/10 hover:border-red-500/50 transition-all duration-500">
                {/* Member Photo */}
                <img
                  src={member.images[0]}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-sm text-red-500 mb-1 font-semibold tracking-wider uppercase">
                    {member.car}
                  </div>
                  <h3 className="text-2xl font-black text-white group-hover:text-red-400 transition-colors duration-300">
                    {member.name}
                  </h3>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,0,0.3),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-block p-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">Want to showcase your classic?</h3>
            <p className="text-gray-400 mb-6 max-w-2xl">
              Join us at the 44th Annual Roadster Show & Swap
            </p>
          </div>
        </div>
      </div>

      {/* Member Lightbox */}
      {selectedMember && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeGallery}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeGallery();
            }}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors duration-300 z-50"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Info */}
          <div className="absolute top-6 left-6 z-40 max-w-md">
            <div className="text-sm text-red-500 font-semibold tracking-wider uppercase">
              {selectedMember.car}
            </div>
            <h2 className="text-3xl font-black text-white">{selectedMember.name}</h2>
          </div>

          {/* Navigation */}
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-6 w-12 h-12 bg-white/10 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors duration-300 z-40"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-6 w-12 h-12 bg-white/10 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors duration-300 z-40"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Main Content */}
          <div 
            className="max-w-5xl max-h-[80vh] px-20 flex items-center gap-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="flex-1">
              <img
                src={selectedMember.images[currentImageIndex]}
                alt={selectedMember.name}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
              />
            </div>

            {/* Story */}
            <div className="flex-1 text-white">
              <h3 className="text-xl font-bold text-red-500 mb-4">My Story</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {selectedMember.story}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}