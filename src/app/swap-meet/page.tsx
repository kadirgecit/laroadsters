import Link from "next/link";
import { FaChevronRight, FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";

export default function SwapMeetPage() {
  return (
    <div className="bg-primary min-h-screen">
      {/* Header */}
      <section className="bg-secondary border-b border-gold/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-5xl md:text-6xl text-gold tracking-widest mb-2">
            SWAP MEET
          </h1>
          <p className="text-text-muted font-sans">Buy, sell, and trade car parts and memorabilia</p>
        </div>
      </section>

      {/* Main Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-3xl text-gold tracking-wider mb-6">
                SWAP MEET INFORMATION
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-gold mt-1" size={24} />
                  <div>
                    <p className="text-text font-sans font-semibold mb-1">Location</p>
                    <p className="text-text-muted font-sans">Enter at Gate #15 off Arrow Highway</p>
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
                    <p className="text-text font-sans font-semibold mb-1">Space Size</p>
                    <p className="text-text-muted font-sans">Each space is 25 x 20 feet</p>
                    <p className="text-text-muted text-sm font-sans">(equivalent to three Fairplex parking spaces)</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <p className="text-text font-body leading-relaxed">
                  Items for sale should be car parts or car-related items only. 
                  Pre-register by mail or phone, or on the day of the show. 
                  Cash, checks, debit and credit cards are accepted.
                </p>
              </div>
            </div>
            
            {/* Pricing */}
            <div>
              <div className="bg-secondary rounded-lg p-8 border border-gold/20">
                <h3 className="font-display text-2xl text-gold tracking-wider mb-6">
                  SPACE PRICING
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 border-b border-gold/10">
                    <span className="text-text font-sans">Standard Space</span>
                    <span className="text-gold font-display text-3xl">$125</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gold/10">
                    <span className="text-text font-sans">Corner Space</span>
                    <span className="text-gold font-display text-3xl">$150</span>
                  </div>
                </div>
                
                <p className="text-text-muted text-sm font-sans mt-4">
                  Friday and Saturday pricing (per space)
                </p>
              </div>
              
              <div className="mt-6">
                <Link
                  href="/original/2026 Swap Form.pdf"
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-gold text-primary font-sans font-semibold rounded hover:bg-gold-dark transition-colors duration-200"
                >
                  <FaChevronRight size={16} />
                  Download Registration Form
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
              SWAP MEET CONTACT
            </h3>
            <p className="text-text font-sans font-semibold mb-1">Ken Butler</p>
            <p className="text-gold font-sans text-xl mb-1">(805) 390-5187</p>
            <p className="text-text-muted font-sans">36fordken@gmail.com</p>
          </div>
        </div>
      </section>
    </div>
  );
}
