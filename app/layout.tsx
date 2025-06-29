import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b', // bg-slate-800
              color: '#f8fafc',      // text-slate-50
              border: '1px solid #334155', // border-slate-700
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
            },
            duration: 5000,
            error: {
              iconTheme: {
                primary: '#ef4444', // text-red-500
                secondary: '#f8fafc',
              },
            },
            success: {
              iconTheme: {
                primary: '#22c55e', // text-green-500
                secondary: '#f8fafc',
              },
            },
            loading: {
              iconTheme: {
                primary: '#0ea5e9', // text-sky-500
                secondary: '#f8fafc',
              },
            },
          }}
        />
      </body>
    </html>
  );
}

export default RootLayout;