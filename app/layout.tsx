import './globals.css';
import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

import { Toaster } from '@/components/ui/sonner';

const FigtreeFont = Figtree({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NOME_DO_EVENTO',
  description: 'DESCRIÇÃO_DO_EVENTO',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={FigtreeFont.className}>
        {children}
        <Toaster richColors position="top-center" />
        <Analytics />
      </body>
    </html>
  );
}
