// /admin/member-news — manage news posts shown on the public site (plain text,
// no rich text per locked customer decision). Each post has: title, body
// (plain text, newline-separated paragraphs), published_at date.
//
// Note: the public site doesn't currently render news_posts anywhere — the
// page h1 "MEMBER NEWS" is just a page title. The admin is built so the
// data is ready when the customer wants a feed. A public section can be
// added to the Members page in a follow-up.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Save, RefreshCw, Trash2, Plus, X, Newspaper, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { confirmDialog, ConfirmDialogHost } from './ConfirmDialog';

interface Post {
  id: string;
  title: string;
  body_text: string;
  published_at: string;
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

const emptyForm = () => ({
  title: '',
  body_text: '',
  published_at: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
});

export function AdminMemberNews() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    api('/me')
      .then((r) => { if (!r.authenticated) navigate('/admin/login', { replace: true }); })
      .catch(() => navigate('/admin/login', { replace: true }));
  }, [navigate]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const rows: Post[] = await api('/admin/news-posts');
      setPosts(rows);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setForm(emptyForm());
    setEditing('new');
  }

  function openEdit(p: Post) {
    setForm({
      title: p.title,
      body_text: p.body_text,
      // Convert ISO timestamp to YYYY-MM-DD for the date input.
      published_at: p.published_at ? p.published_at.slice(0, 10) : '',
    });
    setEditing(p.id);
  }

  function closeForm() {
    setEditing(null);
    setForm(emptyForm());
  }

  async function saveForm() {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.body_text.trim()) { setError('Body is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: form.title.trim(),
        body_text: form.body_text,
        published_at: form.published_at
          ? new Date(form.published_at).toISOString()
          : new Date().toISOString(),
      };
      if (editing === 'new') {
        await api('/admin/news-posts', { method: 'POST', body: JSON.stringify(payload) });
      } else if (editing) {
        await api(`/admin/news-posts/${editing}`, { method: 'PUT', body: JSON.stringify(payload) });
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

  async function del(p: Post) {
    const ok = await confirmDialog({
      title: 'Delete news post?',
      message: `Remove "${p.title}".`,
      details: 'The post is permanently removed from the database. This cannot be undone.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    setSaving(true);
    setError('');
    try {
      await api(`/admin/news-posts/${p.id}`, { method: 'DELETE' });
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
        Loading news posts…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
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
              <h1 className="text-xl font-black truncate">Member News</h1>
              <p className="text-xs text-gray-500">
                {posts.length} post{posts.length === 1 ? '' : 's'}
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
              <Plus className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Add Post</span>
            </Button>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            {error}
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {editing && (
          <Card className="bg-gradient-to-br from-white/5 to-white/0 border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">
                  {editing === 'new' ? 'New Post' : 'Edit Post'}
                </h2>
                <Button variant="ghost" size="icon" onClick={closeForm} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="post-title" className="text-gray-400 text-xs">Title</Label>
                  <Input
                    id="post-title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Club BBQ — Saturday July 12"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="post-date" className="text-gray-400 text-xs">Publish Date</Label>
                  <Input
                    id="post-date"
                    type="date"
                    value={form.published_at}
                    onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="post-body" className="text-gray-400 text-xs">
                  Body
                  <span className="ml-2 text-gray-600">plain text — use blank lines to separate paragraphs</span>
                </Label>
                <textarea
                  id="post-body"
                  value={form.body_text}
                  onChange={(e) => setForm((f) => ({ ...f, body_text: e.target.value }))}
                  className="w-full min-h-[200px] px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  placeholder="Join us for the annual club BBQ at the Fairplex..."
                />
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

        {posts.length === 0 && editing !== 'new' && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No news posts yet. Click "Add Post" to create one.
          </div>
        )}

        {posts.map((p) => (
          <Card key={p.id} className="bg-gradient-to-br from-white/5 to-white/0 border-white/10">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-500/30 flex items-center justify-center shrink-0">
                  <Newspaper className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] tracking-widest text-gray-500 font-mono mb-1">
                    {new Date(p.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-400 whitespace-pre-wrap line-clamp-4">{p.body_text}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(p)}
                    disabled={editing !== null}
                    className="border-white/10 text-gray-300 hover:bg-white/5"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => del(p)}
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

        <div className="text-center text-xs text-gray-500 py-4">
          Posts are sorted by publish date, newest first. Plain text only — no rich text per locked customer decision.
        </div>
      </main>
      <ConfirmDialogHost />
    </div>
  );
}
