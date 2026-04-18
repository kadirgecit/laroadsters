import { FaHistory } from "react-icons/fa";

export default function AboutUsPage() {
  return (
    <div className="bg-primary min-h-screen">
      {/* Header */}
      <section className="bg-secondary border-b border-gold/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-5xl md:text-6xl text-gold tracking-widest mb-2">
            ABOUT US
          </h1>
          <p className="text-text-muted font-sans">The History of the Los Angeles Roadsters</p>
        </div>
      </section>

      {/* History Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-secondary rounded-lg p-8 border border-gold/20 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <FaHistory className="text-gold" size={32} />
                <h2 className="font-display text-2xl text-gold tracking-wider">
                  CLUB HISTORY
                </h2>
              </div>
              
              <div className="space-y-6 text-text font-body text-lg leading-relaxed">
                <p>
                  The Los Angeles Roadsters Car Club was established in 1957 and remains active today, 
                  making it one of the oldest continuously operating car clubs in Southern California.
                </p>
                
                <p>
                  The club is well known for their beautiful 1936 and older roadsters and their 
                  signature club uniform of red shirts and white pants. This distinctive look has 
                  become synonymous with the LA Roadsters identity at car shows and events throughout California.
                </p>
                
                <p>
                  For nearly seven decades, the LA Roadsters has been dedicated to preserving and 
                  celebrating the classic roadster lifestyle. The annual Roadster Show at the Fairplex 
                  in Pomona has become a world-renowned event, attracting enthusiasts from across the country.
                </p>
                
                <p>
                  The club continues its tradition of excellence, welcoming new members who share 
                  the passion for pre-war automobiles and the camaraderie that has defined the 
                  Los Angeles Roadsters for generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
