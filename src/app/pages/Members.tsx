import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, Clock, FileText, Download, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Members() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.member-section', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const events = [
    {
      date: 'June 19-20, 2026',
      title: '44th Annual Roadster Show & Swap',
      location: 'Fairplex, Pomona',
      description: "Father's Day Weekend - The premier classic roadster event of the year",
    },
    {
      date: 'July 2026',
      title: 'Club Meeting',
      location: 'TBD',
      description: 'Monthly member meeting - locations rotate',
    },
    {
      date: 'August 2026',
      title: 'Club Meeting',
      location: 'TBD',
      description: 'Monthly member meeting',
    },
    {
      date: 'September 2026',
      title: 'Club Picnic',
      location: 'TBD',
      description: 'Annual summer picnic for members and families',
    },
  ];

  const meetings = [
    {
      day: '3rd Wednesday of Each Month',
      time: '7:00 PM',
      location: 'Various Locations',
      note: 'Meetings rotate between member homes and local venues',
    },
  ];

  const documents = [
    { name: 'Club Bylaws', size: 'PDF' },
    { name: 'Membership Application', size: 'PDF' },
    { name: 'Event Waiver', size: 'PDF' },
    { name: 'Show Guidelines', size: 'PDF' },
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto" ref={sectionRef}>
        {/* Header */}
        <div className="mb-16">
          <div className="text-sm tracking-[0.3em] text-red-500 mb-4 font-light">
            CLUB INFORMATION
          </div>
          <h1 className="text-[clamp(3rem,10vw,7rem)] font-black leading-[0.9] tracking-tight mb-6">
            <div className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              MEMBER NEWS
            </div>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Stay connected with the latest events, meetings, and club information
          </p>
        </div>

        {/* Calendar of Events */}
        <section className="member-section mb-16">
          <div className="flex items-center gap-4 mb-8">
            <Calendar className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl font-bold text-white">Calendar of Events</h2>
          </div>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-red-500 font-semibold mb-2">{event.date}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-gray-400">{event.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Meeting Dates */}
        <section className="member-section mb-16">
          <div className="flex items-center gap-4 mb-8">
            <Clock className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl font-bold text-white">Meeting Dates</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {meetings.map((meeting, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-gradient-to-br from-red-600/10 to-red-900/10 border border-red-500/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-red-500" />
                  <span className="text-white font-semibold">Regular Meetings</span>
                </div>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{meeting.day}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{meeting.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{meeting.location}</span>
                  </div>
                </div>
                <p className="mt-4 text-gray-500 text-sm">{meeting.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Club Documents */}
        <section className="member-section">
          <div className="flex items-center gap-4 mb-8">
            <FileText className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl font-bold text-white">Club Documents</h2>
          </div>
          <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            <p className="text-gray-400 mb-6">
              Members-only documents. Please log in to access these files.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-red-500" />
                    <span className="text-white">{doc.name}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{doc.size}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
              <p className="text-gray-400">
                For document access, please contact the club secretary or visit a meeting.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}