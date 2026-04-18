import Link from "next/link";
import { FaChevronRight, FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";

export default function ExhibitorsPage() {
  return (
    <div className="bg-primary min-h-screen">
      {/* Header */}
      <section className="bg-secondary border-b border-gold/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-5xl md:text-6xl text-gold tracking-widest mb-2">
            COMMERCIAL EXHIBITORS
          </h1>
          <p className="text-text-muted font-sans">Showcase your business at the Roadster Show</p>
        </div>
      </section>

      {/* Main Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-3xl text-gold tracking-wider mb-6">
                EXHIBITOR INFORMATION
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-gold mt-1" size={24} />
                  <div>
                    <p className="text-text font-sans font-semibold mb-1">Location</p>
                    <p className="text-text-muted font-sans">Enter at Gate #1</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <FaCalendarAlt className="text-gold mt-1" size={24} />
                  <div>
                    <p className="text-text font-sans font-semibold mb-1">Move-in</p>
                    <p className="text-text-muted font-sans">Thursday, June 18th, 7:00 am to 4:00 pm</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <FaInfoCircle className="text-gold mt-1" size={24} />
                  <div>
                    <p className="text-text font-sans font-semibold mb-1">Requirements</p>
                    <p className="text-text-muted font-sans">Car parts or car-related items only</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <p className="text-text font-body leading-relaxed">
                  Join us for the 60th Anniversary show! The Roadster Show attracts hundreds of 
                  classic car enthusiasts. Showcase your products and services to our dedicated audience.
                </p>
              </div>
            </div>
            
            {/* Registration */}
            <div>
              <div className="bg-secondary rounded-lg p-8 border border-gold/20">
                <h3 className="font-display text-2xl text-gold tracking-wider mb-6">
                  RESERVE YOUR SPACE
                </h3>
                
                <p className="text-text-muted font-sans mb-6">
                  Download the exhibitor reservation form or contact the coordinator directly.
                </p>
                
                <Link
                  href="/original/2026 LAR Show Exhibitor form .pdf"
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-gold text-primary font-sans font-semibold rounded hover:bg-gold-dark transition-colors duration-200"
                >
                  <FaChevronRight size={16} />
                  Download Exhibitor Form
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-secondary border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-primary rounded-lg p-8 border border-gold/20 max-w-xl mx-auto text-center">
            <h3 className="font-display text-xl text-gold tracking-wider mb-4">
              EXHIBITOR COORDINATOR
            </h3>
            <p className="text-text font-sans font-semibold mb-1">Rich Cohn</p>
            <p className="text-gold font-sans text-xl mb-1">(818) 402-8145</p>
            <p className="text-text-muted font-sans">rbcsgarage.com@gmail.com</p>
          </div>
        </div>
      </section>
    </div>
  );
}
