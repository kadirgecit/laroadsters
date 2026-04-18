import Link from "next/link";
import { FaCalendarAlt, FaFileAlt, FaLock } from "react-icons/fa";

export default function MemberNewsPage() {
  return (
    <div className="bg-primary min-h-screen">
      {/* Header */}
      <section className="bg-secondary border-b border-gold/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-5xl md:text-6xl text-gold tracking-widest mb-2">
            MEMBER NEWS
          </h1>
          <p className="text-text-muted font-sans">Calendar of events and club information</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Calendar of Events */}
            <div className="bg-secondary rounded-lg p-6 border border-gold/20">
              <div className="flex items-center gap-3 mb-4">
                <FaCalendarAlt className="text-gold" size={24} />
                <h2 className="font-display text-xl text-gold tracking-wider">
                  CALENDAR OF EVENTS
                </h2>
              </div>
              <p className="text-text-muted font-sans text-sm mb-4">
                Stay updated on club meetings, runs, and special events throughout the year.
              </p>
              <div className="bg-primary rounded p-4">
                <p className="text-text text-sm font-sans">
                  Check back for upcoming 2026 events and meeting dates.
                </p>
              </div>
            </div>

            {/* Meeting Dates */}
            <div className="bg-secondary rounded-lg p-6 border border-gold/20">
              <div className="flex items-center gap-3 mb-4">
                <FaCalendarAlt className="text-gold" size={24} />
                <h2 className="font-display text-xl text-gold tracking-wider">
                  MEETING DATES
                </h2>
              </div>
              <p className="text-text-muted font-sans text-sm mb-4">
                Monthly club meetings and gathering schedule.
              </p>
              <div className="bg-primary rounded p-4">
                <p className="text-text text-sm font-sans">
                  Contact us for current meeting schedule and location details.
                </p>
              </div>
            </div>

            {/* Club Documents */}
            <div className="bg-secondary rounded-lg p-6 border border-gold/20">
              <div className="flex items-center gap-3 mb-4">
                <FaLock className="text-gold" size={24} />
                <h2 className="font-display text-xl text-gold tracking-wider">
                  CLUB DOCUMENTS
                </h2>
              </div>
              <p className="text-text-muted font-sans text-sm mb-4">
                Access member-only documents, forms, and club information.
              </p>
              <div className="bg-gold/10 rounded p-4 border border-gold/20">
                <p className="text-text text-sm font-sans flex items-center gap-2">
                  <FaLock size={14} className="text-gold" />
                  Password protected area
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Member Resources */}
      <section className="py-16 bg-secondary border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl text-gold tracking-wider mb-8 text-center">
            MEMBER RESOURCES
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-primary rounded-lg p-6 border border-gold/20">
              <h3 className="font-display text-lg text-gold tracking-wider mb-3">
                MEMBERSHIP APPLICATION
              </h3>
              <p className="text-text-muted font-sans text-sm mb-4">
                Interested in joining the LA Roadsters? Download the membership application.
              </p>
              <Link
                href="/original/membership app 2024.pdf"
                target="_blank"
                className="inline-flex items-center gap-2 text-gold font-sans text-sm hover:underline"
              >
                Download Application
              </Link>
            </div>
            
            <div className="bg-primary rounded-lg p-6 border border-gold/20">
              <h3 className="font-display text-lg text-gold tracking-wider mb-3">
                CLUB BY-LAWS
              </h3>
              <p className="text-text-muted font-sans text-sm mb-4">
                Official club by-laws and operating procedures.
              </p>
              <Link
                href="/original/LAR By-Laws 1-3-17.pdf"
                target="_blank"
                className="inline-flex items-center gap-2 text-gold font-sans text-sm hover:underline"
              >
                View By-Laws
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
