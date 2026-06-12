import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  url: string | null;
  sort_order: number;
}

interface NewsCard {
  slug: string;
  title: string;
  body_text: string;
  body_html: string;
  flyer_url: string | null;
  image_urls: string[];
  enabled: boolean;
  sort_order: number;
}

// Image arrays for cards (hardcoded for now; gallery admin will replace).
const vendorImages = [
  '/assets/photos/vendors1.jpg',
  '/assets/photos/vendors2.jpg',
  '/assets/photos/vendors3.jpg',
  '/assets/photos/vendors4.jpg',
];
const swapImages = [
  '/assets/photos/swap1.jpg',
  '/assets/photos/swap2.jpg',
  '/assets/photos/swap3.jpg',
  '/assets/photos/swap4.jpg',
  '/assets/photos/swap5.jpg',
];
const roadsterImages = [
  '/assets/photos/roadsters1.jpg',
  '/assets/photos/roadsters2.jpg',
];
const souvenirImages = [
  '/assets/photos/souviners1.jpg',
  '/assets/photos/souviners2.jpg',
  '/assets/photos/souviners3.jpg',
];
const mugImages = [
  '/assets/photos/mugs1.jpg',
  '/assets/photos/run5.jpg',
  '/assets/photos/run7.jpg',
];
const specImages = [
  '/assets/photos/spec1.jpg',
  '/assets/photos/spec2.jpg',
  '/assets/photos/spec3.jpg',
];

// Sponsors list now comes from the API at /api/public/sponsors (admin-managed).

const DEFAULT_FLYER_URL = '/60th-Anniversary-Flyer.pdf';

// Renders sanitized HTML. All content comes from the admin (TipTap) so we
// trust it, but we still escape <script> via a basic sanitizer.
function RichBody({ html }: { html: string }) {
  if (!html) return null;
  // Basic sanitization: strip <script>, <style>, on* attributes, javascript: URLs.
  const clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}

export function News() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState<Record<string, NewsCard>>({});
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/public/news-cards').then((r) => r.json()).catch(() => []),
      fetch('/api/public/sponsors').then((r) => r.json()).catch(() => []),
    ]).then(([cardRows, sponsorRows]) => {
      const map: Record<string, NewsCard> = {};
      for (const c of cardRows) map[c.slug] = c;
      setCards(map);
      setSponsors(Array.isArray(sponsorRows) ? sponsorRows : []);
    }).finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.news-section', {
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
  }, [loaded]);

  const flyer = cards['flyer'];
  const sponsorsCard = cards['sponsors'];
  const aboutShow = cards['about_show'];
  const mainAttraction = cards['main_attraction'];
  const generalPublic = cards['general_public'];
  const roadsters = cards['roadsters'];
  const commercialVendors = cards['commercial_vendors'];
  const swapMeet = cards['swap_meet'];
  const souvenirs = cards['souvenirs'];
  const streetRod = cards['street_rod'];
  const programAds = cards['program_ads'];
  const showChairman = cards['show_chairman'];
  const scooterRentals = cards['scooter_rentals'];
  const recreationalVehicles = cards['recreational_vehicles'];

  const flyerUrl = flyer?.flyer_url || DEFAULT_FLYER_URL;
  const isOn = (c: NewsCard | undefined) => c && c.enabled;

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto" ref={sectionRef}>
        {/* Header */}
        <div className="news-section mb-16">
          <div className="text-sm tracking-[0.3em] text-red-500 mb-4 font-light">
            60TH ANNIVERSARY
          </div>
          <h1 className="text-[clamp(3rem,10vw,7rem)] font-black leading-[0.9] tracking-tight mb-6">
            <div className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              SHOW NEWS
            </div>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            60th Anniversary Roadster Show & Swap — Father's Day Weekend, June 19-20, 2026
          </p>
        </div>

        {/* PDF Flyer */}
        {isOn(flyer) && (
          <div className="news-section mb-20">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{flyer?.title || '60th Anniversary Flyer'}</h2>
                <a
                  href={flyerUrl}
                  download
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-500 transition-colors duration-300"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </a>
              </div>

              {/* Embedded PDF Viewer */}
              <div className="w-full h-[600px] rounded-xl overflow-hidden border border-white/10 bg-white/5">
                <iframe
                  src={flyerUrl}
                  className="w-full h-full"
                  title={flyer?.title || '60th Anniversary Flyer'}
                />
              </div>
            </div>
          </div>
        )}

        {/* Sponsors Section */}
        {isOn(sponsorsCard) && (
          <div className="news-section mb-20">
            <div className="text-center mb-12">
              <div className="text-sm tracking-[0.3em] text-red-500 mb-4 font-light">
                THANK YOU
              </div>
              <h2 className="text-4xl font-black text-white mb-4">{sponsorsCard?.title || 'Our Sponsors'}</h2>
              <p className="text-gray-400">
                Supporting the 60th Anniversary Roadster Show & Swap
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {sponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-48"
                >
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-red-500/50 transition-all duration-500 flex items-center justify-center h-28">
                    <img
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">
                      {sponsor.name}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Show Details Content */}
        <div className="news-section mb-20 space-y-16">
          {/* About Section */}
          {isOn(aboutShow) && (
            <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">{aboutShow?.title || 'About The Show'}</h2>
                  <div className="prose prose-invert max-w-none space-y-4 text-gray-300">
                    <RichBody html={aboutShow?.body_html || ''} />
                  </div>
                </div>
                <div>
                  <img src="/assets/photos/lar socal.jpg" alt="LAR SoCal" className="rounded-2xl w-full h-64 object-cover shadow-xl" />
                </div>
              </div>
            </section>
          )}

          {/* Main Attraction */}
          {isOn(mainAttraction) && (
            <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">{mainAttraction?.title || 'The Main Attraction'}</h2>
                  <p className="text-gray-300 text-lg">
                    <RichBody html={mainAttraction?.body_html || ''} />
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {roadsterImages.map((src, i) => (
                    <img key={i} src={src} alt={`Roadsters ${i+1}`} className="rounded-2xl w-full h-36 object-cover shadow-xl" />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* General Public */}
          {isOn(generalPublic) && (
            <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-6">{generalPublic?.title || 'General Public'}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4 text-gray-300">
                  <RichBody html={generalPublic?.body_html || ''} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <img src="/assets/photos/cars1.jpg" alt="Cars" className="rounded-2xl w-full h-36 object-cover shadow-xl" />
                  <img src="/assets/photos/cars2.jpg" alt="Cars" className="rounded-2xl w-full h-36 object-cover shadow-xl mt-8" />
                  <img src="/assets/photos/cars3.jpg" alt="Cars" className="rounded-2xl w-full h-36 object-cover shadow-xl" />
                </div>
              </div>
            </section>
          )}

          {/* Roadsters */}
          {isOn(roadsters) && (
            <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">{roadsters?.title || 'Roadsters'}</h2>
                  <div className="space-y-4 text-gray-300">
                    <RichBody html={roadsters?.body_html || ''} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {mugImages.map((src, i) => (
                    <img key={i} src={src} alt={`Mug ${i+1}`} className="rounded-xl w-full h-28 object-cover shadow-lg" />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Commercial Vendors */}
          {isOn(commercialVendors) && (
            <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-6">{commercialVendors?.title || 'Commercial Vendors'}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4 text-gray-300">
                  <RichBody html={commercialVendors?.body_html || ''} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {vendorImages.map((src, i) => (
                    <img key={i} src={src} alt={`Vendor ${i+1}`} className="rounded-2xl w-full h-32 object-cover shadow-xl" />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Swap Meet */}
          {isOn(swapMeet) && (
            <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-6">{swapMeet?.title || 'Swap Meet'}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4 text-gray-300">
                  <RichBody html={swapMeet?.body_html || ''} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {swapImages.slice(0, 4).map((src, i) => (
                    <img key={i} src={src} alt={`Swap Meet ${i+1}`} className="rounded-2xl w-full h-32 object-cover shadow-xl" />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Souvenirs - NEW SECTION */}
          {isOn(souvenirs) && (
            <section className="p-8 rounded-3xl bg-gradient-to-br from-red-600/20 to-white/0 border border-red-500/30">
              <h2 className="text-3xl font-bold text-white mb-6">{souvenirs?.title || 'Souvenirs & Memorabilia'}</h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-gray-300">
                  <RichBody html={souvenirs?.body_html || ''} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {souvenirImages.map((src, i) => (
                    <img key={i} src={src} alt={`Souvenir ${i+1}`} className="rounded-xl w-full h-28 object-cover shadow-lg" />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Street Rod Specialty Parking */}
          {isOn(streetRod) && (
            <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-6">{streetRod?.title || 'Street Rod Specialty Parking'}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4 text-gray-300">
                  <RichBody html={streetRod?.body_html || ''} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {specImages.map((src, i) => (
                    <img key={i} src={src} alt={`Specialty ${i+1}`} className="rounded-xl w-full h-28 object-cover shadow-lg" />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Show Program Ads */}
          {isOn(programAds) && (
            <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-6">{programAds?.title || 'Show Program Ads'}</h2>
              <div className="space-y-4 text-gray-300">
                <RichBody html={programAds?.body_html || ''} />
              </div>
            </section>
          )}

          {/* Show Chairman */}
          {isOn(showChairman) && (
            <section className="p-8 rounded-3xl bg-gradient-to-br from-red-600/20 to-white/0 border border-red-500/30">
              <h2 className="text-3xl font-bold text-white mb-6">{showChairman?.title || 'Show Chairman'}</h2>
              <div className="text-gray-300">
                <RichBody html={showChairman?.body_html || ''} />
              </div>
            </section>
          )}

          {/* Scooter & Wheelchair Rentals */}
          {isOn(scooterRentals) && (
            <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-6">{scooterRentals?.title || 'Scooter & Wheelchair Rentals'}</h2>
              <div className="space-y-4 text-gray-300">
                <RichBody html={scooterRentals?.body_html || ''} />
              </div>
            </section>
          )}

          {/* Recreational Vehicles */}
          {isOn(recreationalVehicles) && (
            <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-6">{recreationalVehicles?.title || 'Recreational Vehicles'}</h2>
              <div className="space-y-4 text-gray-300">
                <RichBody html={recreationalVehicles?.body_html || ''} />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
