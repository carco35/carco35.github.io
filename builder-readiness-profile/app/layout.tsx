import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Builder Readiness Profile',
  description:
    'Turn your real track record into a structured, AI-generated profile and apply to real funding for young builders.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
