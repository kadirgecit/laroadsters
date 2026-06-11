// Shared upload helper used by all admin pages.
// Sends a file as JSON+base64 to /api/admin/upload. The server decodes and
// writes directly to Vercel Blob. Returns the public Blob URL.

async function apiCall(path: string, body: any): Promise<any> {
  const res = await fetch(`/api${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// Read a File into a base64 string. Uses FileReader (no ArrayBuffer→base64 dep).
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // result is "data:<mime>;base64,XXXX" — strip the prefix.
      const result = reader.result as string;
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export interface UploadResult {
  url: string;
  pathname: string;
}

export async function uploadFile(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  onProgress?.(10);
  const data = await fileToBase64(file);
  onProgress?.(50);
  // 50% is approximate — we can't track base64 transfer progress through fetch
  // (it goes in one shot). The real work (base64 encode + POST) is fast for
  // <= 2MB files.
  const result: UploadResult = await apiCall('/admin/upload', {
    filename: file.name,
    contentType: file.type || 'application/octet-stream',
    data,
  });
  onProgress?.(100);
  return result.url;
}
