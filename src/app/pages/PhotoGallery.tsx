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

interface Album {
  id: string;
  slug: string;
  title: string;
  cover_url: string | null;
  sort_order: number;
}

interface Photo {
  id: string;
  blob_url: string;
  title: string | null;
  caption: string | null;
  sort_order: number;
}

// Filter categories are hardcoded to match the customer's design.
// Each category maps to an album by slug. The admin pre-creates albums with
// these slugs; if the DB has no matching album, that category is hidden.
const filters = [
  { id: 'all', label: 'All' },
  { id: 'runs', label: 'Runs' },
  { id: 'members', label: 'Members' },
];

export function PhotoGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [slides, setSlides] = useState<{ src: string; alt: string; title?: string }[]>([]);
  const [albums, setAlbums] = useState<Record<string, Album & { photos: Photo[]; count: number }>>({});
  const [loaded, setLoaded] = useState(false);

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

  // Fetch all albums, then fetch photos per album in parallel.
  useEffect(() => {
    fetch('/api/public/gallery-albums')
      .then((r) => r.json())
      .then(async (rows: Album[]) => {
        const map: Record<string, Album & { photos: Photo[]; count: number }> = {};
        await Promise.all(
          rows.map(async (a) => {
            const pr = await fetch(`/api/public/gallery-photos?album=${encodeURIComponent(a.id)}`);
            const photos: Photo[] = await pr.json();
            const sorted = [...photos].sort((x, y) => x.sort_order - y.sort_order);
            map[a.slug] = { ...a, photos: sorted, count: sorted.length };
          }),
        );
        setAlbums(map);
      })
      .catch(() => { /* leave empty on failure */ })
      .finally(() => setLoaded(true));
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

  // Only show the categories the design hardcodes (runs, members).
  // Other albums in the DB are still manageable in the admin but not surfaced here.
  const visibleAlbums = (['runs', 'members'] as const)
    .filter((slug) => albums[slug])
    .map((slug) => albums[slug]);

  const filteredGalleries =
    activeFilter === 'all'
      ? visibleAlbums
      : visibleAlbums.filter((a) => a.slug === activeFilter);

  const openGallery = (album: Album & { photos: Photo[]; count: number }) => {
    setSlides(
      album.photos.map((p) => ({
        src: p.blob_url,
        alt: p.caption || p.title || '',
        title: p.title || p.caption || '',
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
          {filteredGalleries.length === 0 && loaded ? (
            <div className="col-span-full text-center py-12 text-gray-500 text-sm">
              No albums available yet.
            </div>
          ) : (
            filteredGalleries.map((gallery) => (
              <div
                key={gallery.id}
                className="gallery-grid-item group cursor-pointer"
                onClick={() => openGallery(gallery)}
              >
                <div className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-red-600/20 to-blue-900/20 border border-white/10 hover:border-red-500/50 transition-all duration-500">
                  {/* Background Image */}
                  {gallery.cover_url ? (
                    <img
                      src={gallery.cover_url}
                      alt={gallery.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm">No photos yet</div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                    {gallery.count} Photos
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-sm text-red-500 mb-2 font-semibold tracking-wider uppercase">
                      {gallery.slug.replace('-', ' ')}
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
            ))
          )}
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
