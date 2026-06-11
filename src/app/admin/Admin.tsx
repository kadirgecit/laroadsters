import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Lock, Mail, Eye, EyeOff, LogOut, LayoutDashboard, FileText, Image, Users, Newspaper, Calendar, FolderArchive } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { ConfirmDialogHost } from './ConfirmDialog';

// ---------- tiny API client ----------
async function api(path: string, opts: RequestInit = {}) {
  const res = await fetch(`/api${path}`, {
    ...opts,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// ---------- Login ----------
export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/me').then((r) => {
      if (r.authenticated) navigate('/admin', { replace: true });
    }).catch(() => {});
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      navigate('/admin', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-white/5 to-white/0 border-white/10 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <CardTitle className="text-3xl font-black text-white">Admin Login</CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to manage site content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="pl-10 bg-white/5 border-white/10 text-white"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="password"
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  tabIndex={-1}
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <ConfirmDialogHost />
    </div>
  );
}

// ---------- Dashboard ----------
const SECTIONS = [
  { icon: Newspaper, label: 'Show News Cards', desc: 'Edit the 14 cards on the Show News page', path: '/admin/news-cards' },
  { icon: FileText, label: 'Show Flyer', desc: 'Replace the annual PDF flyer', path: '/admin/flyer' },
  { icon: Users, label: 'Member News', desc: 'Add, edit, or remove news posts', path: '/admin/member-news', soon: true },
  { icon: FolderArchive, label: 'Club Documents', desc: 'Upload bylaws, roster, and forms', path: '/admin/documents' },
  { icon: LayoutDashboard, label: 'Homepage', desc: 'Edit show info shown on the home page', path: '/admin/homepage', soon: true },
  { icon: Image, label: 'Sponsors', desc: 'Add, edit, or remove sponsor logos', path: '/admin/sponsors' },
  { icon: Image, label: 'Gallery', desc: 'Create albums and upload photos', path: '/admin/gallery' },
  { icon: Calendar, label: 'Events', desc: 'Manage the events list', path: '/admin/events' },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api('/me')
      .then((r) => {
        if (!r.authenticated) navigate('/admin/login', { replace: true });
        else { setEmail(r.email); setReady(true); }
      })
      .catch(() => navigate('/admin/login', { replace: true }));
  }, [navigate]);

  async function logout() {
    try { await api('/auth/logout', { method: 'POST' }); } catch {}
    navigate('/admin/login', { replace: true });
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h1 className="text-xl font-black">Admin Panel</h1>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-white/10 text-gray-300 hover:bg-white/5"
            >
              View Site
            </Button>
            <Button
              onClick={logout}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="text-sm tracking-[0.3em] text-red-500 mb-2 font-light">CONTENT MANAGEMENT</div>
          <h2 className="text-4xl md:text-5xl font-black">
            <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              What would you like to edit?
            </span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.path}
                onClick={() => !s.soon && navigate(s.path)}
                disabled={s.soon}
                className={`text-left p-6 rounded-2xl border transition-all ${
                  s.soon
                    ? 'bg-white/[0.02] border-white/5 opacity-60 cursor-not-allowed'
                    : 'bg-gradient-to-br from-white/5 to-white/0 border-white/10 hover:border-red-500/50 hover:from-red-500/5 cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-red-500" />
                  </div>
                  {s.soon && (
                    <span className="text-[10px] tracking-widest text-gray-500 border border-white/10 rounded-full px-2 py-0.5">
                      COMING SOON
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{s.label}</h3>
                <p className="text-sm text-gray-400">{s.desc}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-sm text-gray-500">
          <strong className="text-gray-400">Foundation deployed.</strong> The login,
          dashboard, and database are wired up. News Cards editor is the first
          full section, built next. Each section is enabled one at a time.
        </div>
      </main>
      <ConfirmDialogHost />
    </div>
  );
}
