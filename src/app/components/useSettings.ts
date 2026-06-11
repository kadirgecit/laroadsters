// Shared hook for reading /api/public/settings with sane defaults. Used by
// Hero, Event, and About on the public Home page so the customer can edit
// their text via /admin/homepage without the components having to know
// about the DB.
//
// Each call site uses a `get(key, defaultValue)` helper:
//   const { get } = useSettings();
//   const title = get('hero.title', 'Los Angeles Roadsters');
//
// If the API is unreachable or the key isn't in the DB, the default is
// returned silently — the site never breaks because of a settings fetch.

import { useEffect, useState } from 'react';

const cache: { value: Record<string, string> | null; ts: number } = { value: null, ts: 0 };
const CACHE_TTL_MS = 30_000; // 30s — short enough that admin edits show up quickly

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>(cache.value || {});

  useEffect(() => {
    if (cache.value && Date.now() - cache.ts < CACHE_TTL_MS) {
      setSettings(cache.value);
      return;
    }
    let cancelled = false;
    fetch('/api/public/settings')
      .then((r) => r.json())
      .then((rows) => {
        if (cancelled) return;
        const map: Record<string, string> = {};
        if (rows && typeof rows === 'object') {
          for (const [k, v] of Object.entries(rows)) map[k] = String(v);
        }
        cache.value = map;
        cache.ts = Date.now();
        setSettings(map);
      })
      .catch(() => { /* keep default empty settings on failure */ });
    return () => { cancelled = true; };
  }, []);

  return {
    settings,
    get(key: string, defaultValue: string): string {
      const v = settings[key];
      // Use the DB value only if it's a non-empty string. Empty values fall
      // back to the default so the customer can clear a field and not break
      // the page.
      return v != null && v !== '' ? v : defaultValue;
    },
  };
}
