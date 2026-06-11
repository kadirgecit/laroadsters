// /admin/sponsors — manage the sponsor logos shown on the public News page.
// Each sponsor has: name, logo (image), website URL, sort order.
// Logo upload uses the same /api/admin/upload endpoint as the flyer.

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowUp, ArrowDown, Save, RefreshCw, Trash2, Plus, X, ExternalLink, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { uploadFile } from './upload';
import { confirmDialog, ConfirmDialogHost } from './ConfirmDialog';

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  url: string | null;
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

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB for a logo

const emptyForm = (sortOrder: number) => ({
  name: '',
  logo_url: '',
  url: '',
  sort_order: sortOrder,
  logoFile: null as File | null,
  logoUploading: false,
  logoPct: 0,
  logoError: '',
});

export function AdminSponsors() {
  const navigate = useNavigate();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
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
      const rows: Sponsor[] = await api('/admin/sponsors');
      const sorted = [...rows].sort((a, b) => a.sort_order - b.sort_order);
      setSponsors(sorted);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function moveSponsor(index: number, dir: -1 | 1) {
    setSponsors((arr) => {
      const next = [...arr];
      const target = index + dir;
      if (target < 0 || target >= next.length) return arr;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((s, i) => ({ ...s, sort_order: (i + 1) * 10 }));
    });
  }

  function openNew() {
    const nextOrder = sponsors.length ? Math.max(...sponsors.map((s) => s.sort_order)) + 10 : 10;
    setForm(emptyForm(nextOrder));
    setEditing('new');
  }

  function openEdit(s: Sponsor) {
    setForm({
      name: s.name,
      logo_url: s.logo_url,
      url: s.url || '',
      sort_order: s.sort_order,
      logoFile: null,
      logoUploading: false,
      logoPct: 0,
      logoError: '',
    });
    setEditing(s.id);
  }

  function closeForm() {
    setEditing(null);
    setForm(emptyForm(10));
  }

  async function handleLogoChange(file: File) {
    if (!file.type.startsWith('image/')) {
      setForm((f) => ({ ...f, logoError: 'Only image files are accepted.' }));
      return;
    }
    if (file.size > MAX_BYTES) {
      setForm((f) => ({ ...f, logoError: `File is ${(file.size / 1024 / 1024).toFixed(1)} MB. Max is 5 MB.` }));
      return;
    }
    setForm((f) => ({ ...f, logoUploading: true, logoPct: 0, logoError: '' }));
    try {
      const url = await uploadFile(file, (p) => setForm((f) => ({ ...f, logoPct: p })));
      setForm((f) => ({ ...f, logo_url: url, logoUploading: false, logoPct: 0 }));
    } catch (e: any) {
      setForm((f) => ({ ...f, logoUploading: false, logoPct: 0, logoError: e.message || 'Upload failed' }));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function saveForm() {
    if (!form.name.trim()) { setError('Name is required.'); return; }
    if (!form.logo_url) { setError('Logo is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name.trim(),
        url: form.url.trim() || null,
        sort_order: form.sort_order,
        logo_url: form.logo_url,
      };
      if (editing === 'new') {
        await api('/admin/sponsors', { method: 'POST', body: JSON.stringify(payload) });
      } else if (editing) {
        await api(`/admin/sponsors/${editing}`, { method: 'PUT', body: JSON.stringify(payload) });
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
      for (const s of sponsors) {
        await api(`/admin/sponsors/${s.id}`, {
          method: 'PUT',
          body: JSON.stringify({ sort_order: s.sort_order }),
        });
      }
      setSavedAt(new Date());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function del(s: Sponsor) {
    const ok = await confirmDialog({
      title: 'Delete sponsor?',
      message: `Remove "${s.name}" from the News page.`,
      details: 'The logo file will be permanently deleted from Vercel Blob storage. This cannot be undone.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    setSaving(true);
    setError('');
    try {
      await api(`/admin/sponsors/${s.id}`, { method: 'DELETE' });
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
        Loading sponsors…
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
              <h1 className="text-xl font-black truncate">Sponsors</h1>
              <p className="text-xs text-gray-500">
                {sponsors.length} sponsor{sponsors.length === 1 ? '' : 's'} shown on the News page
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
              <Plus className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Add Sponsor</span>
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
                  {editing === 'new' ? 'New Sponsor' : 'Edit Sponsor'}
                </h2>
                <Button variant="ghost" size="icon" onClick={closeForm} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="sponsor-name" className="text-gray-400 text-xs">Name</Label>
                  <Input
                    id="sponsor-name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Bob Drake"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="sponsor-url" className="text-gray-400 text-xs">Website URL (optional)</Label>
                  <Input
                    id="sponsor-url"
                    value={form.url}
                    onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="https://bobdrake.com"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="sponsor-order" className="text-gray-400 text-xs">Sort Order</Label>
                  <Input
                    id="sponsor-order"
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              {/* Logo uploader */}
              <div className="space-y-2">
                <Label className="text-gray-400 text-xs">Logo Image</Label>
                <div className="flex items-start gap-4">
                  <div className="w-32 h-20 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {form.logo_url ? (
                      <img src={form.logo_url} alt="" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label
                      className={`block border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                        form.logoUploading ? 'pointer-events-none opacity-60 border-white/10' : 'border-white/15 hover:border-white/30 bg-white/[0.02]'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleLogoChange(f);
                        }}
                        disabled={form.logoUploading}
                      />
                      {form.logoUploading ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                          <Loader2 className="w-4 h-4 animate-spin" /> Uploading {form.logoPct}%
                        </div>
                      ) : (
                        <div className="text-sm text-gray-300">
                          <span className="text-red-500 font-semibold">Click to choose</span> an image
                          <div className="text-xs text-gray-600 mt-1">PNG, JPG, WebP, SVG · max 5 MB</div>
                        </div>
                      )}
                    </label>
                    {form.logoError && (
                      <div className="text-xs text-red-500">{form.logoError}</div>
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

        {/* Sponsor list */}
        {sponsors.length === 0 && editing !== 'new' && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No sponsors yet. Click "Add Sponsor" to add one.
          </div>
        )}

        {sponsors.map((s, i) => (
          <Card key={s.id} className="bg-gradient-to-br from-white/5 to-white/0 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveSponsor(i, -1)}
                    disabled={i === 0}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveSponsor(i, 1)}
                    disabled={i === sponsors.length - 1}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-24 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={s.logo_url} alt={s.name} className="max-w-full max-h-full object-contain" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[10px] tracking-widest text-gray-500 font-mono mb-0.5">#{i + 1} · order {s.sort_order}</div>
                  <div className="text-white font-semibold truncate">{s.name}</div>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-red-500 hover:text-white inline-flex items-center gap-1 truncate">
                      <ExternalLink className="w-3 h-3" /> {s.url}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(s)}
                    disabled={editing !== null}
                    className="border-white/10 text-gray-300 hover:bg-white/5"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => del(s)}
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

        {sponsors.length > 1 && editing === null && (
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
          Sponsors appear in the "Thank You" section of the public News page, in order.
        </div>
      </main>
      <ConfirmDialogHost />
    </div>
  );
}
