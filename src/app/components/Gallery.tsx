import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Member data from upload
const members = [
  {
    id: 1,
    name: 'Wayne & Betty Pendola',
    car: '1932 Ford Roadster',
    story: `Wayne Pendola

Wayne has been a member of the club since 2000. His club car is a 1932 Ford Roadster. He has held the office of Vice President in 2006 and 2007.

Wayne holds the office of People's Voice for 2012 and 2013.

Wayne is married, his lovely wife is Betty. Wayne and Betty have four children and six grandchildren. 

Wayne says he's retired – but he keeps plenty busy working in his "Hobby Rod Shop". Wayne is a meticulous car builder and it shows in every car he builds.

Betty is retired too, she keeps busy spending time with family and friends and with her many hobbies. She enjoys knitting beautiful purses, creating lovely quilts, scrapbooking, and most recently she's into needlepoint. Very creative lady!

Wayne and Betty enjoy traveling to the coast in their RV. Getting away, relaxing and spending time together and with family and friends.

What it means to be a member of the L. A. Roadsters: Very proud to be a member of the Club.`,
    coverImage: '/assets/gallery/members/Wayne & Betty Pendola/pendolacar.jpg',
    storyImage: '/assets/gallery/members/Wayne & Betty Pendola/pemdolafill.jpg',
  },
  {
    id: 2,
    name: 'Jeff & Vickie Tann',
    car: '1936 Ford Cabriolet',
    story: `Jeff Tann

Jeff has been a member of the club since 1997. His club car is a 1936 Ford Cabriolet.

Jeff also built and owns a 1928 Ford Model A Coupe, 1928 Ford Sedan Delivery, 1940 Ford Coupe and 1965 Pontiac GTO.

From 2013 to Present, Jeff holds the office of Vice President. He has also held the office of Secretary from 2003-2011, Show Chairman in 2006 and Assistant Show Chairman in 2007.

Jeff and Vickie have been married for 47 years.

Jeff has always had a job that he loved. His job was his hobby. He's retired now and loving it. He was the West Coast Technical Editor for Street Rod Builder and Super Rod Magazines for ten years; the former editor for Rod & Custom Magazine for nine years; and Muscle Car Classics Magazine for four years. He's also been on the editorial staff for Hot Rod and Popular Hot Rodding Magazines. 

Vickie retired from Los Angeles Department of Water and Power in 2007 with 32 years of service. She keeps busy with family and friends, and maintaining the Club's documents and website.

Jeff's hobbies include cars, all kinds of cars. Building, restoring and tinkering with cars in his home hobby shop. He does all work on his cars, except the interiors, and his garage is always full of beautiful cars.

Jeff has owned the yellow 1928 Model A Coupe since 1967 when he met Vickie. He purchased the car for $450 from Club Member Larry Ready. Jeff says he'll never part with the car - she's a keeper – just like Vickie.

What it means to be a member of the L. A. Roadsters: Being part of the greatest club on the face of the earth. Great cars and people. It's a privilege to be part of hot rodding history.`,
    coverImage: '/assets/gallery/members/Jeff & Vickie Tann/tanncar.jpg',
    storyImage: '/assets/gallery/members/Jeff & Vickie Tann/tannfill.jpg',
  },
  {
    id: 3,
    name: 'Richard & Brenda Anderson',
    car: '1928 Ford Roadster Pickup',
    story: `Richard Anderson

Richard (Dick) has been a member of the club since 1998. His club car is a 1928 Ford Roadster Pickup. He also owns a 1927 Ford Track Roadster, 1934 Ford Two-Door Sedan, 1939 Ford Two-Door Sedan, 1967 Ford Ranchero and 1964 Porsche 356C.

Dick has held the offices of Secretary 2000-2001, Treasurer 2002-2004, and Vice President 2005.

Dick has been married to his wife Brenda for 37 years. They have two sons: Scott, a former Marine Harrier Pilot. He now flies for Delta Airlines and the Air National Guard. Scott's married and also an Associate Member of the L. A. Roadsters. Son Gregg, is married with two boys. He is a manager of Canadian Operations for a Telemarketing company and an avid golfer.

In 1994, Dick retired as a Certified Medical Representative and Surgical Consultant. Dick doesn't know what it's like to retire. He's still working, as the Director of Aircraft Maintenance for Fast Aviation at El Monte Airport.

After 39 years, Brenda retired as a School Administrator. She now works part-time as a Pharmacy Tech and plays lots of tennis.

Both Dick and Brenda are pilots. Dick is instrument and multi-engine rated. They enjoy playing tennis together and tinkering with cars and airplanes.

What it means to be a member of the L. A. Roadsters: Dick is very proud and honored to be a part of history and tradition.`,
    coverImage: '/assets/gallery/members/Richard & Brenda Anderson/andersoncar.jpg',
    storyImage: '/assets/gallery/members/Richard & Brenda Anderson/andersonfill.jpg',
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
          {members.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="member-card group cursor-pointer"
            >
              <div className="relative h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-red-600/20 to-blue-900/20 border border-white/10 hover:border-red-500/50 transition-all duration-500">
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