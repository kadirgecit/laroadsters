// /admin/documents — manage the club documents (bylaws, roster, forms).
// Each document has: display name, file (PDF etc.), optional size label,
// optional category, sort order. File upload uses the same /api/admin/upload
// endpoint as the flyer and sponsors.

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowUp, ArrowDown, Save, RefreshCw, Trash2, Plus, X, FileText, Loader2, Download, Copy, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { uploadFile } from './upload';
import { confirmDialog, ConfirmDialogHost } from './ConfirmDialog';

interface Doc {
  id: string;
  name: string;
  file_url: string;
  size_label: string | null;
  category: string | null;
  sort_order: number;
  show_in_club: boolean;
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

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB for a document

const CATEGORIES = [
  { value: '',         label: '— None —' },
  { value: 'bylaws',   label: 'Bylaws' },
  { value: 'form',     label: 'Form' },
  { value: 'flyer',    label: 'Flyer' },
  { value: 'roster',   label: 'Roster' },
  { value: 'other',    label: 'Other' },
];

const emptyForm = (sortOrder: number) => ({
  name: '',
  file_url: '',
  size_label: 'PDF',
  category: '',
  sort_order: sortOrder,
  show_in_club: true,
  fileUploading: false,
  filePct: 0,
  fileError: '',
  fileName: '',
});

export function AdminDocuments() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState(emptyForm(10));
  const [copiedId, setCopiedId] = useState<string | null>(null);
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
      const rows: Doc[] = await api('/admin/documents');
      // Server already orders by category, sort_order. Keep the order.
      setDocs(rows);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function moveDoc(index: number, dir: -1 | 1) {
    setDocs((arr) => {
      const next = [...arr];
      const target = index + dir;
      if (target < 0 || target >= next.length) return arr;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((d, i) => ({ ...d, sort_order: (i + 1) * 10 }));
    });
  }

  function openNew() {
    const nextOrder = docs.length ? Math.max(...docs.map((d) => d.sort_order)) + 10 : 10;
    setForm(emptyForm(nextOrder));
    setEditing('new');
  }

  function openEdit(d: Doc) {
    setForm({
      name: d.name,
      file_url: d.file_url,
      size_label: d.size_label || 'PDF',
      category: d.category || '',
      sort_order: d.sort_order,
      show_in_club: d.show_in_club,
      fileUploading: false,
      filePct: 0,
      fileError: '',
      fileName: '',
    });
    setEditing(d.id);
  }

  function closeForm() {
    setEditing(null);
    setForm(emptyForm(10));
  }

  async function handleFileChange(file: File) {
    if (file.size > MAX_BYTES) {
      setForm((f) => ({ ...f, fileError: `File is ${(file.size / 1024 / 1024).toFixed(1)} MB. Max is 25 MB.` }));
      return;
    }
    setForm((f) => ({ ...f, fileUploading: true, filePct: 0, fileError: '', fileName: file.name }));
    try {
      const url = await uploadFile(file, (p) => setForm((f) => ({ ...f, filePct: p })));
      // Auto-fill size label from extension if user hasn't customized it.
      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      setForm((f) => ({
        ...f,
        file_url: url,
        fileUploading: false,
        filePct: 0,
        size_label: f.size_label && f.size_label !== 'PDF' ? f.size_label : ext,
        // Auto-fill name from filename (strip extension) if empty.
        name: f.name.trim() || file.name.replace(/\.[^.]+$/, ''),
      }));
    } catch (e: any) {
      setForm((f) => ({ ...f, fileUploading: false, filePct: 0, fileError: e.message || 'Upload failed' }));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function saveForm() {
    if (!form.name.trim()) { setError('Name is required.'); return; }
    if (!form.file_url) { setError('File is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name.trim(),
        file_url: form.file_url,
        size_label: form.size_label.trim() || null,
        category: form.category || null,
        sort_order: form.sort_order,
        show_in_club: form.show_in_club,
      };
      if (editing === 'new') {
        await api('/admin/documents', { method: 'POST', body: JSON.stringify(payload) });
      } else if (editing) {
        await api(`/admin/documents/${editing}`, { method: 'PUT', body: JSON.stringify(payload) });
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
      for (const d of docs) {
        await api(`/admin/documents/${d.id}`, {
          method: 'PUT',
          body: JSON.stringify({ sort_order: d.sort_order }),
        });
      }
      setSavedAt(new Date());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function copyLink(d: Doc) {
    if (!d.file_url) return;
    try {
      await navigator.clipboard.writeText(d.file_url);
      setCopiedId(d.id);
      setTimeout(() => setCopiedId((cur) => (cur === d.id ? null : cur)), 1800);
    } catch {
      // Fallback for older browsers: select-and-prompt.
      window.prompt('Copy this link:', d.file_url);
    }
  }

  async function del(d: Doc) {
    const ok = await confirmDialog({
      title: 'Delete document?',
      message: `Remove "${d.name}" from the Members page.`,
      details: 'The file will be permanently deleted from Vercel Blob storage. This cannot be undone.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    setSaving(true);
    setError('');
    try {
      await api(`/admin/documents/${d.id}`, { method: 'DELETE' });
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
        Loading documents…
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
              <h1 className="text-xl font-black truncate">Club Documents</h1>
              <p className="text-xs text-gray-500">
                {(() => {
                  const visible = docs.filter((d) => d.show_in_club).length;
                  return docs.length === 0
                    ? 'No documents yet'
                    : `${visible} of ${docs.length} shown on the Members page`;
                })()}
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
              <Plus className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Add Document</span>
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
                  {editing === 'new' ? 'New Document' : 'Edit Document'}
                </h2>
                <Button variant="ghost" size="icon" onClick={closeForm} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="doc-name" className="text-gray-400 text-xs">Display Name</Label>
                  <Input
                    id="doc-name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Club Bylaws"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="doc-category" className="text-gray-400 text-xs">Category</Label>
                  <select
                    id="doc-category"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value} className="bg-gray-900">{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="doc-size" className="text-gray-400 text-xs">Type Label (e.g. PDF, DOCX)</Label>
                  <Input
                    id="doc-size"
                    value={form.size_label}
                    onChange={(e) => setForm((f) => ({ ...f, size_label: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="PDF"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="doc-order" className="text-gray-400 text-xs">Sort Order</Label>
                  <Input
                    id="doc-order"
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              {/* Visibility toggle: show on the public Club Documents list? */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-white/[0.03] border border-white/10">
                <div>
                  <Label htmlFor="doc-show" className="text-white text-sm font-semibold">
                    Show on Members page
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    When on, this document appears in the public Club Documents list. When off, the file is still
                    uploaded and the link still works — you can paste it into news cards or anywhere else.
                  </p>
                </div>
                <Switch
                  id="doc-show"
                  checked={form.show_in_club}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, show_in_club: v }))}
                />
              </div>

              {/* File uploader */}
              <div className="space-y-2">
                <Label className="text-gray-400 text-xs">File</Label>
                <div className="flex items-start gap-4">
                  <div className="w-32 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {form.file_url ? (
                      <FileText className="w-6 h-6 text-red-500" />
                    ) : (
                      <FileText className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label
                      className={`block border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                        form.fileUploading ? 'pointer-events-none opacity-60 border-white/10' : 'border-white/15 hover:border-white/30 bg-white/[0.02]'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileChange(f);
                        }}
                        disabled={form.fileUploading}
                      />
                      {form.fileUploading ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                          <Loader2 className="w-4 h-4 animate-spin" /> Uploading {form.filePct}%
                        </div>
                      ) : (
                        <div className="text-sm text-gray-300">
                          {form.fileName ? (
                            <span className="text-white">Re-upload a different file</span>
                          ) : (
                            <>
                              <span className="text-red-500 font-semibold">Click to choose</span> a file
                            </>
                          )}
                          <div className="text-xs text-gray-600 mt-1">Any file type · max 25 MB</div>
                        </div>
                      )}
                    </label>
                    {form.fileName && !form.fileUploading && (
                      <div className="text-xs text-gray-500 truncate">Current file: {form.fileName}</div>
                    )}
                    {form.fileError && (
                      <div className="text-xs text-red-500">{form.fileError}</div>
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

        {/* Document list */}
        {docs.length === 0 && editing !== 'new' && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No documents yet. Click "Add Document" to upload one.
          </div>
        )}

        {docs.map((d, i) => (
          <Card key={d.id} className="bg-gradient-to-br from-white/5 to-white/0 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveDoc(i, -1)}
                    disabled={i === 0}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDoc(i, 1)}
                    disabled={i === docs.length - 1}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-12 h-12 rounded-lg bg-red-600/10 border border-red-500/30 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-[10px] tracking-widest text-gray-500 font-mono">
                      #{i + 1} · order {d.sort_order}{d.category ? ` · ${d.category}` : ''}
                    </div>
                    {!d.show_in_club && (
                      <span className="text-[10px] tracking-widest text-yellow-500 font-mono uppercase border border-yellow-500/30 rounded px-1.5 py-0.5">
                        Hidden from Members
                      </span>
                    )}
                  </div>
                  <div className="text-white font-semibold truncate">{d.name}</div>
                  {d.file_url && (
                    <div className="flex items-center gap-3 mt-0.5">
                      <a
                        href={d.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-red-500 hover:text-white inline-flex items-center gap-1 truncate"
                      >
                        <Download className="w-3 h-3" /> Open file
                      </a>
                      <button
                        onClick={() => copyLink(d)}
                        className="text-xs text-gray-500 hover:text-white inline-flex items-center gap-1 shrink-0"
                        title="Copy direct download link to clipboard"
                      >
                        {copiedId === d.id ? (
                          <>
                            <Check className="w-3 h-3 text-green-500" />
                            <span className="text-green-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy link
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {d.size_label && (
                    <span className="text-xs text-gray-500 mr-2 hidden sm:inline">{d.size_label}</span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(d)}
                    disabled={editing !== null}
                    className="border-white/10 text-gray-300 hover:bg-white/5"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => del(d)}
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

        {docs.length > 1 && editing === null && (
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
          Documents appear in the Club Documents section of the Members page, in order.
        </div>
      </main>
      <ConfirmDialogHost />
    </div>
  );
}
