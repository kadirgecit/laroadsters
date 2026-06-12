import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, FileText, Download, Newspaper } from 'lucide-react';
gsap.registerPlugin(ScrollTrigger);

interface DocumentItem {
  id: string;
  name: string;
  file_url: string;
  size_label: string | null;
  category: string | null;
  sort_order: number;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string | null;
  description: string | null;
  flyer_pdf_url: string | null;
  sort_order: number;
}

interface NewsPost {
  id: string;
  title: string;
  body_text: string;
  published_at: string;
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
  const [docLoaded, setDocLoaded] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventLoaded, setEventLoaded] = useState(false);
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [postsLoaded, setPostsLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/public/documents')
      .then((r) => r.json())
      .then((rows: DocumentItem[]) => {
        const sorted = [...rows].sort((a, b) => a.sort_order - b.sort_order);
        setDocuments(sorted);
      })
      .catch(() => { /* leave empty on failure */ })
      .finally(() => setDocLoaded(true));
  }, []);

  useEffect(() => {
    fetch('/api/public/events')
      .then((r) => r.json())
      .then((rows: EventItem[]) => {
        const sorted = [...rows].sort((a, b) => a.sort_order - b.sort_order);
        setEvents(sorted);
      })
      .catch(() => { /* leave empty on failure */ })
      .finally(() => setEventLoaded(true));
  }, []);

  useEffect(() => {
    fetch('/api/public/news-posts')
      .then((r) => r.json())
      .then((rows: NewsPost[]) => {
        // Server already orders by published_at DESC. Keep that order.
        setPosts(Array.isArray(rows) ? rows : []);
      })
      .catch(() => { /* leave empty on failure */ })
      .finally(() => setPostsLoaded(true));
  }, []);

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
            {eventLoaded && events.length === 0 ? (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm text-center text-gray-500 text-sm">
                No upcoming events.
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-red-500 font-semibold mb-2">{event.date}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                      {event.description && (
                        <p className="text-gray-400">{event.description}</p>
                      )}
                      {event.flyer_pdf_url && (
                        <a
                          href={event.flyer_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center gap-1 text-sm text-red-500 hover:text-white mt-2"
                        >
                          <Download className="w-3 h-3" /> Download Flyer PDF
                        </a>
                      )}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Latest News (news_posts from /admin/member-news) */}
        <section className="member-section mb-16">
          <div className="flex items-center gap-4 mb-8">
            <Newspaper className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl font-bold text-white">Latest News</h2>
          </div>
          <div className="space-y-4">
            {postsLoaded && posts.length === 0 ? (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm text-center text-gray-500 text-sm">
                No news posts yet.
              </div>
            ) : (
              posts.map((p) => (
                <article
                  key={p.id}
                  className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm"
                >
                  <div className="text-[10px] tracking-widest text-gray-500 font-mono mb-2">
                    {new Date(p.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-gray-400 whitespace-pre-wrap">{p.body_text}</p>
                </article>
              ))
            )}
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
            {docLoaded && documents.length === 0 ? (
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