// /admin/news-cards — edit the 14 Show News page cards.
// Each card has: title, body_text (plain, newline-separated), enabled toggle.
// Changes are saved with one bulk PUT (all cards at once).

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowUp, ArrowDown, Save, RefreshCw, Eye, EyeOff, Image as ImageIcon, FileText } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';

interface NewsCard {
  id: string;
  slug: string;
  title: string;
  body_text: string;
  flyer_url: string | null;
  image_urls: string[];
  enabled: boolean;
  sort_order: number;
  updated_at: string;
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

export function AdminNewsCards() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<NewsCard[]>([]);
  const [original, setOriginal] = useState<string>(''); // hash of original state for dirty check
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // Hash of cards to detect changes
  const currentHash = JSON.stringify(cards.map((c) => [c.slug, c.title, c.body_text, c.enabled, c.sort_order]));
  const dirty = currentHash !== original;

  useEffect(() => {
    api('/me')
      .then((r) => {
        if (!r.authenticated) navigate('/admin/login', { replace: true });
      })
      .catch(() => navigate('/admin/login', { replace: true }));
  }, [navigate]);

  useEffect(() => {
    api('/admin/news-cards')
      .then((rows: NewsCard[]) => {
        // sort by current sort_order
        const sorted = [...rows].sort((a, b) => a.sort_order - b.sort_order);
        setCards(sorted);
        setOriginal(JSON.stringify(sorted.map((c) => [c.slug, c.title, c.body_text, c.enabled, c.sort_order])));
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  function updateCard(slug: string, patch: Partial<NewsCard>) {
    setCards((cs) => cs.map((c) => (c.slug === slug ? { ...c, ...patch } : c)));
  }

  function moveCard(index: number, dir: -1 | 1) {
    setCards((cs) => {
      const next = [...cs];
      const target = index + dir;
      if (target < 0 || target >= next.length) return cs;
      [next[index], next[target]] = [next[target], next[index]];
      // re-assign sort_order based on new position
      return next.map((c, i) => ({ ...c, sort_order: (i + 1) * 10 }));
    });
  }

  async function save() {
    setSaving(true);
    setError('');
    try {
      await api('/admin/news-cards', {
        method: 'PUT',
        body: JSON.stringify({
          cards: cards.map((c) => ({
            slug: c.slug,
            title: c.title,
            body_text: c.body_text,
            enabled: c.enabled,
            sort_order: c.sort_order,
          })),
        }),
      });
      setOriginal(JSON.stringify(cards.map((c) => [c.slug, c.title, c.body_text, c.enabled, c.sort_order])));
      setSavedAt(new Date());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function reload() {
    if (dirty && !confirm('You have unsaved changes. Reload anyway?')) return;
    setLoading(true);
    const rows: NewsCard[] = await api('/admin/news-cards');
    const sorted = [...rows].sort((a, b) => a.sort_order - b.sort_order);
    setCards(sorted);
    setOriginal(JSON.stringify(sorted.map((c) => [c.slug, c.title, c.body_text, c.enabled, c.sort_order])));
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Loading news cards…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
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
              <h1 className="text-xl font-black truncate">Show News Cards</h1>
              <p className="text-xs text-gray-500">
                {cards.length} cards · {cards.filter((c) => c.enabled).length} visible
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {savedAt && !dirty && (
              <span className="text-xs text-gray-500 hidden sm:inline">Saved {savedAt.toLocaleTimeString()}</span>
            )}
            <Button
              variant="outline"
              onClick={reload}
              disabled={saving}
              className="border-white/10 text-gray-300 hover:bg-white/5"
            >
              <RefreshCw className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Reload</span>
            </Button>
            <Button
              onClick={save}
              disabled={!dirty || saving}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              <Save className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{saving ? 'Saving…' : 'Save Changes'}</span>
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
        {cards.map((card, index) => (
          <Card
            key={card.slug}
            className={`bg-gradient-to-br from-white/5 to-white/0 border-white/10 ${
              card.enabled ? '' : 'opacity-60'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1 pt-1">
                  <button
                    onClick={() => moveCard(index, -1)}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500"
                    aria-label="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveCard(index, 1)}
                    disabled={index === cards.length - 1}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500"
                    aria-label="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] tracking-widest text-gray-500 font-mono">
                      #{index + 1} · {card.slug}
                    </span>
                    {card.image_urls.length > 0 && (
                      <span className="text-[10px] text-gray-500 inline-flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> {card.image_urls.length}
                      </span>
                    )}
                    {card.flyer_url && (
                      <span className="text-[10px] text-gray-500 inline-flex items-center gap-1">
                        <FileText className="w-3 h-3" /> flyer
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg text-white">{card.title || '(untitled)'}</CardTitle>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {card.enabled ? (
                    <Eye className="w-4 h-4 text-green-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  )}
                  <Switch
                    checked={card.enabled}
                    onCheckedChange={(v) => updateCard(card.slug, { enabled: v })}
                    aria-label="Toggle card visibility"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor={`title-${card.slug}`} className="text-gray-400 text-xs">Title</Label>
                <Input
                  id={`title-${card.slug}`}
                  value={card.title}
                  onChange={(e) => updateCard(card.slug, { title: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`body-${card.slug}`} className="text-gray-400 text-xs">
                  Body Text
                  <span className="ml-2 text-gray-600">plain text · new lines = paragraph breaks</span>
                </Label>
                <Textarea
                  id={`body-${card.slug}`}
                  value={card.body_text}
                  onChange={(e) => updateCard(card.slug, { body_text: e.target.value })}
                  rows={Math.min(12, Math.max(3, card.body_text.split('\n').length + 1))}
                  className="bg-white/5 border-white/10 text-white font-sans"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="text-center text-xs text-gray-500 py-4">
          Tip: toggle off a card to hide it from the public site without deleting it.
        </div>
      </main>
    </div>
  );
}
