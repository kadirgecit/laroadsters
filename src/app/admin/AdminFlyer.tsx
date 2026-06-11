// /admin/flyer — replace the annual PDF flyer (News page top card).
// Uses Vercel Blob client-side upload so the file goes directly from
// the browser to Blob storage, then the returned URL is saved to the
// news_cards row for the 'flyer' slug.

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload, FileText, Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { uploadFile } from './upload';
import { ConfirmDialogHost } from './ConfirmDialog';

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

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

export function AdminFlyer() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('60th Anniversary Flyer');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    api('/me')
      .then((r) => { if (!r.authenticated) navigate('/admin/login', { replace: true }); })
      .catch(() => navigate('/admin/login', { replace: true }));
  }, [navigate]);

  useEffect(() => {
    api('/admin/news-cards')
      .then((rows: any[]) => {
        const flyer = rows.find((c) => c.slug === 'flyer');
        if (flyer) {
          setCurrentUrl(flyer.flyer_url || null);
          setTitle(flyer.title || '60th Anniversary Flyer');
        }
        setLoading(false);
      })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  async function handleFile(file: File) {
    setError('');
    setSuccess('');

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are accepted.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`File is ${(file.size / 1024 / 1024).toFixed(1)} MB. Max is 25 MB.`);
      return;
    }

    setUploading(true);
    setUploadPct(0);
    try {
      // Upload PDF to Vercel Blob via the admin upload endpoint.
      const url = await uploadFile(file, setUploadPct);

      // Save the new URL to the news_cards.flyer_url for slug='flyer'.
      await api('/admin/news-cards', {
        method: 'PUT',
        body: JSON.stringify({
          cards: [{ slug: 'flyer', title, flyer_url: url }],
        }),
      });

      setCurrentUrl(url);
      setSuccess(`Uploaded successfully (${(file.size / 1024 / 1024).toFixed(2)} MB).`);
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadPct(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Loading flyer…
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
              <h1 className="text-xl font-black truncate">Show Flyer</h1>
              <p className="text-xs text-gray-500">Annual PDF shown at the top of the Show News page</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div className="flex items-start gap-3 text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-3 text-sm text-green-500 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>{success}</div>
          </div>
        )}

        {/* Current flyer preview */}
        <Card className="bg-gradient-to-br from-white/5 to-white/0 border-white/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">Current Flyer</CardTitle>
                <CardDescription className="text-gray-500 text-xs">
                  {currentUrl ? (
                    <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-white underline break-all">
                      {currentUrl}
                    </a>
                  ) : (
                    'No flyer uploaded yet'
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          {currentUrl && (
            <CardContent>
              <iframe
                src={currentUrl}
                className="w-full h-[500px] rounded-xl border border-white/10 bg-white/5"
                title="Current flyer preview"
              />
              <div className="mt-3 flex justify-end">
                <a
                  href={currentUrl}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-sm rounded-full transition-colors"
                >
                  <Download className="w-4 h-4" /> Download current PDF
                </a>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Upload area */}
        <Card className="bg-gradient-to-br from-white/5 to-white/0 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Upload New Flyer</CardTitle>
            <CardDescription className="text-gray-500 text-xs">
              PDF only · max 25 MB · replaces the current flyer immediately
            </CardDescription>
          </CardHeader>
          <CardContent>
            <label
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`block border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-white/15 hover:border-white/30 bg-white/[0.02]'
              } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={onFileChange}
                disabled={uploading}
              />
              {uploading ? (
                <div className="space-y-3">
                  <Loader2 className="w-10 h-10 mx-auto text-red-500 animate-spin" />
                  <div className="text-gray-300">Uploading… {uploadPct}%</div>
                  <div className="w-full max-w-xs mx-auto h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-200"
                      style={{ width: `${uploadPct}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-10 h-10 mx-auto text-gray-500" />
                  <div className="text-gray-300">
                    <span className="text-red-500 font-semibold">Click to choose</span> or drag a PDF here
                  </div>
                  <div className="text-xs text-gray-600">
                    The new file will replace the current one on the public site.
                  </div>
                </div>
              )}
            </label>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500 py-4">
          Files are stored in Vercel Blob and served from a public URL. The Show News page picks up the new flyer automatically.
        </div>
      </main>
      <ConfirmDialogHost />
    </div>
  );
}
