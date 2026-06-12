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

const DEFAULT_FLYER_URL = '/60th-Anniversary-Flyer.pdf';

// Renders sanitized HTML. All content comes from the admin (TipTap) so we
// trust it, but we still escape <script> via a basic sanitizer.
function RichBody({ html }: { html: string }) {
  if (!html) return null;
  const clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}

// Section registry: each entry renders one of the news page's 14 cards.
// The public page sorts these by `cards[slug].sort_order` (the customer
// controls this in the admin), falling back to `defaultOrder` for any
// card whose row is missing. The JSX inside `render()` is verbatim from
// the original hardcoded page — design unchanged.
type SectionRenderer = (args: {
  card: NewsCard | undefined;
  sponsors: Sponsor[];
}) => React.ReactNode;

const SECTIONS: { slug: string; defaultTitle: string; defaultOrder: number; render: SectionRenderer }[] = [
  {
    slug: 'flyer', defaultTitle: '60th Anniversary Flyer', defaultOrder: 10,
    render: ({ card }) => {
      const flyerUrl = card?.flyer_url || DEFAULT_FLYER_URL;
      return (
        <div className="news-section mb-20">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{card?.title || '60th Anniversary Flyer'}</h2>
              <a
                href={flyerUrl}
                download
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-500 transition-colors duration-300"
              >
                <Download className="w-4 h-4" /> Download PDF
              </a>
            </div>
            <div className="w-full h-[600px] rounded-xl overflow-hidden border border-white/10 bg-white/5">
              <iframe src={flyerUrl} className="w-full h-full" title={card?.title || '60th Anniversary Flyer'} />
            </div>
          </div>
        </div>
      );
    },
  },
  {
    slug: 'sponsors', defaultTitle: 'Our Sponsors', defaultOrder: 20,
    render: ({ card, sponsors }) => (
      <div className="news-section mb-20">
        <div className="text-center mb-12">
          <div className="text-sm tracking-[0.3em] text-red-500 mb-4 font-light">THANK YOU</div>
          <h2 className="text-4xl font-black text-white mb-4">{card?.title || 'Our Sponsors'}</h2>
          <p className="text-gray-400">Supporting the 60th Anniversary Roadster Show &amp; Swap</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {sponsors.map((sponsor) => (
            <a key={sponsor.id} href={sponsor.url || '#'} target="_blank" rel="noopener noreferrer" className="group w-48">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-red-500/50 transition-all duration-500 flex items-center justify-center h-28">
                <img src={sponsor.logo_url} alt={sponsor.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="text-center mt-2">
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">{sponsor.name}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    ),
  },
  {
    slug: 'about_show', defaultTitle: 'About The Show', defaultOrder: 30,
    render: ({ card }) => (
      <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">{card?.title || 'About The Show'}</h2>
            <div className="prose prose-invert max-w-none space-y-4 text-gray-300">
              <RichBody html={card?.body_html || ''} />
            </div>
          </div>
          <div>
            <img src="/assets/photos/lar socal.jpg" alt="LAR SoCal" className="rounded-2xl w-full h-64 object-cover shadow-xl" />
          </div>
        </div>
      </section>
    ),
  },
  {
    slug: 'main_attraction', defaultTitle: 'The Main Attraction', defaultOrder: 40,
    render: ({ card }) => (
      <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">{card?.title || 'The Main Attraction'}</h2>
            <p className="text-gray-300 text-lg">
              <RichBody html={card?.body_html || ''} />
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {roadsterImages.map((src, i) => (
              <img key={i} src={src} alt={`Roadsters ${i+1}`} className="rounded-2xl w-full h-36 object-cover shadow-xl" />
            ))}
          </div>
        </div>
      </section>
    ),
  },
  {
    slug: 'general_public', defaultTitle: 'General Public', defaultOrder: 50,
    render: ({ card }) => (
      <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-6">{card?.title || 'General Public'}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-gray-300">
            <RichBody html={card?.body_html || ''} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/assets/photos/cars1.jpg" alt="Cars" className="rounded-2xl w-full h-36 object-cover shadow-xl" />
            <img src="/assets/photos/cars2.jpg" alt="Cars" className="rounded-2xl w-full h-36 object-cover shadow-xl mt-8" />
            <img src="/assets/photos/cars3.jpg" alt="Cars" className="rounded-2xl w-full h-36 object-cover shadow-xl" />
          </div>
        </div>
      </section>
    ),
  },
  {
    slug: 'roadsters', defaultTitle: 'Roadsters', defaultOrder: 60,
    render: ({ card }) => (
      <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">{card?.title || 'Roadsters'}</h2>
            <div className="space-y-4 text-gray-300">
              <RichBody html={card?.body_html || ''} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {mugImages.map((src, i) => (
              <img key={i} src={src} alt={`Mug ${i+1}`} className="rounded-xl w-full h-28 object-cover shadow-lg" />
            ))}
          </div>
        </div>
      </section>
    ),
  },
  {
    slug: 'commercial_vendors', defaultTitle: 'Commercial Vendors', defaultOrder: 70,
    render: ({ card }) => (
      <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-6">{card?.title || 'Commercial Vendors'}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-gray-300">
            <RichBody html={card?.body_html || ''} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {vendorImages.map((src, i) => (
              <img key={i} src={src} alt={`Vendor ${i+1}`} className="rounded-2xl w-full h-32 object-cover shadow-xl" />
            ))}
          </div>
        </div>
      </section>
    ),
  },
  {
    slug: 'swap_meet', defaultTitle: 'Swap Meet', defaultOrder: 80,
    render: ({ card }) => (
      <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-6">{card?.title || 'Swap Meet'}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-gray-300">
            <RichBody html={card?.body_html || ''} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {swapImages.slice(0, 4).map((src, i) => (
              <img key={i} src={src} alt={`Swap Meet ${i+1}`} className="rounded-2xl w-full h-32 object-cover shadow-xl" />
            ))}
          </div>
        </div>
      </section>
    ),
  },
  {
    slug: 'souvenirs', defaultTitle: 'Souvenirs & Memorabilia', defaultOrder: 90,
    render: ({ card }) => (
      <section className="p-8 rounded-3xl bg-gradient-to-br from-red-600/20 to-white/0 border border-red-500/30">
        <h2 className="text-3xl font-bold text-white mb-6">{card?.title || 'Souvenirs & Memorabilia'}</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-gray-300">
            <RichBody html={card?.body_html || ''} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {souvenirImages.map((src, i) => (
              <img key={i} src={src} alt={`Souvenir ${i+1}`} className="rounded-xl w-full h-28 object-cover shadow-lg" />
            ))}
          </div>
        </div>
      </section>
    ),
  },
  {
    slug: 'street_rod', defaultTitle: 'Street Rod Specialty Parking', defaultOrder: 100,
    render: ({ card }) => (
      <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-6">{card?.title || 'Street Rod Specialty Parking'}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-gray-300">
            <RichBody html={card?.body_html || ''} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {specImages.map((src, i) => (
              <img key={i} src={src} alt={`Specialty ${i+1}`} className="rounded-xl w-full h-28 object-cover shadow-lg" />
            ))}
          </div>
        </div>
      </section>
    ),
  },
  {
    slug: 'program_ads', defaultTitle: 'Show Program Ads', defaultOrder: 110,
    render: ({ card }) => (
      <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-6">{card?.title || 'Show Program Ads'}</h2>
        <div className="space-y-4 text-gray-300">
          <RichBody html={card?.body_html || ''} />
        </div>
      </section>
    ),
  },
  {
    slug: 'show_chairman', defaultTitle: 'Show Chairman', defaultOrder: 120,
    render: ({ card }) => (
      <section className="p-8 rounded-3xl bg-gradient-to-br from-red-600/20 to-white/0 border border-red-500/30">
        <h2 className="text-3xl font-bold text-white mb-6">{card?.title || 'Show Chairman'}</h2>
        <div className="text-gray-300">
          <RichBody html={card?.body_html || ''} />
        </div>
      </section>
    ),
  },
  {
    slug: 'scooter_rentals', defaultTitle: 'Scooter & Wheelchair Rentals', defaultOrder: 130,
    render: ({ card }) => (
      <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-6">{card?.title || 'Scooter & Wheelchair Rentals'}</h2>
        <div className="space-y-4 text-gray-300">
          <RichBody html={card?.body_html || ''} />
        </div>
      </section>
    ),
  },
  {
    slug: 'recreational_vehicles', defaultTitle: 'Recreational Vehicles', defaultOrder: 140,
    render: ({ card }) => (
      <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-6">{card?.title || 'Recreational Vehicles'}</h2>
        <div className="space-y-4 text-gray-300">
          <RichBody html={card?.body_html || ''} />
        </div>
      </section>
    ),
  },
];

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

  // Build the ordered list of sections. Use the card's sort_order from the DB
  // when available (customer-controlled in the admin); fall back to the
  // original JSX order via the registry's defaultOrder. The customer can
  // reorder any of the 14 cards from /admin/news-cards.
  const visibleSections = SECTIONS
    .map((s) => {
      const card = cards[s.slug];
      // If the card is disabled, skip it.
      if (card && !card.enabled) return null;
      return {
        ...s,
        card,
        // Higher sort_order = further down the page. Use the DB value when
        // present, else fall back to the registry default.
        effectiveOrder: card && typeof card.sort_order === 'number' ? card.sort_order : s.defaultOrder,
      };
    })
    .filter(Boolean) as { slug: string; defaultTitle: string; defaultOrder: number; render: SectionRenderer; card: NewsCard | undefined; effectiveOrder: number }[];

  visibleSections.sort((a, b) => a.effectiveOrder - b.effectiveOrder);

  // Split into top-level sections (flyer + sponsors) and the 12 detail
  // cards. The detail cards need to be wrapped in a single container with
  // `space-y-16` to match the original design's even spacing.
  const TOP_LEVEL_SLUGS = new Set(['flyer', 'sponsors']);
  const topLevel = visibleSections.filter((s) => TOP_LEVEL_SLUGS.has(s.slug));
  const detail = visibleSections.filter((s) => !TOP_LEVEL_SLUGS.has(s.slug));

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
            60th Anniversary Roadster Show &amp; Swap — Father's Day Weekend, June 19-20, 2026
          </p>
        </div>

        {/* Top-level sections (flyer, sponsors) — each renders its own mb-20 */}
        {topLevel.map((s) => (
          <div key={s.slug}>{s.render({ card: s.card, sponsors })}</div>
        ))}

        {/* Detail cards — wrapped in a single space-y-16 container for even
            vertical spacing between cards (matches the original design). */}
        {detail.length > 0 && (
          <div className="news-section mb-20 space-y-16">
            {detail.map((s) => (
              <div key={s.slug}>{s.render({ card: s.card, sponsors })}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
