import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Lora, Plus_Jakarta_Sans } from 'next/font/google';
import '@/app/globals.css';
import Navbar from '@/components/Navbar';
import RouteProgress from '@/components/RouteProgress';
import { AuthProvider } from '@/hooks/useAuth';

const displayFont = Lora({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'Blog Rival',
    template: '%s | Blog Rival',
  },
  description:
    'Blog Rival is a modern blogging platform for creating stories, managing your profile, and engaging through likes and comments.',
  applicationName: 'Blog Rival',
  keywords: [
    'blog platform',
    'write blogs',
    'creator dashboard',
    'community feed',
    'blog rival',
  ],
  openGraph: {
    type: 'website',
    title: 'Blog Rival',
    description:
      'Create and publish image-rich blogs, manage your profile, and grow through a community feed.',
    siteName: 'Blog Rival',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Rival',
    description:
      'Create and publish image-rich blogs, manage your profile, and grow through a community feed.',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
  },
  referrer: 'strict-origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <AuthProvider>
          <RouteProgress />
          <Navbar />
          <main className="container main-content">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
