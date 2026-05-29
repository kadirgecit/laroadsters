import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Member data
const members = [
  {
    id: 1,
    name: 'John Buck',
    car: 'Roadster',
    coverImage: '/assets/gallery/members/John Buck/BUCKRDSTER3.jpg',
    storyImage: '/assets/gallery/members/John Buck/BUCKRDSTER3.jpg',
    story: 'John Buck - LA Roadsters Member',
  },
  {
    id: 2,
    name: 'Ken Butler',
    car: 'Roadster',
    coverImage: '/assets/gallery/members/Ken Butler/BUTLER1.jpg',
    storyImage: '/assets/gallery/members/Ken Butler/BUTLER1.jpg',
    story: 'Ken Butler - LA Roadsters Member',
  },
  {
    id: 3,
    name: 'Rich Cohn',
    car: 'Roadster',
    coverImage: '/assets/gallery/members/Rich Cohn/COHN6.jpg',
    storyImage: '/assets/gallery/members/Rich Cohn/COHN6.jpg',
    story: 'Rich Cohn - LA Roadsters Member',
  },
  {
    id: 4,
    name: 'Doyle Gammell',
    car: 'Roadster',
    coverImage: '/assets/gallery/members/Doyle Gammell/gammell_car copy.jpg',
    storyImage: '/assets/gallery/members/Doyle Gammell/gammell_car copy.jpg',
    story: 'Doyle Gammell - LA Roadsters Member',
  },
  {
    id: 5,
    name: 'Randy Jordan',
    car: 'Roadster',
    coverImage: '/assets/gallery/members/Randy Jordan/jordan copy.JPG',
    storyImage: '/assets/gallery/members/Randy Jordan/jordan copy.JPG',
    story: 'Randy Jordan - LA Roadsters Member',
  },
  {
    id: 6,
    name: 'Bill Krebs',
    car: 'Roadster',
    coverImage: '/assets/gallery/members/Bill Krebs/kreb_carJT copy.jpg',
    storyImage: '/assets/gallery/members/Bill Krebs/kreb_carJT copy.jpg',
    story: 'Bill Krebs - LA Roadsters Member',
  },
  {
    id: 7,
    name: 'Dick Stritchfield',
    car: 'Roadster',
    coverImage: '/assets/gallery/members/Dick Stritchfield/Scritchfield_Roadster copy.jpg',
    storyImage: '/assets/gallery/members/Dick Stritchfield/Scritchfield_Roadster copy.jpg',
    story: 'Dick Stritchfield - LA Roadsters Member',
  },
  {
    id: 8,
    name: 'Rick Simeone',
    car: 'Roadster',
    coverImage: '/assets/gallery/members/Rick Simeone/simeone_car1 copy.JPG',
    storyImage: '/assets/gallery/members/Rick Simeone/simeone_car1 copy.JPG',
    story: 'Rick Simeone - LA Roadsters Member',
  },
  {
    id: 9,
    name: 'Jeff Tann',
    car: 'Roadster',
    coverImage: '/assets/gallery/members/Jeff Tann/tann cabby copy.jpg',
    storyImage: '/assets/gallery/members/Jeff Tann/tann cabby copy.jpg',
    story: 'Jeff Tann - LA Roadsters Member',
  },
  {
    id: 10,
    name: 'Paul Winson',
    car: 'Roadster',
    coverImage: '/assets/gallery/members/Paul Winson/winson copy.JPG',
    storyImage: '/assets/gallery/members/Paul Winson/winson copy.JPG',
    story: 'Paul Winson - LA Roadsters Member',
  },
];

export function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedMember, setSelectedMember] = useState<typeof members[0] | null>(null);

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
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSelectedMember(null);
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [selectedMember]);

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
        {/* Member Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 member-grid">
          {members.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="member-card group cursor-pointer"
            >
              <div className="relative h-[300px] rounded-2xl overflow-hidden bg-gradient-to-br from-red-600/20 to-blue-900/20 border border-white/10 hover:border-red-500/50 transition-all duration-500">
                {/* Member Photo */}
                <img
                  src={member.coverImage}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-black text-white group-hover:text-red-400 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <div className="text-sm text-red-500 mt-1 font-semibold tracking-wider uppercase">
                    {member.car}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Member Story Modal */}
      {selectedMember && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedMember(null)}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMember(null);
            }}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors duration-300 z-50"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Content */}
          <div 
            className="max-w-4xl w-full max-h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Car Image */}
            <div className="mb-8">
              <img
                src={selectedMember.storyImage}
                alt={selectedMember.name}
                className="w-full h-[300px] md:h-[400px] object-cover rounded-2xl"
              />
            </div>

            {/* Info */}
            <div className="text-center mb-8">
              <div className="text-sm text-red-500 font-semibold tracking-wider uppercase mb-2">
                {selectedMember.car}
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white">
                {selectedMember.name}
              </h2>
            </div>

            {/* Story */}
            <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
              <p className="text-gray-300 whitespace-pre-line text-lg leading-relaxed">
                {selectedMember.story}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}