import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Filter, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Image data for each category
const galleryImages = {
  'la-roadster-shows': [
    { src: '/assets/gallery/LA-Roadster-Shows/2025NWDD1.jpeg', caption: "Father's Day Show 2025" },
    { src: '/assets/gallery/LA-Roadster-Shows/2025NWDD2.jpeg', caption: "Father's Day Show 2025" },
    { src: '/assets/gallery/LA-Roadster-Shows/2025NWDD3.jpeg', caption: "Father's Day Show 2025" },
    { src: '/assets/gallery/LA-Roadster-Shows/2025NWDD4.jpeg', caption: "Father's Day Show 2025" },
  ],
  runs: [
    { src: '/assets/gallery/Runs/run1.jpeg', caption: 'Club Run' },
    { src: '/assets/gallery/Runs/run3.jpeg', caption: 'Club Run' },
    { src: '/assets/gallery/Runs/run4.jpg', caption: 'Club Run' },
    { src: '/assets/gallery/Runs/run5.jpg', caption: 'Club Run' },
    { src: '/assets/gallery/Runs/run6.jpg', caption: 'Club Run' },
    { src: '/assets/gallery/Runs/run7.jpg', caption: 'Club Run' },
    { src: '/assets/gallery/Runs/run8.jpg', caption: 'Club Run' },
    { src: '/assets/gallery/Runs/run9.jpg', caption: 'Club Run' },
    { src: '/assets/gallery/Runs/run10.jpg', caption: 'Club Run' },
    { src: '/assets/gallery/Runs/run11.jpg', caption: 'Club Run' },
    { src: '/assets/gallery/Runs/run12.jpg', caption: 'Club Run' },
    { src: '/assets/gallery/Runs/run13.jpeg', caption: 'Club Run' },
    { src: '/assets/gallery/Runs/run14.jpeg', caption: 'Club Run' },
    { src: '/assets/gallery/Runs/run15.jpeg', caption: 'Club Run' },
    { src: '/assets/gallery/Runs/run16.jpg', caption: 'Club Run' },
    { src: '/assets/gallery/Runs/run17.jpg', caption: 'Club Run' },
  ],
  members: [
    { src: '/assets/gallery/Club-cars/BUCKRDSTER3.jpg', caption: 'Member Car' },
    { src: '/assets/gallery/Club-cars/BUTLER1.jpg', caption: 'Member Car' },
    { src: '/assets/gallery/Club-cars/COHN6.jpg', caption: 'Member Car' },
    { src: '/assets/gallery/Club-cars/gammell_car copy.jpg', caption: 'Member Car' },
    { src: '/assets/gallery/Club-cars/jordan copy.JPG', caption: 'Member Car' },
    { src: '/assets/gallery/Club-cars/kreb_carJT copy.jpg', caption: 'Member Car' },
    { src: '/assets/gallery/Club-cars/Scritchfield_Roadster copy.jpg', caption: 'Member Car' },
    { src: '/assets/gallery/Club-cars/simeone_car1 copy.JPG', caption: 'Member Car' },
    { src: '/assets/gallery/Club-cars/tann cabby copy.jpg', caption: 'Member Car' },
    { src: '/assets/gallery/Club-cars/tann topdown copy.jpg', caption: 'Member Car' },
    { src: '/assets/gallery/Club-cars/winson copy.JPG', caption: 'Member Car' },
  ],
};

const filters = [
  { id: 'all', label: 'All' },
  { id: 'la-roadster-shows', label: 'LA Roadster Shows' },
  { id: 'runs', label: 'Runs' },
  { id: 'members', label: 'Members' },
];

const galleries = [
  { 
    category: 'la-roadster-shows', 
    title: "Father's Day Show 2025", 
    count: galleryImages['la-roadster-shows'].length,
    image: galleryImages['la-roadster-shows'][0].src
  },
  { 
    category: 'runs', 
    title: 'Club Runs', 
    count: galleryImages['runs'].length,
    image: galleryImages['runs'][0].src
  },
  { 
    category: 'members', 
    title: 'Member Cars', 
    count: galleryImages['members'].length,
    image: galleryImages['members'][0].src
  },
];

export function PhotoGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedGallery, setSelectedGallery] = useState<typeof galleries[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gallery-grid-item', {
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

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedGallery) {
      document.body.style.overflow = 'hidden';
      // Add escape key handler
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeGallery();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedGallery]);

  const filteredGalleries = activeFilter === 'all'
    ? galleries
    : galleries.filter(g => g.category.toLowerCase() === activeFilter.toLowerCase());

  const openGallery = (gallery: typeof galleries[0]) => {
    setSelectedGallery(gallery);
    setCurrentImageIndex(0);
  };

  const closeGallery = () => {
    setSelectedGallery(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    const images = galleryImages[selectedGallery!.category as keyof typeof galleryImages];
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = galleryImages[selectedGallery!.category as keyof typeof galleryImages];
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImages = selectedGallery 
    ? galleryImages[selectedGallery.category as keyof typeof galleryImages]
    : [];

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto" ref={sectionRef}>
        {/* Header */}
        <div className="mb-16">
          <div className="text-sm tracking-[0.3em] text-red-500 mb-4 font-light">
            VISUAL ARCHIVE
          </div>
          <h1 className="text-[clamp(3rem,10vw,7rem)] font-black leading-[0.9] tracking-tight mb-6">
            <div className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              PHOTO GALLERY
            </div>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Explore photos from our shows, runs, and member cars
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-12 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-400">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-semibold">Filter:</span>
          </div>
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-red-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleries.map((gallery, index) => (
            <div
              key={index}
              className="gallery-grid-item group cursor-pointer"
              onClick={() => openGallery(gallery)}
            >
              <div className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-red-600/20 to-blue-900/20 border border-white/10 hover:border-red-500/50 transition-all duration-500">
                {/* Background Image */}
                <img 
                  src={gallery.image} 
                  alt={gallery.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                  {gallery.count} Photos
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-sm text-red-500 mb-2 font-semibold tracking-wider uppercase">
                    {gallery.category.replace('-', ' ')}
                  </div>
                  <h3 className="text-2xl font-black text-white group-hover:text-red-400 transition-colors duration-300">
                    {gallery.title}
                  </h3>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,0,0.3),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Click icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-16 h-16 bg-red-500/80 rounded-full flex items-center justify-center">
                    <Maximize2 className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 p-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-black text-red-500 mb-2">44</div>
              <div className="text-gray-400">Shows Documented</div>
            </div>
            <div>
              <div className="text-5xl font-black text-red-500 mb-2">60</div>
              <div className="text-gray-400">Years of Photos</div>
            </div>
            <div>
              <div className="text-5xl font-black text-red-500 mb-2">1957</div>
              <div className="text-gray-400">Club Founded</div>
            </div>
            <div>
              <div className="text-5xl font-black text-red-500 mb-2">Pomona</div>
              <div className="text-gray-400">Fairplex Location</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedGallery && (
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

          {/* Gallery title */}
          <div className="absolute top-6 left-6 z-40">
            <div className="text-sm text-red-500 font-semibold tracking-wider uppercase">
              {selectedGallery.category.replace('-', ' ')}
            </div>
            <h2 className="text-2xl font-black text-white">{selectedGallery.title}</h2>
            <div className="text-gray-400 text-sm mt-1">
              {currentImageIndex + 1} of {currentImages.length}
            </div>
          </div>

          {/* Prev button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-6 w-12 h-12 bg-white/10 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors duration-300 z-40"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-6 w-12 h-12 bg-white/10 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors duration-300 z-40"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Main image */}
          <div 
            className="max-w-5xl max-h-[80vh] px-20 cursor-default" 
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImages[currentImageIndex].src}
              alt={currentImages[currentImageIndex].caption}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="text-center mt-4 text-gray-400">
              {currentImages[currentImageIndex].caption}
            </div>
          </div>

          {/* Thumbnail strip */}
          <div 
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 cursor-default" 
            onClick={(e) => e.stopPropagation()}
          >
            {currentImages.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                  idx === currentImageIndex ? 'border-red-500' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img
                  src={img.src}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}