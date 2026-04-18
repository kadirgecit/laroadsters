import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="bg-primary min-h-screen">
      {/* Header */}
      <section className="bg-secondary border-b border-gold/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-5xl md:text-6xl text-gold tracking-widest mb-2">
            CONTACT US
          </h1>
          <p className="text-text-muted font-sans">Get in touch with the Los Angeles Roadsters</p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Main Contact */}
            <div className="bg-secondary rounded-lg p-8 border border-gold/20 mb-8">
              <h2 className="font-display text-2xl text-gold tracking-wider mb-6">
                GENERAL CONTACT
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <FaEnvelope className="text-gold" size={20} />
                  </div>
                  <div>
                    <p className="text-text-muted text-sm font-sans mb-1">Email</p>
                    <a 
                      href="mailto:1932lar@gmail.com" 
                      className="text-gold font-sans text-lg hover:underline"
                    >
                      1932lar@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Show Contacts */}
            <div className="bg-secondary rounded-lg p-8 border border-gold/20 mb-8">
              <h2 className="font-display text-2xl text-gold tracking-wider mb-6">
                SHOW CONTACTS
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <FaPhone className="text-gold" size={18} />
                  </div>
                  <div>
                    <p className="text-text-muted text-sm font-sans mb-1">Show Chairman / Program Ads</p>
                    <p className="text-text font-sans font-semibold mb-1">Dave Meissen</p>
                    <a href="tel:+19162200514" className="text-gold font-sans hover:underline">(916) 220-0514</a>
                    <p className="text-text-muted text-sm font-sans mt-1">1932lar@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <FaPhone className="text-gold" size={18} />
                  </div>
                  <div>
                    <p className="text-text-muted text-sm font-sans mb-1">Swap Meet</p>
                    <p className="text-text font-sans font-semibold mb-1">Ken Butler</p>
                    <a href="tel:+18053905187" className="text-gold font-sans hover:underline">(805) 390-5187</a>
                    <p className="text-text-muted text-sm font-sans mt-1">36fordken@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <FaPhone className="text-gold" size={18} />
                  </div>
                  <div>
                    <p className="text-text-muted text-sm font-sans mb-1">Commercial Exhibitors</p>
                    <p className="text-text font-sans font-semibold mb-1">Rich Cohn</p>
                    <a href="tel:+18184028145" className="text-gold font-sans hover:underline">(818) 402-8145</a>
                    <p className="text-text-muted text-sm font-sans mt-1">rbcsgarage.com@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-secondary rounded-lg p-8 border border-gold/20">
              <h2 className="font-display text-2xl text-gold tracking-wider mb-6">
                FOLLOW US
              </h2>
              
              <div className="flex gap-4 justify-center">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-primary transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-primary transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-primary transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <FaTwitter size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
