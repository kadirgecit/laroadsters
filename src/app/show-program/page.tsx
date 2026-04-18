import Link from "next/link";
import { FaChevronRight, FaBullhorn, FaImage } from "react-icons/fa";

export default function ShowProgramPage() {
  return (
    <div className="bg-primary min-h-screen">
      {/* Header */}
      <section className="bg-secondary border-b border-gold/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-5xl md:text-6xl text-gold tracking-widest mb-2">
            SHOW PROGRAM
          </h1>
          <p className="text-text-muted font-sans">Advertise in the official Roadster Show program</p>
        </div>
      </section>

      {/* Main Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-secondary rounded-lg p-8 border border-gold/20 mb-8">
              <h2 className="font-display text-2xl text-gold tracking-wider mb-4">
                PROGRAM ADVERTISING
              </h2>
              <p className="text-text font-body leading-relaxed mb-6">
                Put your business in front of hundreds of classic car enthusiasts! Our show program 
                is distributed to attendees at the Roadster Show and serves as a lasting reminder 
                of your products and services.
              </p>
              
              <div className="flex items-center gap-3 mb-6">
                <FaBullhorn className="text-gold" size={24} />
                <span className="text-text font-sans font-semibold">Reach a dedicated classic car audience</span>
              </div>
              
              <div className="flex items-center gap-3">
                <FaImage className="text-gold" size={24} />
                <span className="text-text font-sans font-semibold">Full-color program throughout the show</span>
              </div>
            </div>
            
            <div className="bg-gold/10 rounded-lg p-8 border border-gold/30 mb-8">
              <p className="text-text font-body text-center">
                Download the Program Advertising Rate Sheet for pricing and specifications.
              </p>
            </div>
            
            <Link
              href="/original/2026 Program Rate Sheet.pdf"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-gold text-primary font-sans font-semibold rounded hover:bg-gold-dark transition-colors duration-200"
            >
              <FaChevronRight size={16} />
              Download Program Rate Sheet
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-secondary border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-primary rounded-lg p-8 border border-gold/20 max-w-xl mx-auto text-center">
            <h3 className="font-display text-xl text-gold tracking-wider mb-4">
              PROGRAM ADVERTISING
            </h3>
            <p className="text-text font-sans font-semibold mb-1">Dave Meissen</p>
            <p className="text-gold font-sans text-xl mb-1">(916) 220-0514</p>
            <p className="text-text-muted font-sans">1932lar@gmail.com</p>
          </div>
        </div>
      </section>
    </div>
  );
}
