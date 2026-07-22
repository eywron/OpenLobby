'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        className: 'bg-background text-foreground border-border rounded-lg shadow-lg font-sans',
      }}
    />
  );
}
