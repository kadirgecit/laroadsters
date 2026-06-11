// /admin/events — manage the Calendar of Events shown on the public Members page.
// Each event has: title, free-text date (e.g. "June 19-20, 2026"), location,
// description, optional PDF flyer, sort order.

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowUp, ArrowDown, Save, RefreshCw, Trash2, Plus, X, Calendar, MapPin, FileText, Loader2, Download } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string | null;
  description: string | null;
  flyer_pdf_url: string | null;
  sort_order: number;
  created_at: string;
}

async function api(path: string, opts: RequestInit = {}) {
  const res = await fetch(`/api${path}`, {
    ...opts,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// Raw upload — FormData POST, returns { url, pathname }.
async function uploadFile(file: File, onProgress: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/upload');
    xhr.withCredentials = 'true';
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let body: any = {};
      try { body = JSON.parse(xhr.responseText); } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && body.url) resolve(body.url);
      else reject(new Error(body.error || `HTTP ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error('Network error'));
    const fd = new FormData();
    fd.append('file', file);
    xhr.send(fd);
  });
}

const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25 MB

const emptyForm = (sortOrder: number) => ({
  title: '',
  date: '',
  location: '',
  description: '',
  flyer_pdf_url: '',
  sort_order: sortOrder,
  pdfUploading: false,
  pdfPct: 0,
  pdfError: '',
  pdfFileName: '',
});

export function AdminEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState(emptyForm(10));
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api('/me')
      .then((r) => { if (!r.authenticated) navigate('/admin/login', { replace: true }); })
      .catch(() => navigate('/admin/login', { replace: true }));
  }, [navigate]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const rows: Event[] = await api('/admin/events');
      const sorted = [...rows].sort((a, b) => a.sort_order - b.sort_order);
      setEvents(sorted);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function moveEvent(index: number, dir: -1 | 1) {
    setEvents((arr) => {
      const next = [...arr];
      const target = index + dir;
      if (target < 0 || target >= next.length) return arr;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((e, i) => ({ ...e, sort_order: (i + 1) * 10 }));
    });
  }

  function openNew() {
    const nextOrder = events.length ? Math.max(...events.map((e) => e.sort_order)) + 10 : 10;
    setForm(emptyForm(nextOrder));
    setEditing('new');
  }

  function openEdit(e: Event) {
    setForm({
      title: e.title,
      date: e.date,
      location: e.location || '',
      description: e.description || '',
      flyer_pdf_url: e.flyer_pdf_url || '',
      sort_order: e.sort_order,
      pdfUploading: false,
      pdfPct: 0,
      pdfError: '',
      pdfFileName: '',
    });
    setEditing(e.id);
  }

  function closeForm() {
    setEditing(null);
    setForm(emptyForm(10));
  }

  async function handlePdfChange(file: File) {
    if (file.type !== 'application/pdf') {
      setForm((f) => ({ ...f, pdfError: 'Only PDF files are accepted.' }));
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setForm((f) => ({ ...f, pdfError: `File is ${(file.size / 1024 / 1024).toFixed(1)} MB. Max is 25 MB.` }));
      return;
    }
    setForm((f) => ({ ...f, pdfUploading: true, pdfPct: 0, pdfError: '', pdfFileName: file.name }));
    try {
      const url = await uploadFile(file, (p) => setForm((f) => ({ ...f, pdfPct: p })));
      setForm((f) => ({ ...f, flyer_pdf_url: url, pdfUploading: false, pdfPct: 0 }));
    } catch (e: any) {
      setForm((f) => ({ ...f, pdfUploading: false, pdfPct: 0, pdfError: e.message || 'Upload failed' }));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function saveForm() {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.date.trim()) { setError('Date is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: form.title.trim(),
        date: form.date.trim(),
        location: form.location.trim() || null,
        description: form.description.trim() || null,
        flyer_pdf_url: form.flyer_pdf_url || null,
        sort_order: form.sort_order,
      };
      if (editing === 'new') {
        await api('/admin/events', { method: 'POST', body: JSON.stringify(payload) });
      } else if (editing) {
        await api(`/admin/events/${editing}`, { method: 'PUT', body: JSON.stringify(payload) });
      }
      closeForm();
      setSavedAt(new Date());
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function persistOrder() {
    setSaving(true);
    setError('');
    try {
      for (const e of events) {
        await api(`/admin/events/${e.id}`, {
          method: 'PUT',
          body: JSON.stringify({ sort_order: e.sort_order }),
        });
      }
      setSavedAt(new Date());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function del(e: Event) {
    if (!confirm(`Remove event "${e.title}"? This deletes the flyer PDF too.`)) return;
    setSaving(true);
    setError('');
    try {
      await api(`/admin/events/${e.id}`, { method: 'DELETE' });
      setSavedAt(new Date());
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Loading events…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin')}
              className="text-gray-400 hover:text-white hover:bg-white/5"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl font-black truncate">Events</h1>
              <p className="text-xs text-gray-500">
                {events.length} event{events.length === 1 ? '' : 's'} shown on the Members page
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {savedAt && (
              <span className="text-xs text-gray-500 hidden sm:inline">Saved {savedAt.toLocaleTimeString()}</span>
            )}
            <Button
              variant="outline"
              onClick={load}
              disabled={saving}
              className="border-white/10 text-gray-300 hover:bg-white/5"
            >
              <RefreshCw className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Reload</span>
            </Button>
            <Button
              onClick={openNew}
              disabled={editing !== null}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              <Plus className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Add Event</span>
            </Button>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-5xl mx-auto px-4 mt-4">
          <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            {error}
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        {/* Edit / new form */}
        {editing && (
          <Card className="bg-gradient-to-br from-white/5 to-white/0 border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">
                  {editing === 'new' ? 'New Event' : 'Edit Event'}
                </h2>
                <Button variant="ghost" size="icon" onClick={closeForm} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="event-title" className="text-gray-400 text-xs">Title</Label>
                  <Input
                    id="event-title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="60th Anniversary Roadster Show & Swap"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="event-date" className="text-gray-400 text-xs">Date (free text)</Label>
                  <Input
                    id="event-date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="June 19-20, 2026"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="event-location" className="text-gray-400 text-xs">Location</Label>
                  <Input
                    id="event-location"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Fairplex, Pomona"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="event-order" className="text-gray-400 text-xs">Sort Order</Label>
                  <Input
                    id="event-order"
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="event-desc" className="text-gray-400 text-xs">Description</Label>
                <textarea
                  id="event-desc"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full min-h-[80px] px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  placeholder="Father's Day Weekend - The premier classic roadster event of the year"
                />
              </div>

              {/* Optional flyer PDF */}
              <div className="space-y-2">
                <Label className="text-gray-400 text-xs">Flyer PDF (optional)</Label>
                <div className="flex items-start gap-4">
                  <div className="w-32 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {form.flyer_pdf_url ? (
                      <FileText className="w-6 h-6 text-red-500" />
                    ) : (
                      <FileText className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label
                      className={`block border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                        form.pdfUploading ? 'pointer-events-none opacity-60 border-white/10' : 'border-white/15 hover:border-white/30 bg-white/[0.02]'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handlePdfChange(f);
                        }}
                        disabled={form.pdfUploading}
                      />
                      {form.pdfUploading ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                          <Loader2 className="w-4 h-4 animate-spin" /> Uploading {form.pdfPct}%
                        </div>
                      ) : (
                        <div className="text-sm text-gray-300">
                          {form.pdfFileName ? (
                            <span className="text-white">Re-upload a different PDF</span>
                          ) : (
                            <>
                              <span className="text-red-500 font-semibold">Click to choose</span> a PDF
                            </>
                          )}
                          <div className="text-xs text-gray-600 mt-1">PDF only · max 25 MB</div>
                        </div>
                      )}
                    </label>
                    {form.pdfFileName && !form.pdfUploading && (
                      <div className="text-xs text-gray-500 truncate">Current file: {form.pdfFileName}</div>
                    )}
                    {form.pdfError && (
                      <div className="text-xs text-red-500">{form.pdfError}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={closeForm} disabled={saving} className="border-white/10 text-gray-300">
                  Cancel
                </Button>
                <Button onClick={saveForm} disabled={saving} className="bg-red-600 hover:bg-red-500 text-white">
                  <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving…' : 'Save'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Event list */}
        {events.length === 0 && editing !== 'new' && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No events yet. Click "Add Event" to add one.
          </div>
        )}

        {events.map((e, i) => (
          <Card key={e.id} className="bg-gradient-to-br from-white/5 to-white/0 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveEvent(i, -1)}
                    disabled={i === 0}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveEvent(i, 1)}
                    disabled={i === events.length - 1}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-12 h-12 rounded-lg bg-red-600/10 border border-red-500/30 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-red-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[10px] tracking-widest text-gray-500 font-mono mb-0.5">
                    #{i + 1} · order {e.sort_order}
                  </div>
                  <div className="text-red-500 font-semibold text-sm">{e.date}</div>
                  <div className="text-white font-bold truncate">{e.title}</div>
                  {e.location && (
                    <div className="text-xs text-gray-400 inline-flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {e.location}
                    </div>
                  )}
                  {e.flyer_pdf_url && (
                    <a href={e.flyer_pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs text-red-500 hover:text-white inline-flex items-center gap-1 ml-2">
                      <Download className="w-3 h-3" /> Flyer PDF
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(e)}
                    disabled={editing !== null}
                    className="border-white/10 text-gray-300 hover:bg-white/5"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => del(e)}
                    disabled={saving}
                    className="text-gray-500 hover:text-red-500"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {events.length > 1 && editing === null && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={persistOrder}
              disabled={saving}
              className="border-white/10 text-gray-300 hover:bg-white/5"
            >
              <Save className="w-4 h-4 mr-2" /> Save new order
            </Button>
          </div>
        )}

        <div className="text-center text-xs text-gray-500 py-4">
          Events appear in the Calendar of Events section of the Members page, in order.
        </div>
      </main>
    </div>
  );
}
