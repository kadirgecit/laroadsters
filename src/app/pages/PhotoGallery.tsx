import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Filter, Maximize2 } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import {
  Fullscreen,
  Thumbnails,
  Zoom,
  Captions,
} from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/captions.css';

gsap.registerPlugin(ScrollTrigger);

// Image data for each category
const galleryImages = {
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
    { src: '/assets/gallery/LA-Roadster-Shows/2025NWDD1.jpeg', caption: "Club Run" },
    { src: '/assets/gallery/LA-Roadster-Shows/2025NWDD2.jpeg', caption: "Club Run" },
    { src: '/assets/gallery/LA-Roadster-Shows/2025NWDD3.jpeg', caption: "Club Run" },
    { src: '/assets/gallery/LA-Roadster-Shows/2025NWDD4.jpeg', caption: "Club Run" },
  ],
  members: [
    { src: '/assets/gallery/Club-cars/BUCKRDSTER3.jpg', caption: 'John Buck' },
    { src: '/assets/gallery/Club-cars/BUTLER1.jpg', caption: 'Ken Butler' },
    { src: '/assets/gallery/Club-cars/COHN6.jpg', caption: 'Rich Cohn' },
    { src: '/assets/gallery/Club-cars/gammell_car copy.jpg', caption: 'Doyle Gammell' },
    { src: '/assets/gallery/Club-cars/jordan copy.JPG', caption: 'Randy Jordan' },
    { src: '/assets/gallery/Club-cars/kreb_carJT copy.jpg', caption: 'Bill Krebs' },
    { src: '/assets/gallery/Club-cars/Scritchfield_Roadster copy.jpg', caption: 'Dick Stritchfield' },
    { src: '/assets/gallery/Club-cars/simeone_car1 copy.JPG', caption: 'Rick Simeone' },
    { src: '/assets/gallery/Club-cars/tann cabby copy.jpg', caption: 'Jeff Tann' },
    { src: '/assets/gallery/Club-cars/winson copy.JPG', caption: 'Paul Winson' },
  ],
};

const filters = [
  { id: 'all', label: 'All' },
  { id: 'runs', label: 'Runs' },
  { id: 'members', label: 'Members' },
];

const galleries = [
  {
    category: 'runs',
    title: 'Club Runs',
    count: galleryImages['runs'].length,
    image: galleryImages['runs'][0].src,
  },
  {
    category: 'members',
    title: 'Member Cars',
    count: galleryImages['members'].length,
    image: galleryImages['members'][0].src,
  },
];

export function PhotoGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [slides, setSlides] = useState<{ src: string; alt: string; title?: string }[]>([]);

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

  // Body scroll lock when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxOpen]);

  const filteredGalleries =
    activeFilter === 'all'
      ? galleries
      : galleries.filter((g) => g.category.toLowerCase() === activeFilter.toLowerCase());

  const openGallery = (gallery: (typeof galleries)[0]) => {
    const images = galleryImages[gallery.category as keyof typeof galleryImages];
    setSlides(
      images.map((img) => ({
        src: img.src,
        alt: img.caption,
        title: img.caption,
      })),
    );
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

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
      </div>

      {/* Lightbox — uses yet-another-react-lightbox for fullscreen, prev/next,
          thumbnails, zoom, counter, click-outside, ESC, mobile gestures. */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Fullscreen, Thumbnails, Zoom, Captions]}
        captions={{ descriptionTextAlign: 'center', descriptionMaxLines: 2 }}
        thumbnails={{ position: 'bottom', border: 0, borderRadius: 8, gap: 8, width: 80, height: 60 }}
        carousel={{ finite: false, padding: 0, spacing: 0 }}
        animation={{ fade: 250, swipe: 250 }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
          thumbnailsContainer: { backgroundColor: 'rgba(0, 0, 0, 0.85)' },
        }}
      />
    </div>
  );
}
