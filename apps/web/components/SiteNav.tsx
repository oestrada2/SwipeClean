import Link from 'next/link';

export function SiteNav() {
  return (
    <nav style={{ display: 'flex', gap: 16, padding: '20px 24px' }}>
      <Link href="/">SwipeClean</Link>
      <Link href="/privacy">Privacy</Link>
      <Link href="/terms">Terms</Link>
    </nav>
  );
}
