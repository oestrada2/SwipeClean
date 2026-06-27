import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SwipeClean',
  description: 'Clean your photo and video library with fast left and right swipes.',
  icons: {
    icon: '/app-icon.png',
    apple: '/app-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
