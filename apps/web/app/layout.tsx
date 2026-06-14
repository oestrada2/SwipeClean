import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SwipeClean',
  description: 'Clean your photo and video library with fast left and right swipes.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
