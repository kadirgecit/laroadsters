// Reusable confirmation dialog. Returns a Promise<boolean> via `confirmDialog()`.
// Used by every destructive action in the admin (delete, replace, etc.) so the
// user always sees exactly what will be removed from Vercel Blob before they
// confirm.

import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface DialogState {
  open: boolean;
  title: string;
  message: string;
  details?: string;
  confirmLabel: string;
  cancelLabel: string;
  danger: boolean;
  resolve: ((v: boolean) => void) | null;
}

const initial: DialogState = {
  open: false,
  title: '',
  message: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  danger: false,
  resolve: null,
};

let externalSet: ((s: DialogState) => void) | null = null;

export function confirmDialog(opts: {
  title: string;
  message: string;
  details?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}): Promise<boolean> {
  return new Promise((resolve) => {
    if (!externalSet) {
      // Outside React tree (e.g. tests) — fall back to native confirm.
      // eslint-disable-next-line no-alert
      resolve(window.confirm(`${opts.title}\n\n${opts.message}`));
      return;
    }
    externalSet({
      open: true,
      title: opts.title,
      message: opts.message,
      details: opts.details,
      confirmLabel: opts.confirmLabel || 'Confirm',
      cancelLabel: opts.cancelLabel || 'Cancel',
      danger: opts.danger ?? true,
      resolve,
    });
  });
}

export function ConfirmDialogHost() {
  const [state, setState] = useState<DialogState>(initial);

  useEffect(() => {
    externalSet = setState;
    return () => { externalSet = null; };
  }, []);

  if (!state.open || !state.resolve) return null;

  const close = (v: boolean) => {
    state.resolve!(v);
    setState(initial);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => close(false)}>
      <div
        className="w-full max-w-md rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 p-6">
          {state.danger && (
            <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-1">{state.title}</h3>
            <p className="text-sm text-gray-300">{state.message}</p>
            {state.details && (
              <p className="text-xs text-gray-500 mt-2">{state.details}</p>
            )}
          </div>
          <button
            onClick={() => close(false)}
            className="text-gray-500 hover:text-white p-1 -mt-1 -mr-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-white/10">
          <Button variant="outline" onClick={() => close(false)} className="border-white/10 text-gray-300 hover:bg-white/5">
            {state.cancelLabel}
          </Button>
          <Button
            onClick={() => close(true)}
            className={state.danger ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}
          >
            {state.confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
