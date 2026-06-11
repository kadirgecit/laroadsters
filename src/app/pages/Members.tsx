import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, FileText, Download } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface DocumentItem {
  id: string;
  name: string;
  file_url: string;
  size_label: string | null;
  category: string | null;
  sort_order: number;
}

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

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/public/documents')
      .then((r) => r.json())
      .then((rows: DocumentItem[]) => {
        const sorted = [...rows].sort((a, b) => a.sort_order - b.sort_order);
        setDocuments(sorted);
      })
      .catch(() => { /* leave empty on failure */ })
      .finally(() => setLoaded(true));
  }, []);

  const events = [
    {
      date: 'June 19-20, 2026',
      title: '60th Anniversary Roadster Show & Swap',
      location: 'Fairplex, Pomona',
      description: "Father's Day Weekend - The premier classic roadster event of the year",
    },
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

        {/* Club Documents */}
        <section className="member-section">
          <div className="flex items-center gap-4 mb-8">
            <FileText className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl font-bold text-white">Club Documents</h2>
            <p className="text-gray-400 mt-2">These documents are password-protected for members only.</p>
          </div>
          <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
            {loaded && documents.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                No documents available yet.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-red-500 shrink-0" />
                      <span className="text-white truncate">{doc.name}</span>
                    </div>
                    <span className="text-gray-500 text-sm inline-flex items-center gap-1 shrink-0 group-hover:text-red-500 transition-colors">
                      {doc.size_label || 'Download'}
                      <Download className="w-3 h-3" />
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}