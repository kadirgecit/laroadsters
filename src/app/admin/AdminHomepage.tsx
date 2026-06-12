// /admin/homepage — edit the content shown on the public Home page. Backed by
// the site_settings key/value table. The public Hero, Event, and About
// components fetch /api/public/settings and use these values as overrides;
// hardcoded defaults stay in the components so the site still renders if
// the API fails or the table is empty.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Save, RefreshCw, LayoutDashboard, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { ConfirmDialogHost } from './ConfirmDialog';

interface Settings {
  [key: string]: string;
}

// Default keys + default values. These match what's hardcoded in Hero.tsx,
// Event.tsx, and About.tsx so the public site looks identical to before if
// the customer doesn't change anything.
const SECTIONS: { title: string; description: string; keys: { key: string; label: string; placeholder: string; multiline?: boolean }[] }[] = [
  {
    title: 'Hero',
    description: 'The big banner at the top of the home page.',
    keys: [
      { key: 'hero.title',         label: 'Title',        placeholder: 'Los Angeles Roadsters' },
    ],
  },
  {
    title: 'Event',
    description: 'The big date / location block below the hero.',
    keys: [
      { key: 'event.title',        label: 'Big title',         placeholder: '60th Anniversary' },
      { key: 'event.subtitle',     label: 'Subtitle',          placeholder: 'Los Angeles Roadsters Show and Swap' },
      { key: 'event.date_line',    label: 'Date line',         placeholder: "Father's Day Weekend - June 19-20, 2026" },
      { key: 'event.hours',        label: 'Hours',             placeholder: '7:00 am – 4:00 pm' },
      { key: 'event.venue_name',   label: 'Venue name',        placeholder: 'Fairplex in Pomona' },
      { key: 'event.address1',     label: 'Street address',    placeholder: '1101 W. McKinley Avenue' },
      { key: 'event.city',         label: 'City, state',       placeholder: 'Pomona, California' },
    ],
  },
  {
    title: 'About',
    description: 'The "Legendary Heritage" section near the bottom of the home page.',
    keys: [
      { key: 'about.heading1',         label: 'Heading line 1',  placeholder: 'LEGENDARY' },
      { key: 'about.heading2',         label: 'Heading line 2',  placeholder: 'HERITAGE' },
      { key: 'about.lede',             label: 'Lede paragraph',  placeholder: 'The Los Angeles Roadsters Car Club — established in 1957 and still going strong.', multiline: true },
      { key: 'about.body1',            label: 'Body paragraph 1', placeholder: "For six decades, we've hosted the world's premier classic roadster show…", multiline: true },
      { key: 'about.body2',            label: 'Body paragraph 2', placeholder: 'Only finished roadsters park in our Show area…', multiline: true },
    ],
  },
  {
    title: 'Stats',
    description: 'The four stat cards under the About section.',
    keys: [
      { key: 'about.stat_founded',         label: 'Founded year (e.g. 1957)',  placeholder: '1957' },
      { key: 'about.stat_years_strong',    label: 'Years strong (e.g. 69 Years)', placeholder: '69 Years' },
      { key: 'about.stat_anniversary',     label: 'Anniversary (e.g. 60th)',   placeholder: '60th' },
      { key: 'about.stat_years_at_venue',  label: 'Years at venue (e.g. 44th)', placeholder: '44th' },
    ],
  },
  {
    title: 'Show News',
    description: 'The header subtext and sponsors section blurb on the Show News page.',
    keys: [
      { key: 'news.header_subtext',   label: 'Header subtext',     placeholder: "60th Anniversary Roadster Show & Swap — Father's Day Weekend, June 19-20, 2026", multiline: true },
      { key: 'news.sponsors_subtext', label: 'Sponsors blurb',     placeholder: 'Supporting the 60th Anniversary Roadster Show & Swap' },
    ],
  },
];

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

export function AdminHomepage() {
  const navigate = useNavigate();
  const [values, setValues] = useState<Settings>({});
  const [loadedKeys, setLoadedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    api('/me')
      .then((r) => { if (!r.authenticated) navigate('/admin/login', { replace: true }); })
      .catch(() => navigate('/admin/login', { replace: true }));
  }, [navigate]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const rows: Settings = await api('/admin/settings');
      setValues(rows);
      setLoadedKeys(new Set(Object.keys(rows)));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function setKey(k: string, v: string) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  async function saveAll() {
    setSaving(true);
    setError('');
    try {
      // Send all keys (including the ones the customer didn't touch but
      // already have DB values). The server uses ON CONFLICT to upsert.
      const payload: Settings = {};
      for (const sec of SECTIONS) {
        for (const k of sec.keys) {
          payload[k.key] = values[k.key] ?? '';
        }
      }
      await api('/admin/settings', { method: 'PUT', body: JSON.stringify({ settings: payload }) });
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
        Loading homepage settings…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
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
              <h1 className="text-xl font-black truncate">Homepage</h1>
              <p className="text-xs text-gray-500">
                Edit the content shown on the public home page
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
              onClick={saveAll}
              disabled={saving}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              <Save className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{saving ? 'Saving…' : 'Save All'}</span>
            </Button>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-3xl mx-auto px-4 mt-4">
          <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            {error}
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {savedAt && !error && (
          <div className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
            <CheckCircle2 className="w-4 h-4" />
            Public home page updated.
          </div>
        )}

        {SECTIONS.map((sec) => (
          <Card key={sec.title} className="bg-gradient-to-br from-white/5 to-white/0 border-white/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-lg text-white">{sec.title}</CardTitle>
                  <CardDescription className="text-gray-500 text-xs">{sec.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {sec.keys.map((k) => {
                const stored = loadedKeys.has(k.key);
                return (
                  <div key={k.key} className="space-y-1">
                    <Label htmlFor={k.key} className="text-gray-400 text-xs flex items-center gap-2">
                      {k.label}
                      {!stored && (
                        <span className="text-[10px] text-gray-600 uppercase tracking-wider">default</span>
                      )}
                    </Label>
                    {k.multiline ? (
                      <textarea
                        id={k.key}
                        value={values[k.key] ?? ''}
                        onChange={(e) => setKey(k.key, e.target.value)}
                        placeholder={k.placeholder}
                        rows={3}
                        className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      />
                    ) : (
                      <Input
                        id={k.key}
                        value={values[k.key] ?? ''}
                        onChange={(e) => setKey(k.key, e.target.value)}
                        placeholder={k.placeholder}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}

        <div className="text-center text-xs text-gray-500 py-4">
          Empty fields fall back to the values hardcoded in the page components. Public site updates immediately on save.
        </div>
      </main>
      <ConfirmDialogHost />
    </div>
  );
}
