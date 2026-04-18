import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaMapMarkerAlt, FaChevronRight, FaClock, FaInfoCircle } from "react-icons/fa";

export default function ShowNewsPage() {
  return (
    <div className="bg-primary min-h-screen">
      {/* Header */}
      <section className="bg-secondary border-b border-gold/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-5xl md:text-6xl text-gold tracking-widest mb-2">
            SHOW NEWS
          </h1>
          <p className="text-text-muted font-sans">Latest updates from the Los Angeles Roadsters</p>
        </div>
      </section>

      {/* 2026 Show Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-gold/20 text-gold text-sm font-sans tracking-wider rounded">
              APRIL 4, 2026
            </span>
            <span className="px-3 py-1 bg-gold text-primary text-sm font-sans tracking-wider rounded">
              60TH ANNIVERSARY
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Main Content */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-3xl text-gold tracking-wider mb-4">
                  2026 ROADSTER SHOW
                </h2>
                <p className="text-text font-body text-lg leading-relaxed mb-6">
                  The Los Angeles Roadsters Car Club was established in 1957 and remains active today. 
                  The club will host its world-renowned show for the 60th Anniversary in 2026, 
                  marking the 44th time it will be held at the Fairplex in Pomona, California.
                </p>
                <p className="text-text font-body text-lg leading-relaxed">
                  This year, we welcome SoCal Speed Shop to help bring you an even better Show 
                  and Swap experience, and we look forward to the first-ever awards presented 
                  by SoCal and the Los Angeles Roadsters.
                </p>
              </div>

              {/* Show Flyer */}
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary">
                <Image
                  src="/original/Pictures/Show 2025/LA Roadster Flyer with Andys Art 2025.jpg"
                  alt="2026 Show Flyer"
                  fill
                  className="object-contain"
                />
              </div>

              <Link
                href="/original/2026 LAR Show Welcome.pdf"
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-primary font-sans font-semibold rounded hover:bg-gold-dark transition-colors duration-200"
              >
                <FaChevronRight size={16} />
                View 2026 Show Welcome PDF
              </Link>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Date & Location */}
              <div className="bg-secondary rounded-lg p-6 border border-gold/20">
                <h3 className="font-display text-xl text-gold tracking-wider mb-4">
                  DATE & LOCATION
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaCalendarAlt className="text-gold mt-1" size={20} />
                    <div>
                      <p className="text-text font-sans font-semibold">Father Day Weekend</p>
                      <p className="text-text-muted text-sm font-sans">Friday, June 19th</p>
                      <p className="text-text-muted text-sm font-sans">Saturday, June 20th, 2026</p>
                      <p className="text-text-muted text-sm font-sans mt-1">No Show on Sunday</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-gold mt-1" size={20} />
                    <div>
                      <p className="text-text font-sans font-semibold">Fairplex</p>
                      <p className="text-text-muted text-sm font-sans">1101 West McKinley Avenue</p>
                      <p className="text-text-muted text-sm font-sans">Pomona, California</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Show Hours */}
              <div className="bg-secondary rounded-lg p-6 border border-gold/20">
                <h3 className="font-display text-xl text-gold tracking-wider mb-4">
                  SHOW HOURS
                </h3>
                <div className="space-y-2 text-text-muted font-sans text-sm">
                  <div className="flex justify-between">
                    <span>Friday</span>
                    <span>7:00 am to 4:00 pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>7:00 am to 4:00 pm</span>
                  </div>
                </div>
              </div>

              {/* Admission */}
              <div className="bg-secondary rounded-lg p-6 border border-gold/20">
                <h3 className="font-display text-xl text-gold tracking-wider mb-4">
                  ADMISSION
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text font-sans">General Admission</span>
                    <span className="text-gold font-sans font-semibold">$25/person/day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text font-sans">2-Day Pass</span>
                    <span className="text-gold font-sans font-semibold">$45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text font-sans">Active Military (with ID)</span>
                    <span className="text-gold font-sans font-semibold">$10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text font-sans">Children under 12</span>
                    <span className="text-gold font-sans font-semibold">FREE</span>
                  </div>
                  <p className="text-text-muted text-xs font-sans mt-2">
                    Cash, Debit and Credit Cards accepted
                  </p>
                </div>
              </div>

              {/* Main Attraction */}
              <div className="bg-gold/10 rounded-lg p-6 border border-gold/30">
                <h3 className="font-display text-xl text-gold tracking-wider mb-3">
                  MAIN ATTRACTION
                </h3>
                <p className="text-text text-sm font-body leading-relaxed">
                  The main attraction will be the hundreds of 1936 and older open cars of all types 
                  and makes; some original, some modified, all of the highest quality, completely 
                  finished with paint and upholstery, and painstakingly restored to the owner preference. 
                  Only finished roadsters will be allowed to park in the Roadster Parking Area. 
                  No cruising fairgrounds for liability reasons.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parking & Entry Info */}
      <section className="py-16 bg-secondary border-y border-gold/20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl text-gold tracking-wider mb-8 text-center">
            PARKING & ENTRY INFORMATION
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Spectator Parking */}
            <div className="bg-primary rounded-lg p-6 border border-gold/20">
              <h3 className="font-display text-lg text-gold tracking-wider mb-3">
                SPECTATOR PARKING
              </h3>
              <p className="text-text-muted text-sm font-sans mb-2">
                Gate #9 at the Blue Lot on White Avenue
              </p>
              <p className="text-text text-xs font-sans">
                Fairplex charges for parking by credit card or debit card only
              </p>
            </div>

            {/* Roadsters */}
            <div className="bg-primary rounded-lg p-6 border border-gold/20">
              <h3 className="font-display text-lg text-gold tracking-wider mb-3">
                ROADSTERS
              </h3>
              <p className="text-text-muted text-sm font-sans mb-2">
                Enter through Gate #1B
              </p>
              <p className="text-text text-sm font-sans">
                Roadster and driver are free
              </p>
              <p className="text-text-muted text-xs font-sans mt-2">
                Passengers: $20 each for the weekend
              </p>
            </div>

            {/* Swap Meet */}
            <div className="bg-primary rounded-lg p-6 border border-gold/20">
              <h3 className="font-display text-lg text-gold tracking-wider mb-3">
                SWAP MEET
              </h3>
              <p className="text-text-muted text-sm font-sans mb-2">
                Gate #15 off Arrow Highway
              </p>
              <p className="text-text text-sm font-sans">
                Move-in: Thursday, June 18th, 7am-4pm
              </p>
            </div>

            {/* Vendors */}
            <div className="bg-primary rounded-lg p-6 border border-gold/20">
              <h3 className="font-display text-lg text-gold tracking-wider mb-3">
                COMMERCIAL VENDORS
              </h3>
              <p className="text-text-muted text-sm font-sans mb-2">
                Enter at Gate #1
              </p>
              <p className="text-text text-sm font-sans">
                Move-in: Thursday, June 18th, 7am-4pm
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Street Rod Parking */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-secondary rounded-lg p-8 border border-gold/20">
              <h3 className="font-display text-2xl text-gold tracking-wider mb-4">
                STREET ROD SPECIALTY PARKING
              </h3>
              <p className="text-text font-body leading-relaxed mb-4">
                Specialty parking for 1985 and older cars, Pickups, Classics, Hot Rods, Kustoms, 
                and other Special Interest cars will be entered in this large area forming a huge 
                car show. This is also a perfect area to enter cars for sale.
              </p>
              <p className="text-text text-sm font-sans mb-4">
                No pre-registration necessary. Enter at Gate #15 off Arrow Highway.
              </p>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-primary rounded p-3">
                  <p className="text-gold font-display text-xl">$50</p>
                  <p className="text-text-muted text-xs font-sans">Friday</p>
                </div>
                <div className="bg-primary rounded p-3">
                  <p className="text-gold font-display text-xl">$60</p>
                  <p className="text-text-muted text-xs font-sans">Saturday</p>
                </div>
                <div className="bg-primary rounded p-3">
                  <p className="text-gold font-display text-xl">$100</p>
                  <p className="text-text-muted text-xs font-sans">2-Day Pass</p>
                </div>
              </div>
              
              <p className="text-text-muted text-xs font-sans mt-4">
                $20 for each additional passenger. Children under 12 are free. 
                Cash, Debit and Credit Cards accepted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section className="py-16 bg-secondary border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl text-gold tracking-wider mb-8 text-center">
            SHOW CONTACTS
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-text-muted text-sm font-sans mb-1">Commercial Exhibitors</p>
              <p className="text-text font-sans font-semibold">Rich Cohn</p>
              <p className="text-gold font-sans">(818) 402-8145</p>
              <p className="text-text-muted text-sm font-sans">rbcsgarage.com@gmail.com</p>
            </div>
            <div className="text-center">
              <p className="text-text-muted text-sm font-sans mb-1">Swap Meet</p>
              <p className="text-text font-sans font-semibold">Ken Butler</p>
              <p className="text-gold font-sans">(805) 390-5187</p>
              <p className="text-text-muted text-sm font-sans">36fordken@gmail.com</p>
            </div>
            <div className="text-center">
              <p className="text-text-muted text-sm font-sans mb-1">Show Chairman / Program Ads</p>
              <p className="text-text font-sans font-semibold">Dave Meissen</p>
              <p className="text-gold font-sans">(916) 220-0514</p>
              <p className="text-text-muted text-sm font-sans">1932lar@gmail.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
