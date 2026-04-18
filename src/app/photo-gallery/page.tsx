import Image from "next/image";
import { FaImages } from "react-icons/fa";

export default function PhotoGalleryPage() {
  return (
    <div className="bg-primary min-h-screen">
      {/* Header */}
      <section className="bg-secondary border-b border-gold/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-5xl md:text-6xl text-gold tracking-widest mb-2">
            PHOTO GALLERY
          </h1>
          <p className="text-text-muted font-sans">Classic cars from LA Roadsters events</p>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Bent Axles */}
            <div className="bg-secondary rounded-lg overflow-hidden border border-gold/20">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/original/Pictures/bent axles 2018r.jpg"
                  alt="Bent Axles Car Show 2019"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="font-display text-xl text-gold tracking-wider mb-2">
                  BENT AXLES CAR SHOW 2019
                </h2>
                <p className="text-text-muted font-sans text-sm">
                  The annual Bent Axles Car Show brings together classic roadsters for a day of 
                  automotive excellence.
                </p>
              </div>
            </div>

            {/* Show Flyer */}
            <div className="bg-secondary rounded-lg overflow-hidden border border-gold/20">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/original/Pictures/Show 2025/LA Roadster Flyer with Andys Art 2025.jpg"
                  alt="LA Roadster Show 2025"
                  fill
                  className="object-contain bg-primary"
                />
              </div>
              <div className="p-6">
                <h2 className="font-display text-xl text-gold tracking-wider mb-2">
                  ROADSTER SHOW 2025
                </h2>
                <p className="text-text-muted font-sans text-sm">
                  Father Day Weekend at the Fairplex in Pomona, California.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 bg-secondary border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <FaImages className="text-gold mx-auto mb-4" size={48} />
            <h2 className="font-display text-2xl text-gold tracking-wider mb-4">
              MORE PHOTOS COMING SOON
            </h2>
            <p className="text-text-muted font-sans">
              We are working on adding more photos from our events and archives. 
              Check back soon for updates from the 2026 Roadster Show!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
