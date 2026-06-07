// Seed the database with the current 11 Show News cards from src/app/pages/News.tsx.
// Idempotent: uses ON CONFLICT (slug) DO UPDATE.
//
// Also seeds the initial admin user from ADMIN_EMAIL + ADMIN_PASSWORD env vars
// the first time it runs. Set both in .env.local before running.
//
// Usage:  npx tsx db/seed.ts

import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

try { config({ path: '.env.local' }); } catch { /* dotenv optional in prod */ }

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set. Add it to .env.local.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const newsCards = [
  {
    slug: 'flyer',
    title: '60th Anniversary Flyer',
    body_text: '',
    flyer_url: '/60th-Anniversary-Flyer.pdf',
    image_urls: [],
    enabled: true,
    sort_order: 10,
  },
  {
    slug: 'sponsors',
    title: 'Our Sponsors',
    body_text: '',
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
  {
    slug: 'about_show',
    title: 'About The Show',
    body_text: [
      "Our 60th Anniversary Roadster Show & Swap will be held on Father's Day Weekend, Friday, June 19 and Saturday, June 20, 2026 at the Fairplex, 1101 West McKinley Avenue, Pomona, California.",
      "This year, we welcome So-Cal Speed Shop to help bring you an even better Show and Swap experience, and we look forward to the first-ever awards presented by So-Cal and the Los Angeles Roadsters.",
    ].join('\n\n'),
    image_urls: ['/assets/photos/lar socal.jpg'],
    enabled: true,
    sort_order: 30,
  },
  {
    slug: 'main_attraction',
    title: 'The Main Attraction',
    body_text: "The main attraction will be hundreds of open cars from 1936 and earlier, of all types and makes; some original, some modified, all of the highest quality, fully finished in paint and upholstery, and carefully restored to the owner's preference. Only finished roadsters will be allowed to park in the Show Roadster Parking Area. No cruising through the fairgrounds is allowed for liability reasons.",
    image_urls: ['/assets/photos/roadsters1.jpg', '/assets/photos/roadsters2.jpg'],
    enabled: true,
    sort_order: 40,
  },
  {
    slug: 'general_public',
    title: 'General Public',
    body_text: [
      "Spectator parking will be available at Gate #9 at the Blue Lot on White Avenue. The Fairplex charges for parking by credit card or debit card only.",
      "Show hours: Friday 7:00 am to 4:00 pm; Saturday 7:00 am to 4:00 pm.",
      "Admission: $25 per person/per day; Active Military (with ID) - $10; Children under 12 - FREE; Two-day adult pass - $45. Cash, Debit and Credit Cards are accepted.",
    ].join('\n\n'),
    image_urls: ['/assets/photos/cars1.jpg', '/assets/photos/cars2.jpg', '/assets/photos/cars3.jpg'],
    enabled: true,
    sort_order: 50,
  },
  {
    slug: 'roadsters',
    title: 'Roadsters',
    body_text: [
      "Pre-36 Roadsters are Free",
      "Only finished pre-1936 roadsters will be allowed to park in the Show Roadster Parking Area. They will enter Gate #1B, car and driver are free admission, $20 for passenger.",
      "Other roadsters will be referred to park in Street Rod Specialty Parking at Gate #15 off Arrow Highway.",
    ].join('\n\n'),
    image_urls: ['/assets/photos/mugs1.jpg', '/assets/photos/run5.jpg', '/assets/photos/run7.jpg'],
    enabled: true,
    sort_order: 60,
  },
  {
    slug: 'commercial_vendors',
    title: 'Commercial Vendors',
    body_text: [
      "Vendors enter at Gate #1",
      "Move-in Thursday, June 18th - 7:00 am to 4:00 pm",
      "Contact: Rich Cohn - (818) 402-8145; rbcsgarage@gmail.com",
    ].join('\n\n'),
    image_urls: ['/assets/photos/vendors1.jpg', '/assets/photos/vendors2.jpg', '/assets/photos/vendors3.jpg', '/assets/photos/vendors4.jpg'],
    enabled: true,
    sort_order: 70,
  },
  {
    slug: 'swap_meet',
    title: 'Swap Meet',
    body_text: [
      "Swap Meet spaces available — car parts and related items only.",
      "Enter at Gate #15 off Arrow Highway",
      "Move-in Thursday, June 18th - 7:00 am to 4:00 pm",
      "Swap spaces are 25' x 20' (equivalent to three Fairplex parking spaces). Friday and Saturday: $125 for Space; $150 for Corner Space.",
      "Items for sale should be car parts or car-related items only.",
      "Pre-register by mail or phone, or on the day of the show. Cash, checks, debit and credit cards are accepted.",
      "Contact: Ken Butler - (805) 390-5187; 36fordken@gmail.com",
    ].join('\n\n'),
    image_urls: ['/assets/photos/swap1.jpg', '/assets/photos/swap2.jpg', '/assets/photos/swap3.jpg', '/assets/photos/swap4.jpg'],
    enabled: true,
    sort_order: 80,
  },
  {
    slug: 'souvenirs',
    title: 'Souvenirs & Memorabilia',
    body_text: [
      "Take home a piece of Roadster Show history! Exclusive souvenirs and memorabilia are available at the show.",
      "Show T-shirts will be available at Brizio T-Shirts booth",
    ].join('\n\n'),
    image_urls: ['/assets/photos/souviners1.jpg', '/assets/photos/souviners2.jpg', '/assets/photos/souviners3.jpg'],
    enabled: true,
    sort_order: 90,
  },
  {
    slug: 'street_rod',
    title: 'Street Rod Specialty Parking',
    body_text: [
      "Enter at Gate #15 off Arrow Highway",
      "Specialty parking for 1985 and older cars, Pickups, Classics, Hot Rods, Kustoms, and other Special Interest cars will be entered in this large area forming a huge car show. This is also a perfect area to enter cars for sale. No pre-registration necessary.",
      "Friday - $50 per car, driver and one passenger",
      "Saturday - $60 per car, driver and one passenger",
      "2-Day Pass - $100 per car, driver and one passenger",
      "$20 for each additional passenger",
      "Children under 12 - FREE",
      "Cash, Debit and Credit Cards are accepted.",
    ].join('\n\n'),
    image_urls: ['/assets/photos/spec1.jpg', '/assets/photos/spec2.jpg', '/assets/photos/spec3.jpg'],
    enabled: true,
    sort_order: 100,
  },
  {
    slug: 'program_ads',
    title: 'Show Program Ads',
    body_text: [
      "Contact: Dave Meissen - (916) 220-0514; 1932lar@gmail.com",
    ].join('\n\n'),
    image_urls: [],
    enabled: true,
    sort_order: 110,
  },
  {
    slug: 'show_chairman',
    title: 'Show Chairman',
    body_text: [
      "Dave Meissen",
      "(916) 220-0514",
      "1932lar@gmail.com",
    ].join('\n\n'),
    image_urls: [],
    enabled: true,
    sort_order: 120,
  },
  {
    slug: 'scooter_rentals',
    title: 'Scooter & Wheelchair Rentals',
    body_text: [
      "Scooter and wheelchair rentals will be available at the show for a daily rental fee.",
      "Reservations can be made on their website: EventScooters.com/Events",
      "For Reservations call: (262) 677-2697",
    ].join('\n\n'),
    image_urls: [],
    enabled: true,
    sort_order: 130,
  },
  {
    slug: 'recreational_vehicles',
    title: 'Recreational Vehicles',
    body_text: [
      "The Fairplex RV Park is located at:",
      "2200 N. White Avenue, Pomona, CA 91768 (across the street from the Fairplex)",
      "For reservations call: (909) 593-8915",
    ].join('\n\n'),
    image_urls: [],
    enabled: true,
    sort_order: 140,
  },
];

async function seedNewsCards() {
  console.log(`Seeding ${newsCards.length} news cards...`);
  for (const c of newsCards) {
    await sql`
      INSERT INTO news_cards (slug, title, body_text, flyer_url, image_urls, enabled, sort_order)
      VALUES (${c.slug}, ${c.title}, ${c.body_text}, ${c.flyer_url || null}, ${JSON.stringify(c.image_urls)}::jsonb, ${c.enabled}, ${c.sort_order})
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        body_text = EXCLUDED.body_text,
        flyer_url = EXCLUDED.flyer_url,
        image_urls = EXCLUDED.image_urls,
        enabled = EXCLUDED.enabled,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    `;
  }
  console.log('  done.');
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
  await seedAdmin();
  console.log('Seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
