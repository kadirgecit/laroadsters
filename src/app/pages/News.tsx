import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Sponsor {
  name: string;
  logo: string;
  url: string;
}

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
  '/assets/photos/Run5.jpg',
  '/assets/photos/Run7.jpg',
];

const specImages = [
  '/assets/photos/spec1.jpg',
  '/assets/photos/spec2.jpg',
  '/assets/photos/spec3.jpg',
];

export function News() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Sponsors data
  const sponsors: Sponsor[] = [
    { name: 'Bob Drake', logo: '/sponsors/bob-drake.webp', url: 'https://bobdrake.com' },
    { name: 'Brookville Roadster', logo: '/sponsors/brookville-roadster.webp', url: 'https://brookvilleroadster.com' },
    { name: 'California Car Cover', logo: '/sponsors/california-car-cover.jpg', url: 'https://calcarcover.com' },
    { name: 'Grand National Roadster Show', logo: '/sponsors/grand-national-roadster-show.jpg', url: 'https://rodshows.com' },
    { name: 'Rodding USA Magazine', logo: '/sponsors/rodding-usa.png', url: 'https://www.roddingusa.com' },
  ];

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
  }, []);

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
        <div className="news-section mb-20">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">60th Anniversary Flyer</h2>
              <a
                href="/60th-Anniversary-Flyer.pdf"
                download
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-500 transition-colors duration-300"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </div>
            
            {/* Embedded PDF Viewer */}
            <div className="w-full h-[600px] rounded-xl overflow-hidden border border-white/10 bg-white/5">
              <iframe
                src="/60th-Anniversary-Flyer.pdf"
                className="w-full h-full"
                title="60th Anniversary Flyer"
              />
            </div>
          </div>
        </div>

        {/* Sponsors Section */}
        <div className="news-section mb-20">
          <div className="text-center mb-12">
            <div className="text-sm tracking-[0.3em] text-red-500 mb-4 font-light">
              THANK YOU
            </div>
            <h2 className="text-4xl font-black text-white mb-4">Our Sponsors</h2>
            <p className="text-gray-400">
              Supporting the 60th Anniversary Roadster Show & Swap
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {sponsors.map((sponsor, index) => (
              <a
                key={index}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-48"
              >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-red-500/50 transition-all duration-500 flex items-center justify-center h-28">
                  <img
                    src={sponsor.logo}
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

        {/* Show Details Content */}
        <div className="news-section mb-20 space-y-16">
          {/* About Section */}
          <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">About The Show</h2>
                <div className="prose prose-invert max-w-none space-y-4 text-gray-300">
                  <p>
                    Our 60th Anniversary Roadster Show & Swap will be held on Father's Day Weekend, 
                    Friday, June 19 and Saturday, June 20, 2026 at the Fairplex, 1101 West 
                    McKinley Avenue, Pomona, California.
                  </p>
                  <p>
                    This year, we welcome{' '}
                    <a href="https://www.est1946.com" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-white underline">
                      So-Cal Speed Shop
                    </a>{' '}
                    to help bring you an even better Show and Swap experience, and we look forward 
                    to the first-ever awards presented by So-Cal and the Los Angeles Roadsters.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img src="/assets/photos/show1.jpg" alt="Roadster Show" className="rounded-2xl w-full h-40 object-cover shadow-xl" />
                <img src="/assets/photos/show2.jpg" alt="Roadster Show" className="rounded-2xl w-full h-40 object-cover shadow-xl mt-8" />
              </div>
            </div>
          </section>

          {/* Main Attraction */}
          <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">The Main Attraction</h2>
                <p className="text-gray-300 text-lg">
                  The main attraction will be hundreds of open cars from 1936 and earlier, of all types and makes; some original, some modified, all of the highest quality, fully finished in paint and upholstery, and carefully restored to the owner's preference. Only finished roadsters will be allowed to park in the Show Roadster Parking Area. No cruising through the fairgrounds is allowed for liability reasons.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {roadsterImages.map((src, i) => (
                  <img key={i} src={src} alt={`Roadsters ${i+1}`} className="rounded-2xl w-full h-36 object-cover shadow-xl" />
                ))}
              </div>
            </div>
          </section>

          {/* General Public */}
          <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-6">General Public</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 text-gray-300">
                <p>
                  <span className="text-white font-semibold">Spectator parking</span> will be available 
                  at Gate #9 at the Blue Lot on White Avenue. The Fairplex charges for parking by 
                  credit card or debit card only.
                </p>
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-white mb-3">Show hours:</h3>
                  <ul className="space-y-2">
                    <li><span className="text-red-500 font-semibold">Friday</span> 7:00 am to 4:00 pm</li>
                    <li><span className="text-red-500 font-semibold">Saturday</span> 7:00 am to 4:00 pm</li>
                  </ul>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-white mb-3">Admission:</h3>
                  <ul className="space-y-2">
                    <li>$25 per person/per day</li>
                    <li>Active Military (with ID) - $10</li>
                    <li>Children under 12 - <span className="text-green-500">FREE</span></li>
                    <li>Two-day adult pass - $45</li>
                  </ul>
                  <p className="mt-3 text-gray-400">Cash, Debit and Credit Cards are accepted.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img src="/assets/photos/cars1.jpg" alt="Cars" className="rounded-2xl w-full h-36 object-cover shadow-xl" />
                <img src="/assets/photos/cars2.jpg" alt="Cars" className="rounded-2xl w-full h-36 object-cover shadow-xl mt-8" />
                <img src="/assets/photos/cars3.jpg" alt="Cars" className="rounded-2xl w-full h-36 object-cover shadow-xl" />
              </div>
            </div>
          </section>

          {/* Roadsters */}
          <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Roadsters - Parking Information</h2>
                <div className="space-y-4 text-gray-300">
                  <p className="text-2xl font-bold text-red-500">
                    Pre-36 Roadsters are Free
                  </p>
                  <p>
                    Only finished pre-1936 roadsters will be allowed to park in the Show Roadster Parking Area. They will enter Gate #1B, car and driver are free admission, $20 for passenger.
                  </p>
                  <p>
                    Other roadsters will be referred to park in Street Rod Specialty Parking at Gate #15 off Arrow Highway.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {mugImages.map((src, i) => (
                  <img key={i} src={src} alt={`Mug ${i+1}`} className="rounded-xl w-full h-28 object-cover shadow-lg" />
                ))}
              </div>
            </div>
          </section>

          {/* Commercial Vendors */}
          <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-6">Commercial Vendors</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 text-gray-300">
                <p>
                  <span className="text-white font-semibold">Vendors enter at Gate #1</span>
                </p>
                <p>
                  <span className="text-white font-semibold">Move-in Thursday, June 18th</span> - 7:00 am to 4:00 pm
                </p>
                <div className="mt-6 p-4 rounded-xl bg-red-600/20 border border-red-500/30">
                  <a 
                    href="/2026 LAR Show Exhibitor form .pdf" 
                    download
                    className="text-xl font-bold text-red-500 hover:text-white transition-colors duration-300"
                  >
                    Download Commercial Exhibitor Reservation Form
                  </a>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-white mb-3">Contact:</h3>
                  <p>Rich Cohn - (818) 402-8145</p>
                  <p>rbcsgarage@gmail.com</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {vendorImages.map((src, i) => (
                  <img key={i} src={src} alt={`Vendor ${i+1}`} className="rounded-2xl w-full h-32 object-cover shadow-xl" />
                ))}
              </div>
            </div>
          </section>

          {/* Swap Meet */}
          <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-2">Swap Meet</h2>
            <p className="text-lg text-red-500 font-semibold mb-6">Swap Meet spaces available — car parts and related items only.</p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 text-gray-300">
                <p>
                  <span className="text-white font-semibold">Enter at Gate #15 off Arrow Highway</span>
                </p>
                <p>
                  <span className="text-white font-semibold">Move-in Thursday, June 18th</span> - 7:00 am to 4:00 pm
                </p>
                <div className="mt-6 space-y-2">
                  <p><span className="text-white font-semibold">Swap spaces</span> are 25' x 20' (equivalent to three Fairplex parking spaces)</p>
                  <p><span className="text-white font-semibold">Friday and Saturday:</span></p>
                  <ul className="ml-6 space-y-1">
                    <li>$125 for Space</li>
                    <li>$150 for Corner Space</li>
                  </ul>
                  <p className="mt-2">Items for sale should be car parts or car-related items only.</p>
                </div>
                <div className="mt-6 p-4 rounded-xl bg-red-600/20 border border-red-500/30">
                  <a 
                    href="/2026 Swap Form.pdf" 
                    download
                    className="text-xl font-bold text-red-500 hover:text-white transition-colors duration-300"
                  >
                    Download Swap Meet Registration Form
                  </a>
                </div>
                <p className="text-gray-400 mt-4">Pre-register by mail or phone, or on the day of the show. Cash, checks, debit and credit cards are accepted.</p>
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-white mb-3">Contact:</h3>
                  <p>Ken Butler - (805) 390-5187</p>
                  <p>36fordken@gmail.com</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {swapImages.slice(0, 4).map((src, i) => (
                  <img key={i} src={src} alt={`Swap Meet ${i+1}`} className="rounded-2xl w-full h-32 object-cover shadow-xl" />
                ))}
              </div>
            </div>
          </section>

          {/* Souvenirs - NEW SECTION */}
          <section className="p-8 rounded-3xl bg-gradient-to-br from-red-600/20 to-white/0 border border-red-500/30">
            <h2 className="text-3xl font-bold text-white mb-6">Souvenirs & Memorabilia</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-gray-300">
                <p>
                  Take home a piece of Roadster Show history! Exclusive souvenirs and memorabilia 
                  are available at the show.
                </p>
                <p className="text-red-500 font-semibold">
                  Show T-shirts will be available at Brizio T-Shirts booth
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {souvenirImages.map((src, i) => (
                  <img key={i} src={src} alt={`Souvenir ${i+1}`} className="rounded-xl w-full h-28 object-cover shadow-lg" />
                ))}
              </div>
            </div>
          </section>

          {/* Street Rod Specialty Parking */}
          <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-6">Street Rod Specialty Parking</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 text-gray-300">
                <p>
                  <span className="text-white font-semibold">Enter at Gate #15 off Arrow Highway</span>
                </p>
                <p>
                  Specialty parking for 1985 and older cars, Pickups, Classics, Hot Rods, Kustoms, and 
                  other Special Interest cars will be entered in this large area forming a huge car show. 
                  This is also a perfect area to enter cars for sale. No pre-registration necessary.
                </p>
                <div className="mt-6 space-y-2">
                  <p><span className="text-white font-semibold">Friday</span> - $50 per car, driver and one passenger</p>
                  <p><span className="text-white font-semibold">Saturday</span> - $60 per car, driver and one passenger</p>
                  <p><span className="text-white font-semibold">2-Day Pass</span> - $100 per car, driver and one passenger</p>
                  <p>$20 for each additional passenger</p>
                  <p>Children under 12 - <span className="text-green-500">FREE</span></p>
                </div>
                <p className="text-gray-400 mt-4">Cash, Debit and Credit Cards are accepted.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {specImages.map((src, i) => (
                  <img key={i} src={src} alt={`Specialty ${i+1}`} className="rounded-xl w-full h-28 object-cover shadow-lg" />
                ))}
              </div>
            </div>
          </section>

          {/* Show Program Ads */}
          <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-6">Show Program Ads</h2>
            <div className="space-y-4 text-gray-300">
              <div className="mt-6 p-4 rounded-xl bg-red-600/20 border border-red-500/30">
                <a 
                  href="/2026 Program Rate Sheet.pdf" 
                  download
                  className="text-xl font-bold text-red-500 hover:text-white transition-colors duration-300"
                >
                  Download Program Advertising Rate Sheet
                </a>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold text-white mb-3">Contact:</h3>
                <p>Dave Meissen - (916) 220-0514</p>
                <p>1932lar@gmail.com</p>
              </div>
            </div>
          </section>

          {/* Show Chairman */}
          <section className="p-8 rounded-3xl bg-gradient-to-br from-red-600/20 to-white/0 border border-red-500/30">
            <h2 className="text-3xl font-bold text-white mb-6">Show Chairman</h2>
            <div className="text-gray-300">
              <p className="text-xl font-semibold text-white">Dave Meissen</p>
              <p>(916) 220-0514</p>
              <p>1932lar@gmail.com</p>
            </div>
          </section>

          {/* Scooter & Wheelchair Rentals */}
          <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-6">Scooter & Wheelchair Rentals</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Scooter and wheelchair rentals will be available at the show for a daily rental fee.
              </p>
              <p>
                Reservations can be made on their website: <a href="https://EventScooters.com/Events" className="text-red-500 hover:text-white">EventScooters.com/Events</a>
              </p>
              <p>
                For Reservations call: <span className="text-white font-semibold">(262) 677-2697</span>
              </p>
            </div>
          </section>

          {/* Recreational Vehicles */}
          <section className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-6">Recreational Vehicles</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                The Fairplex RV Park is located at:
              </p>
              <p className="text-white font-semibold">
                2200 N. White Avenue<br />
                Pomona, CA 91768<br />
                (across the street from the Fairplex)
              </p>
              <p>
                For reservations call: <span className="text-white font-semibold">(909) 593-8915</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}