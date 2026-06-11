// Seed the database with the 14 Show News cards from the original
// src/app/pages/News.tsx. Populates both body_text (plain) and body_html
// (rich, original Tailwind-styled markup). Idempotent via slug conflict.
//
// Also seeds the initial admin user from ADMIN_EMAIL + ADMIN_PASSWORD.
//
// Usage:  npx tsx db/seed.ts

import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

try { config({ path: '.env.local' }); } catch {}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set. Add it to .env.local.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// ---------- original Tailwind classes used by each card body ----------
// The admin editor will produce the same Tailwind classes when wrapping
// text in bold/red/etc. spans, so the rendered output matches the original
// 100%.

interface Card {
  slug: string;
  title: string;
  body_text: string;
  body_html: string;
  flyer_url?: string | null;
  image_urls: string[];
  enabled: boolean;
  sort_order: number;
}

const cards: Card[] = [
  {
    slug: 'flyer',
    title: '60th Anniversary Flyer',
    body_text: '',
    body_html: '',
    flyer_url: '/60th-Anniversary-Flyer.pdf',
    image_urls: [],
    enabled: true,
    sort_order: 10,
  },
  {
    slug: 'sponsors',
    title: 'Our Sponsors',
    body_text: '',
    body_html: '',
    image_urls: [
      '/sponsors/bob-drake.webp',
      '/sponsors/brookville-roadster.webp',
      '/sponsors/california-car-cover.jpg',
      '/sponsors/grand-national-roadster-show.jpg',
      '/sponsors/rodding-usa.png',
    ],
    enabled: true,
    sort_order: 20,
  },

  // About The Show — two paragraphs, second has a red underlined link
  {
    slug: 'about_show',
    title: 'About The Show',
    body_text: [
      "Our 60th Anniversary Roadster Show & Swap will be held on Father's Day Weekend, Friday, June 19 and Saturday, June 20, 2026 at the Fairplex, 1101 West McKinley Avenue, Pomona, California.",
      "This year, we welcome So-Cal Speed Shop to help bring you an even better Show and Swap experience, and we look forward to the first-ever awards presented by So-Cal and the Los Angeles Roadsters.",
    ].join('\n\n'),
    body_html:
      '<p>Our 60th Anniversary Roadster Show & Swap will be held on Father\'s Day Weekend, Friday, June 19 and Saturday, June 20, 2026 at the Fairplex, 1101 West McKinley Avenue, Pomona, California.</p>' +
      '<p>This year, we welcome <a href="https://www.est1946.com" target="_blank" rel="noopener noreferrer" class="text-red-500 hover:text-white underline">So-Cal Speed Shop</a> to help bring you an even better Show and Swap experience, and we look forward to the first-ever awards presented by So-Cal and the Los Angeles Roadsters.</p>',
    image_urls: ['/assets/photos/lar socal.jpg'],
    enabled: true,
    sort_order: 30,
  },

  // Main Attraction — single big paragraph
  {
    slug: 'main_attraction',
    title: 'The Main Attraction',
    body_text: "The main attraction will be hundreds of open cars from 1936 and earlier, of all types and makes; some original, some modified, all of the highest quality, fully finished in paint and upholstery, and carefully restored to the owner's preference. Only finished roadsters will be allowed to park in the Show Roadster Parking Area. No cruising through the fairgrounds is allowed for liability reasons.",
    body_html:
      '<p>The main attraction will be hundreds of open cars from 1936 and earlier, of all types and makes; some original, some modified, all of the highest quality, fully finished in paint and upholstery, and carefully restored to the owner\'s preference. Only finished roadsters will be allowed to park in the Show Roadster Parking Area. No cruising through the fairgrounds is allowed for liability reasons.</p>',
    image_urls: ['/assets/photos/roadsters1.jpg', '/assets/photos/roadsters2.jpg'],
    enabled: true,
    sort_order: 40,
  },

  // General Public — has the sub-headings + lists with red/green spans
  {
    slug: 'general_public',
    title: 'General Public',
    body_text: '',
    body_html:
      '<p><span class="text-white font-semibold">Spectator parking</span> will be available at Gate #9 at the Blue Lot on White Avenue. The Fairplex charges for parking by credit card or debit card only.</p>' +
      '<h3 class="text-xl font-bold text-white mb-3 mt-6">Show hours:</h3>' +
      '<ul class="space-y-2 mb-6">' +
        '<li><span class="text-red-500 font-semibold">Friday</span> 7:00 am to 4:00 pm</li>' +
        '<li><span class="text-red-500 font-semibold">Saturday</span> 7:00 am to 4:00 pm</li>' +
      '</ul>' +
      '<h3 class="text-xl font-bold text-white mb-3 mt-6">Admission:</h3>' +
      '<ul class="space-y-2">' +
        '<li>$25 per person/per day</li>' +
        '<li>Active Military (with ID) - $10</li>' +
        '<li>Children under 12 - <span class="text-green-500">FREE</span></li>' +
        '<li>Two-day adult pass - $45</li>' +
      '</ul>' +
      '<p class="mt-3 text-gray-400">Cash, Debit and Credit Cards are accepted.</p>',
    image_urls: ['/assets/photos/cars1.jpg', '/assets/photos/cars2.jpg', '/assets/photos/cars3.jpg'],
    enabled: true,
    sort_order: 50,
  },

  // Roadsters — first paragraph is the big red "Pre-36 Roadsters are Free"
  {
    slug: 'roadsters',
    title: 'Roadsters',
    body_text: '',
    body_html:
      '<p class="text-2xl font-bold text-red-500">Pre-36 Roadsters are Free</p>' +
      '<p>Only finished pre-1936 roadsters will be allowed to park in the Show Roadster Parking Area. They will enter Gate #1B, car and driver are free admission, $20 for passenger.</p>' +
      '<p>Other roadsters will be referred to park in Street Rod Specialty Parking at Gate #15 off Arrow Highway.</p>',
    image_urls: ['/assets/photos/mugs1.jpg', '/assets/photos/run5.jpg', '/assets/photos/run7.jpg'],
    enabled: true,
    sort_order: 60,
  },

  // Commercial Vendors — paragraphs + the red download box (kept as anchor)
  {
    slug: 'commercial_vendors',
    title: 'Commercial Vendors',
    body_text: '',
    body_html:
      '<p><span class="text-white font-semibold">Vendors enter at Gate #1</span></p>' +
      '<p><span class="text-white font-semibold">Move-in Thursday, June 18th</span> - 7:00 am to 4:00 pm</p>' +
      '<div class="mt-6 p-4 rounded-xl bg-red-600/20 border border-red-500/30">' +
        '<a href="/2026 LAR Show Exhibitor form .pdf" download class="text-xl font-bold text-red-500 hover:text-white transition-colors duration-300">Download Commercial Exhibitor Reservation Form</a>' +
      '</div>' +
      '<h3 class="text-xl font-bold text-white mb-3 mt-6">Contact:</h3>' +
      '<p>Rich Cohn - (818) 402-8145</p>' +
      '<p>rbcsgarage@gmail.com</p>',
    image_urls: ['/assets/photos/vendors1.jpg', '/assets/photos/vendors2.jpg', '/assets/photos/vendors3.jpg', '/assets/photos/vendors4.jpg'],
    enabled: true,
    sort_order: 70,
  },

  // Swap Meet — long content with red download box, list, contact
  {
    slug: 'swap_meet',
    title: 'Swap Meet',
    body_text: '',
    body_html:
      '<p class="text-lg text-red-500 font-semibold mb-6">Swap Meet spaces available — car parts and related items only.</p>' +
      '<p><span class="text-white font-semibold">Enter at Gate #15 off Arrow Highway</span></p>' +
      '<p><span class="text-white font-semibold">Move-in Thursday, June 18th</span> - 7:00 am to 4:00 pm</p>' +
      '<div class="mt-6 space-y-2">' +
        '<p><span class="text-white font-semibold">Swap spaces</span> are 25\' x 20\' (equivalent to three Fairplex parking spaces)</p>' +
        '<p><span class="text-white font-semibold">Friday and Saturday:</span></p>' +
        '<ul class="ml-6 space-y-1">' +
          '<li>$125 for Space</li>' +
          '<li>$150 for Corner Space</li>' +
        '</ul>' +
        '<p class="mt-2">Items for sale should be car parts or car-related items only.</p>' +
      '</div>' +
      '<div class="mt-6 p-4 rounded-xl bg-red-600/20 border border-red-500/30">' +
        '<a href="/2026 Swap Form.pdf" download class="text-xl font-bold text-red-500 hover:text-white transition-colors duration-300">Download Swap Meet Registration Form</a>' +
      '</div>' +
      '<p class="text-gray-400 mt-4">Pre-register by mail or phone, or on the day of the show. Cash, checks, debit and credit cards are accepted.</p>' +
      '<h3 class="text-xl font-bold text-white mb-3 mt-6">Contact:</h3>' +
      '<p>Ken Butler - (805) 390-5187</p>' +
      '<p>36fordken@gmail.com</p>',
    image_urls: ['/assets/photos/swap1.jpg', '/assets/photos/swap2.jpg', '/assets/photos/swap3.jpg', '/assets/photos/swap4.jpg'],
    enabled: true,
    sort_order: 80,
  },

  // Souvenirs — second paragraph is red bold
  {
    slug: 'souvenirs',
    title: 'Souvenirs & Memorabilia',
    body_text: '',
    body_html:
      '<p>Take home a piece of Roadster Show history! Exclusive souvenirs and memorabilia are available at the show.</p>' +
      '<p class="text-red-500 font-semibold">Show T-shirts will be available at Brizio T-Shirts booth</p>',
    image_urls: ['/assets/photos/souviners1.jpg', '/assets/photos/souviners2.jpg', '/assets/photos/souviners3.jpg'],
    enabled: true,
    sort_order: 90,
  },

  // Street Rod Specialty Parking — bold day names, green FREE
  {
    slug: 'street_rod',
    title: 'Street Rod Specialty Parking',
    body_text: '',
    body_html:
      '<p><span class="text-white font-semibold">Enter at Gate #15 off Arrow Highway</span></p>' +
      '<p>Specialty parking for 1985 and older cars, Pickups, Classics, Hot Rods, Kustoms, and other Special Interest cars will be entered in this large area forming a huge car show. This is also a perfect area to enter cars for sale. No pre-registration necessary.</p>' +
      '<div class="mt-6 space-y-2">' +
        '<p><span class="text-white font-semibold">Friday</span> - $50 per car, driver and one passenger</p>' +
        '<p><span class="text-white font-semibold">Saturday</span> - $60 per car, driver and one passenger</p>' +
        '<p><span class="text-white font-semibold">2-Day Pass</span> - $100 per car, driver and one passenger</p>' +
        '<p>$20 for each additional passenger</p>' +
        '<p>Children under 12 - <span class="text-green-500">FREE</span></p>' +
      '</div>' +
      '<p class="text-gray-400 mt-4">Cash, Debit and Credit Cards are accepted.</p>',
    image_urls: ['/assets/photos/spec1.jpg', '/assets/photos/spec2.jpg', '/assets/photos/spec3.jpg'],
    enabled: true,
    sort_order: 100,
  },

  // Show Program Ads — red download + contact
  {
    slug: 'program_ads',
    title: 'Show Program Ads',
    body_text: '',
    body_html:
      '<div class="mt-6 p-4 rounded-xl bg-red-600/20 border border-red-500/30">' +
        '<a href="/2026 Program Rate Sheet.pdf" download class="text-xl font-bold text-red-500 hover:text-white transition-colors duration-300">Download Program Advertising Rate Sheet</a>' +
      '</div>' +
      '<h3 class="text-xl font-bold text-white mb-3 mt-6">Contact:</h3>' +
      '<p>Dave Meissen - (916) 220-0514</p>' +
      '<p>1932lar@gmail.com</p>',
    image_urls: [],
    enabled: true,
    sort_order: 110,
  },

  // Show Chairman — first line bigger
  {
    slug: 'show_chairman',
    title: 'Show Chairman',
    body_text: '',
    body_html:
      '<p class="text-xl font-semibold text-white">Dave Meissen</p>' +
      '<p>(916) 220-0514</p>' +
      '<p>1932lar@gmail.com</p>',
    image_urls: [],
    enabled: true,
    sort_order: 120,
  },

  // Scooter & Wheelchair Rentals — has a red link
  {
    slug: 'scooter_rentals',
    title: 'Scooter & Wheelchair Rentals',
    body_text: '',
    body_html:
      '<p>Scooter and wheelchair rentals will be available at the show for a daily rental fee.</p>' +
      '<p>Reservations can be made on their website: <a href="https://EventScooters.com/Events" class="text-red-500 hover:text-white" target="_blank" rel="noopener noreferrer">EventScooters.com/Events</a></p>' +
      '<p>For Reservations call: <span class="text-white font-semibold">(262) 677-2697</span></p>',
    image_urls: [],
    enabled: true,
    sort_order: 130,
  },

  // Recreational Vehicles — bold multi-line address
  {
    slug: 'recreational_vehicles',
    title: 'Recreational Vehicles',
    body_text: '',
    body_html:
      '<p>The Fairplex RV Park is located at:</p>' +
      '<p class="text-white font-semibold">2200 N. White Avenue<br />Pomona, CA 91768<br />(across the street from the Fairplex)</p>' +
      '<p>For reservations call: <span class="text-white font-semibold">(909) 593-8915</span></p>',
    image_urls: [],
    enabled: true,
    sort_order: 140,
  },
];

async function seedNewsCards() {
  console.log(`Seeding ${cards.length} news cards (with body_html)...`);
  for (const c of cards) {
    await sql`
      INSERT INTO news_cards (slug, title, body_text, body_html, flyer_url, image_urls, enabled, sort_order)
      VALUES (${c.slug}, ${c.title}, ${c.body_text}, ${c.body_html}, ${c.flyer_url || null}, ${JSON.stringify(c.image_urls)}::jsonb, ${c.enabled}, ${c.sort_order})
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        body_text = EXCLUDED.body_text,
        body_html = EXCLUDED.body_html,
        flyer_url = EXCLUDED.flyer_url,
        image_urls = EXCLUDED.image_urls,
        enabled = EXCLUDED.enabled,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    `;
  }
  console.log('  done.');
}

// Initial sponsors — the 5 logos that ship with the site. The customer can
// add, edit, reorder, or remove these from /admin/sponsors. Idempotent: only
// inserts if the table is empty, so the customer's edits aren't overwritten.
const initialSponsors = [
  { name: 'Bob Drake',                   logo_url: '/sponsors/bob-drake.webp',                     url: 'https://bobdrake.com',            sort_order: 10 },
  { name: 'Brookville Roadster',         logo_url: '/sponsors/brookville-roadster.webp',           url: 'https://brookvilleroadster.com',  sort_order: 20 },
  { name: 'California Car Cover',        logo_url: '/sponsors/california-car-cover.jpg',           url: 'https://calcarcover.com',         sort_order: 30 },
  { name: 'Grand National Roadster Show', logo_url: '/sponsors/grand-national-roadster-show.jpg', url: 'https://rodshows.com',            sort_order: 40 },
  { name: 'Rodding USA Magazine',        logo_url: '/sponsors/rodding-usa.png',                    url: 'https://www.roddingusa.com',      sort_order: 50 },
];

async function seedSponsors() {
  const rows = await sql`SELECT COUNT(*)::int AS n FROM sponsors`;
  const n = (rows as any[])[0]?.n ?? 0;
  if (n > 0) {
    console.log(`Sponsors table already has ${n} row(s) — skipping seed.`);
    return;
  }
  console.log(`Seeding ${initialSponsors.length} sponsors (only on first run)...`);
  for (const s of initialSponsors) {
    await sql`
      INSERT INTO sponsors (name, logo_url, url, sort_order)
      VALUES (${s.name}, ${s.logo_url}, ${s.url}, ${s.sort_order})
    `;
  }
  console.log('  done.');
}

// Initial event — the 60th Anniversary show. The customer can add, edit, or
// remove this from /admin/events. Idempotent: only inserts if the table is empty.
const initialEvents = [
  {
    title: "60th Anniversary Roadster Show & Swap",
    date: "June 19-20, 2026",
    location: "Fairplex, Pomona",
    description: "Father's Day Weekend - The premier classic roadster event of the year",
    sort_order: 10,
  },
];

async function seedEvents() {
  const rows = await sql`SELECT COUNT(*)::int AS n FROM events`;
  const n = (rows as any[])[0]?.n ?? 0;
  if (n > 0) {
    console.log(`Events table already has ${n} row(s) — skipping seed.`);
    return;
  }
  console.log(`Seeding ${initialEvents.length} event(s) (only on first run)...`);
  for (const e of initialEvents) {
    await sql`
      INSERT INTO events (title, date, location, description, sort_order)
      VALUES (${e.title}, ${e.date}, ${e.location}, ${e.description}, ${e.sort_order})
    `;
  }
  console.log('  done.');
}

// Initial gallery albums — the two categories the public Photo Gallery shows
// (filter slugs are hardcoded in the public page to "runs" and "members").
// Photos must be uploaded by the customer via /admin/gallery.
// Idempotent: only inserts if the table is empty, so the customer's edits aren't overwritten.
const initialAlbums = [
  { slug: 'runs',    title: 'Club Runs',   sort_order: 10 },
  { slug: 'members', title: 'Member Cars', sort_order: 20 },
];

async function seedGalleryAlbums() {
  const rows = await sql`SELECT COUNT(*)::int AS n FROM gallery_albums`;
  const n = (rows as any[])[0]?.n ?? 0;
  if (n > 0) {
    console.log(`Gallery albums table already has ${n} row(s) — skipping seed.`);
    return;
  }
  console.log(`Seeding ${initialAlbums.length} gallery album(s) (only on first run)...`);
  for (const a of initialAlbums) {
    await sql`
      INSERT INTO gallery_albums (slug, title, sort_order)
      VALUES (${a.slug}, ${a.title}, ${a.sort_order})
    `;
  }
  console.log('  done.');
}

// Default site_settings — Hero, Event, About text used on the public Home
// page. These match the hardcoded values in Hero.tsx, Event.tsx, About.tsx.
// The customer can edit any of these via /admin/homepage.
const defaultSettings: Record<string, string> = {
  'hero.title':         'Los Angeles Roadsters',
  'event.title':        '60th Anniversary',
  'event.subtitle':     'Los Angeles Roadsters Show and Swap',
  'event.date_line':    "Father's Day Weekend - June 19-20, 2026",
  'event.hours':        '7:00 am – 4:00 pm',
  'event.venue_name':   'Fairplex in Pomona',
  'event.address1':     '1101 W. McKinley Avenue',
  'event.city':         'Pomona, California',
  'about.heading1':     'LEGENDARY',
  'about.heading2':     'HERITAGE',
  'about.lede':         "The Los Angeles Roadsters Car Club — established in 1957 and still going strong. We're celebrating our 60th Anniversary in 2026.",
  'about.body1':        "For six decades, we've hosted the world's premier classic roadster show at the Fairplex in Pomona, California. Our 60th Anniversary Show & Swap brings together the finest classics on Father's Day Weekend.",
  'about.body2':        'Only finished roadsters park in our Show area — no project cars, no exceptions. Every car that makes the cut represents the pinnacle of automotive craftsmanship and passion.',
  'about.stat_founded':         '1957',
  'about.stat_years_strong':    '69 Years',
  'about.stat_anniversary':     '60th',
  'about.stat_years_at_venue':  '44th',
};

async function seedSiteSettings() {
  // Insert only keys that don't already exist. Never overwrite the
  // customer's edits — the customer owns site_settings.
  let inserted = 0;
  for (const [k, v] of Object.entries(defaultSettings)) {
    const res = await sql`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (${k}, ${v}, NOW())
      ON CONFLICT (key) DO NOTHING
    `;
    if (res) inserted++;
  }
  console.log(`  seeded ${inserted} site setting key(s) (existing keys preserved).`);
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log('Skipping admin user (ADMIN_EMAIL / ADMIN_PASSWORD not set).');
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  await sql`
    INSERT INTO admin_users (email, password_hash)
    VALUES (${email}, ${hash})
    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
  `;
  console.log(`  admin user seeded: ${email}`);
}

async function main() {
  await seedNewsCards();
  await seedSponsors();
  await seedEvents();
  await seedGalleryAlbums();
  await seedSiteSettings();
  await seedAdmin();
  console.log('Seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
