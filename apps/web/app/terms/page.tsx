import { SiteNav } from '../../components/SiteNav';

export default function TermsPage() {
  return (
    <main>
      <SiteNav />
      <article className="legal">
        <h1>Terms of Service</h1>
        <p>Last updated: June 13, 2026</p>
        <p>
          SwipeClean is currently an early prototype. The app is provided for planning and testing
          purposes until production terms are reviewed and published.
        </p>
        <p>
          Before launch, add terms covering account eligibility, acceptable use, subscriptions if
          any, media deletion responsibility, warranties, and support expectations.
        </p>
      </article>
    </main>
  );
}
