// /admin/gallery — manage photo albums and the photos inside each album.
// Two-level view:
//   - Top level: list of albums (add / edit slug+title / reorder / delete)
//   - Inside an album: photo grid with upload (client-side compress, 25MB cap
//     on input), per-photo title/caption edit, reorder, delete
//
// Photos are uploaded via the existing /api/admin/upload endpoint. Compression
// happens in the browser using browser-image-compression so we don't push huge
// originals through the Vercel function.

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowUp, ArrowDown, Save, RefreshCw, Trash2, Plus, X, Image as ImageIcon, Loader2, Edit2, Check, FolderOpen, Upload, GripVertical } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface Album {
  id: string;
  slug: string;
  title: string;
  cover_photo_id: string | null;
  sort_order: number;
  created_at: string;
}

interface Photo {
  id: string;
  album_id: string;
  blob_url: string;
  title: string | null;
  caption: string | null;
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

const MAX_INPUT_BYTES = 25 * 1024 * 1024; // 25 MB cap on input
const COMPRESS_MAX_SIZE_MB = 2;            // Re-encode to <= 2MB / 1920px
const COMPRESS_MAX_WIDTH = 1920;

// Compress a user-selected image. Returns a fresh File ready to upload.
async function compressImage(file: File, onProgress: (msg: string) => void): Promise<File> {
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error(`File is ${(file.size / 1024 / 1024).toFixed(1)} MB. Max is 25 MB.`);
  }
  onProgress('Compressing…');
  const compressed = await imageCompression(file, {
    maxSizeMB: COMPRESS_MAX_SIZE_MB,
    maxWidthOrHeight: COMPRESS_MAX_WIDTH,
    useWebWorker: true,
    initialQuality: 0.85,
  });
  // Wrap as a fresh File so the upload name + type are preserved.
  return new File([compressed], file.name, { type: compressed.type || file.type });
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'album';
}

const emptyAlbumForm = (sortOrder: number) => ({
  slug: '',
  title: '',
  sort_order: sortOrder,
});

export function AdminGallery() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // Album editor
  const [editingAlbum, setEditingAlbum] = useState<string | 'new' | null>(null);
  const [albumForm, setAlbumForm] = useState(emptyAlbumForm(10));
  const [slugTouched, setSlugTouched] = useState(false);

  // Photos for the album currently open
  const [openAlbumId, setOpenAlbumId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);

  // Photo upload queue (multiple files at once)
  const [uploads, setUploads] = useState<{ id: string; name: string; status: 'compressing' | 'uploading' | 'done' | 'error'; pct: number; err?: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Per-photo caption/title editor (in-place)
  const [photoEdit, setPhotoEdit] = useState<{ id: string; title: string; caption: string } | null>(null);

  useEffect(() => {
    api('/me')
      .then((r) => { if (!r.authenticated) navigate('/admin/login', { replace: true }); })
      .catch(() => navigate('/admin/login', { replace: true }));
  }, [navigate]);

  async function loadAlbums() {
    setLoading(true);
    setError('');
    try {
      const rows: Album[] = await api('/admin/gallery-albums');
      const sorted = [...rows].sort((a, b) => a.sort_order - b.sort_order);
      setAlbums(sorted);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadPhotos(albumId: string) {
    setPhotosLoading(true);
    try {
      // The public handler accepts ?album=UUID but no admin equivalent exists.
      // Fetch via public for now (read-only is fine for display).
      const r = await fetch(`/api/public/gallery-photos?album=${encodeURIComponent(albumId)}`);
      const rows: Photo[] = await r.json();
      const sorted = [...rows].sort((a, b) => a.sort_order - b.sort_order);
      setPhotos(sorted);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPhotosLoading(false);
    }
  }

  useEffect(() => { loadAlbums(); }, []);

  useEffect(() => {
    if (openAlbumId) loadPhotos(openAlbumId);
    else setPhotos([]);
  }, [openAlbumId]);

  function moveAlbum(index: number, dir: -1 | 1) {
    setAlbums((arr) => {
      const next = [...arr];
      const target = index + dir;
      if (target < 0 || target >= next.length) return arr;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((a, i) => ({ ...a, sort_order: (i + 1) * 10 }));
    });
  }

  function movePhoto(index: number, dir: -1 | 1) {
    setPhotos((arr) => {
      const next = [...arr];
      const target = index + dir;
      if (target < 0 || target >= next.length) return arr;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((p, i) => ({ ...p, sort_order: (i + 1) * 10 }));
    });
  }

  function openNewAlbum() {
    const nextOrder = albums.length ? Math.max(...albums.map((a) => a.sort_order)) + 10 : 10;
    setAlbumForm(emptyAlbumForm(nextOrder));
    setSlugTouched(false);
    setEditingAlbum('new');
  }

  function openEditAlbum(a: Album) {
    setAlbumForm({ slug: a.slug, title: a.title, sort_order: a.sort_order });
    setSlugTouched(true);
    setEditingAlbum(a.id);
  }

  function closeAlbumForm() {
    setEditingAlbum(null);
    setAlbumForm(emptyAlbumForm(10));
  }

  async function saveAlbumForm() {
    if (!albumForm.title.trim()) { setError('Title is required.'); return; }
    const slug = albumForm.slug.trim() || slugify(albumForm.title);
    setSaving(true);
    setError('');
    try {
      const payload = { slug, title: albumForm.title.trim(), sort_order: albumForm.sort_order };
      if (editingAlbum === 'new') {
        await api('/admin/gallery-albums', { method: 'POST', body: JSON.stringify(payload) });
      } else if (editingAlbum) {
        await api(`/admin/gallery-albums/${editingAlbum}`, { method: 'PUT', body: JSON.stringify({ title: payload.title, sort_order: payload.sort_order }) });
      }
      closeAlbumForm();
      setSavedAt(new Date());
      await loadAlbums();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function persistAlbumOrder() {
    setSaving(true);
    setError('');
    try {
      for (const a of albums) {
        await api(`/admin/gallery-albums/${a.id}`, { method: 'PUT', body: JSON.stringify({ sort_order: a.sort_order }) });
      }
      setSavedAt(new Date());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteAlbum(a: Album) {
    if (!confirm(`Delete album "${a.title}" and all ${photos.length} photo(s) in it? Files in Vercel Blob are also removed.`)) return;
    setSaving(true);
    setError('');
    try {
      await api(`/admin/gallery-albums/${a.id}`, { method: 'DELETE' });
      if (openAlbumId === a.id) setOpenAlbumId(null);
      setSavedAt(new Date());
      await loadAlbums();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function persistPhotoOrder() {
    if (!openAlbumId) return;
    setSaving(true);
    setError('');
    try {
      for (const p of photos) {
        await api(`/admin/gallery-photos/${p.id}`, { method: 'PUT', body: JSON.stringify({ sort_order: p.sort_order }) });
      }
      setSavedAt(new Date());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function deletePhoto(p: Photo) {
    if (!confirm('Delete this photo? File is also removed from Vercel Blob.')) return;
    setSaving(true);
    setError('');
    try {
      await api(`/admin/gallery-photos/${p.id}`, { method: 'DELETE' });
      setSavedAt(new Date());
      await loadPhotos(openAlbumId!);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function startPhotoEdit(p: Photo) {
    setPhotoEdit({ id: p.id, title: p.title || '', caption: p.caption || '' });
  }

  async function savePhotoEdit() {
    if (!photoEdit) return;
    setSaving(true);
    setError('');
    try {
      await api(`/admin/gallery-photos/${photoEdit.id}`, {
        method: 'PUT',
        body: JSON.stringify({ title: photoEdit.title || null, caption: photoEdit.caption || null }),
      });
      setPhotoEdit(null);
      setSavedAt(new Date());
      await loadPhotos(openAlbumId!);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  // Multi-file photo upload with compress.
  async function handleFiles(files: FileList) {
    if (!openAlbumId) return;
    const list = Array.from(files);
    const initial = list.map((f) => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: f.name, status: 'compressing' as const, pct: 0 }));
    setUploads((u) => [...u, ...initial]);

    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      const u = initial[i];
      try {
        const compressed = await compressImage(f, () => {});
        setUploads((arr) => arr.map((x) => (x.id === u.id ? { ...x, status: 'uploading', pct: 0 } : x)));
        const url = await uploadFile(compressed, (p) =>
          setUploads((arr) => arr.map((x) => (x.id === u.id ? { ...x, pct: p } : x))),
        );
        await api('/admin/gallery-photos', {
          method: 'POST',
          body: JSON.stringify({ album_id: openAlbumId, blob_url: url, title: f.name.replace(/\.[^.]+$/, '') }),
        });
        setUploads((arr) => arr.map((x) => (x.id === u.id ? { ...x, status: 'done', pct: 100 } : x)));
      } catch (e: any) {
        setUploads((arr) => arr.map((x) => (x.id === u.id ? { ...x, status: 'error', err: e.message } : x)));
      }
    }
    await loadPhotos(openAlbumId);
    // Clear completed uploads after a moment
    setTimeout(() => setUploads((arr) => arr.filter((x) => x.status !== 'done')), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Loading gallery…
      </div>
    );
  }

  const currentAlbum = albums.find((a) => a.id === openAlbumId) || null;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => (openAlbumId ? setOpenAlbumId(null) : navigate('/admin'))}
              className="text-gray-400 hover:text-white hover:bg-white/5"
              aria-label={openAlbumId ? 'Back to albums' : 'Back to dashboard'}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl font-black truncate">
                {openAlbumId ? currentAlbum?.title || 'Album' : 'Gallery'}
              </h1>
              <p className="text-xs text-gray-500">
                {openAlbumId
                  ? `${photos.length} photo${photos.length === 1 ? '' : 's'}`
                  : `${albums.length} album${albums.length === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {savedAt && (
              <span className="text-xs text-gray-500 hidden sm:inline">Saved {savedAt.toLocaleTimeString()}</span>
            )}
            <Button
              variant="outline"
              onClick={() => (openAlbumId ? loadPhotos(openAlbumId) : loadAlbums())}
              disabled={saving}
              className="border-white/10 text-gray-300 hover:bg-white/5"
            >
              <RefreshCw className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Reload</span>
            </Button>
            {!openAlbumId && (
              <Button
                onClick={openNewAlbum}
                disabled={editingAlbum !== null}
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                <Plus className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Add Album</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            {error}
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        {!openAlbumId ? (
          <>
            {/* Album editor */}
            {editingAlbum && (
              <Card className="bg-gradient-to-br from-white/5 to-white/0 border-white/10">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">
                      {editingAlbum === 'new' ? 'New Album' : 'Edit Album'}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={closeAlbumForm} className="text-gray-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="album-title" className="text-gray-400 text-xs">Title</Label>
                      <Input
                        id="album-title"
                        value={albumForm.title}
                        onChange={(e) => {
                          const t = e.target.value;
                          setAlbumForm((f) => ({
                            ...f,
                            title: t,
                            // Auto-fill slug only if user hasn't manually edited it.
                            slug: slugTouched ? f.slug : slugify(t),
                          }));
                        }}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Club Runs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="album-slug" className="text-gray-400 text-xs">Slug (URL-safe)</Label>
                      <Input
                        id="album-slug"
                        value={albumForm.slug}
                        onChange={(e) => { setSlugTouched(true); setAlbumForm((f) => ({ ...f, slug: e.target.value })); }}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="club-runs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="album-order" className="text-gray-400 text-xs">Sort Order</Label>
                      <Input
                        id="album-order"
                        type="number"
                        value={albumForm.sort_order}
                        onChange={(e) => setAlbumForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={closeAlbumForm} disabled={saving} className="border-white/10 text-gray-300">
                      Cancel
                    </Button>
                    <Button onClick={saveAlbumForm} disabled={saving} className="bg-red-600 hover:bg-red-500 text-white">
                      <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving…' : 'Save'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {albums.length === 0 && editingAlbum !== 'new' && (
              <div className="text-center py-12 text-gray-500 text-sm">
                No albums yet. Click "Add Album" to create one.
              </div>
            )}

            {albums.map((a, i) => (
              <Card key={a.id} className="bg-gradient-to-br from-white/5 to-white/0 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => moveAlbum(i, -1)}
                        disabled={i === 0}
                        className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
                        aria-label="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveAlbum(i, 1)}
                        disabled={i === albums.length - 1}
                        className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
                        aria-label="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="w-12 h-12 rounded-lg bg-red-600/10 border border-red-500/30 flex items-center justify-center shrink-0">
                      <FolderOpen className="w-5 h-5 text-red-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] tracking-widest text-gray-500 font-mono mb-0.5">
                        #{i + 1} · order {a.sort_order} · slug: {a.slug}
                      </div>
                      <div className="text-white font-bold truncate">{a.title}</div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => setOpenAlbumId(a.id)}
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
                      >
                        Open
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditAlbum(a)}
                        disabled={editingAlbum !== null}
                        className="border-white/10 text-gray-300 hover:bg-white/5"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteAlbum(a)}
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

            {albums.length > 1 && editingAlbum === null && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={persistAlbumOrder}
                  disabled={saving}
                  className="border-white/10 text-gray-300 hover:bg-white/5"
                >
                  <Save className="w-4 h-4 mr-2" /> Save new album order
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Upload zone */}
            <Card className="bg-gradient-to-br from-white/5 to-white/0 border-white/10">
              <CardContent className="p-6">
                <label
                  className="block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer border-white/15 hover:border-white/30 bg-white/[0.02] transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFiles(e.target.files);
                        e.target.value = '';
                      }
                    }}
                  />
                  <Upload className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                  <div className="text-gray-300">
                    <span className="text-red-500 font-semibold">Click to choose</span> photos
                    <div className="text-xs text-gray-600 mt-1">Multiple allowed · max 25 MB each · auto-compressed in your browser</div>
                  </div>
                </label>

                {uploads.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploads.map((u) => (
                      <div key={u.id} className="flex items-center gap-3 text-sm">
                        {u.status === 'compressing' && <Loader2 className="w-4 h-4 animate-spin text-red-500" />}
                        {u.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin text-red-500" />}
                        {u.status === 'done' && <Check className="w-4 h-4 text-green-500" />}
                        {u.status === 'error' && <X className="w-4 h-4 text-red-500" />}
                        <span className="truncate flex-1">{u.name}</span>
                        <span className="text-xs text-gray-500 shrink-0">
                          {u.status === 'compressing' && 'compressing…'}
                          {u.status === 'uploading' && `${u.pct}%`}
                          {u.status === 'done' && 'done'}
                          {u.status === 'error' && (u.err || 'error')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {photosLoading ? (
              <div className="text-center py-12 text-gray-500 text-sm">Loading photos…</div>
            ) : photos.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                No photos yet. Use the upload zone above.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {photos.map((p, i) => (
                  <Card key={p.id} className="bg-gradient-to-br from-white/5 to-white/0 border-white/10 overflow-hidden">
                    <div className="relative aspect-square">
                      <img src={p.blob_url} alt={p.title || p.caption || ''} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 flex flex-col gap-0.5">
                        <button
                          onClick={() => movePhoto(i, -1)}
                          disabled={i === 0}
                          className="w-6 h-6 rounded bg-black/60 hover:bg-black/80 text-white flex items-center justify-center disabled:opacity-30"
                          aria-label="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => movePhoto(i, 1)}
                          disabled={i === photos.length - 1}
                          className="w-6 h-6 rounded bg-black/60 hover:bg-black/80 text-white flex items-center justify-center disabled:opacity-30"
                          aria-label="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="absolute top-1 right-1 flex gap-1">
                        <button
                          onClick={() => startPhotoEdit(p)}
                          className="w-6 h-6 rounded bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
                          aria-label="Edit"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deletePhoto(p)}
                          disabled={saving}
                          className="w-6 h-6 rounded bg-black/60 hover:bg-red-600 text-white flex items-center justify-center"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    {photoEdit?.id === p.id ? (
                      <div className="p-2 space-y-1.5">
                        <Input
                          value={photoEdit.title}
                          onChange={(e) => setPhotoEdit({ ...photoEdit, title: e.target.value })}
                          placeholder="Title"
                          className="h-7 text-xs bg-white/5 border-white/10 text-white"
                        />
                        <Input
                          value={photoEdit.caption}
                          onChange={(e) => setPhotoEdit({ ...photoEdit, caption: e.target.value })}
                          placeholder="Caption"
                          className="h-7 text-xs bg-white/5 border-white/10 text-white"
                        />
                        <div className="flex gap-1">
                          <Button size="sm" onClick={savePhotoEdit} disabled={saving} className="flex-1 h-7 text-xs bg-red-600 hover:bg-red-500">
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setPhotoEdit(null)} className="h-7 text-xs border-white/10 text-gray-300">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 text-xs">
                        {p.title && <div className="text-white font-semibold truncate">{p.title}</div>}
                        {p.caption && <div className="text-gray-500 truncate">{p.caption}</div>}
                        {!p.title && !p.caption && <div className="text-gray-600 italic">No title or caption</div>}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {photos.length > 1 && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={persistPhotoOrder}
                  disabled={saving}
                  className="border-white/10 text-gray-300 hover:bg-white/5"
                >
                  <Save className="w-4 h-4 mr-2" /> Save new photo order
                </Button>
              </div>
            )}
          </>
        )}

        <div className="text-center text-xs text-gray-500 py-4">
          {openAlbumId
            ? 'Photos are compressed in your browser before upload. Saves Vercel bandwidth and storage costs.'
            : 'Albums appear on the public Photo Gallery page in order.'}
        </div>
      </main>
    </div>
  );
}
